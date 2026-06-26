'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { reportAPI } from '@/lib/api';
import { FileText, ArrowLeft, ChevronRight, Trash2 } from 'lucide-react';

const S = { bg: '#FAFAF8', text: '#2C2C2C', muted: '#8C8C8C', accent: '#B85C3A', border: '#E5E0D8', cardBg: '#FFFFFF' };

interface ReportItem {
  id: number;
  title: string;
  summary: string;
  createdAt: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }
    loadReports();
  }, [router]);

  const loadReports = async () => {
    try {
      const res = await reportAPI.list();
      setReports(res.data.reports);
    } catch { } finally { setLoading(false); }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage('');
    try {
      const res = await reportAPI.generate();
      setMessage(res.data.message);
      loadReports();
    } catch (err: any) {
      setMessage(err.response?.data?.error || '生成失败');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这份报告吗？')) return;
    try {
      await api.delete(`/reports/${id}`);
      setReports(reports.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || '删除失败');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: S.bg }}>
      <nav className="sticky top-0 z-50" style={{ background: 'rgba(250,250,248,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid', borderColor: S.border }}>
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" style={{ color: S.text }}>
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 16, fontWeight: 600, color: S.text, letterSpacing: 2 }}>我的报告</span>
          </div>
          <button onClick={handleGenerate} disabled={generating}
            className="px-5 py-2.5 text-xs tracking-[2px] text-white transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: S.text }}>
            {generating ? '生成中...' : '+ 生成新报告'}
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {message && (
          <div className="mb-6 px-4 py-3 text-sm" style={{ background: '#F5F3EF', color: S.text, borderLeft: `3px solid ${message.includes('完成') ? S.text : S.accent}` }}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-6 h-6 border rounded-full" style={{ borderColor: S.text, borderTopColor: 'transparent' }} />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20" style={{ border: '1px solid', borderColor: S.border, background: S.cardBg }}>
            <FileText className="w-10 h-10 mx-auto mb-4" style={{ color: S.muted }} />
            <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: "'Noto Serif SC', serif", color: S.text }}>暂无报告</h2>
            <p className="text-sm mb-6" style={{ color: S.muted }}>完成性格分析和至少一项测评后即可生成报告</p>
            <button onClick={handleGenerate} disabled={generating}
              className="px-6 py-3 text-xs tracking-[2px] text-white transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ background: S.text }}>
              {generating ? '生成中...' : '生成我的第一份报告'}
            </button>
          </div>
        ) : (
          <div className="space-y-0.5">
            {reports.map((report) => (
              <div key={report.id} className="group transition-all" style={{ background: S.cardBg, border: '1px solid', borderColor: S.border }}>
                <div className="flex items-center">
                  <Link href={`/reports/${report.id}`} className="flex-1 p-6">
                    <div className="flex items-center gap-5">
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm" style={{ color: S.muted }}>
                        📄
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors text-sm">
                          {report.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{report.summary}</p>
                        <p className="text-xs text-gray-300 mt-1.5">
                          {new Date(report.createdAt).toLocaleString('zh-CN')}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                  <button onClick={() => handleDelete(report.id)}
                    className="p-5 text-gray-200 hover:text-red-500 transition-colors flex-shrink-0" title="删除报告">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
