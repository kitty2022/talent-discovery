'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Moon, ArrowLeft, Sparkles } from 'lucide-react';

export default function BaZiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [hasResult, setHasResult] = useState(false);
  const [form, setForm] = useState({
    birthDate: '',
    birthHour: '8',
    birthMinute: '0',
    gender: 'male',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }
    // 检查是否已有排盘结果
    api.get('/bazi/result').then(res => {
      setResult(res.data.bazi);
      setHasResult(true);
    }).catch(() => {});
  }, [router]);

  const handleCalculate = async () => {
    if (!form.birthDate) return;
    setLoading(true);
    try {
      const res = await api.post('/bazi/calculate', {
        birthDate: form.birthDate,
        birthHour: parseInt(form.birthHour),
        birthMinute: parseInt(form.birthMinute),
        gender: form.gender,
      });
      setResult(res.data.bazi);
      setHasResult(true);
    } catch (err: any) {
      alert(err.response?.data?.error || '排盘失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Moon className="w-5 h-5 text-amber-500" />
          <span className="font-semibold">性格分析</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 如果有结果，直接展示 */}
        {hasResult && result ? (
          <ResultView result={result} onRecalculate={() => setHasResult(false)} />
        ) : (
          /* 输入表单 */
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-2">输入出生信息</h2>
            <p className="text-sm text-gray-500 mb-6">填写公历出生日期和时辰，系统将自动进行性格分析</p>

            <div className="space-y-4">
              {/* 日期选择器 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">出生日期（公历）</label>
                <DatePicker value={form.birthDate} onChange={(v) => setForm({ ...form, birthDate: v })} />
              </div>

              {/* 性别 + 时辰 + 分钟 三列 */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
                  <div className="flex gap-1.5">
                    {['male', 'female'].map(g => (
                      <button key={g} onClick={() => setForm({ ...form, gender: g })}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                          form.gender === g
                            ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                        }`}>
                        {g === 'male' ? '男' : '女'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">时辰</label>
                  <select value={form.birthHour} onChange={(e) => setForm({ ...form, birthHour: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center] pr-8">
                    {[23,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22].map(h => (
                      <option key={h} value={h}>{h}时</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分钟</label>
                  <select value={form.birthMinute} onChange={(e) => setForm({ ...form, birthMinute: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center] pr-8">
                    {Array.from({length: 12}, (_, i) => String(i * 5).padStart(2, '0')).map(m => (
                      <option key={m} value={parseInt(m)}>{m}分</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading || !form.birthDate}
              className="mt-6 w-full bg-amber-600 text-white py-3 rounded-xl font-medium hover:bg-amber-700 disabled:opacity-50 transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? '分析中...' : '开始分析'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== 自定义日期选择器 =====================
function DatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const now = new Date();
  const [year, setYear] = useState(value ? parseInt(value.split('-')[0]) : 2000);
  const [month, setMonth] = useState(value ? parseInt(value.split('-')[1]) : 6);
  const [day, setDay] = useState(value ? parseInt(value.split('-')[2]) : 15);
  const [open, setOpen] = useState(false);

  // 当月天数
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  // 更新日期
  const updateDate = (y: number, m: number, d: number) => {
    const clampedD = Math.min(d, new Date(y, m, 0).getDate());
    setYear(y); setMonth(m); setDay(clampedD);
    onChange(`${y}-${String(m).padStart(2, '0')}-${String(clampedD).padStart(2, '0')}`);
  };

  const displayText = value
    ? `${year}年${month}月${day}日`
    : '请选择出生日期';

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-amber-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all">
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>{displayText}</span>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-4 animate-in">
          {/* 年月快速选择 */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <button onClick={() => updateDate(year - 1, month, day)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-50 text-gray-500 transition-colors" title="上一年">‹‹</button>
            <button onClick={() => { const m = month === 1 ? 12 : month - 1; const y = month === 1 ? year - 1 : year; updateDate(y, m, day); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-50 text-gray-500 transition-colors">‹</button>
            <select value={year} onChange={(e) => updateDate(parseInt(e.target.value), month, day)}
              className="flex-1 text-center font-semibold text-sm bg-gray-50 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer appearance-none">
              {Array.from({length: now.getFullYear() - 1900 + 1}, (_, i) => now.getFullYear() - i).map(y => (
                <option key={y} value={y}>{y}年</option>
              ))}
            </select>
            <select value={month} onChange={(e) => updateDate(year, parseInt(e.target.value), day)}
              className="flex-1 text-center font-semibold text-sm bg-gray-50 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer appearance-none">
              {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{m}月</option>
              ))}
            </select>
            <button onClick={() => { const m = month === 12 ? 1 : month + 1; const y = month === 12 ? year + 1 : year; updateDate(y, m, day); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-50 text-gray-500 transition-colors">›</button>
            <button onClick={() => updateDate(year + 1, month, day)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-50 text-gray-500 transition-colors" title="下一年">››</button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 mb-1">
            {weekDays.map(d => (
              <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* 日期网格 */}
          <div className="grid grid-cols-7 gap-0.5">
            {/* 空白占位 */}
            {Array.from({length: firstDayOfWeek}).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {/* 日期 */}
            {Array.from({length: daysInMonth}, (_, i) => i + 1).map(d => {
              const isSelected = d === day;
              const isToday = d === now.getDate() && month === now.getMonth() + 1 && year === now.getFullYear();
              return (
                <button key={d} onClick={() => { updateDate(year, month, d); setOpen(false); }}
                  className={`w-full aspect-square flex items-center justify-center rounded-lg text-sm transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white font-bold shadow-md'
                      : isToday
                        ? 'bg-amber-50 text-amber-700 font-medium'
                        : 'hover:bg-amber-50 text-gray-700'
                  }`}>
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultView({ result, onRecalculate }: { result: any; onRecalculate: () => void }) {
  return (
    <div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          性格分析结果
        </h2>

        {/* 四柱 */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: '年柱', value: result.yearPillar, naYin: result.yearNaYin },
            { label: '月柱', value: result.monthPillar, naYin: result.monthNaYin },
            { label: '日柱', value: result.dayPillar, naYin: result.dayNaYin },
            { label: '时柱', value: result.hourPillar, naYin: result.hourNaYin },
          ].map((pillar, i) => (
            <div key={i} className="text-center bg-amber-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">{pillar.label}</div>
              <div className="text-2xl font-bold text-amber-800">{pillar.value}</div>
              <div className="text-xs text-gray-500 mt-1">{pillar.naYin}</div>
            </div>
          ))}
        </div>

        {/* 日主 */}
        <div className="bg-indigo-50 rounded-xl p-4 mb-4">
          <span className="text-sm text-gray-600">日主：</span>
          <span className="text-xl font-bold text-indigo-700">{result.dayStem}</span>
          <span className="text-sm text-gray-500 ml-2">（{result.interpretations?.dayMasterWuXing || ''}）</span>
        </div>

        {/* 五运六气 */}
        {result.wuYunLiuQi && (
          <div className="space-y-3 mb-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <h3 className="text-sm font-semibold text-green-800 mb-2">🌿 五运六气 · 先天体质</h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-white/60 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-500">五运</div>
                  <div className="text-lg font-bold text-green-700">{result.wuYunLiuQi.wuYun.yun}运</div>
                  <div className="text-xs text-gray-400">{result.wuYunLiuQi.wuYun.excess}</div>
                </div>
                <div className="bg-white/60 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-500">司天</div>
                  <div className="text-lg font-bold text-green-700">{result.wuYunLiuQi.liuQi.siTian}</div>
                  <div className="text-xs text-gray-400">{result.wuYunLiuQi.liuQi.zaiQuan}在泉</div>
                </div>
              </div>
              <p className="text-xs text-green-700 leading-relaxed">{result.wuYunLiuQi.wuYun.tiZhi}</p>
            </div>
            {/* 毛病结论 */}
            {result.wuYunLiuQi.conclusion && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                <h3 className="text-sm font-semibold text-amber-800 mb-2">⚠️ 易发问题</h3>
                <p className="text-xs text-amber-900 leading-relaxed whitespace-pre-line">{result.wuYunLiuQi.conclusion}</p>
              </div>
            )}
            {result.wuYunLiuQi.herbs && (
              <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-4 border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">💊 参考用药</h3>
                <p className="text-xs text-blue-900 leading-relaxed">{result.wuYunLiuQi.herbs}</p>
                <p className="text-[10px] text-blue-400 mt-2">⚠️ 仅供学习参考，实际用药请咨询专业中医师</p>
              </div>
            )}
          </div>
        )}

        {/* 五行 */}
        {result.fiveElements && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">五行分布</h3>
            <div className="flex gap-3">
              {Object.entries(result.fiveElements).map(([wx, count]: any) => (
                <div key={wx} className="flex-1 text-center bg-gray-50 rounded-xl p-3">
                  <div className="text-lg font-bold" style={{
                    color: ({木: '#10b981', 火: '#f59e0b', 土: '#8B7355', 金: '#f59e0b', 水: '#3b82f6'} as Record<string, string>)[wx as string] || '#666'
                  }}>{wx}</div>
                  <div className="text-xs text-gray-500">{'●'.repeat(Math.min(count, 4))}{'○'.repeat(Math.max(0, 4 - count))}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 用神忌神 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="text-xs text-gray-500">用神</div>
            <div className="text-lg font-bold text-green-700">{result.yongShen}</div>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <div className="text-xs text-gray-500">忌神</div>
            <div className="text-lg font-bold text-red-700">{result.jiShen}</div>
          </div>
        </div>

        {/* 大运 */}
        {result.daYun && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">大运走势</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {result.daYun.map((dy: any, i: number) => (
                <div key={i} className="flex-shrink-0 bg-gray-50 rounded-xl p-3 text-center min-w-[80px]">
                  <div className="text-xs text-gray-500">{dy.ageStart}-{dy.ageEnd}岁</div>
                  <div className="text-lg font-bold text-gray-800">{dy.pillar}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6 justify-center">
          <button onClick={onRecalculate} className="text-gray-500 hover:text-gray-700 text-sm">
            重新分析
          </button>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
            返回仪表盘
          </Link>
        </div>
      </div>
    </div>
  );
}
