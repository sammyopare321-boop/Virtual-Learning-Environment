/**
 * AI Client with automatic provider fallback
 * Order: OpenAI → OpenRouter → NVIDIA
 * Switches on any error (429 quota, 5xx, network, etc.)
 */

const OpenAI = require('openai');

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
  const active = PROVIDERS.filter(p => p.enabled());

  if (active.length === 0) {
    throw new Error('No AI provider configured. Set OPENAI_API_KEY, OPENROUTER_API_KEY, NVIDIA_API_KEY, or OLLAMA_API_KEY in .env');
  }

  const errors = [];

  for (const provider of active) {
    try {
      console.log(`[AI] Trying provider: ${provider.name}`);
      const response = await provider.client().chat.completions.create({
        model: provider.model,
        messages,
        max_tokens: maxTokens,
        temperature,
      });
      console.log(`[AI] Success with provider: ${provider.name}`);
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

module.exports = { createCompletion, parseJSON };
