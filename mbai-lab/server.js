/**
 * MBAI LAB — 全栈服务（零依赖 Node，Node 18+ 直接运行）
 * 静态前端: public/   数据: data/results.json
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { quizData } = require('./data/quiz-data');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_FILE = path.join(ROOT, 'data', 'results.json');
const MAX_RESULTS = 5000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

/* ---------- 存储 ---------- */
function loadResults() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')).results || []; }
  catch { return []; }
}
function saveResults(results) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify({ results }, null, 2));
}
function appendResult(entry) {
  const results = loadResults();
  results.push(entry);
  saveResults(results.slice(-MAX_RESULTS));
  return results.length; // 返回保存后的总条数（用于名次）
}

/* ---------- 工具 ---------- */
function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', c => {
      raw += c;
      if (raw.length > 1e5) { reject(new Error('payload too large')); req.destroy(); }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new Error('invalid JSON')); }
    });
    req.on('error', reject);
  });
}
function computeRank(results, code) {
  // 该人格在已保存结果中的位次（1 = 第一个）
  const same = results.filter(r => r.code === code);
  return same.length; // append 之前调用时为历史数量，+1 即名次
}

/* ---------- 简单限流：每 IP 每分钟 30 次写操作 ---------- */
const writeHits = new Map();
function rateLimited(req) {
  const ip = req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const win = writeHits.get(ip) || [];
  const fresh = win.filter(t => now - t < 60_000);
  if (fresh.length >= 30) { writeHits.set(ip, fresh); return true; }
  fresh.push(now);
  writeHits.set(ip, fresh);
  return false;
}

/* ---------- 静态文件 ---------- */
function serveStatic(req, res, pathname) {
  let filePath = path.normalize(path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname));
  if (!filePath.startsWith(PUBLIC_DIR)) { sendJson(res, 403, { error: 'forbidden' }); return; }
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // SPA 回退
      fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e2, html) => {
        if (e2) return sendJson(res, 404, { error: 'not found' });
        res.writeHead(200, { 'Content-Type': MIME['.html'] });
        res.end(html);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(content);
  });
}

/* ---------- 路由 ---------- */
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  try {
    // 健康检查
    if (pathname === '/health') return sendJson(res, 200, { ok: true, uptime: process.uptime() });

    // 题目 + 配置（前端启动时拉取，失败则回退内置数据）
    if (req.method === 'GET' && pathname === '/api/questions') {
      return sendJson(res, 200, quizData);
    }

    // 提交测试结果
    if (req.method === 'POST' && pathname === '/api/results') {
      if (rateLimited(req)) return sendJson(res, 429, { error: '请求太频繁，请稍后再试' });
      const body = await readBody(req);
      const code = String(body.code || '').toUpperCase().slice(0, 8);
      const name = String(body.name || '').slice(0, 30);
      const answers = Array.isArray(body.answers) ? body.answers.map(Number).slice(0, 9) : [];
      if (!/^[DL][FS][TV]$/.test(code) || answers.length !== 9 || answers.some(a => a !== 0 && a !== 1)) {
        return sendJson(res, 400, { error: '结果格式不正确' });
      }
      const results = loadResults();
      const rank = computeRank(results, code) + 1;
      appendResult({
        id: crypto.randomUUID(),
        code, name, answers,
        createdAt: new Date().toISOString()
      });
      const total = loadResults().length;
      return sendJson(res, 201, { ok: true, rank, total });
    }

    // 人格分布统计
    if (req.method === 'GET' && pathname === '/api/stats') {
      const results = loadResults();
      const dist = {};
      for (const r of results) dist[r.code] = (dist[r.code] || 0) + 1;
      return sendJson(res, 200, {
        total: results.length,
        distribution: Object.fromEntries(Object.entries(dist).sort((a, b) => b[1] - a[1]))
      });
    }

    // 最近结果（不含答案明细）
    if (req.method === 'GET' && pathname === '/api/results') {
      const limit = Math.min(Number(url.searchParams.get('limit')) || 20, 100);
      const results = loadResults().slice(-limit).reverse()
        .map(({ id, code, name, createdAt }) => ({ id, code, name, createdAt }));
      return sendJson(res, 200, { results });
    }

    if (req.method === 'GET') return serveStatic(req, res, pathname);

    sendJson(res, 405, { error: 'method not allowed' });
  } catch (e) {
    sendJson(res, 400, { error: e.message || 'bad request' });
  }
});

server.listen(PORT, () => {
  console.log(`MBAI LAB 全栈服务已启动: http://localhost:${PORT}`);
});
