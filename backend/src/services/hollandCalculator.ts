/**
 * 霍兰德职业测评计分器（行为版）
 *
 * 每题 A=3分, B=1分, C=0分
 * 每维度 2-3 题，结果归一化为百分比 0-100
 */

export interface HollandAnswer {
  questionId: number;
  dimension: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  score: number;   // 3 | 1 | 0
  label: string;   // 'A' | 'B' | 'C'
}

export interface HollandResult {
  type: string;       // 三码，如 "EIS"
  dimensions: Record<string, number>;  // 百分比分数
  rawScores: Record<string, number>;   // 原始分数
  description: string;
}

// 每个维度的最大原始分数（题数 × 3）
const MAX_SCORES: Record<string, number> = {
  R: 9, I: 9, A: 6, S: 9, E: 6, C: 6,
};

const DIM_NAMES: Record<string, string> = {
  R: '现实型（执行）', I: '研究型（分析）',
  A: '艺术型（创造）', S: '社会型（共情）',
  E: '企业型（影响）', C: '常规型（结构）',
};

const DIM_DESCRIPTIONS: Record<string, string> = {
  R: '你倾向于通过动手操作和具体行动来完成任务。你喜欢看到实实在在的成果，擅长工具使用和现场执行。',
  I: '你倾向于通过数据分析和逻辑推理来理解问题。你喜欢深度钻研和系统思考，享受探索未知。',
  A: '你倾向于通过创意和审美来表达自己。你喜欢打破常规，追求新颖和美感的解决方案。',
  S: '你倾向于通过理解和帮助他人来建立连接。你善于倾听共情，关注团队氛围和每个人的感受。',
  E: '你倾向于通过影响和带领他人来推动事情发生。你目标明确，敢于承担风险，享受挑战。',
  C: '你倾向于通过规则和流程来保证效率和品质。你做事有条理，注重细节和准确性。',
};

export function calculateHolland(answers: HollandAnswer[]): HollandResult {
  const rawScores: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  answers.forEach((a) => {
    if (a.dimension in rawScores) {
      rawScores[a.dimension] += a.score;
    }
  });

  // 归一化为百分比
  const dimensions: Record<string, number> = {};
  for (const dim of Object.keys(rawScores)) {
    dimensions[dim] = Math.round((rawScores[dim] / MAX_SCORES[dim]) * 100);
  }

  // 按百分比从高到低排序
  const sorted = Object.entries(dimensions).sort((a, b) => b[1] - a[1]);
  const topThree = sorted.slice(0, 3);
  const type = topThree.map(([d]) => d).join('');

  // 生成描述
  const description = topThree
    .map(([d, s]) => {
      return `**${DIM_NAMES[d] || d}**（${s}%）\n${DIM_DESCRIPTIONS[d] || ''}`;
    })
    .join('\n\n');

  return {
    type,
    dimensions,
    rawScores,
    description,
  };
}
