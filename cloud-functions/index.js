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
  <title>一言句子包 API</title>
  <style>
    :root {
      --bg: #f5f7fa;
      --card-bg: #fff;
      --primary: #4f46e5;
      --primary-light: #e0e7ff;
      --text: #1f2937;
      --text-secondary: #6b7280;
      --border: #e5e7eb;
      --radius: 12px;
      --shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05);
      --shadow-hover: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.08);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }
    .container {
      max-width: 960px;
      margin: 0 auto;
      padding: 32px 20px;
    }
    header {
      text-align: center;
      margin-bottom: 36px;
    }
    header h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 6px;
      background: linear-gradient(90deg, #4f46e5, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    header p {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }
    .section-title {
      font-size: 1.15rem;
      font-weight: 600;
      margin: 32px 0 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tutorial {
      background: var(--card-bg);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    .tutorial-item {
      border-bottom: 1px solid var(--border);
    }
    .tutorial-item:last-child { border-bottom: none; }
    .tutorial summary {
      cursor: pointer;
      padding: 16px 20px;
      font-weight: 600;
      color: var(--text);
      user-select: none;
      list-style: none;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .tutorial summary::-webkit-details-marker { display: none; }
    .tutorial summary::before {
      content: '▸';
      color: var(--primary);
      font-size: 0.9rem;
      transition: transform .2s;
      display: inline-block;
    }
    .tutorial details[open] > summary::before { transform: rotate(90deg); }
    .tutorial details[open] > summary { background: #fafafa; }
    .tutorial-body {
      padding: 0 20px 18px;
    }
    .tutorial-body p, .tutorial-body ul {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 10px;
    }
    .tutorial-body ul { margin-left: 18px; }
    .tutorial-body li { margin-bottom: 6px; }
    .tutorial pre {
      background: #1f2937;
      color: #e5e7eb;
      padding: 14px 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.85rem;
      line-height: 1.55;
      margin: 10px 0;
    }
    .tutorial code {
      font-family: "Fira Code", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    }
    .inline-code {
      background: var(--primary-light);
      color: var(--primary);
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 0.85em;
    }
    .toolbar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 14px;
    }
    .btn {
      padding: 7px 16px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      background: var(--primary);
      color: #fff;
      transition: background .2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn:hover { background: #4338ca; }
    .btn-ghost {
      background: transparent;
      color: var(--primary);
      border: 1px solid var(--primary);
    }
    .btn-ghost:hover { background: var(--primary-light); }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .card {
      background: var(--card-bg);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 20px;
      display: flex;
      flex-direction: column;
      transition: transform .2s, box-shadow .2s;
      position: relative;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-hover);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .card-title {
      font-size: 1.05rem;
      font-weight: 600;
    }
    .card-desc {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 2px;
    }
    .card-tag {
      background: var(--primary-light);
      color: var(--primary);
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .card-body {
      flex: 1;
      font-size: 0.95rem;
      line-height: 1.7;
      margin-bottom: 14px;
      word-break: break-word;
      transition: opacity .15s;
    }
    .card-meta {
      font-size: 0.82rem;
      color: var(--text-secondary);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-actions {
      display: flex;
      gap: 8px;
    }
    .card-actions button {
      background: none;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 0.78rem;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all .2s;
    }
    .card-actions button:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: var(--primary-light);
    }
    .loading {
      text-align: center;
      padding: 40px;
      color: var(--text-secondary);
    }
    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 12px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    footer {
      text-align: center;
      padding: 32px 0 16px;
      font-size: 0.82rem;
      color: var(--text-secondary);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Sentences Bundle API</h1>
      <p>基于 Cloud Function 的一言句子服务 · 支持随机获取、分类查询、批量抽取</p>
    </header>

    <h2 class="section-title">📖 API 文档</h2>
    <section class="tutorial">
      <div class="tutorial-item">
        <details>
          <summary>🎲 随机获取一言</summary>
          <div class="tutorial-body">
            <pre><code>GET /api/random
GET /api/random?category=a</code></pre>
            <p><span class="inline-code">category</span>（可选）：分类 key，如 <span class="inline-code">a</span>（动画）。不填则从全部随机。</p>
          </div>
        </details>
      </div>
      <div class="tutorial-item">
        <details>
          <summary>📂 获取分类列表</summary>
          <div class="tutorial-body">
            <pre><code>GET /api/categories</code></pre>
            <p>返回所有分类及每类句子数量。</p>
          </div>
        </details>
      </div>
      <div class="tutorial-item">
        <details>
          <summary>📑 按分类和数量获取</summary>
          <div class="tutorial-body">
            <pre><code>GET /api/sentences?category=a&num=10</code></pre>
            <p><span class="inline-code">category</span>（可选）：分类 key。不填则从全部抽取。</p>
            <p><span class="inline-code">num</span>（可选）：获取数量，默认 10，最大 100。</p>
          </div>
        </details>
      </div>
    </section>

    <h2 class="section-title">🎴 分类预览</h2>
    <div class="toolbar">
      <button class="btn btn-ghost" id="btn-refresh">🔄 全部刷新</button>
    </div>
    <div id="preview">
      <div class="loading"><div class="spinner"></div>正在加载...</div>
    </div>

    <footer>
      Sentences Bundle · API Powered by Cloud Function
    </footer>
  </div>

  <script>
    (async () => {
      const $ = sel => document.querySelector(sel);

      function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
      }

      async function renderPreview() {
        const container = $('#preview');
        container.innerHTML = '<div class="loading"><div class="spinner"></div>正在加载...</div>';

        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('无法加载分类数据');
        const { categories } = await res.json();

        const grid = document.createElement('div');
        grid.className = 'grid';

        for (const cat of categories) {
          const r = await fetch('/api/random?category=' + encodeURIComponent(cat.key));
          const s = r.ok ? await r.json() : null;

          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = \`
            <div class="card-header">
              <div>
                <div class="card-title">\${escapeHtml(cat.name)}</div>
                <div class="card-desc">\${escapeHtml(cat.desc)}</div>
              </div>
              <span class="card-tag">\${cat.count} 句</span>
            </div>
            <div class="card-body" id="quote-\${cat.key}">
              \${s ? '「' + escapeHtml(s.hitokoto) + '」' : '加载失败'}
            </div>
            <div class="card-meta">
              <span id="meta-\${cat.key}">\${s && s.from ? '《' + escapeHtml(s.from) + '》' + (s.from_who ? ' ' + escapeHtml(s.from_who) : '') : ''}</span>
              <div class="card-actions">
                <button onclick="refreshCat('\${cat.key}')">🔄 换一句</button>
                <button onclick="copyQuote('\${cat.key}')">📋 复制</button>
              </div>
            </div>
          \`;
          grid.appendChild(card);
        }

        container.innerHTML = '';
        container.appendChild(grid);
      }

      window.refreshCat = async (key) => {
        const el = document.getElementById('quote-' + key);
        const meta = document.getElementById('meta-' + key);
        if (!el) return;
        try {
          const res = await fetch('/api/random?category=' + encodeURIComponent(key));
          const s = await res.json();
          el.style.opacity = '0';
          setTimeout(() => {
            el.innerHTML = '「' + escapeHtml(s.hitokoto) + '」';
            el.style.opacity = '1';
            if (meta) {
              meta.textContent = (s.from ? '《' + s.from + '》' : '') + (s.from_who ? ' ' + s.from_who : '');
            }
          }, 150);
        } catch (e) {
          el.textContent = '加载失败';
        }
      };

      window.copyQuote = async (key) => {
        const el = document.getElementById('quote-' + key);
        if (!el) return;
        const text = el.textContent.replace(/^「|」$/g, '').trim();
        try {
          await navigator.clipboard.writeText(text);
          const btn = el.closest('.card').querySelector('.card-actions button:last-child');
          const orig = btn.textContent;
          btn.textContent = '✓ 已复制';
          setTimeout(() => btn.textContent = orig, 1200);
        } catch (err) {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
      };

      $('#btn-refresh').addEventListener('click', () => {
        document.querySelectorAll('.card').forEach((card, i) => {
          const key = card.querySelector('.card-body').id.replace('quote-', '');
          setTimeout(() => window.refreshCat(key), i * 60);
        });
      });

      try {
        await renderPreview();
      } catch (err) {
        $('#preview').innerHTML = '<div class="loading">加载失败：' + escapeHtml(err.message) + '</div>';
        console.error(err);
      }
    })();
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
