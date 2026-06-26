'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mbtiAPI } from '@/lib/api';
import Questionnaire, { ThemeConfig } from '@/components/Questionnaire';
import { Brain } from 'lucide-react';
import Link from 'next/link';

const THEME: Partial<ThemeConfig> = {
  primary: '#2C2C2C',
  primaryLight: '#F5F3EF',
  accent: '#2C2C2C',
};

const OPTION_LABELS = ['A', 'B'];

export default function MBTIPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }

    Promise.all([
      mbtiAPI.getQuestions(),
      mbtiAPI.getResult().catch(() => null),
    ]).then(([qRes, rRes]) => {
      setQuestions(qRes.data.questions);
      if (rRes?.status === 200) setResult(rRes.data);
    }).finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async (answers: any[]) => {
    const formatted = answers.map((a, i) => ({
      questionId: questions[i].id,
      answer: a.answer,
      dimension: questions[i].dimension,
      direction: questions[i].direction,
    }));
    const res = await mbtiAPI.submit(formatted);
    setResult(res.data);
  };

  const handleRetest = () => { setResult(null); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFFAF6' }}>
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: '#2C2C2C', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <Questionnaire
      title="MBTI 人格测评"
      icon={<Brain className="w-10 h-10" style={{ color: '#2C2C2C' }} />}
      theme={THEME}
      questions={questions}
      isCompleted={!!result}
      resultView={result ? (
        <div className="max-w-lg mx-auto px-5" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
          {/* 结果头部 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center" style={{ background: '#F5F3EF' }}>
              <Brain className="w-8 h-8" style={{ color: '#2C2C2C' }} />
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#2C2C2C' }}>你的 MBTI 类型</h2>
          </div>

          <div className="p-8 mb-6 text-center" style={{ background: '#2C2C2C' }}>
            <div className="text-5xl font-bold text-white tracking-[4px]">{result.type}</div>
          </div>

          <div className="rounded-3xl p-6 mb-4" style={{
            background: '#FFFFFF',
            boxShadow: '0 4px 24px rgba(180, 140, 120, 0.08)',
          }}>
            <p className="text-sm leading-relaxed" style={{ color: '#8C8C8C' }}>{result.description}</p>
          </div>

          {/* 维度条 */}
          {result.dimensions && (
            <div className="p-6 mb-6" style={{ background: '#FFFFFF', border: '1px solid #E5E0D8' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#2C2C2C' }}>维度分析</h3>
              <div className="space-y-4">
                {[
                  { label: 'E/I', val: result.dimensions.ei, left: '外向 E', right: '内向 I' },
                  { label: 'S/N', val: result.dimensions.sn, left: '实感 S', right: '直觉 N' },
                  { label: 'T/F', val: result.dimensions.tf, left: '理性 T', right: '感性 F' },
                  { label: 'J/P', val: result.dimensions.jp, left: '判断 J', right: '感知 P' },
                ].map((dim, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1" style={{ color: '#8C8C8C' }}>
                      <span>{dim.left}</span>
                      <span>{dim.right}</span>
                    </div>
                    <div className="w-full h-1.5" style={{ background: '#F0EDEA' }}>
                      <div className="h-1.5 transition-all"
                        style={{
                          width: '50%',
                          marginLeft: dim.val >= 0 ? '0' : `${50 + dim.val / 2}%`,
                          background: '#2C2C2C',
                        }} />
                    </div>
                    <div className="text-center text-xs mt-0.5" style={{ color: '#B0A8A0' }}>{dim.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4 pb-8">
            <button onClick={handleRetest}
              className="px-6 py-3 text-xs tracking-[2px] transition-all hover:opacity-60"
              style={{ background: '#F0EDEA', color: '#2C2C2C' }}>
              重新测试
            </button>
            <Link href="/dashboard"
              className="px-6 py-3 text-xs tracking-[2px] text-white transition-all hover:opacity-80"
              style={{ background: '#2C2C2C' }}>
              返回仪表盘
            </Link>
          </div>
        </div>
      ) : undefined}
      onBack={() => router.push('/dashboard')}
      onSubmit={handleSubmit}
      renderQuestion={(q, _idx, answer, onAnswer) => (
        <div className="grid grid-cols-2 gap-3">
          {q.options?.map((opt: string, oi: number) => {
            const isSelected = answer?.answer === (oi === 0 ? 2 : 1);
            return (
              <button key={oi}
                onClick={() => onAnswer({ answer: oi === 0 ? 2 : 1 })}
                className="text-center transition-all duration-200"
                style={{
                  background: isSelected ? '#F5F3EF' : '#FFFFFF',
                  border: '1px solid',
                  borderColor: isSelected ? '#2C2C2C' : '#E5E0D8',
                  padding: '20px',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                }}>
                <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2 text-sm font-bold"
                  style={{
                    background: isSelected ? '#2C2C2C' : '#F0EDEA',
                    color: isSelected ? '#fff' : '#8C8C8C',
                  }}>
                  {OPTION_LABELS[oi]}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: isSelected ? '#2C2C2C' : '#8C8C8C' }}>
                  {opt}
                </p>
              </button>
            );
          })}
        </div>
      )}
    />
  );
}
