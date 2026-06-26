'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Questionnaire, { ThemeConfig } from '@/components/Questionnaire';
import { Sparkles } from 'lucide-react';

const THEME: Partial<ThemeConfig> = {
  primary: '#2C2C2C',
  primaryLight: '#F5F3EF',
  accent: '#2C2C2C',
};

const TALENT_API = {
  getQuestions: () => api.get('/talent/questions'),
  submit: (answers: any[]) => api.post('/talent/submit', { answers }),
  getResult: () => api.get('/talent/result'),
};

const TYPE_ICONS: Record<string, string> = {
  creativity: '💡', expression: '🎯', research: '🔍',
  execution: '⚡', leadership: '🚀', business: '💼',
  service: '🤝', growth: '🌱',
};
const TYPE_NAMES: Record<string, string> = {
  creativity: '创造力', expression: '表达力', research: '研究力',
  execution: '执行力', leadership: '领导力', business: '商业力',
  service: '服务力', growth: '成长力',
};

export default function TalentPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }

    Promise.all([
      TALENT_API.getQuestions(),
      TALENT_API.getResult().catch(() => null),
    ]).then(([qRes, rRes]) => {
      setQuestions(qRes.data.questions);
      if (rRes?.status === 200) setResult(rRes.data.result);
    }).finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async (answers: any[]) => {
    const formatted = answers.map((a: any) => {
      const q = questions.find((q: any) => q.id === a.questionId);
      return { questionId: a.questionId, dimension: q?.dimension, score: a.score, label: a.label };
    });
    const res = await TALENT_API.submit(formatted);
    setResult(res.data.result);
  };

  const handleRetest = () => { setResult(null); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAF8' }}>
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: '#2C2C2C', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <Questionnaire
      title="天赋发现测评"
      icon={<Sparkles className="w-10 h-10" style={{ color: '#2C2C2C' }} />}
      theme={THEME}
      questions={questions}
      isCompleted={!!result}
      resultView={result ? (
        <div className="max-w-lg mx-auto px-5" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
          {/* 核心天赋 */}
          <div className="p-8 mb-6 text-center" style={{ background: '#2C2C2C' }}>
            <div className="text-4xl mb-3">{TYPE_ICONS[result.topThree?.[0]?.dimension] || '✨'}</div>
            <div className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '2px' }}>核心天赋</div>
            <div className="text-3xl font-bold text-white mb-1">{result.topTalent}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>这是你最自然的优势方向</div>
          </div>

          {/* 天赋排行 */}
          <div className="mb-8" style={{ border: '1px solid #E5E0D8', background: '#FFFFFF' }}>
            <div className="p-5" style={{ borderBottom: '1px solid #E5E0D8' }}>
              <span className="text-xs font-semibold" style={{ color: '#2C2C2C', letterSpacing: '1px' }}>八大天赋维度</span>
            </div>
            <div className="p-5 space-y-4">
              {result.topThree?.map((t: any, i: number) => (
                <div key={t.dimension}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-semibold" style={{ color: '#2C2C2C' }}>{t.dimension}</span>
                    <span style={{ color: '#8C8C8C' }}>{t.score}%</span>
                  </div>
                  <div className="w-full h-1.5" style={{ background: '#F5F3EF' }}>
                    <div className="h-1.5 transition-all" style={{ width: `${t.score}%`, background: '#2C2C2C' }} />
                  </div>
                </div>
              ))}
              {Object.entries(result.dimensions || {}).sort((a: any, b: any) => b[1] - a[1]).slice(3).map(([key, val]: any) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span style={{ color: '#8C8C8C' }}>{TYPE_NAMES[key] || key}</span>
                    <span style={{ color: '#B0A8A0' }}>{val}%</span>
                  </div>
                  <div className="w-full h-1" style={{ background: '#F5F3EF' }}>
                    <div className="h-1 transition-all" style={{ width: `${val}%`, background: '#D0C8D8' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 解读 */}
          {result.description && (
            <div className="p-5 mb-6" style={{ background: '#F5F3EF' }}>
              <div className="text-xs font-semibold mb-3" style={{ color: '#2C2C2C', letterSpacing: '1px' }}>📋 天赋解读</div>
              <div className="leading-relaxed" style={{ color: '#8C8C8C', lineHeight: '1.8', fontSize: '13px' }}>
                {result.description.split('\n').map((line: string, li: number) => {
                  const t = line.trim();
                  if (!t) return <div key={li} className="h-2" />;
                  if (/^[^\x00-\x7F]/.test(t) && t.length < 30) {
                    return <div key={li} className="font-semibold mt-4 mb-1" style={{ fontSize: '14px', color: '#2C2C2C' }}>{t}</div>;
                  }
                  if (/（\d+%?）/.test(t)) {
                    return <div key={li} className="font-semibold mt-3 mb-1" style={{ fontSize: '14px', color: '#2C2C2C' }}>{t}</div>;
                  }
                  return <div key={li} className="leading-relaxed" style={{ color: '#8C8C8C' }}>{t}</div>;
                })}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4 pb-8">
            <button onClick={handleRetest}
              className="px-6 py-3 text-xs tracking-[1px] transition-all hover:opacity-60"
              style={{ background: '#F5F3EF', color: '#2C2C2C' }}>
              重新测评
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
        <div className="space-y-3">
          <div className="text-xs mb-2" style={{ color: '#B0A8A0' }}>
            {q.type === 'behavior' && '📌 基于过去行为的判断'}
            {q.type === 'ability' && '💪 基于他人对你的认知'}
            {q.type === 'energy' && '⚡ 基于你的能量来源'}
          </div>
          {q.options?.map((opt: any) => {
            const isSelected = answer?.label === opt.label;
            return (
              <button key={opt.label} onClick={() => onAnswer({ score: opt.score, label: opt.label })}
                className="w-full text-left p-4 transition-all duration-200"
                style={{
                  background: isSelected ? '#F5F3EF' : '#FFFFFF',
                  border: '1px solid',
                  borderColor: isSelected ? '#2C2C2C' : '#E5E0D8',
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                }}>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-sm font-bold transition-all"
                    style={{
                      background: isSelected ? '#2C2C2C' : '#F0EDEA',
                      color: isSelected ? '#fff' : '#8C8C8C',
                    }}>
                    {opt.label}
                  </span>
                  <span className="text-sm leading-relaxed pt-1" style={{ color: isSelected ? '#2C2C2C' : '#8C8C8C' }}>
                    {opt.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    />
  );
}
