'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setDone(true);
      if (res.data.resetUrl) setResetLink(res.data.resetUrl);
    } catch (err: any) {
      setError(err.response?.data?.error || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              天赋星鉴
            </span>
          </Link>
          <h1 className="text-2xl font-bold">忘记密码</h1>
          <p className="text-gray-500 mt-1">输入注册邮箱，获取重置链接</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          {done ? (
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">重置链接已生成</h2>
              <p className="text-sm text-gray-500 mb-4">
                如果该邮箱已注册，重置链接已发送
              </p>
              {resetLink && (
                <div className="bg-gray-50 rounded-xl p-3 mb-4 text-left">
                  <p className="text-xs text-gray-500 mb-1">开发环境重置链接：</p>
                  <a href={resetLink} className="text-indigo-600 text-sm break-all hover:underline">
                    {resetLink}
                  </a>
                </div>
              )}
              <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                返回登录
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>
              )}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="your@email.com" required
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
              >
                {loading ? '发送中...' : '发送重置链接'}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> 返回登录
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
