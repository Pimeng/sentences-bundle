export default function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sentences Bundle API 文档</title>
  <style>
    :root {
      --bg: #0f0f0f;
      --sidebar-bg: #141414;
      --panel-bg: #1a1a1a;
      --card-bg: #1e1e1e;
      --card-hover: #252525;
      --border: #2a2a2a;
      --border-light: #3a3a3a;
      --text: #e5e7eb;
      --text-secondary: #9ca3af;
      --text-muted: #6b7280;
      --primary: #10b981;
      --primary-dark: #059669;
      --primary-bg: rgba(16,185,129,0.12);
      --accent: #6366f1;
      --accent-bg: rgba(99,102,241,0.12);
      --danger: #ef4444;
      --danger-bg: rgba(239,68,68,0.12);
      --code-bg: #111111;
      --radius: 8px;
      --radius-sm: 6px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      font-size: 13px;
      line-height: 1.6;
      overflow: hidden;
    }

    /* Layout */
    .app {
      display: flex;
      height: 100vh;
      width: 100vw;
    }

    /* Sidebar */
    .sidebar {
      width: 260px;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .sidebar-header {
      padding: 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .sidebar-header .logo {
      width: 28px; height: 28px;
      background: var(--primary-bg);
      color: var(--primary);
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 12px;
    }
    .sidebar-header .title {
      font-weight: 600; font-size: 14px;
    }
    .sidebar-search {
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
    }
    .sidebar-search input {
      width: 100%;
      background: var(--panel-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 6px 10px;
      color: var(--text);
      font-size: 12px;
      outline: none;
    }
    .sidebar-search input::placeholder { color: var(--text-muted); }
    .sidebar-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    }
    .sidebar-group {
      margin-bottom: 4px;
    }
    .sidebar-group-title {
      padding: 8px 16px;
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
    }
    .sidebar-group-title::after {
      content: '▾';
      font-size: 10px;
    }
    .sidebar-group.collapsed .sidebar-group-title::after {
      content: '▸';
    }
    .sidebar-group.collapsed .sidebar-items {
      display: none;
    }
    .sidebar-item {
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      gap: 8px;
      border-left: 2px solid transparent;
      transition: background .15s;
    }
    .sidebar-item:hover {
      background: var(--card-hover);
    }
    .sidebar-item.active {
      background: var(--card-bg);
      border-left-color: var(--primary);
    }
    .sidebar-item-left {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
    }
    .method-tag {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 5px;
      border-radius: 3px;
      letter-spacing: 0.3px;
      flex-shrink: 0;
    }
    .method-tag.get { background: var(--primary-bg); color: var(--primary); }
    .sidebar-item-name {
      font-size: 12px;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sidebar-item.active .sidebar-item-name {
      color: var(--text);
    }

    /* Main Content */
    .main {
      flex: 1;
      overflow-y: auto;
      background: var(--bg);
    }
    .main-inner {
      max-width: 760px;
      padding: 32px 36px;
    }
    .api-header-area {
      margin-bottom: 28px;
    }
    .api-breadcrumb {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 10px;
    }
    .api-title {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 14px;
    }
    .api-path-bar {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 8px 14px;
    }
    .api-path-bar .method-tag.get {
      font-size: 11px;
      padding: 3px 7px;
    }
    .api-path-bar code {
      font-family: "Fira Code", "SFMono-Regular", Consolas, monospace;
      font-size: 13px;
      color: #a5b4fc;
    }
    .api-desc {
      color: var(--text-secondary);
      font-size: 13px;
      margin-top: 14px;
      line-height: 1.7;
    }

    .section {
      margin-top: 28px;
    }
    .section-title {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 14px;
      color: #f3f4f6;
    }

    /* Param List */
    .param-list {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }
    .param-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
      font-size: 12px;
      color: var(--text-secondary);
    }
    .param-header .badge {
      background: var(--panel-bg);
      border: 1px solid var(--border);
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 11px;
    }
    .param-row {
      display: flex;
      align-items: flex-start;
      padding: 12px 14px;
      border-bottom: 1px solid var(--border);
      gap: 14px;
    }
    .param-row:last-child { border-bottom: none; }
    .param-name {
      font-family: "Fira Code", "SFMono-Regular", Consolas, monospace;
      font-size: 12px;
      color: #93c5fd;
      background: var(--panel-bg);
      padding: 2px 8px;
      border-radius: 4px;
      white-space: nowrap;
    }
    .param-meta {
      flex: 1;
      min-width: 0;
    }
    .param-type {
      font-size: 12px;
      color: var(--primary);
      margin-bottom: 2px;
    }
    .param-desc {
      font-size: 12px;
      color: var(--text-secondary);
    }
    .param-required {
      font-size: 11px;
      color: var(--danger);
      background: var(--danger-bg);
      padding: 1px 6px;
      border-radius: 4px;
      white-space: nowrap;
    }
    .param-optional {
      font-size: 11px;
      color: var(--text-muted);
      background: var(--panel-bg);
      padding: 1px 6px;
      border-radius: 4px;
      white-space: nowrap;
    }

    /* Response */
    .response-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }
    .response-header {
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    .status-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--primary);
    }
    .status-text {
      font-size: 13px;
      font-weight: 500;
    }
    .response-body {
      padding: 14px;
    }
    .response-sub {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 10px;
    }

    /* Code Block */
    pre.code-block {
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 14px;
      overflow-x: auto;
      font-size: 12px;
      line-height: 1.6;
      margin: 0;
    }
    code {
      font-family: "Fira Code", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    }
    .json-key { color: #93c5fd; }
    .json-str { color: #86efac; }
    .json-num { color: #fca5a5; }
    .json-bool { color: #fcd34d; }

    /* Example Tabs */
    .example-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 10px;
    }
    .example-tab {
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      color: var(--text-muted);
      cursor: pointer;
      border: none;
      background: transparent;
    }
    .example-tab.active {
      background: var(--accent-bg);
      color: var(--accent);
    }

    /* Debug Panel */
    .debug-panel {
      width: 420px;
      background: var(--panel-bg);
      border-left: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .debug-header {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .debug-header-title {
      font-weight: 600;
      font-size: 14px;
    }
    .debug-close {
      background: none; border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 16px;
    }
    .debug-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }
    .debug-url-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }
    .debug-url-bar .method-tag.get {
      font-size: 11px;
      padding: 4px 8px;
    }
    .debug-url {
      flex: 1;
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 7px 10px;
      color: var(--text-secondary);
      font-family: "Fira Code", monospace;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .btn-send {
      background: var(--primary);
      color: #fff;
      border: none;
      border-radius: var(--radius-sm);
      padding: 7px 16px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background .2s;
    }
    .btn-send:hover { background: var(--primary-dark); }

    .debug-section-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      margin: 14px 0 8px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .debug-input-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    .debug-input-table th {
      text-align: left;
      padding: 6px 8px;
      color: var(--text-muted);
      font-weight: 500;
      border-bottom: 1px solid var(--border);
    }
    .debug-input-table td {
      padding: 6px 8px;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }
    .debug-input-table input {
      width: 100%;
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 5px 8px;
      color: var(--text);
      font-size: 12px;
      outline: none;
      font-family: "Fira Code", monospace;
    }
    .debug-input-table input:focus {
      border-color: var(--border-light);
    }

    .debug-result {
      margin-top: 16px;
      border-top: 1px solid var(--border);
      padding-top: 14px;
    }
    .debug-result-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .debug-result-title {
      font-weight: 600;
      font-size: 13px;
    }
    .debug-status {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .debug-status.ok {
      background: var(--primary-bg);
      color: var(--primary);
    }
    .debug-status.err {
      background: var(--danger-bg);
      color: var(--danger);
    }
    .debug-result-empty {
      color: var(--text-muted);
      font-size: 12px;
      text-align: center;
      padding: 30px 0;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #4a4a4a; }

    /* Responsive */
    @media (max-width: 1100px) {
      .debug-panel { display: none; }
    }
  </style>
</head>
<body>
  <div class="app">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">SB</div>
        <div class="title">Sentences Bundle</div>
      </div>
      <div class="sidebar-search">
        <input type="text" placeholder="搜索接口..." id="search-input">
      </div>
      <div class="sidebar-scroll" id="sidebar-scroll">
        <!-- Generated by JS -->
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main" id="main-scroll">
      <div class="main-inner" id="main-content">
        <!-- Generated by JS -->
      </div>
    </main>

    <!-- Debug Panel -->
    <aside class="debug-panel" id="debug-panel">
      <div class="debug-header">
        <span class="debug-header-title">在线运行</span>
      </div>
      <div class="debug-body" id="debug-body">
        <!-- Generated by JS -->
      </div>
    </aside>
  </div>

  <script>
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
          { name: 'category', type: 'string', desc: '分类 key，如 a（动画）、b（漫画）、c（游戏）等', required: false }
        ],
        responseExample: { id: 1234, uuid: "abc-def", hitokoto: "句子内容", type: "a", from: "作品名", from_who: "作者", creator: "提交者", created_at: "2020-01-01" }
      },
      {
        id: 'sentences',
        group: '句子接口',
        name: '批量获取句子',
        method: 'GET',
        path: '/api/sentences',
        desc: '按指定数量和分类随机抽取多条句子。不填分类则从全部句子中抽取，num 参数控制返回数量。',
        params: [
          { name: 'category', type: 'string', desc: '分类 key，如 a、b、c 等', required: false },
          { name: 'num', type: 'integer', desc: '获取数量，默认 10，最大 100', required: false }
        ],
        responseExample: { count: 2, sentences: [{ id: 1, hitokoto: "...", from: "..." }, { id: 2, hitokoto: "...", from: "..." }] }
      },
      {
        id: 'categories',
        group: '元数据接口',
        name: '分类列表',
        method: 'GET',
        path: '/api/categories',
        desc: '返回所有可用的分类及每类句子的数量。',
        params: [],
        responseExample: { categories: [{ id: 1, name: "动画", desc: "Anime - 动画", key: "a", count: 100 }] }
      }
    ];

    const CATEGORY_MAP = {
      a: '动画', b: '漫画', c: '游戏', d: '文学', e: '原创',
      f: '网络', g: '其他', h: '影视', i: '诗词', j: '网易云',
      k: '哲学', l: '抖机灵'
    };

    let currentApiId = 'random';
    let lastResponse = null;
    let lastStatus = null;

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
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

    function renderSidebar() {
      const container = document.getElementById('sidebar-scroll');
      const groups = {};
      APIS.forEach(api => {
        if (!groups[api.group]) groups[api.group] = [];
        groups[api.group].push(api);
      });

      let html = '';
      for (const [groupName, items] of Object.entries(groups)) {
        html += \`<div class="sidebar-group" data-group="\${escapeHtml(groupName)}">\`;
        html += \`<div class="sidebar-group-title" onclick="toggleGroup(this)">\${escapeHtml(groupName)}</div>\`;
        html += \`<div class="sidebar-items">\`;
        for (const api of items) {
          const active = api.id === currentApiId ? 'active' : '';
          html += \`
            <div class="sidebar-item \${active}" data-id="\${api.id}" onclick="selectApi('\${api.id}')">
              <div class="sidebar-item-left">
                <span class="method-tag get">GET</span>
                <span class="sidebar-item-name">\${escapeHtml(api.name)}</span>
              </div>
            </div>
          \`;
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
    }

    function renderMain() {
      const api = APIS.find(a => a.id === currentApiId);
      if (!api) return;

      let paramsHtml = '';
      if (api.params.length === 0) {
        paramsHtml = \`<div class="param-list"><div class="param-row"><span class="param-optional">无需参数</span></div></div>\`;
      } else {
        paramsHtml = \`
          <div class="param-list">
            <div class="param-header">
              <span>Query 参数</span>
              <span class="badge">application/json</span>
            </div>
        \`;
        for (const p of api.params) {
          const req = p.required
            ? '<span class="param-required">必需</span>'
            : '<span class="param-optional">可选</span>';
          paramsHtml += \`
            <div class="param-row">
              <span class="param-name">\${escapeHtml(p.name)}</span>
              <div class="param-meta">
                <div class="param-type">\${escapeHtml(p.type)}</div>
                <div class="param-desc">\${escapeHtml(p.desc)}</div>
              </div>
              \${req}
            </div>
          \`;
        }
        paramsHtml += '</div>';
      }

      const curl = \`curl -X GET "\${API_BASE}\${api.path}\"\`;
      const js = \`fetch("\${API_BASE}\${api.path}")
  .then(r => r.json())
  .then(console.log);\`;

      document.getElementById('main-content').innerHTML = \`
        <div class="api-header-area">
          <div class="api-breadcrumb">\${escapeHtml(api.group)} / \${escapeHtml(api.name)}</div>
          <div class="api-title">\${escapeHtml(api.name)}</div>
          <div class="api-path-bar">
            <span class="method-tag get">GET</span>
            <code>\${escapeHtml(api.path)}</code>
          </div>
          <div class="api-desc">\${escapeHtml(api.desc)}</div>
        </div>

        <div class="section">
          <div class="section-title">请求参数</div>
          \${paramsHtml}
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
              <pre class="code-block"><code>\${syntaxHighlight(api.responseExample)}</code></pre>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">请求示例</div>
          <div class="example-tabs">
            <button class="example-tab active" onclick="switchExample(this,'curl')">cURL</button>
            <button class="example-tab" onclick="switchExample(this,'js')">JavaScript</button>
          </div>
          <pre class="code-block" id="example-curl"><code>\${escapeHtml(curl)}</code></pre>
          <pre class="code-block" id="example-js" style="display:none"><code>\${escapeHtml(js)}</code></pre>
        </div>

        \${api.id !== 'categories' ? \`
        <div class="section">
          <div class="section-title">分类对照</div>
          <div class="param-list">
            <div class="param-header">可用分类 key</div>
            \${Object.entries(CATEGORY_MAP).map(([k,v]) => \`
              <div class="param-row">
                <span class="param-name">\${k}</span>
                <div class="param-meta"><div class="param-desc">\${escapeHtml(v)}</div></div>
              </div>
            \`).join('')}
          </div>
        </div>
        \` : ''}
      \`;
    }

    function switchExample(btn, type) {
      document.querySelectorAll('.example-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('example-curl').style.display = type === 'curl' ? 'block' : 'none';
      document.getElementById('example-js').style.display = type === 'js' ? 'block' : 'none';
    }

    function renderDebug() {
      const api = APIS.find(a => a.id === currentApiId);
      if (!api) return;

      let inputsHtml = '';
      if (api.params.length === 0) {
        inputsHtml = '<div style="color:var(--text-muted);font-size:12px;padding:4px 0;">该接口无需参数</div>';
      } else {
        inputsHtml = `
          <table class="debug-input-table">
            <tr><th>参数</th><th>值</th></tr>
            ${api.params.map(p => {
              let inputEl;
              if (p.name === 'category') {
                const options = Object.entries(CATEGORY_MAP).map(([k, v]) =>
                  `<option value="${escapeHtml(k)}">${escapeHtml(k)} - ${escapeHtml(v)}</option>`
                ).join('');
                inputEl = `<select id="debug-${p.name}" style="width:100%;background:var(--code-bg);border:1px solid var(--border);border-radius:4px;padding:5px 8px;color:var(--text);font-size:12px;outline:none;font-family:&quot;Fira Code&quot;,monospace;"><option value="">全部</option>${options}</select>`;
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
      const resultHtml = lastResponse !== null
        ? \`
          <div class="debug-result-header">
            <span class="debug-result-title">返回结果</span>
            <span class="debug-status \${lastStatus >= 200 && lastStatus < 300 ? 'ok' : 'err'}">\${lastStatus}</span>
          </div>
          <pre class="code-block"><code>\${syntaxHighlight(lastResponse)}</code></pre>
        \`
        : \`<div class="debug-result-empty">点击「发送」按钮获取返回结果</div>\`;

      document.getElementById('debug-body').innerHTML = \`
        <div class="debug-url-bar">
          <span class="method-tag get">GET</span>
          <div class="debug-url">\${escapeHtml(api.path)}</div>
          <button class="btn-send" onclick="sendDebug()">发送</button>
        </div>

        <div class="debug-section-title">Query 参数</div>
        \${inputsHtml}

        <div class="debug-result">
          \${resultHtml}
        </div>
      \`;
    }

    async function sendDebug() {
      const api = APIS.find(a => a.id === currentApiId);
      if (!api) return;

      const url = new URL(api.path, API_BASE);
      for (const p of api.params) {
        const val = document.getElementById('debug-' + p.name)?.value.trim();
        if (val) url.searchParams.set(p.name, val);
      }

      try {
        const res = await fetch(url.toString());
        lastStatus = res.status;
        const data = await res.json();
        lastResponse = data;
      } catch (e) {
        lastStatus = 0;
        lastResponse = { error: e.message };
      }
      renderDebug();
    }

    // Search
    document.getElementById('search-input').addEventListener('input', function() {
      const q = this.value.toLowerCase();
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

    // Init
    renderSidebar();
    renderMain();
    renderDebug();
  </script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
