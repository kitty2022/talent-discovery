'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { tianzhiAPI } from '@/lib/api';
import Questionnaire, { ThemeConfig } from '@/components/Questionnaire';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

/* —— 主题：紫罗兰 —— */
const THEME: Partial<ThemeConfig> = {
  primary: '#2C2C2C',
  primaryLight: '#F5F3EF',
  accent: '#2C2C2C',
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

export default function TianZhiPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }

    Promise.all([
      tianzhiAPI.getQuestions(),
      tianzhiAPI.getResult().catch(() => null),
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
    const res = await tianzhiAPI.submit(formatted);
    setResult(res.data.result);
  };

  const handleRetest = () => { setResult(null); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFFAF6' }}>
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: '#2C2C2C', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <Questionnaire
      title="天职测评"
      icon={<Sparkles className="w-10 h-10" style={{ color: '#2C2C2C' }} />}
      theme={THEME}
      questions={questions}
      isCompleted={!!result}
      resultView={result ? (
        <div className="max-w-lg mx-auto px-5" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
          {/* 核心天赋 */}
          <div className="rounded-3xl p-8 mb-6 text-center" style={{
            background: '#2C2C2C',
            boxShadow: '0 8px 32px rgba(139, 111, 168, 0.25)',
          }}>
            <div className="text-4xl mb-3">{TYPE_ICONS[Object.keys(result.dimensions || {})[0]] || '✨'}</div>
            <h2 className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>你的核心天赋</h2>
            <div className="text-3xl font-bold text-white mb-2">{result.topTalent}</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>这是你最自然的优势方向</p>
          </div>

          {/* 天赋排行 */}
          <div className="rounded-3xl p-6 mb-4" style={{
            background: '#FFFFFF',
            boxShadow: '0 4px 24px rgba(180, 140, 120, 0.08)',
          }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#2C2C2C' }}>八大天赋维度排行</h3>
            <div className="space-y-3">
              {result.topThree?.map((t: any, i: number) => (
                <div key={t.dimension} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: '#F0EAF5' }}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: '#2C2C2C' }}>
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium" style={{ color: '#2C2C2C' }}>{t.dimension}</span>
                      <span style={{ color: '#8C8C8C' }}>{t.score}%</span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ background: '#E0D8E8' }}>
                      <div className="h-2 rounded-full transition-all"
                        style={{ width: `${t.score}%`, background: '#2C2C2C' }} />
                    </div>
                  </div>
                </div>
              ))}
              {Object.entries(result.dimensions || {}).sort((a: any, b: any) => b[1] - a[1]).slice(3).map(([key, val]: any) => (
                <div key={key} className="flex items-center gap-3 p-2">
                  <span className="w-7 h-7 text-sm flex items-center justify-center flex-shrink-0"
                    style={{ color: '#B0A8A0' }}>
                    {TYPE_ICONS[key] || '•'}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: '#8C8C8C' }}>{TYPE_NAMES[key] || key}</span>
                      <span style={{ color: '#B0A8A0' }}>{val}%</span>
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{ background: '#F0EDEA' }}>
                      <div className="h-1.5 rounded-full transition-all"
                        style={{ width: `${val}%`, background: '#D0D0D0' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 解读 */}
          {result.recommendation && (
            <div className="rounded-3xl p-6 mb-6" style={{
              background: 'linear-gradient(135deg, #F0EAF5, #F8F4FC)',
              border: '1px solid #D8D0E8',
            }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#2C2C2C' }}>📋 天赋解读</h3>
              <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#8C8C8C' }}>
                {result.recommendation}
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
