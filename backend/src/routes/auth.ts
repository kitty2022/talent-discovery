import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../index';
import { generateToken, authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// 注册验证
const registerSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少6位'),
  nickname: z.string().min(1, '昵称不能为空').max(20, '昵称最长20字'),
});

// POST /api/auth/register
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, nickname } = registerSchema.parse(req.body);

    // 检查邮箱是否已注册
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ error: '该邮箱已被注册' });
      return;
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, nickname },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, nickname: user.nickname },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error('注册失败:', error);
    res.status(500).json({ error: '注册失败，请稍后重试' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: '请输入邮箱和密码' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: '邮箱或密码错误' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: '邮箱或密码错误' });
      return;
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: { id: user.id, email: user.email, nickname: user.nickname },
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '登录失败，请稍后重试' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: '请输入邮箱' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // 不暴露邮箱是否注册，统一返回成功
      res.json({ message: '如果该邮箱已注册，重置链接已发送' });
      return;
    }

    // 生成重置令牌（有效1小时）
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    // 开发环境直接返回 token（生产环境应发邮件）
    res.json({
      message: '重置链接已生成',
      resetToken,
      resetUrl: `http://localhost:3000/auth/reset-password?token=${resetToken}`,
    });
  } catch (error) {
    console.error('忘记密码失败:', error);
    res.status(500).json({ error: '操作失败，请稍后重试' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req: AuthRequest, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({ error: '缺少必要参数' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: '密码至少6位' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      res.status(400).json({ error: '重置链接已过期或无效' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: '密码已重置成功，请使用新密码登录' });
  } catch (error) {
    console.error('重置密码失败:', error);
    res.status(500).json({ error: '重置密码失败，请稍后重试' });
  }
});

export default router;
