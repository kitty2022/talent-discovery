'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Sparkles, CheckCircle2 } from 'lucide-react';

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) { setError('密码至少6位'); return; }
    if (password !== confirm) { setError('两次密码输入不一致'); return; }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setDone(true);
    } catch (err: any) {
      setError(err.response?.data?.error || '重置失败');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">重置链接无效，请重新申请</p>
        <Link href="/auth/forgot-password" className="text-indigo-600 hover:underline">重新申请</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">密码已重置</h2>
        <p className="text-sm text-gray-500 mb-6">请使用新密码登录</p>
        <Link
          href="/auth/login"
          className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all"
        >
          去登录
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
        <input
          type="password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="至少6位" minLength={6} required
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
        <input
          type="password" value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="再次输入密码" required
        />
      </div>
      <button
        type="submit" disabled={loading}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
      >
        {loading ? '重置中...' : '重置密码'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              镜相
            </span>
          </Link>
          <h1 className="text-2xl font-bold">重置密码</h1>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <Suspense fallback={<div className="text-center py-4">加载中...</div>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
