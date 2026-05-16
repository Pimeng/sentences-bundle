const KEEP_FIELDS = ['id', 'uuid', 'hitokoto', 'type', 'from', 'from_who', 'length'];

const cache = {};

function cleanSentence(item) {
  const obj = {};
  for (const key of KEEP_FIELDS) {
    if (key in item) {
      obj[key] = item[key];
    }
  }
  return obj;
}

async function fetchJson(url) {
  if (cache[url]) {
    return cache[url];
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  const data = await res.json();
  cache[url] = data;
  return data;
}

export async function getCategories(requestUrl) {
  const url = new URL('/categories.json', requestUrl).href;
  return fetchJson(url);
}

export async function getSentences(category, requestUrl) {
  const categories = await getCategories(requestUrl);
  const keys = categories.map(c => c.key);
  if (!keys.includes(category)) {
    return null;
  }
  const cacheKey = `sentences:${category}:${requestUrl}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  const url = new URL(`/sentences/${category}.json`, requestUrl).href;
  const raw = await fetchJson(url);
  const cleaned = raw.map(cleanSentence);
  cache[cacheKey] = cleaned;
  return cleaned;
}

let allSentencesCache = null;
let allSentencesCacheUrl = null;

export async function getAllSentences(requestUrl) {
  if (allSentencesCache && allSentencesCacheUrl === requestUrl) {
    return allSentencesCache;
  }
  const categories = await getCategories(requestUrl);
  const lists = await Promise.all(categories.map(c => getSentences(c.key, requestUrl)));
  allSentencesCache = lists.flat();
  allSentencesCacheUrl = requestUrl;
  return allSentencesCache;
}
