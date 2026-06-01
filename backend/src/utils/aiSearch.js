/**
 * AI-Powered Search Engine
 * Provides semantic search and intelligent search suggestions
 */

const { createCompletion } = require('./aiClient');

async function semanticSearch(query, courseContent, searchType = 'all') {
  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert search engine for educational content. Respond with JSON array only.

Format:
[{"id": string, "title": string, "type": string, "description": string, "relevanceScore": number, "matchedKeywords": [string], "preview": string, "url": string, "metadata": {"author": string, "date": string, "tags": [string]}}]`,
    },
    { role: 'user', content: `Search for: "${query}"\nType: ${searchType}\nContent: ${JSON.stringify(courseContent)}` },
  ], 2000, 0.5);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
}

async function generateSearchSuggestions(query, searchHistory = [], courseContent = []) {
  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert search suggestion engine. Respond with JSON array only.

Format:
[{"suggestion": string, "type": string, "description": string, "searchCount": number, "relevance": number}]`,
    },
    { role: 'user', content: `Suggestions for: "${query}"\nHistory: ${JSON.stringify(searchHistory)}\nContent: ${JSON.stringify(courseContent.slice(0, 10))}` },
  ], 1000);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
}

async function analyzeSearchQuery(query) {
  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert in search intent analysis. Respond with JSON only.

Format:
{"originalQuery": string, "normalizedQuery": string, "intent": string, "keywords": [string], "entities": [string], "suggestedFilters": {"type": [string], "difficulty": string, "dateRange": string}, "relatedTopics": [string], "confidence": number}`,
    },
    { role: 'user', content: `Analyze: "${query}"` },
  ], 1000, 0.5);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  return { originalQuery: query, normalizedQuery: query, intent: 'search', keywords: [], entities: [], suggestedFilters: {}, relatedTopics: [], confidence: 0 };
}

async function advancedSearch(query, filters = {}, courseContent = []) {
  const filterString = Object.entries(filters).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(', ');

  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert search engine for educational content. Respond with JSON array only.

Format:
[{"id": string, "title": string, "type": string, "description": string, "relevanceScore": number, "matchedFilters": [string], "preview": string, "url": string, "metadata": {"author": string, "date": string, "difficulty": string, "tags": [string]}}]`,
    },
    { role: 'user', content: `Search: "${query}"\nFilters: ${filterString}\nContent: ${JSON.stringify(courseContent)}` },
  ], 2000, 0.5);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
}

async function getTrendingTopics(searchHistory = [], timeRange = 'week') {
  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert in search trend analysis. Respond with JSON array only.

Format:
[{"topic": string, "searchCount": number, "trend": string, "relatedTopics": [string], "description": string, "relevance": number}]`,
    },
    { role: 'user', content: `Trending topics (${timeRange}):\n\n${JSON.stringify(searchHistory)}` },
  ], 1000);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
}

module.exports = { semanticSearch, generateSearchSuggestions, analyzeSearchQuery, advancedSearch, getTrendingTopics };
