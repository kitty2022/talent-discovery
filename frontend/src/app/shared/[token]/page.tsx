'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Sparkles, FileText, Moon, Brain, BarChart3, Star, ArrowLeft } from 'lucide-react';

interface ReportSection {
  title: string;
  subtitle?: string;
  content: string;
  type: string;
  data?: any;
}

export default function SharedReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    api.get(`/shared/${token}`)
      .then((res) => setReport(res.data.report))
      .catch((err) => setError(err.response?.data?.error || '报告不存在'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  if (error || !report) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">报告不可用</h2>
        <p className="text-gray-500 mb-6">{error || '报告不存在'}</p>
        <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
          返回首页
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Minimal header */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              镜相
            </span>
          </div>
          <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            我也要测
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white mb-6 shadow-xl">
          <h1 className="text-2xl font-bold mb-2">{report.title}</h1>
          <p className="text-indigo-200 text-sm">{report.summary}</p>
          <p className="text-indigo-300 text-xs mt-2">
            分享报告 · {new Date(report.createdAt).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* Section tabs */}
        {report.sections && report.sections.length > 0 && (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
              {report.sections.map((section: ReportSection, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveSection(i)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    activeSection === i
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                      : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>

            {report.sections.map((section: ReportSection, i: number) => (
              <div key={i} className={`transition-all duration-300 ${activeSection === i ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold mb-2">{section.title}</h2>
                  {section.subtitle && (
                    <p className="text-indigo-600 font-medium mb-4">{section.subtitle}</p>
                  )}
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line text-[15px]">
                    {section.content}
                  </div>

                  {/* 霍兰德图表 */}
                  {section.data && section.title.includes('霍兰德') && (
                    <div className="mt-6 grid grid-cols-6 gap-2">
                      {Object.entries(section.data).map(([key, val]: any) => {
                        const colors: Record<string, string> = { R: '#10b981', I: '#3b82f6', A: '#f59e0b', S: '#ec4899', E: '#8b5cf6', C: '#6b7280' };
                        const labels: Record<string, string> = { R: '现实', I: '研究', A: '艺术', S: '社会', E: '企业', C: '常规' };
                        return (
                          <div key={key} className="text-center">
                            <div className="text-xs text-gray-500 mb-1">{labels[key] || key}</div>
                            <div className="relative h-24 bg-gray-50 rounded-lg overflow-hidden">
                              <div className="absolute bottom-0 w-full rounded-t-lg transition-all duration-700"
                                style={{ height: `${(val / 30) * 100}%`, backgroundColor: colors[key] || '#666' }} />
                            </div>
                            <div className="text-xs font-medium mt-1">{val}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 五行图表 */}
                  {section.data && section.title.includes('五行') && (
                    <div className="mt-6 flex gap-4 justify-center">
                      {Object.entries(section.data).map(([wx, count]: any) => (
                        <div key={wx} className="text-center">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: ({木: '#10b981', 火: '#f59e0b', 土: '#8B7355', 金: '#f59e0b', 水: '#3b82f6'} as Record<string, string>)[wx as string] || '#666', opacity: 0.5 + count * 0.15 }}
                          >{wx}</div>
                          <div className="text-xs text-gray-500 mt-1">{count}分</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 大运 */}
                  {section.type === 'list' && section.data && Array.isArray(section.data) && (
                    <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
                      {section.data.map((item: any, idx: number) => (
                        <div key={idx} className="flex-shrink-0 bg-gray-50 rounded-xl p-4 text-center min-w-[90px]">
                          <div className="text-xs text-gray-500">{item.ageStart}-{item.ageEnd}岁</div>
                          <div className="text-lg font-bold text-gray-800 my-1">{item.pillar}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        <div className="text-center mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-3">也想发现自己的天赋优势？</p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Sparkles className="w-4 h-4" />
            开始我的天赋探索
          </Link>
        </div>

        <div className="text-center mt-6 text-xs text-gray-400">
          <p>镜相 · 本报告仅供参考，请理性看待分析结果</p>
        </div>
      </div>
    </div>
  );
}
