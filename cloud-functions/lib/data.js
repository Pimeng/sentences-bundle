import categories from './data/categories.js';
import a from './data/sentences/a.js';
import b from './data/sentences/b.js';
import c from './data/sentences/c.js';
import d from './data/sentences/d.js';
import e from './data/sentences/e.js';
import f from './data/sentences/f.js';
import g from './data/sentences/g.js';
import h from './data/sentences/h.js';
import i from './data/sentences/i.js';
import j from './data/sentences/j.js';
import k from './data/sentences/k.js';
import l from './data/sentences/l.js';

const sentencesMap = { a, b, c, d, e, f, g, h, i, j, k, l };
const categoryKeys = categories.map(c => c.key);

export function getCategories() {
  return categories;
}

export function getSentences(category) {
  if (!categoryKeys.includes(category)) {
    return null;
  }
  return sentencesMap[category] || null;
}

let allSentencesCache = null;
let idIndexCache = null;
let uuidIndexCache = null;

export function getAllSentences() {
  if (!allSentencesCache) {
    allSentencesCache = categoryKeys.map(key => sentencesMap[key]).flat();
  }
  return allSentencesCache;
}

function buildIndexes() {
  if (!idIndexCache) {
    idIndexCache = new Map();
    uuidIndexCache = new Map();
    const all = getAllSentences();
    for (const s of all) {
      idIndexCache.set(s.id, s);
      uuidIndexCache.set(s.uuid, s);
    }
  }
}

export function getSentenceById(id) {
  buildIndexes();
  return idIndexCache.get(id) || null;
}

export function getSentenceByUuid(uuid) {
  buildIndexes();
  return uuidIndexCache.get(uuid) || null;
}
