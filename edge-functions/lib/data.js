import categories from './data/categories.js';
import aStr from './data/sentences/a.js';
import bStr from './data/sentences/b.js';
import cStr from './data/sentences/c.js';
import dStr from './data/sentences/d.js';
import eStr from './data/sentences/e.js';
import fStr from './data/sentences/f.js';
import gStr from './data/sentences/g.js';
import hStr from './data/sentences/h.js';
import iStr from './data/sentences/i.js';
import jStr from './data/sentences/j.js';
import kStr from './data/sentences/k.js';
import lStr from './data/sentences/l.js';

const sentencesStrMap = { a: aStr, b: bStr, c: cStr, d: dStr, e: eStr, f: fStr, g: gStr, h: hStr, i: iStr, j: jStr, k: kStr, l: lStr };
const sentencesCache = {};
const categoryKeys = categories.map(c => c.key);

export function getCategories() {
  return categories;
}

export function getSentences(category) {
  if (!categoryKeys.includes(category)) {
    return null;
  }
  if (!sentencesCache[category]) {
    sentencesCache[category] = JSON.parse(sentencesStrMap[category]);
  }
  return sentencesCache[category];
}

let allSentencesCache = null;

export function getAllSentences() {
  if (!allSentencesCache) {
    allSentencesCache = categoryKeys.map(key => getSentences(key)).flat();
  }
  return allSentencesCache;
}
