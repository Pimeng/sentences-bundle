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

export async function getCategories() {
  return fetchJson('/categories.json');
}

export async function getSentences(category) {
  const categories = await getCategories();
  const keys = categories.map(c => c.key);
  if (!keys.includes(category)) {
    return null;
  }
  const cacheKey = `sentences:${category}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  const raw = await fetchJson(`/sentences/${category}.json`);
  const cleaned = raw.map(cleanSentence);
  cache[cacheKey] = cleaned;
  return cleaned;
}

let allSentencesCache = null;

export async function getAllSentences() {
  if (!allSentencesCache) {
    const categories = await getCategories();
    const lists = await Promise.all(categories.map(c => getSentences(c.key)));
    allSentencesCache = lists.flat();
  }
  return allSentencesCache;
}
