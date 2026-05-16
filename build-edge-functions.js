const fs = require('fs');
const path = require('path');

const KEEP_FIELDS = ['id', 'uuid', 'hitokoto', 'type', 'from', 'from_who', 'length'];

function jsonToJs(src, dest) {
  const data = fs.readFileSync(src, 'utf8');
  fs.writeFileSync(dest, `export default ${data};\n`);
}

function cleanSentences(src, dest) {
  const raw = JSON.parse(fs.readFileSync(src, 'utf8'));
  const cleaned = raw.map(item => {
    const obj = {};
    for (const key of KEEP_FIELDS) {
      if (key in item) {
        obj[key] = item[key];
      }
    }
    return obj;
  });
  fs.writeFileSync(dest, `export default ${JSON.stringify(cleaned)};\n`);
}

// Convert categories.json to categories.js (keep all fields)
jsonToJs('categories.json', 'edge-functions/lib/data/categories.js');

// Convert all sentences/*.json to sentences/*.js (cleaned)
const sentenceFiles = fs.readdirSync('sentences');
for (const f of sentenceFiles) {
  if (f.endsWith('.json')) {
    const jsName = f.replace('.json', '.js');
    cleanSentences(path.join('sentences', f), path.join('edge-functions/lib/data/sentences', jsName));
  }
}

console.log('Build complete: JSON files converted to cleaned JS modules.');
