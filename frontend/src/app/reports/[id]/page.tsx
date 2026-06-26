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

const S = { bg: '#FAFAF8', text: '#2C2C2C', muted: '#8C8C8C', border: '#E5E0D8', cardBg: '#FFFFFF' };

const SECTION_TABS = [
  { key: '核心结论', icon: '✨' },
  { key: '形成原因', icon: '🧠' },
  { key: '能力画像', icon: '📊' },
  { key: '职业发展建议', icon: '🧭' },
  { key: '风险提醒', icon: '⚠️' },
  { key: '先天特质', icon: '📋' },
];

function getTabIcon(title: string): string {
  if (title.includes('先天')) return '📋';
  if (title.includes('MBTI')) return '📋';
  if (title.includes('霍兰德')) return '📋';
  if (title.includes('天赋')) return '📋';
  for (const t of SECTION_TABS) { if (title.includes(t.key)) return t.icon; }
  return '📄';
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
    <div className="min-h-screen flex items-center justify-center" style={{ background: S.bg }}>
      <div className="animate-spin w-8 h-8 border-2 rounded-full" style={{ borderColor: S.text, borderTopColor: 'transparent' }} />
    </div>
  );

  if (!report) return null;

  return (
    <div style={{ minHeight: '100vh', background: S.bg }}>
      {/* Header */}
      <nav className="sticky top-0 z-50" style={{ background: 'rgba(255,250,246,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(180,140,120,0.08)' }}>
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/reports" style={{ color: S.muted }}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <FileText className="w-5 h-5" style={{ color: S.text }} />
            <span className="font-semibold truncate" style={{ color: S.text }}>{report.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleShare}
              className="flex items-center gap-2 text-sm transition-all px-3 py-1.5"
              style={{ color: S.muted, background: S.bg }}>
              {shareCopied ? <Check className="w-4 h-4" style={{ color: '#4CAF50' }} /> : <Share2 className="w-4 h-4" />}
              {shareCopied ? '已复制' : '分享'}
            </button>
            <button onClick={() => window.print()}
              className="flex items-center gap-2 text-sm transition-all px-3 py-1.5"
              style={{ color: S.muted, background: S.bg }}>
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title section */}
        <div className="p-8 md:p-10 mb-6" style={{ background: S.text }}>
          <h1 className="text-xl md:text-2xl font-bold mb-3 text-white" style={{ fontFamily: "'Noto Serif SC', serif" }}>{report.title}</h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{report.summary}</p>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {new Date(report.createdAt).toLocaleString('zh-CN')}
            </span>
          </div>
        </div>

        {/* Navigation tabs — 极简下划线 */}
        <div className="flex gap-4 overflow-x-auto mb-8 scrollbar-hide" style={{ borderBottom: '1px solid #E5E0D8' }}>
          {report.sections.map((section, i) => {
            const isActive = activeSection === i;
            return (
              <button key={i} onClick={() => setActiveSection(i)}
                className="flex-shrink-0 pb-2 text-xs tracking-[2px] transition-all"
                style={{
                  color: isActive ? '#2C2C2C' : '#B0A8A0',
                  borderBottom: isActive ? '1.5px solid #2C2C2C' : '1.5px solid transparent',
                  marginBottom: '-1px',
                }}>
                {section.title}
              </button>
            );
          })}
        </div>

        {/* Active section — 无边框 */}
        {report.sections.map((section, i) => (
          <div key={i}
            className={`transition-all duration-300 ${activeSection === i ? 'block' : 'hidden'}`}
            style={{ animation: activeSection === i ? 'fadeSlideUp 0.3s ease-out' : 'none' }}>
            <div className="py-2">
              <h2 className="text-lg font-bold mb-5" style={{ fontFamily: "'Noto Serif SC', serif", color: '#2C2C2C' }}>{section.title}</h2>
              {section.subtitle && (
                <p className="text-sm mb-4" style={{ color: S.muted }}>{section.subtitle}</p>
              )}
              <div className="leading-relaxed" style={{ color: '#8C8C8C', lineHeight: '2', fontSize: '13px' }}>
                {section.content.split('\n').map((line, li) => {
                  const t = line.trim();
                  if (!t) return <div key={li} className="h-2" />;
                  // ━━━ 分隔线
                  if (/^━+$/.test(t)) {
                    return <div key={li} className="my-5" style={{ height: '1px', background: '#E5E0D8' }} />;
                  }
                  // ▎ 开头 → 小节标题（衬线）
                  if (t.startsWith('▎')) {
                    return <div key={li} className="font-semibold mt-6 mb-3" style={{ fontSize: '14px', fontFamily: "'Noto Serif SC', serif", color: '#2C2C2C' }}>{t.slice(1)}</div>;
                  }
                  // ↳ 开头 → 培养建议
                  if (t.startsWith('↳')) {
                    return <div key={li} className="pl-3 text-xs" style={{ color: '#B0A8A0', fontStyle: 'italic' }}>{t}</div>;
                  }
                  // ▸ 开头 → 列表项
                  if (t.startsWith('▸')) {
                    return <div key={li} className="pl-4" style={{ color: '#8C8C8C' }}>· {t.slice(1).trim()}</div>;
                  }
                  // 以 emoji 开头的短行（≤28字）→ 大标题
                  const m = t.match(/^([^\x00-\x7F]+)\s*(.*)/);
                  if (m) {
                    if (t.length < 28) {
                      return <div key={li} className="font-bold mt-6 mb-2" style={{ fontSize: '15px', fontFamily: "'Noto Serif SC', serif", color: '#2C2C2C', letterSpacing: '0.5px' }}>{m[2] || m[1]}</div>;
                    }
                    return <div key={li} style={{ color: '#8C8C8C' }}><span className="font-semibold" style={{ color: '#2C2C2C' }}>{m[1]}</span>{m[2]}</div>;
                  }
                  // 包含（数字分）的能力名称行
                  if (/（\d+分）/.test(t)) {
                    return <div key={li} className="font-semibold mt-4 mb-1" style={{ fontSize: '14px', color: '#2C2C2C' }}>{t}</div>;
                  }
                  return <div key={li} className="leading-relaxed" style={{ color: '#8C8C8C' }}>{t}</div>;
                })}
              </div>

              {/* 霍兰德柱状图 — 百分比适配 */}
              {section.data && section.type === 'text' && section.title.includes('霍兰德') && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-600 mb-4">六维得分</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {Object.entries(section.data).map(([key, val]: any) => {
                      const palette: Record<string, string> = {
                        R: '#5B7B8C', I: '#7CA5B8', A: '#C9A96E',
                        S: '#2C2C2C', E: '#2C2C2C', C: '#9A9A9A',
                      };
                      const labels: Record<string, string> = {
                        R: '执行', I: '分析', A: '创造', S: '共情', E: '影响', C: '结构',
                      };
                      const pct = typeof val === 'number' && val <= 1 ? val * 100 : val;
                      return (
                        <div key={key} className="text-center">
                          <div className="text-xs font-medium mb-1.5" style={{ color: S.muted }}>{labels[key] || key}</div>
                          <div className="relative h-24" style={{ background: S.bg }}>
                            <div className="absolute bottom-0 w-full transition-all duration-700"
                              style={{ height: `${Math.min(pct, 100)}%`, backgroundColor: palette[key] || '#8C8C8C' }} />
                          </div>
                          <div className="text-xs font-semibold mt-1.5" style={{ color: S.text }}>{pct}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 能力画像可视化 — 雷达图 + 条图 */}
              {section.data && section.title === '能力画像' && (
                <div className="mt-6">
                  {/* SVG 雷达图 */}
                  <div className="flex justify-center mb-8">
                    <svg width="280" height="280" viewBox="0 0 300 300" className="max-w-full">
                      {(() => {
                        const entries = Object.entries(section.data) as [string, number][];
                        const n = entries.length;
                        const cx = 150, cy = 150, r = 100;
                        const colors: Record<string, string> = {
                          '创造力': '#8C8C8C', '分析力': '#5B7B8C', '表达力': '#2C2C2C',
                          '领导力': '#2C2C2C', '执行力': '#C9A96E', '学习力': '#2C2C2C',
                        };
                        const angleStep = (2 * Math.PI) / n;
                        const getPoint = (i: number, radius: number) => ({
                          x: cx + radius * Math.sin(angleStep * i),
                          y: cy - radius * Math.cos(angleStep * i),
                        });

                        // 背景网格（3层）
                        const grid = [0.33, 0.66, 1];
                        const gridPaths = grid.map(level => {
                          const pts = Array.from({length: n}, (_, i) => getPoint(i, r * level));
                          return pts.map((p, j) => `${j === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
                        });

                        // 数据多边形
                        const dataPts = entries.map(([, val], i) => getPoint(i, r * (Math.min(val, 100) / 100)));
                        const dataPath = dataPts.map((p, j) => `${j === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

                        // 轴线
                        const axes = Array.from({length: n}, (_, i) => getPoint(i, r + 18));

                        return (
                          <g>
                            {/* 背景网格 */}
                            {gridPaths.map((path, gi) => (
                              <path key={gi} d={path} fill="none" stroke="#e5e7eb" strokeWidth="1" />
                            ))}
                            {/* 轴线 */}
                            {axes.map((p, i) => (
                              <line key={i} x1={cx} y1={cy} x2={getPoint(i, r).x} y2={getPoint(i, r).y} stroke="#e5e7eb" strokeWidth="1" />
                            ))}
                            {/* 数据区域 */}
                            <path d={dataPath} fill="rgba(44,44,44,0.08)" stroke="#2C2C2C" strokeWidth="1.5" />
                            {/* 数据点 */}
                            {dataPts.map((p, i) => (
                              <circle key={i} cx={p.x} cy={p.y} r="5" fill={colors[entries[i][0]] || '#6366f1'} stroke="#fff" strokeWidth="2" />
                            ))}
                            {/* 标签 */}
                            {entries.map(([key, val], i) => {
                              const label = key.replace('力', '');
                              const lp = getPoint(i, r + 38);
                              return (
                                <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
                                  fontSize="13" fontWeight="600" fill="#8C8C8C">
                                  {label}
                                </text>
                              );
                            })}
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* 水平条图 */}
                  <div className="space-y-2.5">
                    {Object.entries(section.data).map(([key, val]: any) => {
                      const palette: Record<string, string> = {
                        '创造力': '#8C8C8C', '分析力': '#5B7B8C', '表达力': '#2C2C2C',
                        '领导力': '#2C2C2C', '执行力': '#C9A96E', '学习力': '#2C2C2C',
                      };
                      const pct = Math.min(val, 100);
                      const level = pct >= 65 ? '优势' : pct >= 40 ? '普通' : '待提升';
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <div className="w-16 text-xs font-medium text-right flex-shrink-0" style={{ color: S.muted }}>{key}</div>
                          <div className="flex-1" style={{ background: S.bg }}>
                            <div className="h-3 transition-all duration-700 flex items-center justify-end pr-2 text-[10px] text-white"
                              style={{ width: `${pct}%`, backgroundColor: palette[key] || '#8C8C8C' }}>
                              {pct >= 25 ? `${val}分` : ''}
                            </div>
                          </div>
                          <span className="text-[10px] font-medium flex-shrink-0 w-8" style={{ color: S.muted }}>
                            {level}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 五行数据可视化 */}
              {section.data && section.title.includes('五行') && (
                <div className="mt-6 flex gap-4 justify-center">
                  {Object.entries(section.data).map(([wx, count]: any) => (
                    <div key={wx} className="text-center">
                      <div className="w-14 h-14 flex items-center justify-center text-sm font-bold"
                        style={{
                          background: '#F5F3EF', color: '#2C2C2C',
                          border: '1px solid #E5E0D8',
                        }}>
                        {wx}
                      </div>
                      <div className="text-xs mt-1" style={{ color: S.muted }}>{count}分</div>
                    </div>
                  ))}
                </div>
              )}

              {/* 大运列表可视化 */}
              {section.type === 'list' && section.data && Array.isArray(section.data) && (
                <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
                  {section.data.map((item: any, idx: number) => (
                    <div key={idx} className="flex-shrink-0 p-4 text-center min-w-[90px]" style={{ background: S.bg, border: '1px solid', borderColor: S.border }}>
                      <div className="text-xs" style={{ color: S.muted }}>{item.ageStart}-{item.ageEnd}岁</div>
                      <div className="text-base font-semibold my-1" style={{ color: S.text }}>{item.pillar}</div>
                      <div className="text-xs" style={{ color: S.muted }}>{item.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-400">
          <p>镜相 · 本报告仅供参考</p>
        </div>
      </div>
    </div>
  );
}
