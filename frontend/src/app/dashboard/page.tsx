'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import {
  Sparkles, Moon, Brain, BarChart3, Star, FileText,
  CheckCircle2, Circle, ArrowRight, LogOut,
} from 'lucide-react';

const S = { bg: '#FAFAF8', text: '#2C2C2C', muted: '#8C8C8C', accent: '#B85C3A', border: '#E5E0D8', cardBg: '#FFFFFF' };

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
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [nicknameMsg, setNicknameMsg] = useState('');

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

  const handleUpdateNickname = async () => {
    if (!nicknameInput.trim()) return;
    try {
      const res = await api.put('/auth/nickname', { nickname: nicknameInput.trim() });
      const updated = { ...user!, nickname: res.data.nickname };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setEditingNickname(false);
      setNicknameMsg('✅ 昵称已更新');
      setTimeout(() => setNicknameMsg(''), 3000);
    } catch (err: any) {
      setNicknameMsg('❌ ' + (err.response?.data?.error || '更新失败'));
    }
  };

  const modules = [
    { key: 'bazi' as const, title: '性格分析', desc: '输入出生信息分析性格', href: '/assessments/bazi', icon: Moon, color: 'text-gray-800', bg: 'bg-gray-100' },
    { key: 'mbti' as const, title: 'MBTI 人格', desc: '了解你的性格类型', href: '/assessments/mbti', icon: Brain, color: 'text-gray-800', bg: 'bg-gray-100' },
    { key: 'holland' as const, title: '霍兰德测评', desc: '发现职业兴趣', href: '/assessments/holland', icon: BarChart3, color: 'text-gray-800', bg: 'bg-gray-100' },
    { key: 'tianzhi' as const, title: '天赋发现', desc: '发现你的核心天赋', href: '/assessments/tianzhi', icon: Star, color: 'text-gray-800', bg: 'bg-gray-100' },
  ];

  const completedCount = Object.values(status).filter(Boolean).length;
  const totalCount = Object.values(status).length;
  const canGenerate = status.bazi && (status.mbti || status.holland);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: S.bg }}>
        <div className="animate-spin w-6 h-6 border rounded-full" style={{ borderColor: S.text, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: S.bg }}>
      {/* Top Nav */}
      <nav className="sticky top-0 z-50" style={{ background: 'rgba(250,250,248,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid', borderColor: S.border }}>
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 18, fontWeight: 600, color: S.text, letterSpacing: 2 }}>
            镜相
          </Link>
          <div className="flex items-center gap-6">
            {editingNickname ? (
              <div className="flex items-center gap-2">
                <input type="text" value={nicknameInput} onChange={(e) => setNicknameInput(e.target.value)}
                  className="w-28 px-2 py-1 text-xs outline-none" style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', color: '#2C2C2C' }}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateNickname()} autoFocus />
                <button onClick={handleUpdateNickname} className="text-xs" style={{ color: '#2C2C2C' }}>保存</button>
                <button onClick={() => setEditingNickname(false)} className="text-xs" style={{ color: '#8C8C8C' }}>取消</button>
              </div>
            ) : (
              <button onClick={() => { setNicknameInput(user?.nickname || ''); setEditingNickname(true); }}
                className="text-xs tracking-[2px] transition-opacity hover:opacity-60" style={{ color: S.muted }}>
                {user?.nickname} ✎
              </button>
            )}
            <button onClick={handleLogout} className="text-xs tracking-[2px] transition-opacity hover:opacity-60" style={{ color: S.muted }}>
              退出
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {nicknameMsg && (
          <div className="mb-4 px-4 py-2 text-xs" style={{ background: '#F5F3EF', color: '#2C2C2C' }}>{nicknameMsg}</div>
        )}
        {/* Progress */}
        <div className="p-8 mb-10" style={{ background: S.cardBg, border: '1px solid', borderColor: S.border }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold" style={{ fontFamily: "'Noto Serif SC', serif", color: S.text }}>测评进度</h2>
              <p className="text-xs mt-1 tracking-[1px]" style={{ color: S.muted }}>完成所有测评后生成综合报告</p>
            </div>
            <span className="text-xs tracking-[2px] px-4 py-1.5" style={{ color: S.muted, background: S.bg }}>{completedCount}/{totalCount} 已完成</span>
          </div>
          <div className="w-full h-1" style={{ background: S.border }}>
            <div className="h-1 transition-all duration-700" style={{ width: `${(completedCount / totalCount) * 100}%`, background: S.text }} />
          </div>
          {canGenerate && (
            <Link href="/reports"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-xs tracking-[2px] text-white transition-opacity hover:opacity-80"
              style={{ background: S.text }}>
              <FileText className="w-3.5 h-3.5" />
              生成综合报告 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Module Grid */}
        <div className="grid md:grid-cols-2 gap-0.5">
          {modules.map((mod) => {
            const done = status[mod.key as keyof Status];
            const Icon = mod.icon;
            const iconColors: Record<string, string> = {
              bazi: '#2C2C2C', mbti: '#2C2C2C', holland: '#2C2C2C', tianzhi: '#2C2C2C',
            };
            return (
              <Link key={mod.key} href={mod.href}
                className="p-6 transition-all duration-300 group"
                style={{ background: S.cardBg, border: '1px solid', borderColor: S.border }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 text-lg group-hover:opacity-60 transition-opacity" style={{ color: iconColors[mod.key] || '#666' }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: "'Noto Serif SC', serif", color: S.text }}>{mod.title}</h3>
                      <p className="text-xs" style={{ color: S.muted }}>{mod.desc}</p>
                    </div>
                  </div>
                  {done ? (
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center" style={{ background: S.text }}>
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: S.bg }} />
                      <div style={{ color: S.text }}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-5 h-5" style={{ border: '1px solid', borderColor: S.border }} />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Reports Link */}
        <div className="mt-10 p-8" style={{ background: S.cardBg, border: '1px solid', borderColor: S.border }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: "'Noto Serif SC', serif", color: S.text }}>我的报告</h3>
              <p className="text-xs" style={{ color: S.muted }}>查看已生成的综合天赋分析报告</p>
            </div>
            <Link href="/reports"
              className="inline-flex items-center gap-1.5 text-xs tracking-[2px] transition-all hover:opacity-60"
              style={{ color: S.text }}>
              查看 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
