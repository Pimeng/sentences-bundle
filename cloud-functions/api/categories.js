import { getCategories, getSentences } from '../lib/data.js';
import { jsonResponse } from '../lib/utils.js';

export async function onRequestGet(context) {
  try {
    const requestUrl = context.request.url;
    const categories = await getCategories(requestUrl);
    const results = await Promise.all(
      categories.map(async (c) => {
        const sentences = await getSentences(c.key, requestUrl);
        return {
          id: c.id,
          name: c.name,
          desc: c.desc,
          key: c.key,
          count: sentences ? sentences.length : 0,
        };
      })
    );
    return jsonResponse({ categories: results });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
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
