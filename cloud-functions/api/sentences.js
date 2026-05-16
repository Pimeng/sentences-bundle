import { getSentences, getAllSentences } from '../lib/data.js';
import { jsonResponse, errorResponse, getRandomItems } from '../lib/utils.js';

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const category = url.searchParams.get('category');
    const numParam = url.searchParams.get('num');
    const num = Math.min(Math.max(parseInt(numParam, 10) || 10, 1), 100);
    let sentences;

    if (category) {
      sentences = await getSentences(category);
      if (!sentences) {
        return errorResponse('Invalid category', 400);
      }
    } else {
      sentences = await getAllSentences();
    }

    if (!sentences || sentences.length === 0) {
      return errorResponse('No sentences found', 404);
    }

    const results = getRandomItems(sentences, num);
    return jsonResponse({ count: results.length, sentences: results });
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
