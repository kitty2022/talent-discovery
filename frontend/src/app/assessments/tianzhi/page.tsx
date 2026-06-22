'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { tianzhiAPI } from '@/lib/api';
import Questionnaire from '@/components/Questionnaire';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const COLORS = 'bg-purple-50 text-purple-600';

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Questionnaire
        title="天职测评"
        icon={<Sparkles className="w-5 h-5 text-purple-600" />}
        color={COLORS}
        questions={questions}
        isCompleted={!!result}
        resultView={result ? (
          <div className="max-w-lg mx-auto">
            {/* 核心天赋 */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white mb-6 shadow-xl text-center">
              <div className="text-4xl mb-3">{TYPE_ICONS[Object.keys(result.dimensions || {})[0]] || '✨'}</div>
              <h2 className="text-lg font-medium text-purple-200 mb-1">你的核心天赋</h2>
              <div className="text-3xl font-bold mb-2">{result.topTalent}</div>
              <p className="text-purple-200 text-sm">这是你最自然的优势方向</p>
            </div>

            {/* 天赋排行 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h3 className="font-semibold mb-4">八大天赋维度排行</h3>
              <div className="space-y-3">
                {result.topThree?.map((t: any, i: number) => (
                  <div key={t.dimension} className="flex items-center gap-3 p-2 rounded-lg bg-purple-50/50">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{t.dimension}</span>
                        <span className="text-gray-500">{t.score}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full bg-purple-600 transition-all" style={{ width: `${t.score}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
                {Object.entries(result.dimensions || {}).sort((a: any, b: any) => b[1] - a[1]).slice(3).map(([key, val]: any) => (
                  <div key={key} className="flex items-center gap-3 p-2 rounded-lg">
                    <span className="w-6 h-6 text-xs text-gray-400 flex items-center justify-center flex-shrink-0">{TYPE_ICONS[key] || '•'}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{TYPE_NAMES[key] || key}</span>
                        <span className="text-gray-400">{val}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-gray-300 transition-all" style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 解读 */}
            {result.recommendation && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <h3 className="font-semibold mb-3">📋 天赋解读</h3>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {result.recommendation}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4 mb-8">
              <button onClick={handleRetest} className="text-gray-500 hover:text-gray-700 text-sm">重新测评</button>
              <Link href="/dashboard" className="text-purple-600 hover:text-purple-700 text-sm font-medium">返回仪表盘</Link>
            </div>
          </div>
        ) : undefined}
        onBack={() => router.push('/dashboard')}
        onSubmit={handleSubmit}
        renderQuestion={(q, _idx, answer, onAnswer) => (
          <div className="space-y-3">
            <div className="text-xs text-gray-400 mb-2">
              {q.type === 'behavior' && '📌 基于过去行为的判断'}
              {q.type === 'ability' && '💪 基于他人对你的认知'}
              {q.type === 'energy' && '⚡ 基于你的能量来源'}
            </div>
            {q.options?.map((opt: any) => (
              <button key={opt.label} onClick={() => onAnswer({ score: opt.score, label: opt.label })}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answer?.label === opt.label
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50/50'
                }`}>
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    answer?.label === opt.label ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{opt.label}</span>
                  <span className="text-gray-700 leading-relaxed pt-1">{opt.text}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      />
    </div>
  );
}
