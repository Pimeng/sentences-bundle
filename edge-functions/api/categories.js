import { getCategories, getSentences } from '../lib/data.js';
import { jsonResponse } from '../lib/utils.js';

export default function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
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
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
