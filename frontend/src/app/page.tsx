'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/* ========================================================
   Auwa.life 风格复刻 — 侘寂 · 克制 · 留白
   底色: #FAFAF8  文字: #2C2C2C  点缀: #B85C3A
   ======================================================== */

const S = {
  bg: '#FAFAF8',
  text: '#2C2C2C',
  muted: '#8C8C8C',
  accent: '#B85C3A',
  border: '#E5E0D8',
  lightBg: '#F5F3EF',
};

const MODULES = [
  { num: '01', label: '先天解码', title: '性格分析', desc: '通过出生信息解读先天五行格局，了解性格底色',
    icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2C2C2C" strokeWidth="1.8"><circle cx="16" cy="12" r="5"/><path d="M6 28c0-6 4.5-10 10-10s10 4 10 10"/><circle cx="12.5" cy="10" r="1.5" fill="#2C2C2C"/><circle cx="19.5" cy="10" r="1.5" fill="#2C2C2C"/><path d="M14 13l2-1 2 1"/></svg> },
  { num: '02', label: '人格认知', title: 'MBTI 人格', desc: '经典 Myers-Briggs 类型指标，认清思维偏好',
    icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2C2C2C" strokeWidth="1.8"><path d="M16 4c-4 0-6 2-6 5s2 4 6 4 6-1 6-4-2-5-6-5z"/><path d="M6 20c0-4 4-6 10-6s10 2 10 6"/><path d="M14 26h4l-2-6-2 6z"/></svg> },
  { num: '03', label: '职业探索', title: '霍兰德测评', desc: '15道行为选择题，基于真实行为评估职业倾向',
    icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2C2C2C" strokeWidth="1.8"><circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="4"/><circle cx="16" cy="16" r="1.5" fill="#2C2C2C"/><line x1="16" y1="6" x2="16" y2="10"/><line x1="16" y1="22" x2="16" y2="26"/><line x1="6" y1="16" x2="10" y2="16"/><line x1="22" y1="16" x2="26" y2="16"/></svg> },
  { num: '04', label: '天赋扫描', title: '天赋发现', desc: '18道行为题，从创造力到商业力发现核心优势',
    icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2C2C2C" strokeWidth="1.8"><path d="M16 4l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z"/></svg> },
];

const STEPS = [
  { num: '❶', title: '输入出生信息', desc: '完成性格分析' },
  { num: '❷', title: '完成行为测评', desc: 'MBTI、霍兰德、天赋发现' },
  { num: '❸', title: '生成综合报告', desc: '获得天赋与职业发展建议' },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setMounted(true);
    setLoggedIn(!!localStorage.getItem('token'));
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ background: S.bg, minHeight: '100vh', color: S.text }}>

      {/* ===== 导航 ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(250,250,248,0.9)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 20, fontWeight: 600, color: S.text, letterSpacing: 2 }}>
            镜相
          </Link>
          <div className="flex items-center gap-8">
            {loggedIn ? (
              <Link href="/dashboard"
                style={{ fontSize: 13, color: S.text, letterSpacing: 1, borderBottom: '1px solid transparent', ':hover': { borderColor: S.text } }}>
                进入仪表盘
              </Link>
            ) : (
              <>
                <Link href="/auth/login" style={{ fontSize: 13, color: S.muted, letterSpacing: 1 }}>登录</Link>
                <Link href="/auth/register"
                  style={{ fontSize: 13, color: '#fff', letterSpacing: 1, background: S.text, padding: '10px 24px', borderRadius: 0 }}>
                  开始探索
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <section className="min-h-screen flex items-center justify-center px-6 text-center relative">
        {/* 装饰大字符 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] md:text-[320px] font-bold select-none pointer-events-none opacity-[0.03]" style={{ fontFamily: "'Noto Serif SC', serif", color: S.text }}>
          天赋
        </div>
        <div className="max-w-2xl relative">
          <p className="text-xs mb-8 tracking-[4px] uppercase" style={{ color: S.muted }}>先天特质 × 行为科学 × 职业发展</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8" style={{ fontFamily: "'Noto Serif SC', serif", letterSpacing: 2, lineHeight: 1.6 }}>
            发现你的天赋优势
          </h1>
          <p className="text-base leading-relaxed mb-12" style={{ color: S.muted, maxWidth: 420, margin: '0 auto' }}>
            从先天特质到职业方向，四大测评帮你找到真正擅长的领域
          </p>
          <div className="mt-6">
          {loggedIn ? (
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 text-sm tracking-[2px] py-3 px-8 transition-opacity hover:opacity-70"
              style={{ color: '#fff', background: S.text }}>
              进入仪表盘 <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link href="/auth/register"
                className="inline-flex items-center gap-2 text-sm tracking-[2px] py-3 px-8 transition-opacity hover:opacity-70"
                style={{ color: '#fff', background: S.text }}>
                开始探索天赋 <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
      </section>

      {/* ===== 四大测评 ===== */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <p className="text-xs tracking-[4px] mb-4" style={{ color: S.accent }}>01 / 04</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif" }}>四大测评维度</h2>
            <p className="text-sm mt-4" style={{ color: S.muted }}>先天命理 + 行为科学，全方位解码你的天赋</p>
          </div>

          <div className="grid md:grid-cols-4 gap-0.5">
            {MODULES.map((m, i) => (
              <div key={i} className="p-10 transition-all duration-500 hover:opacity-90" style={{ background: S.lightBg }}>
                <div className="mb-5" style={{ color: S.text }}>{m.icon}</div>
                <p className="text-xs tracking-[3px] mb-2" style={{ color: S.muted }}>{m.num} / {m.label}</p>
                <h3 className="text-base font-semibold mb-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>{m.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: S.muted }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 流程 ===== */}
      <section className="py-32 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[4px] mb-4 text-center" style={{ color: S.accent }}>HOW IT WORKS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-20" style={{ fontFamily: "'Noto Serif SC', serif" }}>三步获得你的报告</h2>

          <div className="grid md:grid-cols-3 gap-16">
            {STEPS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-6">{s.num}</div>
                <h3 className="text-base font-semibold mb-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>{s.title}</h3>
                <p className="text-sm" style={{ color: S.muted }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-xs tracking-[4px] mb-4" style={{ color: S.accent }}>BEGIN YOUR JOURNEY</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            准备好发现你的天赋了吗？
          </h2>
          <p className="text-sm mb-10" style={{ color: S.muted }}>
            完成测评，获得你的专属天赋与职业发展报告
          </p>
          {loggedIn ? (
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 text-sm tracking-[2px] py-3 px-8 transition-opacity hover:opacity-70"
              style={{ color: '#fff', background: S.text }}>
              进入仪表盘 <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link href="/auth/register"
              className="inline-flex items-center gap-2 text-sm tracking-[2px] py-3 px-8 transition-opacity hover:opacity-70"
              style={{ color: '#fff', background: S.text }}>
              开始探索 <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="py-12 px-6 text-center border-t" style={{ borderColor: S.border }}>
        <p className="text-xs tracking-[3px] mb-1" style={{ color: S.text, fontFamily: "'Noto Serif SC', serif" }}>镜相</p>
        <p className="text-xs" style={{ color: S.muted }}>基于行为科学、优势理论与职业发展模型</p>
      </footer>
    </div>
  );
}
