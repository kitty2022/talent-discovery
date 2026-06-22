import { Router, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../index';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { generateReport } from '../services/report/reportGenerator';

const router = Router();

// 生成报告
router.post('/generate', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // 获取用户的所有测评结果
    const [bazi, mbti, holland, tianzhi] = await Promise.all([
      prisma.baZiResult.findUnique({ where: { userId: req.userId! } }),
      prisma.mBTIResult.findUnique({ where: { userId: req.userId! } }),
      prisma.hollandResult.findUnique({ where: { userId: req.userId! } }),
      prisma.tianZhiResult.findUnique({ where: { userId: req.userId! } }),
    ]);

    if (!bazi && !mbti && !holland) {
      res.status(400).json({
        error: '请至少完成性格分析、MBTI 或霍兰德测评中的一项才能生成报告',
      });
      return;
    }

    // 判断 tianzhi 结果类型（旧天职 or 天赋发现）
    let tianzhiData = null;
    let talentData = null;
    if (tianzhi) {
      const parsed = JSON.parse(tianzhi.results);
      // 天赋发现测评包含 topTalent 字段
      if (parsed.topTalent) {
        talentData = parsed;
      } else {
        tianzhiData = parsed;
      }
    }

    // 组装数据
    const data = {
      profile: null,
      bazi: bazi ? {
        ...bazi,
        fiveElements: JSON.parse(bazi.fiveElements),
        shiShen: JSON.parse(bazi.shiShen),
        daYun: JSON.parse(bazi.daYun),
        rawData: JSON.parse(bazi.rawData),
      } : null,
      mbti: mbti ? {
        type: mbti.personalityType,
        dimensions: JSON.parse(mbti.dimensionScores),
      } : null,
      holland: holland ? {
        type: holland.personalityType,
        dimensions: JSON.parse(holland.dimensionScores),
      } : null,
      tianzhi: tianzhiData,
      talent: talentData,
    };

    // 生成报告
    const reportContent = generateReport(data);

    // 保存报告
    const report = await prisma.report.create({
      data: {
        userId: req.userId!,
        title: reportContent.title,
        summary: reportContent.summary,
        sections: JSON.stringify(reportContent.sections),
        baziResultId: bazi?.id,
        mbtiResultId: mbti?.id,
        hollandResultId: holland?.id,
        tianzhiResultId: tianzhi?.id,
      },
    });

    res.json({
      report: {
        id: report.id,
        title: report.title,
        summary: report.summary,
        sections: reportContent.sections,
        createdAt: report.createdAt,
      },
      message: '报告生成完成',
    });
  } catch (error) {
    console.error('报告生成失败:', error);
    res.status(500).json({ error: '报告生成失败，请稍后重试' });
  }
});

// 获取报告列表
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        summary: true,
        createdAt: true,
      },
    });

    res.json({ reports });
  } catch (error) {
    console.error('获取报告列表失败:', error);
    res.status(500).json({ error: '获取报告列表失败' });
  }
});

// 获取单个报告
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const report = await prisma.report.findFirst({
      where: { id: parseInt(req.params.id), userId: req.userId! },
    });

    if (!report) {
      res.status(404).json({ error: '报告不存在' });
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
    console.error('获取报告失败:', error);
    res.status(500).json({ error: '获取报告失败' });
  }
});

// 删除报告
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const report = await prisma.report.findFirst({
      where: { id: parseInt(req.params.id), userId: req.userId! },
    });

    if (!report) {
      res.status(404).json({ error: '报告不存在' });
      return;
    }

    await prisma.report.delete({ where: { id: report.id } });
    res.json({ message: '报告已删除' });
  } catch (error) {
    console.error('删除报告失败:', error);
    res.status(500).json({ error: '删除报告失败' });
  }
});

// 生成分享链接
router.post('/:id/share', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const report = await prisma.report.findFirst({
      where: { id: parseInt(req.params.id), userId: req.userId! },
    });

    if (!report) {
      res.status(404).json({ error: '报告不存在' });
      return;
    }

    // 生成或复用已有分享令牌
    let shareToken = report.shareToken;
    if (!shareToken) {
      shareToken = crypto.randomBytes(16).toString('hex');
      await prisma.report.update({
        where: { id: report.id },
        data: { shareToken },
      });
    }

    const origin = req.headers.origin || req.headers.referer || process.env.FRONTEND_URL || 'http://localhost:3000';
    const baseUrl = (Array.isArray(origin) ? origin[0] : origin).replace(/\/$/, '');
    const shareUrl = `${baseUrl}/shared/${shareToken}`;

    res.json({ shareToken, shareUrl });
  } catch (error) {
    console.error('生成分享链接失败:', error);
    res.status(500).json({ error: '生成分享链接失败' });
  }
});

export default router;
