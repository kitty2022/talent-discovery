'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mbtiAPI } from '@/lib/api';
import Questionnaire from '@/components/Questionnaire';
import { Brain } from 'lucide-react';
import Link from 'next/link';

const COLORS = 'bg-blue-50 text-blue-600';

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

  const handleRetest = () => {
    setResult(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Questionnaire
        title="MBTI 人格测评"
        icon={<Brain className="w-5 h-5 text-blue-600" />}
        color={COLORS}
        questions={questions}
        isCompleted={!!result}
        resultView={result ? (
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">你的 MBTI 类型</h2>
              <div className="text-5xl font-bold text-blue-600 my-4">{result.type}</div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{result.description}</p>
              {result.dimensions && (
                <div className="space-y-3 mb-6">
                  {[
                    { label: 'E/I', val: result.dimensions.ei, left: '外向 E', right: '内向 I' },
                    { label: 'S/N', val: result.dimensions.sn, left: '实感 S', right: '直觉 N' },
                    { label: 'T/F', val: result.dimensions.tf, left: '理性 T', right: '感性 F' },
                    { label: 'J/P', val: result.dimensions.jp, left: '判断 J', right: '感知 P' },
                  ].map((dim, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{dim.left}</span>
                        <span>{dim.right}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{
                            width: '100%',
                            marginLeft: dim.val >= 0 ? '0' : `${50 + dim.val / 2}%`,
                            marginRight: dim.val < 0 ? '0' : `${50 - dim.val / 2}%`,
                          }}
                        />
                      </div>
                      <div className="text-center text-xs text-gray-400 mt-0.5">{dim.label}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-center gap-4">
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
          <div className="grid grid-cols-2 gap-3">
            {q.options?.map((opt: string, oi: number) => (
              <button
                key={oi}
                onClick={() => onAnswer({ answer: oi === 0 ? 2 : 1 })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  answer?.answer === (oi === 0 ? 2 : 1)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                }`}
              >
                <span className="text-xs text-gray-400">{OPTION_LABELS[oi]}</span>
                <p className="text-sm mt-1">{opt}</p>
              </button>
            ))}
          </div>
        )}
      />
    </div>
  );
}
