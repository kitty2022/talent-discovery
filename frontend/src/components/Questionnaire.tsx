'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options?: any[];
  type?: string;
  dimension?: string;
  direction?: string;
}

interface QuestionnaireProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  questions: Question[];
  renderQuestion: (q: Question, index: number, answer: any, onAnswer: (val: any) => void) => React.ReactNode;
  onSubmit: (answers: any[]) => Promise<void>;
  onBack: () => void;
  resultView?: React.ReactNode;
  isCompleted?: boolean;
}

export default function Questionnaire({
  title, icon, color, questions, renderQuestion, onSubmit, onBack, resultView, isCompleted,
}: QuestionnaireProps) {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [answers, setAnswers] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAnswer = (val: any) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = { questionId: questions[currentQ].id, ...val };
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (!answers[currentQ]) { setError('请先回答本题'); return; }
    setError('');
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      handleSubmit();
    }
  };

  const prevQuestion = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (answers.length < questions.length) { setError('请回答所有题目'); return; }
    setSubmitting(true);
    setError('');
    try {
      await onSubmit(answers);
      setStep('result');
    } catch (err: any) {
      setError(err.response?.data?.error || '提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (isCompleted || step === 'result') {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
            <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            {icon}
            <span className="font-semibold">{title}</span>
          </div>
        </nav>
        <div className="max-w-3xl mx-auto px-4 py-12">
          {resultView || (
            <div className="text-center bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">测评已完成</h2>
              <p className="text-gray-500">感谢你的参与，结果已保存</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          <div className={`w-20 h-20 rounded-2xl ${color} flex items-center justify-center mx-auto mb-6`}>
            {icon}
          </div>
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <p className="text-gray-500 mb-2">共 {questions.length} 题</p>
          <p className="text-gray-400 text-sm mb-8">请根据你的真实想法回答，没有对错之分</p>
          <button
            onClick={() => setStep('quiz')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            开始测评
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          {icon}
          <span className="font-semibold">{title}</span>
          <span className="ml-auto text-sm text-gray-400">{currentQ + 1}/{questions.length}</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-400 mb-2">第 {currentQ + 1} 题</div>
          <h2 className="text-xl font-semibold mb-6">{q.text}</h2>

          {renderQuestion(q, currentQ, answers[currentQ], handleAnswer)}

          {error && <div className="text-red-500 text-sm mt-4">{error}</div>}

          <div className="flex justify-between mt-8">
            <button
              onClick={prevQuestion}
              disabled={currentQ === 0}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 disabled:opacity-30 transition-all flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> 上一题
            </button>
            <button
              onClick={nextQuestion}
              disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-1 shadow-lg shadow-indigo-200"
            >
              {currentQ < questions.length - 1 ? '下一题' : submitting ? '提交中...' : '完成'}
              {currentQ < questions.length - 1 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
