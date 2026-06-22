'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hollandAPI } from '@/lib/api';
import Questionnaire from '@/components/Questionnaire';
import { BarChart3, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const COLORS = 'bg-rose-50 text-rose-600';

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

  const handleRetest = () => {
    setResult(null);
  };

  const DIM_COLORS: Record<string, string> = {
    R: '#10b981', I: '#3b82f6', A: '#f59e0b',
    S: '#ec4899', E: '#8b5cf6', C: '#6b7280',
  };
  const DIM_LABELS: Record<string, string> = {
    R: '执行型', I: '分析型', A: '创造型',
    S: '共情型', E: '影响型', C: '结构型',
  };
  const DIM_BG: Record<string, string> = {
    R: 'bg-emerald-50', I: 'bg-blue-50', A: 'bg-amber-50',
    S: 'bg-pink-50', E: 'bg-purple-50', C: 'bg-gray-50',
  };
  const DIM_TEXT: Record<string, string> = {
    R: 'text-emerald-700', I: 'text-blue-700', A: 'text-amber-700',
    S: 'text-pink-700', E: 'text-purple-700', C: 'text-gray-700',
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Questionnaire
        title="霍兰德职业测评"
        icon={<BarChart3 className="w-5 h-5 text-rose-600" />}
        color={COLORS}
        questions={questions}
        isCompleted={!!result}
        resultView={result ? (
          <div className="max-w-lg mx-auto">
            {/* 结果头部 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-rose-600" />
                </div>
                <h2 className="text-2xl font-bold mb-1">你的行为倾向代码</h2>
                <div className="text-5xl font-bold text-rose-600 my-3 tracking-wider">{result.type}</div>
                <p className="text-sm text-gray-500">
                  得分最高的三个维度组合，反映了你的行为偏好
                </p>
              </div>

              {/* 维度得分 */}
              {result.dimensions && (
                <div className="space-y-4 mb-6">
                  {Object.entries(result.dimensions).map(([key, val]: any) => {
                    const isTop = result.type.includes(key);
                    return (
                      <div key={key} className={`p-3 rounded-xl ${isTop ? DIM_BG[key] || 'bg-gray-50' : ''}`}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={`font-medium ${isTop ? DIM_TEXT[key] || '' : 'text-gray-700'}`}>
                            {DIM_LABELS[key] || key}
                            {isTop && ' ★'}
                          </span>
                          <span className="text-gray-500">{val}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div
                            className="h-3 rounded-full transition-all"
                            style={{ width: `${val}%`, backgroundColor: DIM_COLORS[key] || '#666' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 行为解读 */}
              {result.description && (
                <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-5 border border-rose-200">
                  <h3 className="font-semibold text-sm text-rose-800 mb-3">📋 你的行为偏好解读</h3>
                  <div className="text-sm text-rose-900 leading-relaxed whitespace-pre-line">
                    {result.description}
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4 mt-6">
                <button onClick={handleRetest} className="text-gray-500 hover:text-gray-700 text-sm">
                  重新测试
                </button>
                <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  返回仪表盘
                </Link>
              </div>
            </div>
          </div>
        ) : undefined}
        onBack={() => router.push('/dashboard')}
        onSubmit={handleSubmit}
        renderQuestion={(q, _idx, answer, onAnswer) => (
          <div className="space-y-3">
            {q.options?.map((opt: any) => (
              <button
                key={opt.label}
                onClick={() => onAnswer({ score: opt.score, label: opt.label })}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answer?.label === opt.label
                    ? 'border-rose-500 bg-rose-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-rose-200 hover:bg-rose-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    answer?.label === opt.label
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {opt.label}
                  </span>
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
