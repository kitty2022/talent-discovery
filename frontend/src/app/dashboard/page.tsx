'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import {
  Sparkles, Moon, Brain, BarChart3, Star, FileText,
  CheckCircle2, Circle, ArrowRight, LogOut,
} from 'lucide-react';

interface UserData {
  id: number;
  email: string;
  nickname: string;
  profile?: any;
}

interface Status {
  bazi: boolean;
  mbti: boolean;
  holland: boolean;
  tianzhi: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [status, setStatus] = useState<Status>({ bazi: false, mbti: false, holland: false, tianzhi: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }

    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }

    Promise.all([
      api.get('/auth/me'),
      api.get('/bazi/result').catch(() => null),
      api.get('/mbti/result').catch(() => null),
      api.get('/holland/result').catch(() => null),
      api.get('/tianzhi/result').catch(() => null),
    ]).then(([me, bazi, mbti, holland, tianzhi]) => {
      setUser(me.data.user);
      setStatus({
        bazi: bazi?.status === 200,
        mbti: mbti?.status === 200,
        holland: holland?.status === 200,
        tianzhi: tianzhi?.status === 200,
      });
    }).finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const modules = [
    { key: 'bazi' as const, title: '性格分析', desc: '输入出生信息分析性格', href: '/assessments/bazi', icon: Moon, color: 'text-amber-600', bg: 'bg-amber-50' },
    { key: 'mbti' as const, title: 'MBTI 人格', desc: '了解你的性格类型', href: '/assessments/mbti', icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50' },
    { key: 'holland' as const, title: '霍兰德测评', desc: '发现职业兴趣', href: '/assessments/holland', icon: BarChart3, color: 'text-rose-600', bg: 'bg-rose-50' },
    { key: 'tianzhi' as const, title: '天赋发现', desc: '发现你的核心天赋', href: '/assessments/tianzhi', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const completedCount = Object.values(status).filter(Boolean).length;
  const totalCount = Object.values(status).length;
  const canGenerate = status.bazi && (status.mbti || status.holland);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-lg">天赋星鉴</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user?.nickname}</span>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">测评进度</h2>
            <span className="text-sm text-gray-500">{completedCount}/{totalCount} 已完成</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
          {canGenerate && (
            <Link
              href="/reports"
              className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              <FileText className="w-4 h-4" />
              生成综合报告
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Module Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {modules.map((mod) => {
            const done = status[mod.key as keyof Status];
            const Icon = mod.icon;
            return (
              <Link
                key={mod.key}
                href={mod.href}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${mod.bg} ${mod.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-indigo-600 transition-colors">{mod.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{mod.desc}</p>
                    </div>
                  </div>
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Reports Link */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">📊 我的报告</h3>
              <p className="text-sm text-gray-600 mt-1">查看已生成的综合天赋分析报告</p>
            </div>
            <Link
              href="/reports"
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              查看 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
