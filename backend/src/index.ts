import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import baziRoutes from './routes/bazi';
import mbtiRoutes from './routes/mbti';
import hollandRoutes from './routes/holland';
import tianzhiRoutes from './routes/tianzhi';
import talentRoutes from './routes/talent';
import reportRoutes from './routes/report';

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
  origin: true, // 开发环境允许所有来源
  credentials: true,
}));
app.use(express.json());

// 路由注册
app.use('/api/auth', authRoutes);
app.use('/api/bazi', baziRoutes);
app.use('/api/mbti', mbtiRoutes);
app.use('/api/holland', hollandRoutes);
app.use('/api/tianzhi', tianzhiRoutes);
app.use('/api/talent', talentRoutes);
app.use('/api/reports', reportRoutes);

// 公开分享路由（无需登录）
app.get('/api/shared/:token', async (req, res) => {
  try {
    const report = await prisma.report.findUnique({
      where: { shareToken: req.params.token },
    });

    if (!report) {
      res.status(404).json({ error: '报告不存在或分享链接已失效' });
      return;
    }

    res.json({
      report: {
        id: report.id,
        title: report.title,
        summary: report.summary,
        sections: JSON.parse(report.sections),
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    console.error('获取分享报告失败:', error);
    res.status(500).json({ error: '获取报告失败' });
  }
});

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`✨ 天赋测评后端服务已启动: http://localhost:${PORT}`);
  console.log(`📋 API 文档: http://localhost:${PORT}/api/health`);
});

// 优雅退出
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
