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
      --bg: #1a1a1a;
      --card-bg: #252525;
      --card-bg-hover: #2e2e2e;
      --primary: #10b981;
      --primary-hover: #059669;
      --primary-bg: rgba(16, 185, 129, 0.15);
      --accent: #6366f1;
      --accent-bg: rgba(99, 102, 241, 0.15);
      --text: #e5e7eb;
      --text-secondary: #9ca3af;
      --text-muted: #6b7280;
      --border: #374151;
      --border-light: #4b5563;
      --code-bg: #1f2937;
      --radius: 10px;
      --radius-sm: 6px;
      --shadow: 0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -2px rgba(0,0,0,0.3);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      font-size: 14px;
    }
    .container {
      max-width: 860px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    header {
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
    }
    header h1 {
      font-size: 1.6rem;
      font-weight: 700;
      margin-bottom: 6px;
      color: #f3f4f6;
    }
    header p {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    /* Section Title */
    .section-title {
      font-size: 1.15rem;
      font-weight: 600;
      margin: 36px 0 18px;
      color: #f3f4f6;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title .num {
      color: var(--primary);
      font-weight: 700;
    }

    /* API Endpoint Card */
    .api-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      margin-bottom: 16px;
      box-shadow: var(--shadow);
    }
    .api-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      cursor: pointer;
      user-select: none;
      transition: background 0.2s;
    }
    .api-header:hover {
      background: var(--card-bg-hover);
    }
    .api-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .method-badge {
      background: var(--primary);
      color: #fff;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      letter-spacing: 0.5px;
    }
    .api-name {
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--text);
    }
    .api-path {
      color: var(--text-muted);
      font-size: 0.85rem;
      font-family: "Fira Code", "SFMono-Regular", Consolas, monospace;
    }
    .api-toggle {
      color: var(--text-muted);
      font-size: 0.8rem;
      transition: transform 0.2s;
    }
    .api-card.open .api-toggle {
      transform: rotate(180deg);
    }

    /* API Body */
    .api-body {
      display: none;
      padding: 0 18px 18px;
      border-top: 1px solid var(--border);
    }
    .api-card.open .api-body {
      display: block;
    }
    .api-desc {
      color: var(--text-secondary);
      font-size: 0.9rem;
      padding: 14px 0 6px;
    }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 8px;
      margin: 14px 0;
    }
    .tab {
      padding: 5px 12px;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      color: var(--text-secondary);
      background: transparent;
      border: 1px solid var(--border);
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab.active {
      background: var(--accent-bg);
      color: var(--accent);
      border-color: var(--accent);
    }

    /* Subsection */
    .subsection {
      margin-top: 18px;
    }
    .subsection-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 10px;
      padding-left: 10px;
      border-left: 3px solid var(--accent);
    }

    /* URL Box */
    .url-box {
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      font-family: "Fira Code", "SFMono-Regular", Consolas, monospace;
      font-size: 0.85rem;
    }
    .url-text {
      color: #a5b4fc;
      overflow-x: auto;
      white-space: nowrap;
    }
    .url-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
    .btn-sm {
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      border: none;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }
    .btn-primary {
      background: var(--primary);
      color: #fff;
    }
    .btn-primary:hover {
      background: var(--primary-hover);
    }
    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--border-light);
    }
    .btn-ghost:hover {
      background: var(--card-bg-hover);
      color: var(--text);
    }

    /* Table */
    .param-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }
    .param-table th,
    .param-table td {
      text-align: left;
      padding: 8px 12px;
      border: 1px solid var(--border);
    }
    .param-table th {
      background: var(--code-bg);
      color: var(--text-secondary);
      font-weight: 500;
    }
    .param-table td {
      color: var(--text);
    }
    .param-table .col-name {
      color: #a5b4fc;
      font-family: "Fira Code", "SFMono-Regular", Consolas, monospace;
    }
    .param-table .col-type {
      color: var(--primary);
    }
    .param-table .col-optional {
      color: var(--text-muted);
      text-align: center;
    }

    /* Code Block */
    pre {
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 14px 16px;
      overflow-x: auto;
      font-size: 0.82rem;
      line-height: 1.55;
      margin: 0;
    }
    code {
      font-family: "Fira Code", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    }
    .json-key { color: #93c5fd; }
    .json-str { color: #86efac; }
    .json-num { color: #fca5a5; }
    .json-bool { color: #fcd34d; }
    .json-null { color: #fcd34d; }

    /* Endpoint List */
    .endpoint-list {
      margin-top: 8px;
      padding-left: 18px;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .endpoint-list li {
      margin-bottom: 8px;
      line-height: 1.6;
    }
    .endpoint-list code {
      background: var(--code-bg);
      padding: 1px 5px;
      border-radius: 4px;
      color: #a5b4fc;
      font-size: 0.85em;
    }

    /* Info Box */
    .info-box {
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 14px 16px;
      margin-top: 14px;
    }
    .info-box-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .info-box p {
      color: var(--text-secondary);
      font-size: 0.85rem;
      line-height: 1.6;
    }
    .info-box code {
      background: var(--code-bg);
      padding: 1px 5px;
      border-radius: 4px;
      color: #a5b4fc;
      font-size: 0.85em;
    }

    /* Category tags */
    .cat-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 10px;
    }
    .cat-tag {
      background: var(--code-bg);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      font-family: "Fira Code", "SFMono-Regular", Consolas, monospace;
    }

    footer {
      text-align: center;
      padding: 40px 0 16px;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Sentences Bundle API</h1>
      <p>一言句子包 · Cloud Function API 文档</p>
    </header>

    <!-- API 1: Random -->
    <div class="section-title"><span class="num"># 1.</span> 随机获取一言</div>
    <div class="api-card" id="card-random">
      <div class="api-header" onclick="toggleCard('card-random')">
        <div class="api-header-left">
          <span class="method-badge">GET</span>
          <span class="api-name">随机句子</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span class="api-path">/api/random</span>
          <span class="api-toggle">▼</span>
        </div>
      </div>
      <div class="api-body">
        <div class="api-desc">从全部句子中随机抽取一条，或指定分类后从该分类中随机抽取。</div>
        <div class="tabs">
          <button class="tab active">默认</button>
          <button class="tab">指定分类</button>
        </div>

        <div class="subsection">
          <div class="subsection-title">请求地址</div>
          <div class="url-box">
            <span class="url-text" id="url-random">/api/random</span>
            <div class="url-actions">
              <button class="btn-sm btn-primary" onclick="tryApi('/api/random')">运行</button>
              <button class="btn-sm btn-ghost" onclick="copyUrl('url-random')">复制</button>
            </div>
          </div>
        </div>

        <div class="subsection">
          <div class="subsection-title">请求参数 (Query)</div>
          <table class="param-table">
            <tr><th>参数名</th><th>类型</th><th>说明</th><th>必填</th></tr>
            <tr><td class="col-name">category</td><td class="col-type">string</td><td>分类 key，如 <code>a</code>（动画）</td><td class="col-optional">可选</td></tr>
          </table>
        </div>

        <div class="subsection">
          <div class="subsection-title">响应示例 (JSON)</div>
          <pre><code>{<br>  <span class="json-key">"id"</span>: <span class="json-num">1234</span>,<br>  <span class="json-key">"uuid"</span>: <span class="json-str">"abc-def-123"</span>,<br>  <span class="json-key">"hitokoto"</span>: <span class="json-str">「句子内容」</span>,<br>  <span class="json-key">"type"</span>: <span class="json-str">"a"</span>,<br>  <span class="json-key">"from"</span>: <span class="json-str">"作品名"</span>,<br>  <span class="json-key">"from_who"</span>: <span class="json-str">"作者"</span>,<br>  <span class="json-key">"creator"</span>: <span class="json-str">"提交者"</span>,<br>  <span class="json-key">"created_at"</span>: <span class="json-str">"2020-01-01"</span><br>}</code></pre>
        </div>

        <ul class="endpoint-list">
          <li>端点: <code>GET /api/random</code></li>
          <li>带分类: <code>GET /api/random?category=a</code></li>
        </ul>
      </div>
    </div>

    <!-- API 2: Sentences -->
    <div class="section-title"><span class="num"># 2.</span> 批量获取句子</div>
    <div class="api-card" id="card-sentences">
      <div class="api-header" onclick="toggleCard('card-sentences')">
        <div class="api-header-left">
          <span class="method-badge">GET</span>
          <span class="api-name">批量句子</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span class="api-path">/api/sentences</span>
          <span class="api-toggle">▼</span>
        </div>
      </div>
      <div class="api-body">
        <div class="api-desc">按指定数量和分类随机抽取多条句子。不填分类则从全部句子中抽取。</div>

        <div class="subsection">
          <div class="subsection-title">请求地址</div>
          <div class="url-box">
            <span class="url-text" id="url-sentences">/api/sentences?category=a&num=5</span>
            <div class="url-actions">
              <button class="btn-sm btn-primary" onclick="tryApi('/api/sentences?category=a&num=5')">运行</button>
              <button class="btn-sm btn-ghost" onclick="copyUrl('url-sentences')">复制</button>
            </div>
          </div>
        </div>

        <div class="subsection">
          <div class="subsection-title">请求参数 (Query)</div>
          <table class="param-table">
            <tr><th>参数名</th><th>类型</th><th>说明</th><th>必填</th></tr>
            <tr><td class="col-name">category</td><td class="col-type">string</td><td>分类 key，如 <code>a</code></td><td class="col-optional">可选</td></tr>
            <tr><td class="col-name">num</td><td class="col-type">integer</td><td>获取数量，默认 10，最大 100</td><td class="col-optional">可选</td></tr>
          </table>
        </div>

        <div class="subsection">
          <div class="subsection-title">响应示例 (JSON)</div>
          <pre><code>{<br>  <span class="json-key">"count"</span>: <span class="json-num">5</span>,<br>  <span class="json-key">"sentences"</span>: [<br>    {<br>      <span class="json-key">"id"</span>: <span class="json-num">1</span>,<br>      <span class="json-key">"hitokoto"</span>: <span class="json-str">"..."</span>,<br>      <span class="json-key">"from"</span>: <span class="json-str">"..."</span><br>    }<br>  ]<br>}</code></pre>
        </div>

        <ul class="endpoint-list">
          <li>端点: <code>GET /api/sentences</code></li>
          <li>完整示例: <code>GET /api/sentences?category=a&num=10</code></li>
        </ul>
      </div>
    </div>

    <!-- API 3: Categories -->
    <div class="section-title"><span class="num"># 3.</span> 分类列表</div>
    <div class="api-card" id="card-categories">
      <div class="api-header" onclick="toggleCard('card-categories')">
        <div class="api-header-left">
          <span class="method-badge">GET</span>
          <span class="api-name">分类列表</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span class="api-path">/api/categories</span>
          <span class="api-toggle">▼</span>
        </div>
      </div>
      <div class="api-body">
        <div class="api-desc">返回所有可用的分类及每类句子的数量。</div>

        <div class="subsection">
          <div class="subsection-title">请求地址</div>
          <div class="url-box">
            <span class="url-text" id="url-categories">/api/categories</span>
            <div class="url-actions">
              <button class="btn-sm btn-primary" onclick="tryApi('/api/categories')">运行</button>
              <button class="btn-sm btn-ghost" onclick="copyUrl('url-categories')">复制</button>
            </div>
          </div>
        </div>

        <div class="subsection">
          <div class="subsection-title">请求参数 (Query)</div>
          <table class="param-table">
            <tr><th>参数名</th><th>类型</th><th>说明</th><th>必填</th></tr>
            <tr><td colspan="4" class="col-optional" style="padding:10px;">无需参数</td></tr>
          </table>
        </div>

        <div class="subsection">
          <div class="subsection-title">响应示例 (JSON)</div>
          <pre><code>{<br>  <span class="json-key">"categories"</span>: [<br>    {<br>      <span class="json-key">"id"</span>: <span class="json-num">1</span>,<br>      <span class="json-key">"name"</span>: <span class="json-str">"动画"</span>,<br>      <span class="json-key">"desc"</span>: <span class="json-str">"Anime - 动画"</span>,<br>      <span class="json-key">"key"</span>: <span class="json-str">"a"</span>,<br>      <span class="json-key">"count"</span>: <span class="json-num">100</span><br>    }<br>  ]<br>}</code></pre>
        </div>

        <div class="info-box">
          <div class="info-box-title">💡 分类 key 对照</div>
          <div class="cat-tags">
            <span class="cat-tag">a: 动画</span>
            <span class="cat-tag">b: 漫画</span>
            <span class="cat-tag">c: 游戏</span>
            <span class="cat-tag">d: 文学</span>
            <span class="cat-tag">e: 原创</span>
            <span class="cat-tag">f: 网络</span>
            <span class="cat-tag">g: 其他</span>
            <span class="cat-tag">h: 影视</span>
            <span class="cat-tag">i: 诗词</span>
            <span class="cat-tag">j: 网易云</span>
            <span class="cat-tag">k: 哲学</span>
            <span class="cat-tag">l: 抖机灵</span>
          </div>
        </div>
      </div>
    </div>

    <footer>
      Sentences Bundle · API Powered by Cloud Function
    </footer>
  </div>

  <script>
    function toggleCard(id) {
      const card = document.getElementById(id);
      card.classList.toggle('open');
    }
    // Open first card by default
    document.getElementById('card-random').classList.add('open');

    async function tryApi(path) {
      try {
        const res = await fetch(path);
        const data = await res.json();
        alert(JSON.stringify(data, null, 2));
      } catch (e) {
        alert('请求失败: ' + e.message);
      }
    }

    function copyUrl(id) {
      const text = document.getElementById(id).textContent;
      navigator.clipboard.writeText(location.origin + text).then(() => {
        alert('已复制: ' + location.origin + text);
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = location.origin + text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        alert('已复制: ' + location.origin + text);
      });
    }
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
