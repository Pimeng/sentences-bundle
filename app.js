/* ==========================================================
   Sentences Bundle API Docs — Application Logic
   ========================================================== */

const API_BASE = location.origin;

const APIS = [
  {
    id: 'random',
    group: '句子接口',
    name: '随机获取一言',
    method: 'GET',
    path: '/api/random',
    desc: '从全部句子中随机抽取一条，或指定分类后从该分类中随机抽取。不填分类参数时从所有分类中抽取。',
    params: [
      { name: 'c', type: 'string', desc: '分类 key，如 a（动画）、b（漫画）、c（游戏）等', required: false },
      { name: 'e', type: 'string', desc: '返回格式，json 返回 JSON（默认），text 返回纯文本句子', required: false }
    ],
    responseExample: {
      id: 10298,
      uuid: "5bd9fdf7-57bf-45f2-9342-8201f341910a",
      hitokoto: "十年信奥一场空，不开long long见祖宗。",
      type: "l",
      from: "竞赛名言",
      from_who: null,
      length: 23
    }
  },
  {
    id: 'sentences',
    group: '句子接口',
    name: '批量获取句子',
    method: 'GET',
    path: '/api/sentences',
    desc: '按指定数量和分类随机抽取多条句子。不填分类则从全部句子中抽取，n 参数控制返回数量。',
    params: [
      { name: 'c', type: 'string', desc: '分类 key，如 a、b、c 等', required: false },
      { name: 'n', type: 'integer', desc: '获取数量，默认 10，最大 100', required: false }
    ],
    responseExample: {
      count: 2,
      sentences: [
        {
          id: 10298,
          uuid: "5bd9fdf7-57bf-45f2-9342-8201f341910a",
          hitokoto: "十年信奥一场空，不开long long见祖宗。",
          type: "l",
          from: "竞赛名言",
          from_who: null,
          length: 23
        },
        {
          id: 10305,
          uuid: "d7b78f6e-5e74-4c3a-93b4-68e4f1b7e2a1",
          hitokoto: "愿你的未来永远有星光相伴。",
          type: "a",
          from: "紫罗兰永恒花园",
          from_who: "晓佳奈",
          length: 14
        }
      ]
    }
  },
  {
    id: 'sentence',
    group: '元数据接口',
    name: '获取指定句子',
    method: 'GET',
    path: '/api/sentence',
    desc: '根据 id 或 uuid 精确查询一条句子，两个参数至少提供一个。',
    params: [
      { name: 'id', type: 'integer', desc: '句子 ID', required: false },
      { name: 'uuid', type: 'string', desc: '句子 UUID', required: false }
    ],
    responseExample: {
      id: 10298,
      uuid: "5bd9fdf7-57bf-45f2-9342-8201f341910a",
      hitokoto: "十年信奥一场空，不开long long见祖宗。",
      type: "l",
      from: "竞赛名言",
      from_who: null,
      length: 23
    }
  },
  {
    id: 'categories',
    group: '元数据接口',
    name: '分类列表',
    method: 'GET',
    path: '/api/categories',
    desc: '返回所有可用的分类及每类句子的数量。',
    params: [],
    responseExample: {
      categories: [
        { id: 1, name: "动画", desc: "Anime - 动画", key: "a", count: 100 }
      ]
    }
  },
  {
    id: 'nanbeng',
    group: '句子接口',
    name: '随机获取难绷语录',
    method: 'GET',
    path: '/api/nanbeng',
    desc: '从难绷语录分类中随机抽取一条。',
    params: [
      { name: 'e', type: 'string', desc: '返回格式，json 返回 JSON（默认），text 返回纯文本句子', required: false }
    ],
    responseExample: {
      id: 11291,
      uuid: "90f2f12b-3b67-4848-b59d-bbaa083595ba",
      hitokoto: "-安卓iOS？\\n-昂\\n里莫的秘密书房\\n-安卓iOS？\\n-对\\n-？\\n-安卓\\n",
      type: "nanbeng",
      from: "澜轶小卖部",
      from_who: null,
      length: 44
    }
  }
];

const CATEGORY_MAP = {
  a: '动画', b: '漫画', c: '游戏', d: '文学', e: '原创',
  f: '网络', g: '其他', h: '影视', i: '诗词', j: '网易云',
  k: '哲学', l: '抖机灵', nanbeng: 'nanbeng'
};

let currentApiId = 'random';
let lastResponse = null;
let lastStatus = null;
let lastDuration = null;
let lastRequestUrl = null;
let debugCollapsed = false;

/* ----------------------------------------------------------
   Utilities
   ---------------------------------------------------------- */
function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

function syntaxHighlight(json) {
  if (!json) return '';
  const str = typeof json === 'string' ? json : JSON.stringify(json, null, 2);
  return escapeHtml(str)
    .replace(/"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?=\s*:)/g, '<span class="json-key">$&</span>')
    .replace(/"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?!\s*:)/g, '<span class="json-str">$&</span>')
    .replace(/\b(true|false)\b/g, '<span class="json-bool">$&</span>')
    .replace(/\b(null)\b/g, '<span class="json-bool">$&</span>')
    .replace(/\b(\d+)\b/g, '<span class="json-num">$&</span>');
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>已复制`;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = original;
    }, 1800);
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

/* ----------------------------------------------------------
   Sidebar
   ---------------------------------------------------------- */
function renderSidebar() {
  const container = document.getElementById('sidebar-scroll');
  const groups = {};
  APIS.forEach(api => {
    if (!groups[api.group]) groups[api.group] = [];
    groups[api.group].push(api);
  });

  let html = '';
  for (const [groupName, items] of Object.entries(groups)) {
    html += `<div class="sidebar-group" data-group="${escapeHtml(groupName)}">`;
    html += `<div class="sidebar-group-title" onclick="toggleGroup(this)">${escapeHtml(groupName)}</div>`;
    html += `<div class="sidebar-items">`;
    for (const api of items) {
      const active = api.id === currentApiId ? 'active' : '';
      html += `
        <div class="sidebar-item ${active}" data-id="${api.id}" onclick="selectApi('${api.id}')">
          <div class="sidebar-item-left">
            <span class="method-tag get">GET</span>
            <span class="sidebar-item-name">${escapeHtml(api.name)}</span>
          </div>
        </div>
      `;
    }
    html += '</div></div>';
  }
  container.innerHTML = html;
}

function toggleGroup(el) {
  el.parentElement.classList.toggle('collapsed');
}

function selectApi(id) {
  currentApiId = id;
  renderSidebar();
  renderMain();
  renderDebug();
  lastResponse = null;
  lastStatus = null;
  lastDuration = null;
  lastRequestUrl = null;
  // Close sidebar on mobile after selection
  if (window.innerWidth <= 768) {
    toggleSidebar(false);
  }
}

/* ----------------------------------------------------------
   Main Content
   ---------------------------------------------------------- */
function renderMain() {
  const api = APIS.find(a => a.id === currentApiId);
  if (!api) return;

  let paramsHtml = '';
  if (api.params.length === 0) {
    paramsHtml = `<div class="param-list"><div class="param-row"><span class="param-optional">无需参数</span></div></div>`;
  } else {
    paramsHtml = `
      <div class="param-list">
        <div class="param-header">
          <span>Query 参数</span>
          <span class="badge">application/json</span>
        </div>
    `;
    for (const p of api.params) {
      const req = p.required
        ? '<span class="param-required">必需</span>'
        : '<span class="param-optional">可选</span>';
      paramsHtml += `
        <div class="param-row">
          <span class="param-name">${escapeHtml(p.name)}</span>
          <div class="param-meta">
            <div class="param-type">${escapeHtml(p.type)}</div>
            <div class="param-desc">${escapeHtml(p.desc)}</div>
          </div>
          ${req}
        </div>
      `;
    }
    paramsHtml += '</div>';
  }

  const curl = `curl -X GET "${API_BASE}${api.path}"`;
  const js = `fetch("${API_BASE}${api.path}")
  .then(r => r.json())
  .then(console.log);`;

  const exampleContent = escapeHtml(curl);
  const jsContent = escapeHtml(js);

  document.getElementById('main-content').innerHTML = `
    <div class="api-header-area">
      <div class="api-breadcrumb">${escapeHtml(api.group)}</div>
      <div class="api-title">${escapeHtml(api.name)}</div>
      <div class="api-path-bar">
        <span class="method-tag get">GET</span>
        <code>${escapeHtml(api.path)}</code>
      </div>
      <div class="api-desc">${escapeHtml(api.desc)}</div>
    </div>

    <div class="section">
      <div class="section-title">请求参数</div>
      ${paramsHtml}
    </div>

    <div class="section">
      <div class="section-title">返回响应</div>
      <div class="response-card">
        <div class="response-header">
          <span class="status-dot"></span>
          <span class="status-text">200 成功</span>
        </div>
        <div class="response-body">
          <div class="response-sub">application/json · 业务响应</div>
          <div class="code-block-wrapper">
            <button class="copy-btn" onclick="copyToClipboard(this.dataset.text, this)" data-text="${escapeHtml(JSON.stringify(api.responseExample, null, 2))}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              复制
            </button>
            <pre class="code-block"><code>${syntaxHighlight(api.responseExample)}</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">请求示例</div>
      <div class="example-tabs">
        <button class="example-tab active" onclick="switchExample(this,'curl')">cURL</button>
        <button class="example-tab" onclick="switchExample(this,'js')">JavaScript</button>
      </div>
      <div class="code-block-wrapper" id="wrapper-curl">
        <button class="copy-btn" onclick="copyToClipboard(this.dataset.text, this)" data-text="${escapeHtml(curl)}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          复制
        </button>
        <pre class="code-block" id="example-curl"><code>${exampleContent}</code></pre>
      </div>
      <div class="code-block-wrapper" id="wrapper-js" style="display:none">
        <button class="copy-btn" onclick="copyToClipboard(this.dataset.text, this)" data-text="${escapeHtml(js)}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          复制
        </button>
        <pre class="code-block" id="example-js"><code>${jsContent}</code></pre>
      </div>
    </div>

    ${api.params.some(p => p.name === 'category') ? `
    <div class="section">
      <div class="section-title">分类对照</div>
      <div class="param-list category-grid">
        <div class="param-header">可用分类 key</div>
        <div class="category-grid-body">
          ${Object.entries(CATEGORY_MAP).map(([k, v]) => `
            <div class="category-grid-item">
              <span class="param-name">${k}</span>
              <span class="category-grid-label">${escapeHtml(v)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    ` : ''}
  `;
}

function switchExample(btn, type) {
  document.querySelectorAll('.example-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const curlWrap = document.getElementById('wrapper-curl');
  const jsWrap = document.getElementById('wrapper-js');

  if (type === 'curl') {
    curlWrap.style.display = 'block';
    jsWrap.style.display = 'none';
  } else {
    curlWrap.style.display = 'none';
    jsWrap.style.display = 'block';
  }
}

/* ----------------------------------------------------------
   Debug Panel
   ---------------------------------------------------------- */
function renderDebug() {
  const api = APIS.find(a => a.id === currentApiId);
  if (!api) return;

  let inputsHtml = '';
  if (api.params.length === 0) {
    inputsHtml = '<div style="color:var(--text-muted);font-size:12.5px;padding:6px 0;">该接口无需参数</div>';
  } else {
    inputsHtml = `
      <table class="debug-input-table">
        <tr><th>参数</th><th>值</th></tr>
        ${api.params.map(p => {
          let inputEl;
          if (p.name === 'c') {
            const options = Object.entries(CATEGORY_MAP).map(([k, v]) =>
              `<option value="${escapeHtml(k)}">${escapeHtml(k)} - ${escapeHtml(v)}</option>`
            ).join('');
            inputEl = `<select id="debug-${p.name}"><option value="">全部</option>${options}</select>`;
          } else if (p.name === 'e') {
            inputEl = `<select id="debug-${p.name}"><option value="">json</option><option value="text">text</option></select>`;
          } else {
            inputEl = `<input type="text" id="debug-${p.name}" placeholder="${escapeHtml(p.desc)}">`;
          }
          return `
            <tr>
              <td><span class="param-name">${escapeHtml(p.name)}</span></td>
              <td>${inputEl}</td>
            </tr>
          `;
        }).join('')}
      </table>
    `;
  }

  const durationHtml = lastDuration !== null
    ? `<span class="debug-duration">${lastDuration}ms</span>`
    : '';

  const requestInfoHtml = lastRequestUrl !== null
    ? `
      <div class="debug-result-header">
        <span class="debug-result-title">请求信息</span>
      </div>
      <div class="code-block-wrapper" style="margin-bottom:14px;">
        <button class="copy-btn" onclick="copyToClipboard(this.dataset.text, this)" data-text="${escapeHtml(lastRequestUrl)}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          复制
        </button>
        <pre class="code-block"><code><span class="json-key">GET</span> <span class="json-str">${escapeHtml(lastRequestUrl)}</span></code></pre>
      </div>
    `
    : '';

  const resultHtml = lastResponse !== null
    ? `
      <div class="debug-result-header">
        <span class="debug-result-title">返回结果</span>
        <div style="display:flex;align-items:center;gap:8px;">
          ${durationHtml}
          <span class="debug-status ${lastStatus >= 200 && lastStatus < 300 ? 'ok' : 'err'}">${lastStatus}</span>
        </div>
      </div>
      <div class="code-block-wrapper">
        <button class="copy-btn" onclick="copyToClipboard(this.dataset.text, this)" data-text="${escapeHtml(JSON.stringify(lastResponse, null, 2))}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          复制
        </button>
        <pre class="code-block"><code>${syntaxHighlight(lastResponse)}</code></pre>
      </div>
    `
    : `<div class="debug-result-empty">点击「发送」按钮获取返回结果</div>`;

  document.getElementById('debug-body').innerHTML = `
    <div class="debug-url-bar">
      <span class="method-tag get">GET</span>
      <div class="debug-url">${escapeHtml(api.path)}</div>
      <button class="btn-send" id="btn-send" onclick="sendDebug()">发送</button>
    </div>

    <div class="debug-section-title">Query 参数</div>
    ${inputsHtml}

    <div class="debug-result">
      ${requestInfoHtml}
      ${resultHtml}
    </div>
  `;
}

async function sendDebug() {
  const api = APIS.find(a => a.id === currentApiId);
  if (!api) return;

  const btn = document.getElementById('btn-send');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '请求中…';
  }

  // 保存当前已填写的参数值
  const preservedValues = {};
  for (const p of api.params) {
    const el = document.getElementById('debug-' + p.name);
    if (el) preservedValues[p.name] = el.value;
  }

  const url = new URL(api.path, API_BASE);
  for (const p of api.params) {
    const val = preservedValues[p.name]?.trim();
    if (val) url.searchParams.set(p.name, val);
  }
  lastRequestUrl = url.toString();

  const startTime = performance.now();
  try {
    const res = await fetch(url.toString());
    lastStatus = res.status;
    const data = await res.json();
    lastResponse = data;
  } catch (e) {
    lastStatus = 0;
    lastResponse = { error: e.message };
  }
  lastDuration = Math.round(performance.now() - startTime);

  renderDebug();

  // 恢复已填写的参数值
  for (const p of api.params) {
    const el = document.getElementById('debug-' + p.name);
    if (el && preservedValues[p.name] !== undefined) {
      el.value = preservedValues[p.name];
    }
  }
}

/* ----------------------------------------------------------
   Sidebar Toggle
   ---------------------------------------------------------- */
function toggleSidebar(show) {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (show) {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ----------------------------------------------------------
   Panel Toggle
   ---------------------------------------------------------- */
function updateDebugToggle() {
  const toggle = document.getElementById('debug-toggle');
  if (debugCollapsed) {
    toggle.title = '展开面板';
    toggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>
    </svg>`;
  } else {
    toggle.title = '收起面板';
    toggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M13 17l5-5-5-5M6 17l5-5-5-5"/>
    </svg>`;
  }
}

function toggleDebugPanel(show) {
  const panel = document.getElementById('debug-panel');
  debugCollapsed = !show;

  if (show) {
    panel.classList.remove('collapsed');
  } else {
    panel.classList.add('collapsed');
  }
  updateDebugToggle();
}

/* ----------------------------------------------------------
   Search
   ---------------------------------------------------------- */
document.getElementById('search-input').addEventListener('input', function() {
  const q = this.value.toLowerCase().trim();
  document.querySelectorAll('.sidebar-group').forEach(g => {
    const items = g.querySelectorAll('.sidebar-item');
    let hasVisible = false;
    items.forEach(item => {
      const name = item.querySelector('.sidebar-item-name').textContent.toLowerCase();
      const visible = name.includes(q);
      item.style.display = visible ? 'flex' : 'none';
      if (visible) hasVisible = true;
    });
    g.style.display = hasVisible ? 'block' : 'none';
  });
});

/* ----------------------------------------------------------
   Event Listeners
   ---------------------------------------------------------- */
document.getElementById('menu-toggle').addEventListener('click', () => toggleSidebar(true));
document.getElementById('sidebar-overlay').addEventListener('click', () => toggleSidebar(false));
document.getElementById('debug-close').addEventListener('click', () => toggleDebugPanel(false));
document.getElementById('debug-toggle').addEventListener('click', () => toggleDebugPanel(debugCollapsed));

// Keyboard shortcut: Ctrl/Cmd + Enter to send
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    const btn = document.getElementById('btn-send');
    if (btn && !btn.disabled) {
      sendDebug();
    }
  }
});

/* ----------------------------------------------------------
   Init
   ---------------------------------------------------------- */
renderSidebar();
renderMain();
renderDebug();
updateDebugToggle();
