'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
const S = { bg: '#FAFAF8', text: '#2C2C2C', muted: '#8C8C8C', accent: '#B85C3A', border: '#E5E0D8' };

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.register({ email, password, nickname });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: S.bg }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-14">
          <Link href="/" className="inline-block mb-8" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 22, fontWeight: 600, color: S.text, letterSpacing: 2 }}>
            镜相
          </Link>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Noto Serif SC', serif", color: S.text }}>开启天赋探索</h1>
          <p className="text-sm" style={{ color: S.muted }}>注册账号，发现你的天赋优势</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="px-4 py-3 text-sm" style={{ background: '#F5F3EF', color: S.text, borderLeft: `3px solid ${S.accent}` }}>{error}</div>
          )}

          <div>
            <label className="block text-xs tracking-[2px] mb-2" style={{ color: S.muted }}>昵称</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 outline-none text-sm transition-all"
              style={{ border: '1px solid', borderColor: S.border, background: '#FFFFFF', color: S.text }}
              placeholder="你的名字" required />
          </div>

          <div>
            <label className="block text-xs tracking-[2px] mb-2" style={{ color: S.muted }}>邮箱</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 outline-none text-sm transition-all"
              style={{ border: '1px solid', borderColor: S.border, background: '#FFFFFF', color: S.text }}
              placeholder="your@email.com" required />
          </div>

          <div>
            <label className="block text-xs tracking-[2px] mb-2" style={{ color: S.muted }}>密码</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 outline-none text-sm transition-all"
              style={{ border: '1px solid', borderColor: S.border, background: '#FFFFFF', color: S.text }}
              placeholder="至少6位密码" minLength={6} required />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 text-sm tracking-[2px] text-white transition-all disabled:opacity-50"
            style={{ background: S.text }}>
            {loading ? '注册中...' : '注册并开始探索'}
          </button>

          <p className="text-center text-xs tracking-[1px]" style={{ color: S.muted }}>
            已有账号？{' '}
            <Link href="/auth/login" style={{ color: S.text, textDecoration: 'underline' }}>
              立即登录
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
