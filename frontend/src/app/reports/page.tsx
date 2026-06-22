'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { reportAPI } from '@/lib/api';
import { FileText, ArrowLeft, ChevronRight, Trash2 } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50/50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <FileText className="w-5 h-5 text-indigo-500" />
            <span className="font-semibold">我的报告</span>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            {generating ? '生成中...' : '+ 生成新报告'}
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {message && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${
            message.includes('完成') ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
          }`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">暂无报告</h2>
            <p className="text-gray-500 mb-6">完成性格分析和至少一项测评后即可生成报告</p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {generating ? '生成中...' : '生成我的第一份报告'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center">
                  <Link href={`/reports/${report.id}`} className="flex-1 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold group-hover:text-indigo-600 transition-colors">
                          {report.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{report.summary}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(report.createdAt).toLocaleString('zh-CN')}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="p-5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                    title="删除报告"
                  >
                    <Trash2 className="w-5 h-5" />
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
