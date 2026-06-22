'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { reportAPI } from '@/lib/api';
import {
  ArrowLeft, Download, Sparkles, Moon, Brain, BarChart3, Star, FileText, Share2, Check,
} from 'lucide-react';

interface ReportSection {
  title: string;
  subtitle?: string;
  content: string;
  type: string;
  data?: any;
}

interface ReportData {
  id: number;
  title: string;
  summary: string;
  sections: ReportSection[];
  createdAt: string;
}

const SECTION_ICONS: Record<string, any> = {
  '核心结论': Sparkles,
  '形成原因': Brain,
  '能力画像': BarChart3,
  '职业发展建议': Star,
  '发展路径': FileText,
  '风险提醒': FileText,
  '数据依据': FileText,
};

const SECTION_COLORS: Record<string, string> = {
  '核心结论': 'bg-indigo-50 border-indigo-200 text-indigo-700',
  '形成原因': 'bg-blue-50 border-blue-200 text-blue-700',
  '能力画像': 'bg-teal-50 border-teal-200 text-teal-700',
  '职业发展建议': 'bg-emerald-50 border-emerald-200 text-emerald-700',
  '发展路径': 'bg-amber-50 border-amber-200 text-amber-700',
  '风险提醒': 'bg-rose-50 border-rose-200 text-rose-700',
  '数据依据': 'bg-gray-50 border-gray-200 text-gray-600',
};

function getSectionStyle(title: string): { icon: any; color: string } {
  for (const [key, icon] of Object.entries(SECTION_ICONS)) {
    if (title.includes(key)) {
      return { icon, color: SECTION_COLORS[key] || 'bg-gray-50 border-gray-200 text-gray-700' };
    }
  }
  return { icon: FileText, color: 'bg-gray-50 border-gray-200 text-gray-700' };
}

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [shareUrl, setShareUrl] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = async () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
      return;
    }
    try {
      const res = await reportAPI.share(parseInt(id));
      const url = res.data.shareUrl;
      setShareUrl(url);
      navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch { }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }

    reportAPI.get(parseInt(id))
      .then((res) => setReport(res.data.report))
      .catch(() => router.push('/reports'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  if (!report) return null;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/reports" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <FileText className="w-5 h-5 text-indigo-500" />
            <span className="font-semibold truncate">{report.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 text-sm transition-colors"
            >
              {shareCopied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
              {shareCopied ? '已复制' : '分享'}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
            >
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title section */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white mb-6 shadow-xl">
          <h1 className="text-2xl font-bold mb-2">{report.title}</h1>
          <p className="text-indigo-200 text-sm">{report.summary}</p>
          <p className="text-indigo-300 text-xs mt-2">
            生成时间：{new Date(report.createdAt).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {report.sections.map((section, i) => {
            const { icon: Icon, color } = getSectionStyle(section.title);
            return (
              <button
                key={i}
                onClick={() => setActiveSection(i)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  activeSection === i
                    ? color + ' shadow-sm'
                    : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.title}
              </button>
            );
          })}
        </div>

        {/* Active section */}
        {report.sections.map((section, i) => (
          <div
            key={i}
            className={`transition-all duration-300 ${activeSection === i ? 'block' : 'hidden'}`}
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-2">{section.title}</h2>
              {section.subtitle && (
                <p className="text-indigo-600 font-medium mb-4">{section.subtitle}</p>
              )}
              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-[15px]">
                {section.content}
              </div>

              {/* Chart data visualization */}
              {section.data && section.type === 'text' && section.title.includes('霍兰德') && (
                <div className="mt-6 grid grid-cols-6 gap-2">
                  {Object.entries(section.data).map(([key, val]: any) => {
                    const colors: Record<string, string> = {
                      R: '#10b981', I: '#3b82f6', A: '#f59e0b',
                      S: '#ec4899', E: '#8b5cf6', C: '#6b7280',
                    };
                    const labels: Record<string, string> = {
                      R: '现实', I: '研究', A: '艺术', S: '社会', E: '企业', C: '常规',
                    };
                    return (
                      <div key={key} className="text-center">
                        <div className="text-xs text-gray-500 mb-1">{labels[key] || key}</div>
                        <div className="relative h-24 bg-gray-50 rounded-lg overflow-hidden">
                          <div
                            className="absolute bottom-0 w-full rounded-t-lg transition-all duration-700"
                            style={{ height: `${(val / 30) * 100}%`, backgroundColor: colors[key] || '#666' }}
                          />
                        </div>
                        <div className="text-xs font-medium mt-1">{val}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 能力画像可视化 */}
              {section.data && section.title === '能力画像' && (
                <div className="mt-6 space-y-3">
                  {Object.entries(section.data).map(([key, val]: any) => {
                    const colors: Record<string, string> = {
                      '创造力': '#8b5cf6', '分析力': '#3b82f6', '表达力': '#f59e0b',
                      '领导力': '#ef4444', '执行力': '#10b981', '学习力': '#06b6d4',
                    };
                    const pct = Math.min(val, 100);
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <div className="w-16 text-sm font-medium text-gray-700 text-right">{key}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2 text-xs text-white font-medium"
                            style={{ width: `${pct}%`, backgroundColor: colors[key] || '#6366f1' }}
                          >
                            {pct >= 30 ? `${val}分` : ''}
                          </div>
                        </div>
                        <div className="w-10 text-sm text-gray-500">{val}分</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 五行数据可视化 */}
              {section.data && section.title.includes('五行') && (
                <div className="mt-6 flex gap-4 justify-center">
                  {Object.entries(section.data).map(([wx, count]: any) => (
                    <div key={wx} className="text-center">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{
                          backgroundColor: ({木: '#10b981', 火: '#f59e0b', 土: '#8B7355', 金: '#f59e0b', 水: '#3b82f6'} as Record<string, string>)[wx as string] || '#666',
                          opacity: 0.5 + count * 0.15,
                        }}
                      >
                        {wx}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{count}分</div>
                    </div>
                  ))}
                </div>
              )}

              {/* 大运列表可视化 */}
              {section.type === 'list' && section.data && Array.isArray(section.data) && (
                <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
                  {section.data.map((item: any, idx: number) => (
                    <div key={idx} className="flex-shrink-0 bg-gray-50 rounded-xl p-4 text-center min-w-[90px]">
                      <div className="text-xs text-gray-500">{item.ageStart}-{item.ageEnd}岁</div>
                      <div className="text-lg font-bold text-gray-800 my-1">{item.pillar}</div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-400">
          <p>天赋星鉴 · 本报告仅供参考，请理性看待分析结果</p>
        </div>
      </div>
    </div>
  );
}
