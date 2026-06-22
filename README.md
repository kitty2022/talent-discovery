# 天赋星鉴 · 天赋测评系统

融合八字命理、五运六气、MBTI、霍兰德职业测评的综合天赋分析平台。

## 快速启动

### 前置要求

- **Node.js** 18+（[下载](https://nodejs.org/)）
- 双击 `.bat` 脚本即可，无需其他依赖

### 一键启动

```bash
# 1. 安装依赖 & 初始化数据库
双击 install.bat

# 2. 启动服务
双击 start.bat
```

启动后打开 http://localhost:3000 即可使用。

### 手动启动

```bash
# 后端（新开一个终端）
cd backend
npm install
npx prisma db push
npx tsx src/index.ts

# 前端（新开另一个终端）
cd frontend
npm install
npx next dev
```

## 访问地址

| 服务 | 地址 |
|------|------|
| 前端页面 | http://localhost:3000 |
| 后端 API | http://localhost:3001 |

## 项目结构

```
talent-discovery/
├── backend/          # 后端 API (Express + Prisma + SQLite)
│   ├── src/
│   │   ├── routes/       # API 路由
│   │   ├── services/     # 业务逻辑（八字、五运六气、报告生成）
│   │   └── data/         # 测评题库
│   └── prisma/
│       └── dev.db        # SQLite 数据库文件
├── frontend/         # 前端页面 (Next.js + Tailwind)
│   └── src/app/         # 页面路由
└── start.bat         # 一键启动脚本
```

## 功能

- ✅ 用户注册/登录 + 忘记密码
- ✅ 八字排盘（四柱、纳音、五行、十神、大运）
- ✅ 五运六气（先天体质分析）
- ✅ MBTI 人格测评（15题精简版）
- ✅ 霍兰德职业测评（15题精简版）
- ✅ 天职测评
- ✅ 综合报告生成（含天赋建议）
- ✅ 报告分享链接（局域网内可分享）
- ✅ 报告删除
