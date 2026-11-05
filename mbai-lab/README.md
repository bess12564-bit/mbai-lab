# MBAI LAB — 测测你的 MBAI（全栈版）

把你的 AI 使用习惯做成一个可部署的全栈小项目：Node 零依赖后端 + 静态前端 + 结果统计 API。

## 快速开始

要求 Node.js 18+（无需 npm install，零第三方依赖）。

```bash
npm start        # 或 node server.js
# 打开 http://localhost:3000
```

开发模式（文件变更自动重启）：

```bash
npm run dev
```

## 项目结构

```
mbai-lab/
├─ server.js            # 后端：静态托管 + REST API（零依赖 Node http）
├─ data/
│  ├─ quiz-data.js      # 题目 / 人格文案（前后端共享的唯一数据源）
│  └─ results.json      # 测试结果存储（自动创建，可删）
├─ public/
│  ├─ index.html        # 首页
│  ├─ style.css         # 样式
│  └─ quiz.js           # 前端逻辑（内置数据兜底，后端挂了也能玩）
├─ package.json
└─ .env.example
```

## API

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/health` | 健康检查 |
| GET | `/api/questions` | 题目与人格配置（前端启动时拉取） |
| POST | `/api/results` | 提交结果 `{code, name, answers}`，返回 `{rank, total}` |
| GET | `/api/stats` | 人格分布统计 `{total, distribution}` |
| GET | `/api/results?limit=20` | 最近结果（不含答案明细） |

请求示例：

```bash
curl -X POST http://localhost:3000/api/results   -H 'Content-Type: application/json'   -d '{"code":"LSV","name":"脑力陪练员","answers":[1,1,1,1,1,1,1,1,1]}'
```

## 部署（获得公网 URL）

**Render / Railway / Fly.io**：新建 Web Service，Build Command 留空（或 `npm ci`），Start Command 填 `node server.js`，暴露端口 3000（平台通常自动注入 `PORT`）。

**VPS**：`git clone` 后 `node server.js`，前面用 Nginx 反代到 3000，再配 HTTPS。

## 说明

- 存储用 JSON 文件，适合演示与小流量；要接生产数据库，把 `loadResults/saveResults` 换成你的 DB 调用即可。
- 写接口带简单的每 IP 每分钟 30 次限流；前端对后端不可用有完整降级。
