import { Router, Response } from 'express';
import { prisma } from '../index';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { calculateHolland } from '../services/hollandCalculator';

import { questions } from '../data/holland-questions';

const router = Router();

// 获取霍兰德题目
router.get('/questions', (_req, res: Response) => {
  res.json({ questions });
});

// 提交霍兰德答案
router.post('/submit', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      res.status(400).json({ error: '请提供完整的答题记录' });
      return;
    }

    // 计算霍兰德结果
    const result = calculateHolland(answers);

    // 保存结果
    const hollandResult = await prisma.hollandResult.upsert({
      where: { userId: req.userId! },
      update: {
        personalityType: result.type,
        dimensionScores: JSON.stringify(result.dimensions),
        answers: JSON.stringify(answers),
      },
      create: {
        userId: req.userId!,
        personalityType: result.type,
        dimensionScores: JSON.stringify(result.dimensions),
        answers: JSON.stringify(answers),
      },
    });

    res.json({
      type: result.type,
      dimensions: result.dimensions,
      description: result.description,
      message: '霍兰德测评完成',
    });
  } catch (error) {
    console.error('霍兰德测评失败:', error);
    res.status(500).json({ error: '霍兰德测评失败，请稍后重试' });
  }
});

// 获取霍兰德结果
router.get('/result', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await prisma.hollandResult.findUnique({
      where: { userId: req.userId! },
    });

    if (!result) {
      res.status(404).json({ error: '请先完成霍兰德测评' });
      return;
    }

    res.json({
      type: result.personalityType,
      dimensions: JSON.parse(result.dimensionScores),
    });
  } catch (error) {
    console.error('获取霍兰德结果失败:', error);
    res.status(500).json({ error: '获取霍兰德结果失败' });
  }
});

export default router;
