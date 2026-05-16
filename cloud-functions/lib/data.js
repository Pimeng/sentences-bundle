import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sentencesDir = path.resolve(__dirname, '../../sentences');
const categoriesPath = path.resolve(__dirname, '../../categories.json');

const KEEP_FIELDS = ['id', 'uuid', 'hitokoto', 'type', 'from', 'from_who', 'length'];

let categoriesCache = null;
const sentencesCache = {};

function cleanSentence(item) {
  const obj = {};
  for (const key of KEEP_FIELDS) {
    if (key in item) {
      obj[key] = item[key];
    }
  }
  return obj;
}

export function getCategories() {
  if (!categoriesCache) {
    categoriesCache = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
  }
  return categoriesCache;
}

export function getSentences(category) {
  const categories = getCategories();
  const keys = categories.map(c => c.key);
  if (!keys.includes(category)) {
    return null;
  }
  if (!sentencesCache[category]) {
    const filePath = path.join(sentencesDir, `${category}.json`);
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    sentencesCache[category] = raw.map(cleanSentence);
  }
  return sentencesCache[category];
}

let allSentencesCache = null;

export function getAllSentences() {
  if (!allSentencesCache) {
    const categories = getCategories();
    allSentencesCache = categories.map(c => getSentences(c.key)).flat();
  }
  return allSentencesCache;
}
