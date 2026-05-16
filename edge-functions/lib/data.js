import categories from './data/categories.js';

const sentencesCache = {};
const categoryKeys = categories.map(c => c.key);

export function getCategories() {
  return categories;
}

export async function getSentences(category) {
  if (!categoryKeys.includes(category)) {
    return null;
  }
  if (!sentencesCache[category]) {
    const mod = await import(`./data/sentences/${category}.js`);
    sentencesCache[category] = mod.default;
  }
  return sentencesCache[category];
}

let allSentencesCache = null;

export async function getAllSentences() {
  if (!allSentencesCache) {
    const promises = categoryKeys.map(key => getSentences(key));
    const results = await Promise.all(promises);
    allSentencesCache = results.flat();
  }
  return allSentencesCache;
}
