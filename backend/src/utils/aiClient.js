/**
 * AI Client with automatic provider fallback
 * Order: OpenAI → OpenRouter → NVIDIA
 * Switches on any error (429 quota, 5xx, network, etc.)
 */

const crypto = require('crypto');
const OpenAI = require('openai');
const logger = require('./logger');

const aiCache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

function getCacheKey(messages, maxTokens, temperature) {
  const data = JSON.stringify({ messages, maxTokens, temperature });
  return crypto.createHash('sha256').update(data).digest('hex');
}

const PROVIDERS = [
  {
    name: 'openai',
    enabled: () => !!process.env.OPENAI_API_KEY,
    client: () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    model: 'gpt-4o',
  },
  {
    name: 'groq',
    enabled: () => !!process.env.GROQ_API_KEY,
    client: () => new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    }),
    model: 'llama-3.3-70b-versatile',
  },
  {
    name: 'openrouter',
    enabled: () => !!process.env.OPENROUTER_API_KEY,
    client: () => new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:3000',
        'X-Title': 'UniLearn LMS',
      },
    }),
    model: 'deepseek/deepseek-chat-v3-0324',
  },
  {
    name: 'nvidia',
    enabled: () => !!process.env.NVIDIA_API_KEY,
    client: () => new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    }),
    model: 'meta/llama-3.3-70b-instruct',
  },
  {
    name: 'ollama',
    enabled: () => !!process.env.OLLAMA_API_KEY,
    client: () => new OpenAI({
      apiKey: process.env.OLLAMA_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:3000',
        'X-Title': 'UniLearn LMS',
      },
    }),
    model: 'deepseek/deepseek-chat-v3-0324',
  },
];

/**
 * Creates a chat completion, trying each provider in order until one succeeds.
 * @param {Array} messages - OpenAI-format messages array
 * @param {number} maxTokens - Max tokens for the response
 * @param {number} temperature - Temperature (default 0.7)
 * @returns {Promise<Object>} OpenAI-compatible completion response
 */
async function createCompletion(messages, maxTokens = 2000, temperature = 0.7) {
  const cacheKey = getCacheKey(messages, maxTokens, temperature);
  const cached = aiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    logger.info('[AI] Serving response from memory cache');
    return cached.response;
  }

  const active = PROVIDERS.filter(p => p.enabled());

  if (active.length === 0) {
    throw new Error('No AI provider configured. Set OPENAI_API_KEY, OPENROUTER_API_KEY, NVIDIA_API_KEY, or OLLAMA_API_KEY in .env');
  }

  const errors = [];

  for (const provider of active) {
    try {
      logger.info(`[AI] Trying provider: ${provider.name}`);
      const response = await provider.client().chat.completions.create({
        model: provider.model,
        messages,
        max_tokens: maxTokens,
        temperature,
      });
      logger.info(`[AI] Success with provider: ${provider.name}`);
      aiCache.set(cacheKey, { timestamp: Date.now(), response });
      
      // Basic cache cleanup (prevent memory leaks)
      if (aiCache.size > 1000) {
        for (const [key, val] of aiCache.entries()) {
          if (Date.now() - val.timestamp > CACHE_TTL_MS) aiCache.delete(key);
        }
      }
      
      return response;
    } catch (err) {
      console.error(`[AI] Provider ${provider.name} failed: ${err.message}`);
      errors.push(`${provider.name}: ${err.message}`);
    }
  }

  throw new Error(`All AI providers failed:\n${errors.join('\n')}`);
}

/**
 * Safely parse JSON from AI response — handles markdown code fences
 */
function parseJSON(content) {
  let cleaned = content.replace(/^```(?:json)?\s*/im, '').replace(/\s*```\s*$/im, '').trim();
  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  const arrMatch = cleaned.match(/\[[\s\S]*\]/);
  if (objMatch && arrMatch) {
    return JSON.parse(objMatch.index < arrMatch.index ? objMatch[0] : arrMatch[0]);
  }
  if (objMatch) return JSON.parse(objMatch[0]);
  if (arrMatch) return JSON.parse(arrMatch[0]);
  return JSON.parse(cleaned);
}

/**
 * Sanitize user input to prevent prompt injection attacks
 * @param {string} input - User input string
 * @param {number} maxLength - Maximum allowed length (default 5000)
 * @returns {string} Sanitized input
 */
function sanitizeInput(input, maxLength = 5000) {
  if (typeof input !== 'string') {
    return '';
  }

  // Truncate to max length
  let sanitized = input.slice(0, maxLength);

  // Define suspicious patterns that might indicate prompt injection
  const suspiciousPatterns = [
    { pattern: /ignore\s+(previous|all|the)\s+(instructions?|prompts?|rules?|directives?)/gi, replacement: '[FILTERED]' },
    { pattern: /you\s+are\s+now\s+/gi, replacement: '[FILTERED]' },
    { pattern: /system\s*:?\s*(prompt|message|instruction)/gi, replacement: '[FILTERED]' },
    { pattern: /new\s+(instructions?|prompts?|rules?|directives?)\s*:/gi, replacement: '[FILTERED]' },
    { pattern: /disregard\s+(all|any|previous)\s+(instructions?|prompts?|rules?)/gi, replacement: '[FILTERED]' },
    { pattern: /override\s+(instructions?|prompts?|rules?)/gi, replacement: '[FILTERED]' },
    { pattern: /jailbreak/gi, replacement: '[FILTERED]' },
    { pattern: /pretend\s+(you\s+are|to\s+be)\s+/gi, replacement: '[FILTERED]' },
  ];

  let patternsDetected = [];

  // Replace matched patterns
  suspiciousPatterns.forEach(({ pattern, replacement }) => {
    if (pattern.test(sanitized)) {
      patternsDetected.push(pattern.source);
      sanitized = sanitized.replace(pattern, replacement);
    }
  });

  // Log security warnings when patterns are detected
  if (patternsDetected.length > 0) {
    console.warn('[SECURITY] Prompt injection patterns detected and sanitized:', {
      timestamp: new Date().toISOString(),
      patterns: patternsDetected,
      originalLength: input.length,
      truncated: input.length > maxLength,
    });
  }

  // Normalize excessive whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
}

module.exports = { createCompletion, parseJSON, sanitizeInput };
