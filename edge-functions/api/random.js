import { getSentences, getAllSentences } from '../lib/data.js';
import { jsonResponse, errorResponse } from '../lib/utils.js';

export function onRequestGet(context) {
  const url = new URL(context.request.url);
  const category = url.searchParams.get('category');

  try {
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

    const randomIndex = Math.floor(Math.random() * sentences.length);
    const item = sentences[randomIndex];

    return jsonResponse({
      id: item.id,
      uuid: item.uuid,
      hitokoto: item.hitokoto,
      type: item.type,
      from: item.from,
      from_who: item.from_who,
      length: item.length,
    });
  } catch (err) {
    return errorResponse(err.message, 500);
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
