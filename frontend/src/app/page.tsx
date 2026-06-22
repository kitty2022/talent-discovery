'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Compass, Brain, Star, ArrowRight, BookOpen, Moon, BarChart3 } from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setMounted(true);
    setLoggedIn(!!localStorage.getItem('token'));
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      {/* 导航栏 */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              天赋星鉴
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {loggedIn ? (
              <Link
                href="/dashboard"
                className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                进入仪表盘
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                  登录
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  开始测评
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero 区 */}
      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            先天特质 × 行为科学 × 职业发展
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            发现你的
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              天赋优势
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            性格分析 · MBTI · 霍兰德 · 天赋发现
            <br />
            四大测评，从先天特质到职业方向，全面解码你的天赋优势
          </p>
          <div className="flex items-center justify-center gap-4">
            {loggedIn ? (
              <Link
                href="/dashboard"
                className="bg-indigo-600 text-white px-8 py-3.5 rounded-full text-lg font-medium hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center gap-2"
              >
                进入仪表盘 <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/register"
                  className="bg-indigo-600 text-white px-8 py-3.5 rounded-full text-lg font-medium hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center gap-2"
                >
                  开始探索天赋 <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-white text-gray-700 px-8 py-3.5 rounded-full text-lg font-medium border border-gray-200 hover:border-indigo-300 transition-all"
                >
                  已有报告
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 特色模块 */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">四大测评维度</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            先天命理揭示底层特质，行为科学识别真实能力，全方位规划职业发展
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Moon className="w-8 h-8" />,
                title: '性格分析',
                desc: '通过出生年月日时排盘，分析五行平衡、十神格局，解读先天性格特质',
                color: 'bg-amber-50 text-amber-600',
                bg: 'bg-amber-50/50',
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'MBTI 人格',
                desc: '经典 Myers-Briggs 类型指标，认清你的思维偏好与行为模式',
                color: 'bg-blue-50 text-blue-600',
                bg: 'bg-blue-50/50',
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: '霍兰德测评',
                desc: '60道行为选择题，基于真实行为而非主观兴趣，评估六维职业倾向',
                color: 'bg-rose-50 text-rose-600',
                bg: 'bg-rose-50/50',
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: '天赋发现',
                desc: '18道行为选择题，从创造力到商业力，发现你的核心天赋优势',
                color: 'bg-indigo-50 text-indigo-600',
                bg: 'bg-indigo-50/50',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`${item.bg} rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-100`}
              >
                <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 流程说明 */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">四步发现你的天赋</h2>
          <p className="text-gray-500 text-center mb-12">完成测评，获得你的个人天赋与职业发展报告</p>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: '性格分析', desc: '输入出生信息，了解先天特质' },
              { step: '02', title: '能力测评', desc: '参与 MBTI、霍兰德等行为测评' },
              { step: '03', title: '天赋发现', desc: '从八维天赋中找到你的核心优势' },
              { step: '04', title: '获取报告', desc: '生成个人天赋与职业发展报告' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-400 text-sm border-t border-gray-100">
        <p>天赋星鉴 · 发现你的天赋优势</p>
        <p className="mt-1">基于行为科学、优势理论与职业发展模型，仅供参考</p>
      </footer>
    </div>
  );
}
