import { getCategories, getSentences } from '../lib/data.js';
import { jsonResponse } from '../lib/utils.js';

export function onRequestGet() {
  const categories = getCategories();
  const results = categories.map((c) => {
    const sentences = getSentences(c.key);
    return {
      id: c.id,
      name: c.name,
      desc: c.desc,
      key: c.key,
      count: sentences ? sentences.length : 0,
    };
  });

  return jsonResponse({ categories: results });
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
