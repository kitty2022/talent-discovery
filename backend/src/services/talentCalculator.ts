/**
 * 天赋发现测评计分器
 *
 * 每题 A=3分, B=1分, C=0分
 * 每维度 2-3 题，结果归一化为百分比 0-100
 */

export interface TalentAnswer {
  questionId: number;
  dimension: string;
  score: number;
  label: string;
}

export interface TalentResult {
  dimensions: Record<string, number>;   // 百分比分数
  rawScores: Record<string, number>;     // 原始分数
  topTalent: string;                     // 核心天赋
  topThree: { dimension: string; score: number }[];
  description: string;
}

// 每个维度的最大原始分数
const MAX_SCORES: Record<string, number> = {
  creativity: 6,   // 2题 × 3分
  expression: 9,   // 3题 × 3分
  research: 6,     // 2题 × 3分
  execution: 9,    // 3题 × 3分
  leadership: 6,   // 2题 × 3分
  business: 6,     // 2题 × 3分
  service: 6,      // 2题 × 3分
  growth: 6,       // 2题 × 3分
};

const DIM_NAMES: Record<string, string> = {
  creativity: '创造力', expression: '表达力', research: '研究力',
  execution: '执行力', leadership: '领导力', business: '商业力',
  service: '服务力', growth: '成长力',
};

const DIM_DESCRIPTIONS: Record<string, string> = {
  creativity: '你擅长从无到有创造新事物，在空白处看到可能性。你思维活跃，善于提出新想法和新方案。',
  expression: '你擅长用语言和文字传递思想，你的表达有感染力，能影响和带动他人。',
  research: '你擅长抽丝剥茧式地分析问题，喜欢追根究底，能发现别人忽略的规律和联系。',
  execution: '你擅长把想法变成现实，行动力强，做事靠谱，是团队中值得信赖的交付者。',
  leadership: '你擅长凝聚团队和推动方向，在需要做决策和承担责任时能站出来。',
  business: '你擅长发现商业机会和价值，对市场和资源敏感，善于做出投入产出判断。',
  service: '你擅长理解和服务他人，细腻敏感，能在团队中起到凝聚和支持的作用。',
  growth: '你擅长学习和适应新环境，对未知保持好奇，能在变化中持续成长。',
};

export function calculateTalent(answers: TalentAnswer[]): TalentResult {
  const rawScores: Record<string, number> = {
    creativity: 0, expression: 0, research: 0, execution: 0,
    leadership: 0, business: 0, service: 0, growth: 0,
  };

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

  // 按得分排序
  const sorted = Object.entries(dimensions).sort((a, b) => b[1] - a[1]);
  const topThree = sorted.slice(0, 3).map(([dimension, score]) => ({ dimension: DIM_NAMES[dimension] || dimension, score }));
  const topTalent = topThree[0]?.dimension || '';

  // 生成描述
  const topDims = sorted.slice(0, 3).map(([d]) => d);
  const descParts = topDims.map((d) => {
    const name = DIM_NAMES[d] || d;
    const desc = DIM_DESCRIPTIONS[d] || '';
    return `**${name}**（${dimensions[d]}%）\n${desc}`;
  });

  const description = `你的核心天赋是「${topTalent}」。\n\n` +
    '以下是你最具优势的三个天赋维度：\n\n' +
    descParts.join('\n\n') +
    '\n\n💡 **使用建议**：优先在发挥你核心天赋的领域中选择发展方向，同时有意识地培养其他维度以形成能力互补。';

  return {
    dimensions,
    rawScores,
    topTalent,
    topThree,
    description,
  };
}
