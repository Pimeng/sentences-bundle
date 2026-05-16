import { getSentences, getAllSentences } from '../lib/data.js';
import { jsonResponse, errorResponse } from '../lib/utils.js';

export function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const category = url.searchParams.get('c');
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

    const item = sentences[Math.floor(Math.random() * sentences.length)];
    const format = url.searchParams.get('e');

    if (format === 'text') {
      return new Response(item.hitokoto, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    const result = {
      id: item.id,
      uuid: item.uuid,
      hitokoto: item.hitokoto,
      type: item.type,
      from: item.from,
      from_who: item.from_who ?? null,
      length: item.hitokoto?.length ?? 0,
    };
    return jsonResponse(result);
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
