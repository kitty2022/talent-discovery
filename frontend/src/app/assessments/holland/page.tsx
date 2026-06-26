'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hollandAPI } from '@/lib/api';
import Questionnaire, { ThemeConfig } from '@/components/Questionnaire';
import { BarChart3 } from 'lucide-react';
import Link from 'next/link';

const THEME: Partial<ThemeConfig> = {
  primary: '#2C2C2C',
  primaryLight: '#F5F3EF',
  accent: '#2C2C2C',
};

const DIM_COLORS: Record<string, string> = {
  R: '#5B7B8C', I: '#7CA5B8', A: '#C9A96E',
  S: '#2C2C2C', E: '#2C2C2C', C: '#9A9A9A',
};
const DIM_LABELS: Record<string, string> = {
  R: '执行型', I: '分析型', A: '创造型',
  S: '共情型', E: '影响型', C: '结构型',
};

export default function HollandPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }

    Promise.all([
      hollandAPI.getQuestions(),
      hollandAPI.getResult().catch(() => null),
    ]).then(([qRes, rRes]) => {
      setQuestions(qRes.data.questions);
      if (rRes?.status === 200) setResult(rRes.data);
    }).finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async (answers: any[]) => {
    const formatted = answers.map((a: any) => ({
      questionId: questions[a.questionId - 1]?.id || a.questionId,
      dimension: questions[a.questionId - 1]?.dimension,
      score: a.score,
      label: a.label,
    }));
    const res = await hollandAPI.submit(formatted);
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
      title="霍兰德职业测评"
      icon={<BarChart3 className="w-10 h-10" style={{ color: '#D4876A' }} />}
      theme={THEME}
      questions={questions}
      isCompleted={!!result}
      resultView={result ? (
        <div className="max-w-lg mx-auto px-5" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
          {/* 结果头部 */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#2C2C2C' }}>你的行为倾向代码</h2>
            <p className="text-sm mt-1" style={{ color: '#8C8C8C' }}>得分最高的三个维度组合</p>
          </div>

          {/* 类型大卡 */}
          <div className="p-8 mb-4 text-center" style={{ background: '#2C2C2C' }}>
            <div className="text-5xl font-bold text-white tracking-[4px]">{result.type}</div>
          </div>

          {/* 维度得分 */}
          {result.dimensions && (
            <div className="p-6 mb-4" style={{ background: '#FFFFFF', border: '1px solid #E5E0D8' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#2C2C2C' }}>维度得分</h3>
              <div className="space-y-3">
                {Object.entries(result.dimensions).map(([key, val]: any) => {
                  const isTop = result.type.includes(key);
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium" style={{ color: isTop ? '#2D2424' : '#8A7A72' }}>
                          {DIM_LABELS[key] || key} {isTop && '★'}
                        </span>
                        <span style={{ color: '#8A7A72' }}>{val}%</span>
                      </div>
                      <div className="w-full rounded-full h-2.5" style={{ background: '#F0EDEA' }}>
                        <div className="h-2.5 rounded-full transition-all"
                          style={{
                            width: `${val}%`,
                            background: DIM_COLORS[key] || '#2C2C2C',
                          }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 解读 */}
          {result.description && (
            <div className="p-6 mb-6" style={{ background: '#F5F3EF' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#2C2C2C' }}>📋 你的行为偏好解读</h3>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#8C8C8C' }}>
                {result.description}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4 pb-8">
            <button onClick={handleRetest}
              className="px-6 py-3 text-xs tracking-[1px] transition-all hover:opacity-60"
              style={{ background: '#F5F3EF', color: '#2C2C2C' }}>
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
        <div className="space-y-3">
          {q.options?.map((opt: any) => {
            const isSelected = answer?.label === opt.label;
            return (
              <button key={opt.label}
                onClick={() => onAnswer({ score: opt.score, label: opt.label })}
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
