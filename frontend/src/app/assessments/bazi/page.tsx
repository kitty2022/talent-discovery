'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Moon, ArrowLeft, Sparkles, ChevronRight } from 'lucide-react';

/* ========================================================
   Auwa 侘寂风格 — 克制 · 留白 · 极简
   ======================================================== */

const THEME = {
  // Auwa 配色
  text: '#2C2C2C',
  textSoft: '#8C8C8C',
  cardBg: '#FFFFFF',
  bg: '#FAFAF8',
  // 兼容旧属性名（映射到 Auwa 色值）
  peach: '#2C2C2C',
  peachLight: '#F5F3EF',
  peachBg: '#FAFAF8',
  teal: '#5B7B8C',
  tealLight: '#EEF2F4',
  gold: '#2C2C2C',
  goldLight: '#F5F3EF',
  cream: '#FAFAF8',
  shadow: 'rgba(0,0,0,0.04)',
};

// ===================== 时辰数据 =====================
const SHI_CHEN = [
  { id: 0, name: '子时', emoji: '🌙', range: '23:00 — 00:59', desc: '夜半·鼠时', hour: 23 },
  { id: 1, name: '丑时', emoji: '🐂', range: '01:00 — 02:59', desc: '鸡鸣·牛时', hour: 1 },
  { id: 2, name: '寅时', emoji: '🐯', range: '03:00 — 04:59', desc: '平旦·虎时', hour: 3 },
  { id: 3, name: '卯时', emoji: '🐰', range: '05:00 — 06:59', desc: '日出·兔时', hour: 5 },
  { id: 4, name: '辰时', emoji: '🐲', range: '07:00 — 08:59', desc: '食时·龙时', hour: 7 },
  { id: 5, name: '巳时', emoji: '🐍', range: '09:00 — 10:59', desc: '隅中·蛇时', hour: 9 },
  { id: 6, name: '午时', emoji: '🐴', range: '11:00 — 12:59', desc: '日中·马时', hour: 11 },
  { id: 7, name: '未时', emoji: '🐏', range: '13:00 — 14:59', desc: '日昳·羊时', hour: 13 },
  { id: 8, name: '申时', emoji: '🐵', range: '15:00 — 16:59', desc: '晡时·猴时', hour: 15 },
  { id: 9, name: '酉时', emoji: '🐔', range: '17:00 — 18:59', desc: '日入·鸡时', hour: 17 },
  { id: 10, name: '戌时', emoji: '🐶', range: '19:00 — 20:59', desc: '黄昏·狗时', hour: 19 },
  { id: 11, name: '亥时', emoji: '🐷', range: '21:00 — 22:59', desc: '人定·猪时', hour: 21 },
];

const MONTH_NAMES = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六'];

// ===================== 主页面 =====================
export default function BaZiPage() {
  const router = useRouter();
  const [step, setStep] = useState<'intro' | 'date' | 'hour' | 'gender' | 'loading' | 'result'>('intro');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // ---------- 表单数据 ----------
  const [birthYear, setBirthYear] = useState(2000);
  const [birthMonth, setBirthMonth] = useState(6);
  const [birthDay, setBirthDay] = useState(15);
  const [birthHour, setBirthHour] = useState(8);
  const [birthMinute, setBirthMinute] = useState(0);
  const [gender, setGender] = useState<'male' | 'female' | null>(null);

  // 日期有效性
  const daysInMonth = new Date(birthYear, birthMonth, 0).getDate();

  // 页面加载时检查登录
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }
    api.get('/bazi/result').then(res => {
      setResult(res.data.bazi);
      setStep('result');
    }).catch(() => {});
  }, [router]);

  // ---------- 确定 ----------
  const handleCalculate = async () => {
    if (!gender) return;
    setStep('loading');
    setLoading(true);
    const birthDateStr = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
    try {
      const res = await api.post('/bazi/calculate', {
        birthDate: birthDateStr,
        birthHour: birthHour,
        birthMinute: birthMinute,
        gender,
      });
      setResult(res.data.bazi);
      setStep('result');
    } catch (err: any) {
      alert(err.response?.data?.error || '排盘失败');
      setStep('gender');
    } finally {
      setLoading(false);
    }
  };

  // ---------- 进度 ----------
  const steps = ['date', 'hour', 'gender'] as const;
  const currentStepIndex = steps.indexOf(step as any);

  const canProceedFromDate = birthYear > 0 && birthMonth > 0 && birthDay > 0;

  return (
    <div className="min-h-screen" style={{ background: THEME.cream }}>
      {/* --- Navigation --- */}
      {step !== 'intro' && step !== 'loading' && (
        <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: THEME.cream }}>
          <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
            <button onClick={() => {
              if (step === 'date') setStep('intro');
              else if (step === 'hour') setStep('date');
              else if (step === 'gender') setStep('hour');
              else if (step === 'result') setStep('intro');
            }} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
              <ArrowLeft className="w-5 h-5" style={{ color: THEME.text }} />
            </button>

            {/* 步骤点 */}
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${
                  i <= currentStepIndex ? 'w-6' : 'w-1.5'
                }`} style={{
                  background: i <= currentStepIndex
                    ? `linear-gradient(90deg, ${THEME.peach}, ${THEME.gold})`
                    : '#E8DDD8',
                }} />
              ))}
            </div>

            <div className="w-9" />
          </div>
        </nav>
      )}

      {/* ==================== INTRO ==================== */}
      {step === 'intro' && (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
          {/* 装饰：弥散光晕 */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${THEME.peach}, transparent 70%)` }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${THEME.teal}, transparent 70%)` }} />

          <div className="max-w-sm w-full text-center relative">
            {/* 装饰图标 */}
            <div className="w-24 h-24 rounded-3xl mx-auto mb-8 flex items-center justify-center relative"
              style={{
                background: `linear-gradient(135deg, ${THEME.peachLight}, ${THEME.goldLight})`,
                boxShadow: `0 12px 40px ${THEME.shadow}`,
              }}>
              <Moon className="w-10 h-10" style={{ color: THEME.peach }} />
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: THEME.goldLight }}>
                <Sparkles className="w-3.5 h-3.5" style={{ color: THEME.gold }} />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-3 tracking-tight" style={{ color: THEME.text }}>
              先天性格解码
            </h1>
            <p className="text-base leading-relaxed mb-2" style={{ color: THEME.textSoft }}>
              输入你的出生信息
            </p>
            <p className="text-sm mb-10" style={{ color: THEME.textSoft }}>
              通过东方智慧，探索你与生俱来的特质
            </p>

            <button onClick={() => setStep('date')}
              className="w-full px-8 py-4 rounded-2xl text-white font-medium text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${THEME.peach}, ${THEME.gold})`,
                boxShadow: `0 8px 24px ${THEME.peach}44`,
              }}>
              开始探索
            </button>

            <p className="text-xs mt-4" style={{ color: THEME.textSoft + '99' }}>
              大约 1 分钟 · 仅需填写一次
            </p>
            <p className="mt-6 text-xs tracking-[2px]" style={{ color: THEME.textSoft }}>
              <Link href="/dashboard" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>返回仪表盘</Link>
            </p>
          </div>
        </div>
      )}

      {/* ==================== DATE STEP ==================== */}
      {step === 'date' && (
        <div className="min-h-screen flex items-start pt-20 pb-8 px-5">
          <div className="max-w-sm w-full mx-auto" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
            {/* 问题 */}
            <div className="mb-6 text-center">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                style={{ background: THEME.peachLight, color: THEME.peach }}>
                第 1 步
              </div>
              <h2 className="text-2xl font-bold" style={{ color: THEME.text }}>
                你的出生日期是？
              </h2>
            </div>

            {/* 卡片 */}
            <div className="rounded-3xl p-6" style={{
              background: THEME.cardBg,
              boxShadow: `0 4px 24px ${THEME.shadow}`,
              border: `1px solid rgba(180, 140, 120, 0.06)`,
            }}>
              {/* 年份 + 月份 行 */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {/* 年份 */}
                <div>
                  <label className="block text-xs font-medium mb-1.5 px-1" style={{ color: THEME.textSoft }}>年份</label>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setBirthYear(y => y - 1)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
                      style={{ background: THEME.peachLight, color: THEME.peach }}>
                      ‹
                    </button>
                    <select value={birthYear} onChange={e => setBirthYear(parseInt(e.target.value))}
                      className="flex-1 text-center font-semibold text-sm outline-none rounded-xl px-2 py-2 cursor-pointer appearance-none"
                      style={{
                        background: THEME.peachLight,
                        color: THEME.text,
                      }}>
                      {Array.from({ length: 90 }, (_, i) => new Date().getFullYear() - i).map(y => (
                        <option key={y} value={y}>{y}年</option>
                      ))}
                    </select>
                    <button onClick={() => setBirthYear(y => Math.min(y + 1, new Date().getFullYear()))}
                      className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
                      style={{ background: THEME.peachLight, color: THEME.peach }}>
                      ›
                    </button>
                  </div>
                </div>

                {/* 月份 */}
                <div>
                  <label className="block text-xs font-medium mb-1.5 px-1" style={{ color: THEME.textSoft }}>月份</label>
                  <select value={birthMonth} onChange={e => {
                    const m = parseInt(e.target.value);
                    setBirthMonth(m);
                    if (birthDay > new Date(birthYear, m, 0).getDate()) {
                      setBirthDay(new Date(birthYear, m, 0).getDate());
                    }
                  }}
                    className="w-full text-center font-semibold text-sm outline-none rounded-xl px-2 py-2 cursor-pointer appearance-none"
                    style={{
                      background: THEME.tealLight,
                      color: THEME.teal,
                    }}>
                    {MONTH_NAMES.map((name, i) => (
                      <option key={i} value={i + 1}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 日历网格 */}
              <div>
                <div className="grid grid-cols-7 mb-1">
                  {WEEK_DAYS.map(d => (
                    <div key={d} className="text-center text-xs py-1.5 font-medium" style={{ color: THEME.textSoft + '99' }}>
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {Array.from({ length: new Date(birthYear, birthMonth - 1, 1).getDay() }).map((_, i) => (
                    <div key={`e-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                    const isSelected = d === birthDay;
                    const isToday = d === new Date().getDate() && birthMonth === new Date().getMonth() + 1 && birthYear === new Date().getFullYear();
                    return (
                      <button key={d} onClick={() => setBirthDay(d)}
                        className={`w-full aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                          isSelected ? 'text-white shadow-md' : isToday ? '' : 'hover:scale-105'
                        }`}
                        style={{
                          background: isSelected
                            ? `linear-gradient(135deg, ${THEME.peach}, ${THEME.gold})`
                            : isToday
                              ? THEME.peachLight
                              : 'transparent',
                          color: isSelected ? '#fff' : isToday ? THEME.peach : THEME.text,
                        }}>
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 分钟选择 */}
              <div className="mt-5 pt-4 border-t" style={{ borderColor: THEME.peachLight }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: THEME.textSoft }}>出生分钟</span>
                  <div className="flex items-center gap-2">
                    <select value={birthMinute} onChange={e => setBirthMinute(parseInt(e.target.value))}
                      className="text-sm font-medium outline-none rounded-xl px-3 py-1.5 cursor-pointer appearance-none"
                      style={{ background: THEME.peachLight, color: THEME.text }}>
                      {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')).map(m => (
                        <option key={m} value={parseInt(m)}>{m}分</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 继续按钮 */}
            <button onClick={() => canProceedFromDate && setStep('hour')}
              disabled={!canProceedFromDate}
              className="w-full mt-5 py-3.5 rounded-2xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-30"
              style={{
                background: canProceedFromDate
                  ? `linear-gradient(135deg, ${THEME.peach}, ${THEME.gold})`
                  : '#E8DDD8',
                boxShadow: canProceedFromDate ? `0 6px 20px ${THEME.peach}33` : 'none',
              }}>
              继续 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== HOUR STEP ==================== */}
      {step === 'hour' && (
        <div className="min-h-screen flex items-start pt-20 pb-8 px-5">
          <div className="max-w-sm w-full mx-auto" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
            <div className="mb-6 text-center">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                style={{ background: THEME.tealLight, color: THEME.teal }}>
                第 2 步
              </div>
              <h2 className="text-2xl font-bold" style={{ color: THEME.text }}>
                出生在什么时辰？
              </h2>
              <p className="text-sm mt-1.5" style={{ color: THEME.textSoft }}>
                古代将一天分为十二个时辰
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SHI_CHEN.map(sc => {
                const isSelected = sc.id === Math.floor(birthHour / 2) % 12;
                return (
                  <button key={sc.id} onClick={() => {
                    setBirthHour(sc.hour);
                    setBirthMinute(0);
                  }}
                    className={`rounded-2xl p-4 text-left transition-all duration-200 ${
                      isSelected ? 'shadow-md border-0' : 'border'
                    }`}
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${THEME.tealLight}, #fff)`
                        : THEME.cardBg,
                      borderColor: isSelected ? THEME.teal : 'rgba(180, 140, 120, 0.08)',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: isSelected ? `0 4px 16px ${THEME.teal}22` : 'none',
                    }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{sc.emoji}</span>
                      <span className="text-base font-bold" style={{ color: isSelected ? THEME.teal : THEME.text }}>
                        {sc.name}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: THEME.textSoft }}>{sc.range}</div>
                    <div className="text-xs mt-0.5" style={{ color: THEME.textSoft + '99' }}>{sc.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* 已选的分钟微调 */}
            <div className="mt-4 rounded-2xl p-4 flex items-center justify-between"
              style={{ background: THEME.peachLight }}>
              <span className="text-sm" style={{ color: THEME.text }}>
                已选：<strong>{birthHour}时{birthMinute}分</strong>
              </span>
              <select value={birthMinute} onChange={e => setBirthMinute(parseInt(e.target.value))}
                className="text-sm font-medium outline-none rounded-xl px-3 py-1.5 cursor-pointer"
                style={{ background: THEME.cardBg, color: THEME.text }}>
                {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')).map(m => (
                  <option key={m} value={parseInt(m)}>{m}分</option>
                ))}
              </select>
            </div>

            <button onClick={() => setStep('gender')}
              className="w-full mt-4 py-3.5 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${THEME.teal}, #6B9AAC)`,
                color: '#fff',
                boxShadow: `0 6px 20px ${THEME.teal}33`,
              }}>
              继续 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== GENDER STEP ==================== */}
      {step === 'gender' && (
        <div className="min-h-screen flex items-start pt-20 pb-8 px-5">
          <div className="max-w-sm w-full mx-auto" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
            <div className="mb-6 text-center">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                style={{ background: THEME.goldLight, color: THEME.gold }}>
                第 3 步
              </div>
              <h2 className="text-2xl font-bold" style={{ color: THEME.text }}>
                你的性别是？
              </h2>
              <p className="text-sm mt-1.5" style={{ color: THEME.textSoft }}>
                八字排盘需要结合性别进行分析
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'male' as const, label: '男', emoji: '🧑', desc: '乾造' },
                { value: 'female' as const, label: '女', emoji: '👩', desc: '坤造' },
              ].map(g => {
                const isSelected = gender === g.value;
                return (
                  <button key={g.value} onClick={() => setGender(g.value)}
                    className={`rounded-3xl p-8 text-center transition-all duration-300 ${
                      isSelected ? 'shadow-lg' : ''
                    }`}
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${THEME.peach}, #E49A80)`
                        : THEME.cardBg,
                      boxShadow: isSelected
                        ? `0 12px 32px ${THEME.peach}44`
                        : `0 2px 12px ${THEME.shadow}`,
                      border: isSelected ? 'none' : `1px solid rgba(180, 140, 120, 0.06)`,
                      transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                    }}>
                    <div className="text-5xl mb-4">{g.emoji}</div>
                    <div className="text-2xl font-bold mb-1" style={{ color: isSelected ? '#fff' : THEME.text }}>
                      {g.label}
                    </div>
                    <div className="text-sm" style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : THEME.textSoft }}>
                      {g.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            <button onClick={handleCalculate} disabled={!gender}
              className="w-full mt-6 py-4 rounded-2xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-30"
              style={{
                background: gender
                  ? `linear-gradient(135deg, ${THEME.peach}, ${THEME.gold})`
                  : '#E8DDD8',
                boxShadow: gender ? `0 8px 24px ${THEME.peach}44` : 'none',
              }}>
              <Sparkles className="w-5 h-5" />
              开始分析
            </button>
          </div>
        </div>
      )}

      {/* ==================== LOADING ==================== */}
      {step === 'loading' && (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
          {/* 装饰光晕 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 rounded-full animate-pulse" style={{
              background: `radial-gradient(circle, ${THEME.peach}22, transparent 70%)`,
              animationDuration: '3s',
            }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 rounded-full animate-pulse" style={{
              background: `radial-gradient(circle, ${THEME.gold}15, transparent 70%)`,
              animationDuration: '4s',
              animationDelay: '1s',
            }} />
          </div>

          <div className="text-center relative z-10">
            {/* 脉冲圈 */}
            <div className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ background: THEME.peach, animationDuration: '2s' }} />
              <div className="absolute inset-2 rounded-full animate-ping opacity-30"
                style={{ background: THEME.gold, animationDuration: '2.5s', animationDelay: '0.5s' }} />
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${THEME.peach}, ${THEME.gold})` }}>
                <Moon className="w-7 h-7 text-white" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3" style={{ color: THEME.text }}>
              正在解读你的先天密码
            </h3>
            <div className="flex justify-center gap-1">
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: THEME.peach, animationDelay: '0s' }} />
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: THEME.gold, animationDelay: '0.15s' }} />
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: THEME.teal, animationDelay: '0.3s' }} />
            </div>
          </div>
        </div>
      )}

      {/* ==================== RESULT ==================== */}
      {step === 'result' && result && (
        <ResultView result={result} onRecalculate={() => {
          setStep('date');
          setResult(null);
        }} />
      )}
    </div>
  );
}

// ===================== 结果页 =====================
function ResultView({ result, onRecalculate }: { result: any; onRecalculate: () => void }) {
  return (
    <div className="pt-14 pb-12 px-5 min-h-screen" style={{ background: '#FAFAF8' }}>
      <div className="max-w-lg mx-auto" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
        {/* 结果头部 */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: '#2C2C2C' }}>性格分析结果</h2>
          <p className="text-sm mt-1" style={{ color: '#8C8C8C' }}>你的先天性格特质解读</p>
        </div>

        {/* 四柱 */}
        <div className="p-6 mb-4" style={{
          background: '#FFFFFF',
          border: '1px solid #E5E0D8',
        }}>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '年柱', value: result.yearPillar, naYin: result.yearNaYin },
              { label: '月柱', value: result.monthPillar, naYin: result.monthNaYin },
              { label: '日柱', value: result.dayPillar, naYin: result.dayNaYin },
              { label: '时柱', value: result.hourPillar, naYin: result.hourNaYin },
            ].map((pillar, i) => (
              <div key={i} className="text-center p-3" style={{ background: '#F5F3EF' }}>
                <div className="text-xs mb-1" style={{ color: '#8C8C8C' }}>{pillar.label}</div>
                <div className="text-lg font-semibold" style={{ color: '#2C2C2C' }}>{pillar.value}</div>
                <div className="text-[10px] mt-0.5" style={{ color: '#8C8C8C' }}>{pillar.naYin}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 日主 */}
        <div className="p-5 mb-4 flex items-center gap-4" style={{ background: '#2C2C2C' }}>
          <div className="w-14 h-14 flex items-center justify-center text-xl font-bold text-white"
            style={{ background: 'rgba(255,255,255,0.1)' }}>
            {result.dayStem}
          </div>
          <div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>日主</div>
            <div className="text-lg font-bold text-white">{result.dayStem}</div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{result.interpretations?.dayMasterWuXing || ''}</div>
          </div>
        </div>

        {/* 五运六气 */}
        {result.wuYunLiuQi && (
          <div className="space-y-3 mb-4">
            <div className="p-5" style={{ background: '#F5F3EF' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#2C2C2C' }}>🌿 五运六气 · 先天体质</h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="p-3 text-center" style={{ background: '#FAFAF8' }}>
                  <div className="text-xs" style={{ color: '#8C8C8C' }}>五运</div>
                  <div className="text-lg font-semibold" style={{ color: '#2C2C2C' }}>{result.wuYunLiuQi.wuYun.yun}运</div>
                  <div className="text-xs" style={{ color: '#8C8C8C' }}>{result.wuYunLiuQi.wuYun.excess}</div>
                </div>
                <div className="p-3 text-center" style={{ background: '#FAFAF8' }}>
                  <div className="text-xs" style={{ color: '#8C8C8C' }}>司天</div>
                  <div className="text-lg font-semibold" style={{ color: '#2C2C2C' }}>{result.wuYunLiuQi.liuQi.siTian}</div>
                  <div className="text-xs" style={{ color: '#8C8C8C' }}>{result.wuYunLiuQi.liuQi.zaiQuan}在泉</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#8C8C8C' }}>{result.wuYunLiuQi.wuYun.tiZhi}</p>
            </div>

            {result.wuYunLiuQi.conclusion && (
              <div className="p-5" style={{ background: '#F5F3EF' }}>
                <h3 className="text-sm font-semibold mb-2" style={{ color: '#B85C3A' }}>⚠️ 易发问题</h3>
                <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: '#8C8C8C' }}>{result.wuYunLiuQi.conclusion}</p>
              </div>
            )}

            {result.wuYunLiuQi.herbs && (
              <div className="p-5" style={{ background: '#F5F3EF' }}>
                <h3 className="text-sm font-semibold mb-2" style={{ color: '#2C2C2C' }}>💊 参考用药</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#8C8C8C' }}>{result.wuYunLiuQi.herbs}</p>
                <p className="text-[10px] mt-2" style={{ color: '#B0A8A0' }}>⚠️ 仅供学习参考，实际用药请咨询专业中医师</p>
              </div>
            )}
          </div>
        )}

        {/* 五行 */}
        {result.fiveElements && (
          <div className="p-5 mb-4" style={{ background: '#FFFFFF', border: '1px solid #E5E0D8' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#2C2C2C' }}>五行分布</h3>
            <div className="flex gap-3">
              {Object.entries(result.fiveElements).map(([wx, count]: any) => {
                const wxColors: Record<string, string> = {
                  木: '#2C2C2C', 火: '#8C8C8C', 土: '#B0A8A0', 金: '#2C2C2C', 水: '#5B7B8C',
                };
                return (
                  <div key={wx} className="flex-1 text-center p-3" style={{ background: '#F5F3EF' }}>
                    <div className="text-lg font-semibold" style={{ color: wxColors[wx as string] || '#666' }}>{wx}</div>
                    <div className="text-xs mt-1" style={{ color: '#8C8C8C' }}>
                      {'●'.repeat(Math.min(count as number, 4))}{'○'.repeat(Math.max(0, 4 - (count as number)))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 用神忌神 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-4 text-center" style={{ background: '#F5F3EF' }}>
            <div className="text-xs" style={{ color: '#8C8C8C' }}>用神</div>
            <div className="text-lg font-semibold mt-1" style={{ color: '#2C2C2C' }}>{result.yongShen}</div>
          </div>
          <div className="p-4 text-center" style={{ background: '#F5F3EF' }}>
            <div className="text-xs" style={{ color: '#8C8C8C' }}>忌神</div>
            <div className="text-lg font-semibold mt-1" style={{ color: '#B85C3A' }}>{result.jiShen}</div>
          </div>
        </div>

        {/* 大运走势 */}
        {result.daYun && (
          <div className="p-5 mb-6" style={{ background: '#FFFFFF', border: '1px solid #E5E0D8' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#2C2C2C' }}>大运走势</h3>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {result.daYun.map((dy: any, i: number) => (
                <div key={i} className="flex-shrink-0 p-3 text-center min-w-[76px]" style={{ background: '#F5F3EF' }}>
                  <div className="text-xs" style={{ color: '#8C8C8C' }}>{dy.ageStart}-{dy.ageEnd}岁</div>
                  <div className="text-base font-semibold mt-0.5" style={{ color: '#2C2C2C' }}>{dy.pillar}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4">
          <button onClick={onRecalculate}
            className="px-6 py-3 text-xs tracking-[1px] transition-all hover:opacity-60"
            style={{ background: '#F5F3EF', color: '#2C2C2C' }}>
            重新分析
          </button>
          <Link href="/dashboard"
            className="px-6 py-3 text-xs tracking-[2px] text-white transition-all hover:opacity-80"
            style={{ background: '#2C2C2C' }}>
            返回仪表盘
          </Link>
        </div>
      </div>
    </div>
  );
}
