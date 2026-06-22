/**
 * 天赋发现测评计分器（原天职测评升级版）
 *
 * 每题 A=3分, B=1分, C=0分
 * 每维度 2-3 题，结果归一化为百分比 0-100
 */

export interface TianZhiAnswer {
  questionId: number;
  dimension: string;
  score: number;
  label: string;
}

export interface TianZhiResult {
  dimensions: Record<string, number>;
  rawScores: Record<string, number>;
  topTalent: string;
  topThree: { dimension: string; score: number }[];
  recommendation: string;
}

const MAX_SCORES: Record<string, number> = {
  creativity: 6, expression: 9, research: 6,
  execution: 9, leadership: 6, business: 6,
  service: 6, growth: 6,
};

const DIM_NAMES: Record<string, string> = {
  creativity: '创造力', expression: '表达力', research: '研究力',
  execution: '执行力', leadership: '领导力', business: '商业力',
  service: '服务力', growth: '成长力',
};

const DIM_DESC: Record<string, string> = {
  creativity: '你擅长从无到有创造新事物，在空白处看到可能性。思维活跃，善于提出新想法。',
  expression: '你擅长用语言和文字传递思想，表达有感染力，能影响和带动他人。',
  research: '你擅长抽丝剥茧地分析问题，喜欢追根究底，能发现别人忽略的规律。',
  execution: '你擅长把想法变成现实，行动力强，做事靠谱，是值得信赖的交付者。',
  leadership: '你擅长凝聚团队和推动方向，在需要做决策和承担责任时能站出来。',
  business: '你擅长发现商业机会和价值，对市场和资源敏感，善于做出判断。',
  service: '你擅长理解和服务他人，细腻敏感，在团队中起到凝聚和支持的作用。',
  growth: '你擅长学习和适应新环境，对未知保持好奇，能在变化中持续成长。',
};

const DIRECTION_MAP: Record<string, string> = {
  creativity: '优先选择需要创新和突破的领域，让创意成为你的核心竞争力。',
  expression: '优先选择需要沟通和表达的领域，让影响力成为你的杠杆。',
  research: '优先选择需要深度研究和分析的领域，让专业度成为你的护城河。',
  execution: '优先选择需要高效交付和执行的领域，让成果成为你的名片。',
  leadership: '优先选择需要带领团队和统筹全局的领域，让领导力成就团队。',
  business: '优先选择需要商业判断和资源整合的领域，让洞察创造价值。',
  service: '优先选择需要服务他人和支持团队的领域，让温度成为你的优势。',
  growth: '优先选择需要快速学习和适应变化的领域，让成长速度成为你的壁垒。',
};

const RISK_MAP: Record<string, string> = {
  creativity: '注意平衡创意和执行，避免只出点子不落地。练习将想法最小化验证。',
  expression: '注意平衡表达和内容深度，避免形式大于实质。先确保有干货再优化表达。',
  research: '注意避免过度分析导致行动迟缓。设定分析截止时间，适时做出决策。',
  execution: '注意避免陷入事务性工作。定期留出时间做全局思考和策略规划。',
  leadership: '注意避免过于强势。多倾听团队成员的真实想法，练习服务型领导。',
  business: '注意避免只关注利益而忽略人的因素。在追求结果的同时关注团队感受。',
  service: '注意避免过度付出而忽略自己的需求。学会设立边界，保护自己的能量。',
  growth: '注意避免兴趣过于分散。选择1-2个核心领域深耕，建立T型知识结构。',
};

export function calculateTianZhi(answers: TianZhiAnswer[]): TianZhiResult {
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
    dimensions[dim] = Math.round((rawScores[dim] / (MAX_SCORES[dim] || 6)) * 100);
  }

  // 排序
  const sorted = Object.entries(dimensions).sort((a, b) => b[1] - a[1]);
  const topThree = sorted.slice(0, 3).map(([dimension, score]) => ({
    dimension: DIM_NAMES[dimension] || dimension,
    score,
  }));
  const topTalent = topThree[0]?.dimension || '';
  const topKey = sorted[0]?.[0] || '';

  // 生成推荐
  const desc = topThree.map((t) => {
    const key = Object.entries(DIM_NAMES).find(([, v]) => v === t.dimension)?.[0];
    return `**${t.dimension}**（${t.score}%）\n${DIM_DESC[key || ''] || ''}`;
  }).join('\n\n');

  const direction = DIRECTION_MAP[topKey] || '';
  const risk = RISK_MAP[topKey] || '';

  const recommendation = `**✨ 你的核心天赋：${topTalent}**\n\n` +
    `**📊 最具优势的三个天赋维度**\n\n${desc}\n\n` +
    `**🧭 发展方向**\n${direction}\n\n` +
    `**⚠️ 成长提醒**\n${risk}\n\n` +
    `💡 **使用建议**：优先在发挥核心天赋的领域选择发展方向，同时有意识地培养其他维度。天赋不是限制，而是你的加速器。`;

  return {
    dimensions,
    rawScores,
    topTalent,
    topThree,
    recommendation,
  };
}
