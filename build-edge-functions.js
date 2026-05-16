const fs = require('fs');
const path = require('path');

const KEEP_FIELDS = ['id', 'uuid', 'hitokoto', 'type', 'from', 'from_who', 'length'];

function jsonToJs(src, dest) {
  const data = fs.readFileSync(src, 'utf8');
  fs.writeFileSync(dest, `export default ${data};\n`);
}

function cleanSentencesToString(src, dest) {
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
  // 导出为 JSON 字符串，避免模块加载时 V8 解析巨大的数组字面量
  fs.writeFileSync(dest, `export default ${JSON.stringify(JSON.stringify(cleaned))};\n`);
}

// Convert categories.json to categories.js (keep all fields)
jsonToJs('categories.json', 'edge-functions/lib/data/categories.js');

// Convert all sentences/*.json to sentences/*.js (cleaned, as JSON string)
const sentenceFiles = fs.readdirSync('sentences');
for (const f of sentenceFiles) {
  if (f.endsWith('.json')) {
    const jsName = f.replace('.json', '.js');
    cleanSentencesToString(path.join('sentences', f), path.join('edge-functions/lib/data/sentences', jsName));
  }
}

console.log('Build complete: JSON files converted to string JS modules.');
