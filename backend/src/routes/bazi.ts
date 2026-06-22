import { Router, Response } from 'express';
import { prisma } from '../index';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { calculateBaZi } from '../services/bazi/baziCalculator';

const router = Router();

// 计算八字
router.post('/calculate', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { birthDate, birthHour, birthMinute, gender } = req.body;

    if (!birthDate || birthHour === undefined || !gender) {
      res.status(400).json({ error: '请提供完整的出生信息：出生日期、时辰、性别' });
      return;
    }

    // 计算八字
    const baziData = calculateBaZi({
      birthDate: new Date(birthDate),
      birthHour,
      birthMinute: birthMinute || 0,
      gender,
    });

    // 保存结果
    const result = await prisma.baZiResult.upsert({
      where: { userId: req.userId! },
      update: {
        yearPillar: baziData.yearPillar,
        monthPillar: baziData.monthPillar,
        dayPillar: baziData.dayPillar,
        hourPillar: baziData.hourPillar,
        yearStem: baziData.yearStem,
        monthStem: baziData.monthStem,
        dayStem: baziData.dayStem,
        hourStem: baziData.hourStem,
        yearBranch: baziData.yearBranch,
        monthBranch: baziData.monthBranch,
        dayBranch: baziData.dayBranch,
        hourBranch: baziData.hourBranch,
        yearNaYin: baziData.yearNaYin,
        monthNaYin: baziData.monthNaYin,
        dayNaYin: baziData.dayNaYin,
        hourNaYin: baziData.hourNaYin,
        fiveElements: JSON.stringify(baziData.fiveElements),
        shiShen: JSON.stringify(baziData.shiShen),
        yongShen: baziData.yongShen,
        jiShen: baziData.jiShen,
        daYun: JSON.stringify(baziData.daYun),
        rawData: JSON.stringify(baziData),
      },
      create: {
        userId: req.userId!,
        yearPillar: baziData.yearPillar,
        monthPillar: baziData.monthPillar,
        dayPillar: baziData.dayPillar,
        hourPillar: baziData.hourPillar,
        yearStem: baziData.yearStem,
        monthStem: baziData.monthStem,
        dayStem: baziData.dayStem,
        hourStem: baziData.hourStem,
        yearBranch: baziData.yearBranch,
        monthBranch: baziData.monthBranch,
        dayBranch: baziData.dayBranch,
        hourBranch: baziData.hourBranch,
        yearNaYin: baziData.yearNaYin,
        monthNaYin: baziData.monthNaYin,
        dayNaYin: baziData.dayNaYin,
        hourNaYin: baziData.hourNaYin,
        fiveElements: JSON.stringify(baziData.fiveElements),
        shiShen: JSON.stringify(baziData.shiShen),
        yongShen: baziData.yongShen,
        jiShen: baziData.jiShen,
        daYun: JSON.stringify(baziData.daYun),
        rawData: JSON.stringify(baziData),
      },
    });

    res.json({ bazi: baziData, message: '性格分析完成' });
  } catch (error) {
    console.error('性格分析失败:', error);
    res.status(500).json({ error: '性格分析失败，请稍后重试' });
  }
});

// 获取八字结果
router.get('/result', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await prisma.baZiResult.findUnique({
      where: { userId: req.userId! },
    });

    if (!result) {
      res.status(404).json({ error: '请先进行性格分析' });
      return;
    }

    const rawData = JSON.parse(result.rawData);
    res.json({
      bazi: {
        yearPillar: result.yearPillar,
        monthPillar: result.monthPillar,
        dayPillar: result.dayPillar,
        hourPillar: result.hourPillar,
        yearStem: result.yearStem,
        dayStem: result.dayStem,
        fiveElements: JSON.parse(result.fiveElements),
        shiShen: JSON.parse(result.shiShen),
        yongShen: result.yongShen,
        jiShen: result.jiShen,
        daYun: JSON.parse(result.daYun),
        interpretations: rawData.interpretations,
        wuYunLiuQi: rawData.wuYunLiuQi,
      },
    });
  } catch (error) {
    console.error('获取八字结果失败:', error);
    res.status(500).json({ error: '获取八字结果失败' });
  }
});

export default router;
