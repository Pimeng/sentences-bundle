import { getSentences, getAllSentences } from '../lib/data.js';
import { jsonResponse, errorResponse, getRandomItems } from '../lib/utils.js';

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
    const url = new URL(context.request.url);
    const category = url.searchParams.get('category');
    const numParam = url.searchParams.get('num');
    const num = Math.min(Math.max(parseInt(numParam, 10) || 10, 1), 100);
    let sentences;

    if (category) {
      sentences = getSentences(category);
      if (!sentences) {
        return errorResponse('Invalid category', 400);
      }
    } else {
      sentences = getAllSentences();
    }

    if (!sentences || sentences.length === 0) {
      return errorResponse('No sentences found', 404);
    }

    const results = getRandomItems(sentences, num);
    return jsonResponse({
      count: results.length,
      sentences: results.map(item => ({
        id: item.id,
        uuid: item.uuid,
        hitokoto: item.hitokoto,
        type: item.type,
        from: item.from,
        from_who: item.from_who,
        length: item.length,
      })),
    });
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}
