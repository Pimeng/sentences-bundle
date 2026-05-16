const fs = require('fs');
const path = require('path');

const KEEP_FIELDS = ['id', 'uuid', 'hitokoto', 'type', 'from', 'from_who', 'length'];

function jsonToJs(src, dest, keepFields = null) {
  const raw = JSON.parse(fs.readFileSync(src, 'utf8'));
  const cleaned = raw.map(item => {
    if (!keepFields) return item;
    const obj = {};
    for (const key of keepFields) {
      if (key in item) {
        obj[key] = item[key];
      }
    }
    return obj;
  });
  fs.writeFileSync(dest, `export default ${JSON.stringify(cleaned)};\n`);
}

// Convert categories.json (keep all fields)
jsonToJs('categories.json', 'cloud-functions/lib/data/categories.js');

// Convert all sentences/*.json
const files = fs.readdirSync('sentences');
for (const f of files) {
  if (f.endsWith('.json')) {
    const jsName = f.replace('.json', '.js');
    jsonToJs(path.join('sentences', f), path.join('cloud-functions/lib/data/sentences', jsName), KEEP_FIELDS);
  }
}

console.log('Build complete: data packed into cloud-functions/lib/data/');
