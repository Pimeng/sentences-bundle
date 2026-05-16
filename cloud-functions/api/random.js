import { getSentences, getAllSentences } from '../lib/data.js';
import { jsonResponse, errorResponse } from '../lib/utils.js';

export function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const category = url.searchParams.get('category');
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
    return jsonResponse(item);
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
