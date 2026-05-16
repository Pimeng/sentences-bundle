import { getSentenceById, getSentenceByUuid } from '../lib/data.js';
import { jsonResponse, errorResponse } from '../lib/utils.js';

export function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const idParam = url.searchParams.get('id');
    const uuidParam = url.searchParams.get('uuid');

    if (!idParam && !uuidParam) {
      return errorResponse('Missing required parameter: id or uuid', 400);
    }

    let sentence = null;

    if (idParam) {
      const id = parseInt(idParam, 10);
      if (Number.isNaN(id)) {
        return errorResponse('Invalid id parameter', 400);
      }
      sentence = getSentenceById(id);
    } else if (uuidParam) {
      sentence = getSentenceByUuid(uuidParam);
    }

    if (!sentence) {
      return errorResponse('Sentence not found', 404);
    }

    return jsonResponse(sentence);
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
