'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Moon, Brain, BarChart3, Sparkles, Star, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

/* —— 配色系统（与各测评页一致） —— */
const ASSESSMENTS = [
  {
    id: 'bazi',
    title: '性格分析',
    subtitle: '先天性格解码',
    desc: '通过出生信息，结合东方智慧探索你与生俱来的性格特质',
    href: '/assessments/bazi',
    icon: Moon,
    theme: { primary: '#D4876A', light: '#F5E6DE', gradient: 'linear-gradient(135deg, #D4876A, #C9A96E)' },
  },
  {
    id: 'mbti',
    title: 'MBTI 人格',
    subtitle: '十六型人格测试',
    desc: '了解你的性格类型偏好，发现思考与行为模式的独特组合',
    href: '/assessments/mbti',
    icon: Brain,
    theme: { primary: '#5B7B8C', light: '#E8EFF2', gradient: 'linear-gradient(135deg, #5B7B8C, #7CA5B8)' },
  },
  {
    id: 'holland',
    title: '霍兰德测评',
    subtitle: '职业兴趣探索',
    desc: '发现你的职业兴趣倾向，找到最适合你的工作方向',
    href: '/assessments/holland',
    icon: BarChart3,
    theme: { primary: '#D4876A', light: '#F5E6DE', gradient: 'linear-gradient(135deg, #D4876A, #E8A090)' },
  },
  {
    id: 'talent',
    title: '天赋发现',
    subtitle: '八大天赋维度',
    desc: '全面评估你的八大天赋维度，找到你最自然的优势方向',
    href: '/assessments/talent',
    icon: Sparkles,
    theme: { primary: '#7C6A9A', light: '#EEE8F4', gradient: 'linear-gradient(135deg, #7C6A9A, #A08AC9)' },
  },
  {
    id: 'tianzhi',
    title: '天职测评',
    subtitle: '核心天赋定位',
    desc: '深入探索你的核心天赋，找到与生俱来的优势与潜能',
    href: '/assessments/tianzhi',
    icon: Star,
    theme: { primary: '#8B6FA8', light: '#F0EAF5', gradient: 'linear-gradient(135deg, #8B6FA8, #B89FD4)' },
  },
];

export default function AssessmentsPage() {
  const router = useRouter();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }

    Promise.allSettled([
      api.get('/bazi/result').catch(() => null),
      api.get('/mbti/result').catch(() => null),
      api.get('/holland/result').catch(() => null),
      api.get('/talent/result').catch(() => null),
      api.get('/tianzhi/result').catch(() => null),
    ]).then((results) => {
      const keys = ['bazi', 'mbti', 'holland', 'talent', 'tianzhi'];
      const status: Record<string, boolean> = {};
      results.forEach((r, i) => {
        status[keys[i]] = r.status === 'fulfilled' && (r.value as any)?.status === 200;
      });
      setCompleted(status);
    }).finally(() => setLoading(false));
  }, [router]);

  const doneCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className="min-h-screen" style={{ background: '#FFFAF6' }}>
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50" style={{ background: '#FFFAF6', borderBottom: '1px solid rgba(180, 140, 120, 0.08)' }}>
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={() => router.push('/dashboard')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
            <svg className="w-5 h-5" style={{ color: '#2D2424' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-semibold text-base" style={{ color: '#2D2424' }}>测评中心</span>
          <div className="w-9" />
        </div>
      </nav>

      {/* 内容 */}
      <div className="max-w-lg mx-auto px-5 pt-8 pb-12">
        {/* 头部 */}
        <div className="text-center mb-8" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #F5E6DE, #EEE8F4)' }}>
            <Sparkles className="w-8 h-8" style={{ color: '#D4876A' }} />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#2D2424' }}>开始你的探索之旅</h1>
          <p className="text-sm" style={{ color: '#8A7A72' }}>
            已完 {doneCount}/{ASSESSMENTS.length} 项测评
          </p>
          {/* 进度条 */}
          <div className="mt-4 w-full rounded-full h-1.5" style={{ background: '#F0EDEA' }}>
            <div className="h-1.5 rounded-full transition-all duration-700"
              style={{
                width: `${(doneCount / ASSESSMENTS.length) * 100}%`,
                background: 'linear-gradient(90deg, #D4876A, #C9A96E)',
              }} />
          </div>
        </div>

        {/* 测评卡片列表 */}
        <div className="space-y-4">
          {ASSESSMENTS.map((item, i) => {
            const Icon = item.icon;
            const done = completed[item.id];
            return (
              <Link key={item.id} href={item.href}
                className="block rounded-3xl p-5 transition-all duration-300 hover:scale-[1.01]"
                style={{
                  background: done
                    ? `linear-gradient(135deg, ${item.theme.light}, #fff)`
                    : '#FFFFFF',
                  boxShadow: done
                    ? `0 4px 20px ${item.theme.primary}15`
                    : '0 2px 16px rgba(180, 140, 120, 0.06)',
                  border: done
                    ? `1px solid ${item.theme.primary}22`
                    : '1px solid rgba(180, 140, 120, 0.06)',
                  animation: `fadeSlideUp 0.5s ease-out ${i * 0.1}s both`,
                }}>
                <div className="flex items-center gap-4">
                  {/* 图标 */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: item.theme.light }}>
                    <Icon className="w-7 h-7" style={{ color: item.theme.primary }} />
                  </div>

                  {/* 文字 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-base" style={{ color: '#2D2424' }}>{item.title}</h3>
                      {done && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ background: '#E8F5E8', color: '#5A9A5A' }}>
                          已完
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: '#8A7A72' }}>{item.subtitle}</p>
                    <p className="text-xs mt-1 line-clamp-1" style={{ color: '#B0A8A0' }}>{item.desc}</p>
                  </div>

                  {/* 箭头 */}
                  <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: '#D0C8C0' }} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center" style={{ animation: 'fadeSlideUp 0.5s ease-out 0.5s both' }}>
          <p className="text-xs" style={{ color: '#B0A8A0' }}>
            完成所有测评，系统将为你生成综合天赋分析报告
          </p>
          {doneCount === ASSESSMENTS.length && (
            <Link href="/reports"
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-medium text-sm transition-all"
              style={{
                background: 'linear-gradient(135deg, #D4876A, #C9A96E)',
                boxShadow: '0 6px 20px rgba(212, 135, 106, 0.3)',
              }}>
              查看综合报告 <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
