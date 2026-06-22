import { Router, Response } from 'express';
import { prisma } from '../index';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { calculateTianZhi } from '../services/tianzhiCalculator';

import { questions } from '../data/tianzhi-questions';

const router = Router();

// 获取天职测评题目
router.get('/questions', (_req, res: Response) => {
  res.json({ questions });
});

// 提交天职测评答案
router.post('/submit', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      res.status(400).json({ error: '请提供完整的答题记录' });
      return;
    }

    const result = calculateTianZhi(answers);

    const tianzhiResult = await prisma.tianZhiResult.upsert({
      where: { userId: req.userId! },
      update: {
        answers: JSON.stringify(answers),
        results: JSON.stringify(result),
      },
      create: {
        userId: req.userId!,
        answers: JSON.stringify(answers),
        results: JSON.stringify(result),
      },
    });

    res.json({ result, message: '天职测评完成' });
  } catch (error) {
    console.error('天职测评失败:', error);
    res.status(500).json({ error: '天职测评失败，请稍后重试' });
  }
});

// 获取天职测评结果
router.get('/result', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await prisma.tianZhiResult.findUnique({
      where: { userId: req.userId! },
    });

    if (!result) {
      res.status(404).json({ error: '请先完成天职测评' });
      return;
    }

    res.json({ result: JSON.parse(result.results) });
  } catch (error) {
    console.error('获取天职结果失败:', error);
    res.status(500).json({ error: '获取天职结果失败' });
  }
});

export default router;
