'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';

/* ========================================================
   通用测评问卷组件 — 配色通过 theme 属性自定义
   ======================================================== */

export interface ThemeConfig {
  primary: string;
  primaryLight: string;
  accent: string;
  gradient?: string;
  shadow?: string;
}

const DEFAULT_THEME: ThemeConfig = {
  primary: '#2C2C2C',
  primaryLight: '#F5F3EF',
  accent: '#B85C3A',
};

interface Question {
  id: number;
  text: string;
  options?: any[];
  type?: string;
  dimension?: string;
  direction?: string;
}

interface QuestionnaireProps {
  title: string;
  icon: React.ReactNode;
  theme?: Partial<ThemeConfig>;
  questions: Question[];
  renderQuestion: (q: Question, index: number, answer: any, onAnswer: (val: any) => void) => React.ReactNode;
  onSubmit: (answers: any[]) => Promise<void>;
  onBack: () => void;
  resultView?: React.ReactNode;
  isCompleted?: boolean;
}

export default function Questionnaire({
  title, icon, theme: themeProp, questions, renderQuestion,
  onSubmit, onBack, resultView, isCompleted,
}: QuestionnaireProps) {
  const theme = { ...DEFAULT_THEME, ...themeProp } as ThemeConfig;
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [answers, setAnswers] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAnswer = (val: any) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = { questionId: questions[currentQ].id, ...val };
    setAnswers(newAnswers);
    setError('');
  };

  const nextQuestion = () => {
    if (!answers[currentQ]) { setError('请先回答本题'); return; }
    setError('');
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      handleSubmit();
    }
  };

  const prevQuestion = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (answers.length < questions.length) { setError('请回答所有题目'); return; }
    setSubmitting(true);
    setError('');
    try {
      await onSubmit(answers);
      setStep('result');
    } catch (err: any) {
      setError(err.response?.data?.error || '提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- 结果页 ----------
  if (isCompleted || step === 'result') {
    return (
      <div className="min-h-screen" style={{ background: '#FAFAF8' }}>
        <div className="pt-20 pb-12">
          {resultView || (
            <div className="max-w-sm mx-auto px-5 text-center" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
              <div className="p-8" style={{ background: '#FFFFFF', border: '1px solid #E5E0D8' }}>
                <h2 className="text-lg font-bold mb-2" style={{ fontFamily: "'Noto Serif SC', serif", color: '#2C2C2C' }}>测评已完成</h2>
                <p className="text-sm" style={{ color: '#8C8C8C' }}>感谢你的参与，结果已保存</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------- 首页 ----------
  if (step === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#FAFAF8' }}>
        <div className="max-w-sm w-full text-center">
          {icon && <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center" style={{ background: theme.primaryLight }}>
            {icon}
          </div>}
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Noto Serif SC', serif", color: '#2C2C2C' }}>{title}</h1>
          <p className="text-sm mb-1" style={{ color: '#8C8C8C' }}>共 {questions.length} 题 · 大约 3-5 分钟</p>
          <p className="text-sm mb-10" style={{ color: '#8C8C8C' }}>请根据你的真实情况选择</p>
          <button onClick={() => setStep('quiz')}
            className="w-full py-4 text-sm tracking-[2px] text-white transition-all hover:opacity-80"
            style={{ background: theme.primary }}>
            开始测评
          </button>
          <p className="mt-6 text-xs tracking-[2px]" style={{ color: '#8C8C8C' }}>
            <Link href="/dashboard" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>返回仪表盘</Link>
          </p>
        </div>
      </div>
    );
  }

  // ---------- 答题 ----------
  const q = questions[currentQ];
  const totalSteps = questions.length;
  // 进度 = 已完成 / 总步数（当前算进行中）
  const progressFraction = (currentQ) / totalSteps;

  return (
    <div className="min-h-screen" style={{ background: '#FFFAF6' }}>
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: '#FFFAF6' }}>
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
            <ArrowLeft className="w-5 h-5" style={{ color: '#2D2424' }} />
          </button>

          {/* 步骤点 */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i}
                className="h-1 transition-all duration-500"
                style={{
                  width: i <= currentQ ? '24px' : '6px',
                  background: i <= currentQ ? theme.primary : '#E5E0D8',
                }} />
            ))}
          </div>

          <div className="w-9" />
        </div>
      </nav>

      {/* 内容 */}
      <div className="pt-20 pb-8 px-5" key={currentQ}>
        <div className="max-w-sm w-full mx-auto" style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
          {/* 题目标签 */}
          <div className="text-center mb-3">
            <span className="inline-block text-xs tracking-[2px]" style={{ color: theme.primary }}>
              第 {currentQ + 1} 题
            </span>
          </div>

          {/* 题目文字 */}
          <h2 className="text-lg font-bold text-center mb-8 leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif", color: '#2C2C2C' }}>
            {q.text}
          </h2>

          {/* 选项卡片 */}
          <div className="p-6" style={{
            background: '#FFFFFF',
            border: '1px solid #E5E0D8',
          }}>
            {renderQuestion(q, currentQ, answers[currentQ], handleAnswer)}
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="mt-3 px-4 py-2.5 text-sm" style={{ background: '#F5F3EF', color: '#2C2C2C', borderLeft: '3px solid #B85C3A' }}>
              {error}
            </div>
          )}

          {/* 按钮区 */}
          <div className="mt-6 flex gap-3">
            {currentQ > 0 && (
              <button onClick={prevQuestion}
                className="px-5 py-3 text-xs tracking-[1px] transition-all"
                style={{ color: '#8C8C8C', border: '1px solid #E5E0D8', background: '#FFFFFF' }}>
                ← 上一题
              </button>
            )}
            <button onClick={nextQuestion} disabled={submitting}
              className="flex-1 py-3 text-xs tracking-[2px] text-white transition-all hover:opacity-80 disabled:opacity-40"
              style={{ background: theme.primary }}>
              {currentQ < questions.length - 1 ? '继续 →' : submitting ? '提交中...' : '完成'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
