/**
 * 🎯 个人天赋与职业发展报告
 *
 * 设计理念：
 *  先结论，后解释
 *  从「展示分析过程」升级为「直接输出可行动结论」
 *  从「人格报告」升级为「成长报告」
 *
 * 报告结构：
 *  1. 核心结论 —— 30秒看懂自己
 *  2. 形成原因 —— 为什么你有这些优势
 *  3. 能力画像 —— 6维能力评估
 *  4. 职业发展建议 —— 适合做什么
 *  5. 发展路径 —— 30/90/365天行动计划
 *  6. 风险提醒 —— 潜在短板与优化
 *  7. 数据依据（附录）—— 测评原始数据
 */

import { analyzeCareer } from '../career/careerModel';

// ===================== 类型定义 =====================

export interface ReportInput {
  profile: { name: string; gender: string; birthDate: Date; birthHour: number } | null;
  bazi: any;
  mbti: any;
  holland: any;
  tianzhi: any;
  talent: any;
}

export interface ReportSection {
  title: string;
  subtitle?: string;
  content: string;
  type: 'text' | 'list' | 'chart' | 'table';
  data?: any;
}

export interface ReportOutput {
  title: string;
  summary: string;
  sections: ReportSection[];
}

// ===================== 六维能力评分系统 =====================

interface CapabilityScore {
  name: string;
  icon: string;
  score: number;     // 0-100
  level: '优势能力' | '普通能力' | '弱势能力';
  description: string;
  developTip: string;
}

/**
 * 从所有测评数据中综合计算六维能力评分
 */
function calculateCapabilities(bazi: any, mbti: any, holland: any, tianzhi: any, talent?: any): CapabilityScore[] {
  const scores: Record<string, number> = {
    creativity: 50,  // 创造力
    analytical: 50,  // 分析力
    expression: 50,  // 表达力
    leadership: 50,  // 领导力
    execution: 50,   // 执行力
    learning: 50,    // 学习力
  };

  // ---- 八字贡献 ----
  if (bazi?.fiveElements) {
    const wx = bazi.fiveElements;
    scores.creativity += (wx['木'] || 0) * 10;
    scores.analytical += (wx['金'] || 0) * 10;
    scores.expression += (wx['火'] || 0) * 8;
    scores.leadership += (wx['火'] || 0) * 6;
    scores.execution += (wx['土'] || 0) * 10;
    scores.learning += (wx['水'] || 0) * 8;
  }

  // 日主影响
  const yangGan = ['甲', '丙', '戊', '庚', '壬'];
  const yinGan = ['乙', '丁', '己', '辛', '癸'];
  if (bazi?.dayStem) {
    if (yangGan.includes(bazi.dayStem)) {
      scores.leadership += 12;
      scores.expression += 6;
    } else {
      scores.analytical += 8;
      scores.learning += 8;
    }
  }

  // ---- MBTI贡献 ----
  if (mbti?.dimensions) {
    const d = mbti.dimensions;
    // E/I → 表达力
    scores.expression += Math.abs(d.ei || 0) * 0.3 * (d.ei >= 0 ? 1 : -0.3);
    // S/N → 创造力/学习力
    scores.creativity += Math.abs(d.sn || 0) * 0.3 * (d.sn >= 0 ? -0.2 : 1);
    scores.learning += Math.abs(d.sn || 0) * 0.2 * (d.sn >= 0 ? 0.3 : 1);
    // T/F → 分析力
    scores.analytical += Math.abs(d.tf || 0) * 0.3 * (d.tf >= 0 ? 1 : -0.3);
    // J/P → 执行力
    scores.execution += Math.abs(d.jp || 0) * 0.3 * (d.jp >= 0 ? 1 : -0.2);
  }

  // ---- 霍兰德贡献 ----
  if (holland?.dimensions) {
    const h = holland.dimensions;
    scores.creativity += (h['A'] || 0) * 3;
    scores.analytical += (h['I'] || 0) * 3;
    scores.expression += (h['S'] || 0) * 2 + (h['A'] || 0) * 2;
    scores.leadership += (h['E'] || 0) * 4;
    scores.execution += (h['R'] || 0) * 2 + (h['C'] || 0) * 3;
    scores.learning += (h['I'] || 0) * 2;
  }

  // ---- 天职贡献 ----
  if (tianzhi?.dimensions) {
    const t = tianzhi.dimensions;
    scores.creativity += (t['passion'] || 0) * 1.5;
    scores.analytical += (t['talent'] || 0) * 1.2;
    scores.learning += (t['passion'] || 0) * 1.2;
  }

  // ---- 天赋发现贡献 ----
  if (talent?.dimensions) {
    const d = talent.dimensions;
    scores.creativity += (d['creativity'] || 0) * 0.4;
    scores.expression += (d['expression'] || 0) * 0.4;
    scores.analytical += (d['research'] || 0) * 0.4;
    scores.execution += (d['execution'] || 0) * 0.4;
    scores.leadership += (d['leadership'] || 0) * 0.4;
    scores.learning += (d['growth'] || 0) * 0.4;
  }

  // 归一化到 0-100，并取整
  for (const key of Object.keys(scores)) {
    scores[key] = Math.max(10, Math.min(95, Math.round(scores[key])));
  }

  // 构建输出
  const configs: Record<string, { name: string; icon: string; desc: string; tip: string }> = {
    creativity: {
      name: '创造力', icon: '💡',
      desc: '产生新想法、新方案，突破常规思考的能力',
      tip: '多接触跨界知识，练习头脑风暴和逆向思维',
    },
    analytical: {
      name: '分析力', icon: '🔍',
      desc: '拆解复杂问题、发现规律、逻辑推理的能力',
      tip: '学习结构化思维，练习用数据和逻辑论证',
    },
    expression: {
      name: '表达力', icon: '🎯',
      desc: '清晰传递信息、有效沟通、影响他人的能力',
      tip: '练习结构化表达（金字塔原理），多做公开分享',
    },
    leadership: {
      name: '领导力', icon: '🚀',
      desc: '带领团队、激励他人、推动目标达成的能力',
      tip: '主动承担小项目负责人角色，练习授权和反馈',
    },
    execution: {
      name: '执行力', icon: '⚡',
      desc: '将计划转化为行动、按时交付成果的能力',
      tip: '使用OKR分解目标，建立每日行动清单习惯',
    },
    learning: {
      name: '学习力', icon: '📚',
      desc: '快速掌握新知识、适应新环境的能力',
      tip: '建立个人知识体系，采用费曼学习法输出',
    },
  };

  return Object.entries(configs).map(([key, cfg]) => {
    const score = scores[key];
    let level: '优势能力' | '普通能力' | '弱势能力';
    if (score >= 65) level = '优势能力';
    else if (score >= 40) level = '普通能力';
    else level = '弱势能力';

    return {
      name: cfg.name,
      icon: cfg.icon,
      score,
      level,
      description: cfg.desc,
      developTip: cfg.tip,
    };
  });
}

// ===================== 核心结论生成 =====================

function generateCoreConclusion(
  caps: CapabilityScore[],
  bazi: any, mbti: any, holland: any
): { oneLiner: string; coreTalents: string[]; topAbilities: string[]; direction: string; growthAdvice: string } {
  // 提取优势能力（Top 3）
  const sorted = [...caps].sort((a, b) => b.score - a.score);
  const top3 = sorted.slice(0, 3);

  // 核心天赋词
  const talentMap: Record<string, string> = {
    creativity: '创新思维', analytical: '深度分析', expression: '沟通表达',
    leadership: '组织领导', execution: '高效执行', learning: '快速学习',
  };
  const topKeys = sorted.filter(c => c.level === '优势能力').slice(0, 3);
  const coreTalents = topKeys.map(c => talentMap[c.name.replace('力', '')] || c.name);

  // 一句总结
  const primaryStyle = (() => {
    if (caps.find(c => c.name === '创造力' && c.level === '优势能力')) return '你是一个有创新思维的人';
    if (caps.find(c => c.name === '分析力' && c.level === '优势能力')) return '你是一个善于深度思考的人';
    if (caps.find(c => c.name === '表达力' && c.level === '优势能力')) return '你是一个擅长沟通表达的人';
    if (caps.find(c => c.name === '领导力' && c.level === '优势能力')) return '你是一个有领导潜质的人';
    if (caps.find(c => c.name === '执行力' && c.level === '优势能力')) return '你是一个务实高效的人';
    if (caps.find(c => c.name === '学习力' && c.level === '优势能力')) return '你是一个学习能力很强的人';
    return '你拥有独特的天赋组合';
  })();

  const oneLiner = `${primaryStyle}，你的核心优势在于「${top3.map(c => c.name).join('」、「')}」。`;

  // 适合发展方向
  const direction = (() => {
    const topCap = sorted[0].name;
    const secondCap = sorted[1]?.name;
    if (topCap === '创造力' || topCap === '学习力') return '适合需要不断探索和创新的领域，在变化和挑战中成长';
    if (topCap === '分析力') return '适合需要深度思考和专业判断的领域，在钻研中建立优势';
    if (topCap === '表达力' || topCap === '领导力') return '适合需要影响和带动他人的领域，在协作中发挥价值';
    if (topCap === '执行力') return '适合需要高效交付和持续优化的领域，在实干中积累成果';
    return '适合发挥你综合优势的跨领域工作';
  })();

  return {
    oneLiner,
    coreTalents: [...new Set(coreTalents)].slice(0, 3),
    topAbilities: top3.map(c => `${c.icon} ${c.name}`),
    direction,
    growthAdvice: `持续培养「${sorted[sorted.length - 1].name}」，能让你的综合能力更全面`,
  };
}

// ===================== 发展路径生成 =====================

// 发展路径生成（已移除）
function generateDevelopmentPath(_caps: CapabilityScore[], _bazi: any): { title: string; actions: string[] }[] {
  const weakest = [..._caps].sort((a, b) => a.score - b.score)[0];
  const strongest = [..._caps].sort((a, b) => b.score - a.score)[0];

  return [
    {
      title: '未来30天 · 快速启动',
      actions: [
        `✅ 优势实践：找一个需要「${strongest.name}」的小任务，刻意练习并记录成果`,
        `📖 能力补足：每天花15分钟学习「${weakest.name}」相关的一个技巧或工具`,
        `📝 自我复盘：每周写一次工作/学习复盘，梳理你的优势发挥情况`,
        `👥 寻求反馈：请一位信任的同事或朋友，给你关于${strongest.name}和${weakest.name}的客观反馈`,
      ],
    },
    {
      title: '未来90天 · 能力巩固',
      actions: [
        `🎯 项目实践：参与一个能充分发挥「${strongest.name}」的项目，争取主导其中部分工作`,
        `📚 系统学习：完成一门与「${weakest.name}」相关的系统课程（线上/线下均可）`,
        `🤝 拓展圈子：结识3位在你擅长领域有经验的人，主动请教和交流`,
        `📊 成果量化：整理你在${strongest.name}方面的实际成果，形成个人案例库`,
      ],
    },
    {
      title: '未来1年 · 方向确立',
      actions: [
        `🎯 方向聚焦：基于你的优势能力，确定1-2个具体的职业发展方向并深入了解`,
        `🏆 标杆项目：打造一个有代表性的项目成果，能清晰展示你的${strongest.name}`,
        `🌱 能力输出：尝试通过写作、分享或教学的方式，把你的${strongest.name}经验传递给他人`,
        `🔄 全面评估：重新进行一次能力评估，对比一年前的成长变化，规划下一阶段`,
      ],
    },
  ];
}

// ===================== 风险提醒生成 =====================

function generateRiskTips(caps: CapabilityScore[], bazi: any): { weakness: string; risk: string; optimize: string }[] {
  const weakest = [...caps].sort((a, b) => a.score - b.score);
  const risks: { weakness: string; risk: string; optimize: string }[] = [];

  const riskMap: Record<string, { risk: string; optimize: string }> = {
    '创造力': { risk: '可能过于追求新意，忽略可行性和执行细节', optimize: '学会在创意和执行之间找到平衡，用MVP思维快速验证' },
    '分析力': { risk: '可能过度分析导致决策拖延，错过最佳时机', optimize: '设定分析截止时间，培养"足够好"的决策意识' },
    '表达力': { risk: '可能过度关注表达而忽略内容的深度', optimize: '先确保内容质量，再优化表达方式' },
    '领导力': { risk: '可能过于强势或急于推动，忽略团队感受', optimize: '多倾听团队成员的想法，练习"服务型领导"风格' },
    '执行力': { risk: '可能陷入事务性工作，缺乏对全局的思考', optimize: '定期留出"思考时间"，从执行中抽离审视方向' },
    '学习力': { risk: '可能兴趣广泛但难以深耕，缺乏专业深度', optimize: '选择1-2个核心领域持续深耕，建立T型知识结构' },
  };

  weakest.forEach(c => {
    if (c.level === '弱势能力') {
      const info = riskMap[c.name];
      risks.push({
        weakness: c.name,
        risk: info?.risk || `${c.name}相对较弱，可能在某些场景下成为瓶颈`,
        optimize: info?.optimize || `有意识地练习和培养${c.name}，可以通过小步骤渐进提升`,
      });
    }
  });

  // 至少2条
  if (risks.length === 0) {
    risks.push({
      weakness: weakest[0]?.name || '综合',
      risk: '各项能力较为均衡，但可能缺乏突出的核心优势',
      optimize: '选择一个你最有意愿深耕的能力方向，集中资源打造差异化优势',
    });
  }

  return risks.slice(0, 3);
}

// ===================== 形成原因生成 =====================

function generateFormationReason(bazi: any, mbti: any, holland: any): string[] {
  const reasons: string[] = [];

  // 从先天特质角度
  if (bazi?.dayStem) {
    const dayStem = bazi.dayStem;
    const yangGan = ['甲', '丙', '戊', '庚', '壬'];
    const stemChinese: Record<string, string> = { '甲': '甲', '乙': '乙', '丙': '丙', '丁': '丁', '戊': '戊', '己': '己', '庚': '庚', '辛': '辛', '壬': '壬', '癸': '癸' };
    const stemNature: Record<string, string> = {
      '甲': '你有天然的开拓者气质', '乙': '你有灵活的协调者特质',
      '丙': '你天生热情有感染力', '丁': '你细腻敏锐洞察力强',
      '戊': '你稳重可靠有担当', '己': '你务实细腻善于滋养',
      '庚': '你果断刚毅执行力强', '辛': '你追求完美审美出色',
      '壬': '你智慧豁达善统筹', '癸': '你聪敏内敛富于灵感',
    };
    reasons.push(`🔸 **先天特质**：${stemNature[dayStem] || '你有独特的先天特质'}。这构成了你能力的基础底色。`);
  }

  // 从人格模式角度
  if (mbti?.type) {
    const type = mbti.type;
    const typePattern: Record<string, string> = {
      'INTJ': '你偏向独立思考、长远规划', 'INTP': '你喜欢探索原理、逻辑分析',
      'INFJ': '你注重意义、善于洞察他人', 'INFP': '你坚守内在价值、富有创造力',
      'ISTJ': '你注重事实、做事严谨负责', 'ISFJ': '你默默付出、守护团队和谐',
      'ISTP': '你冷静务实、善于解决实际问题', 'ISFP': '你温和敏感、享受创作过程',
      'ENTJ': '你果断强势、善于战略规划', 'ENTP': '你思维活跃、善于辩论创新',
      'ENFJ': '你善于激励他人、有感染力', 'ENFP': '你充满热情、善于发现可能',
      'ESTJ': '你注重效率、善于组织管理', 'ESFJ': '你热心助人、注重团队氛围',
      'ESTP': '你行动力强、善于把握机会', 'ESFP': '你活力四射、享受当下',
    };
    reasons.push(`🔸 **人格模式**：作为${type}型，${typePattern[type] || '你有独特的思维和行为模式'}。这影响你处理信息和做决策的方式。`);
  }

  // 从兴趣角度
  if (holland?.type) {
    const type = holland.type;
    reasons.push(`🔸 **兴趣倾向**：你的霍兰德代码为${type}型，反映出你在${type.includes('A') ? '创意表达' : ''}${type.includes('I') ? '深度研究' : ''}${type.includes('S') ? '人际协作' : ''}${type.includes('E') ? '组织影响' : ''}${type.includes('R') ? '动手实践' : ''}${type.includes('C') ? '规范执行' : ''}方面有天然的偏好和动力。`);
  }

  // 合成段落
  reasons.push(`🔸 **综合影响**：先天特质给你底层的倾向，人格模式塑造了你处理信息的方式，兴趣倾向则指引你愿意投入的方向。三者共同作用，形成了你当前的能力优势和独特的工作风格。`);

  return reasons;
}

// ===================== 报告章节生成器 =====================

// 第一部分：核心结论
function generatePart1(caps: CapabilityScore[], bazi: any, mbti: any, holland: any): ReportSection {
  const conclusion = generateCoreConclusion(caps, bazi, mbti, holland);

  let content = '';
  content += `**✨ 一句总结**\n\n${conclusion.oneLiner}\n\n`;
  content += `**🎯 核心天赋**\n`;
  conclusion.coreTalents.forEach(t => { content += `  - ${t}\n`; });
  content += '\n';
  content += `**💪 优势能力 TOP 3**\n`;
  conclusion.topAbilities.forEach(a => { content += `  - ${a}\n`; });
  content += '\n';
  content += `**🧭 适合发展方向**\n\n${conclusion.direction}\n\n`;
  content += `**📈 一句成长建议**\n\n${conclusion.growthAdvice}`;

  return {
    title: '核心结论',
    content,
    type: 'text',
    data: { coreTalents: conclusion.coreTalents, topAbilities: caps.filter(c => c.level === '优势能力').map(c => c.name) },
  };
}

// 第二部分：形成原因
function generatePart2(bazi: any, mbti: any, holland: any): ReportSection {
  const reasons = generateFormationReason(bazi, mbti, holland);
  let content = '你的能力不是凭空而来的。以下是形成你当前优势的几个关键原因：\n\n';
  reasons.forEach(r => { content += `${r}\n\n`; });
  return { title: '形成原因', content, type: 'text' };
}

// 第三部分：能力画像
function generatePart3(caps: CapabilityScore[]): ReportSection {
  let content = '以下是从创造力、分析力、表达力、领导力、执行力、学习力六个维度对你的能力评估：\n\n';

  // 分组展示
  const strengths = caps.filter(c => c.level === '优势能力');
  const normals = caps.filter(c => c.level === '普通能力');
  const weaknesses = caps.filter(c => c.level === '弱势能力');

  if (strengths.length > 0) {
    content += '**✅ 优势能力**（你可以重点依靠的能力）\n\n';
    strengths.forEach(c => {
      content += `${c.icon} **${c.name}**（${c.score}分）\n`;
      content += `  ${c.description}\n`;
      content += `  💡 *培养建议：${c.developTip}*\n\n`;
    });
  }

  if (normals.length > 0) {
    content += '**📊 普通能力**（有发展空间，可以继续提升）\n\n';
    normals.forEach(c => {
      content += `  ${c.icon} ${c.name}（${c.score}分）\n`;
    });
    content += '\n';
  }

  if (weaknesses.length > 0) {
    content += '**🌱 可提升能力**（现阶段相对较弱，值得关注）\n\n';
    weaknesses.forEach(c => {
      content += `  ${c.icon} ${c.name}（${c.score}分）\n`;
    });
    content += '\n';
  }

  return {
    title: '能力画像',
    content,
    type: 'text',
    data: caps.reduce((acc, c) => ({ ...acc, [c.name]: c.score }), {}),
  };
}

// 第四部分：职业发展建议
function generatePart4(bazi: any): ReportSection {
  if (!bazi) {
    return { title: '职业发展建议', content: '请先完成性格分析，获取更精准的职业发展建议。', type: 'text' };
  }

  const analysis = analyzeCareer({
    fiveElements: bazi.fiveElements,
    dayStem: bazi.dayStem,
    shiShen: bazi.shiShen,
    gender: bazi.gender,
  });

  let content = '以下建议基于你的能力特点和先天倾向，帮助你找到更适合的发展方向：\n\n';

  content += '**✅ 适合的工作类型**\n';
  analysis.direction.workTypes.forEach((t: string) => { content += `  - ${t}\n`; });
  content += '\n';

  content += '**✅ 适合的团队环境**\n';
  analysis.direction.workEnvironments.forEach((e: string) => { content += `  - ${e}\n`; });
  content += '\n';

  content += '**✅ 适合的成长方式**\n';
  analysis.direction.developmentPaths.forEach((p: string) => { content += `  - ${p}\n`; });
  content += '\n';

  content += '**⏱️ 适合的工作节奏**\n';
  const primaryElement = Object.entries(bazi.fiveElements || {}).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || '木';
  const rhythmMap: Record<string, string[]> = {
    '木': ['弹性工作制，自主安排时间', '项目制而非固定工时', '允许深度工作和自由探索的节奏'],
    '火': ['快节奏、即时反馈的工作节奏', '有社交和互动的工作安排', '避免长时间独处的任务安排'],
    '土': ['规律稳定的工作节奏', '有明确计划和预期的工作安排', '避免频繁的临时变更'],
    '金': ['专注深入的工作节奏', '有明确的交付标准和时间', '避免多任务频繁切换'],
    '水': ['有思考空间的工作节奏', '允许弹性安排、避免死板考勤', '适合阶段性紧张和放松交替'],
  };
  (rhythmMap[primaryElement] || rhythmMap['木']).forEach((r: string) => { content += `  - ${r}\n`; });
  content += '\n';

  content += '**❌ 不太适合的环境**\n';
  analysis.direction.avoidWorkTypes.forEach((a: string) => { content += `  - ${a}\n`; });

  return { title: '职业发展建议', content, type: 'text' };
}

// 第六部分：风险提醒
function generatePart6(caps: CapabilityScore[], bazi: any): ReportSection {
  const risks = generateRiskTips(caps, bazi);
  let content = '了解潜在短板不是为了否定自己，而是为了更有针对性地成长：\n\n';

  risks.forEach(r => {
    content += `**🔸 潜在短板：${r.weakness}**\n\n`;
    content += `⚠️ 容易陷入的问题：${r.risk}\n\n`;
    content += `💡 如何优化：${r.optimize}\n\n`;
  });

  content += '🌟 **成长心态**\n\n能力不是固定的，只要有意识地去练习和提升，每个人都可以在薄弱环节取得进步。关键是正视它，而不是回避它。';
  return { title: '风险提醒', content, type: 'text' };
}

// 第七部分：数据依据（附录）
function generatePart7(bazi: any, mbti: any, holland: any, tianzhi: any, talent?: any): ReportSection[] {
  const sections: ReportSection[] = [];

  // 先天特质摘要（已翻译成行为语言）
  if (bazi) {
    const wxEntries = Object.entries(bazi.fiveElements || {}) as [string, number][];
    const sorted = [...wxEntries].sort((a, b) => b[1] - a[1]);
    let content = '**先天特质参考**\n\n';
    content += '以下是根据你的出生信息分析得出的先天特质倾向，已转化为行为语言供参考：\n\n';

    const wxBehaviorMap: Record<string, string> = {
      '木': '→ 倾向：喜欢探索、追求成长、独立自主',
      '火': '→ 倾向：表达欲强、行动迅速、热情感染',
      '土': '→ 倾向：稳重务实、包容大度、注重规则',
      '金': '→ 倾向：规则感强、追求精确、善于分析',
      '水': '→ 倾向：深度思考、灵活应变、包容接纳',
    };
    sorted.forEach(([wx, count]) => {
      if (count > 0) {
        content += `  ${wx}（${count}分）${wxBehaviorMap[wx] || ''}\n`;
      }
    });
    content += `\n**日主**：${bazi.dayStem}  你的核心特质偏向「${sorted[0][0]}性」。\n`;
    sections.push({ title: '数据依据 · 先天特质', content, type: 'text', data: bazi.fiveElements });
  }

  // MBTI
  if (mbti) {
    const dimLabels: Record<string, string> = {
      ei: mbti.dimensions.ei >= 0 ? '外向 E' : '内向 I',
      sn: mbti.dimensions.sn >= 0 ? '实感 S' : '直觉 N',
      tf: mbti.dimensions.tf >= 0 ? '理性 T' : '感性 F',
      jp: mbti.dimensions.jp >= 0 ? '判断 J' : '感知 P',
    };
    let content = `**MBTI 类型**：${mbti.type} 型\n\n`;
    content += `维度倾向：\n`;
    content += `  - ${dimLabels.ei}（${Math.abs(mbti.dimensions.ei)}%）\n`;
    content += `  - ${dimLabels.sn}（${Math.abs(mbti.dimensions.sn)}%）\n`;
    content += `  - ${dimLabels.tf}（${Math.abs(mbti.dimensions.tf)}%）\n`;
    content += `  - ${dimLabels.jp}（${Math.abs(mbti.dimensions.jp)}%）\n\n`;
    content += mbti.description || '';
    sections.push({ title: '数据依据 · MBTI', content, type: 'text', data: mbti.dimensions });
  }

  // 霍兰德
  if (holland) {
    const sortedDims = Object.entries(holland.dimensions).sort((a: any, b: any) => b[1] - a[1]);
    let content = `**霍兰德代码**：${holland.type} 型\n\n`;
    content += `六维得分（满分30分）：\n`;
    sortedDims.forEach(([d, s]: any) => { content += `  - ${d} 型：${s} 分\n`; });
    sections.push({ title: '数据依据 · 霍兰德', content, type: 'text', data: holland.dimensions });
  }

  // 天职
  if (tianzhi) {
    let content = '**天职测评摘要**\n\n';
    content += tianzhi.recommendation || '完成测评后获取详细解读。';
    sections.push({ title: '数据依据 · 天职', content, type: 'text' });
  }

  // 天赋发现
  if (talent?.dimensions) {
    const sorted = Object.entries(talent.dimensions).sort((a: any, b: any) => b[1] - a[1]);
    const dimNames: Record<string, string> = {
      creativity: '创造力', expression: '表达力', research: '研究力',
      execution: '执行力', leadership: '领导力', business: '商业力',
      service: '服务力', growth: '成长力',
    };
    let content = `**核心天赋**：${talent.topTalent || ''}\n\n`;
    content += '**八维天赋得分**\n\n';
    sorted.forEach(([key, val]: any) => {
      content += `  - ${dimNames[key] || key}：${val}%\n`;
    });
    sections.push({ title: '数据依据 · 天赋发现', content, type: 'text', data: talent.dimensions });
  }

  return sections;
}

// ===================== 主入口 =====================

export function generateReport(input: ReportInput): ReportOutput {
  const sections: ReportSection[] = [];
  const timestamp = new Date().toLocaleString('zh-CN');

  // 综合计算能力画像
  const caps = calculateCapabilities(input.bazi, input.mbti, input.holland, input.tianzhi, input.talent);

  // 报告标题
  const title = '个人天赋与职业发展报告';

  // 摘要 — 用核心结论替换
  const conclusion = generateCoreConclusion(caps, input.bazi, input.mbti, input.holland);
  const summary = `${conclusion.oneLiner}\n📊 已基于 ${[
    input.bazi && '性格分析',
    input.mbti && 'MBTI',
    input.holland && '霍兰德',
    input.tianzhi && '天职测评',
    input.talent && '天赋发现',
  ].filter(Boolean).join('、')} 综合生成 | ${timestamp}`;

  // ==================== 报告主体 ====================

  // Part 1: 核心结论 — 先告诉用户最核心的信息
  sections.push(generatePart1(caps, input.bazi, input.mbti, input.holland));

  // Part 2: 形成原因 — 再解释为什么
  sections.push(generatePart2(input.bazi, input.mbti, input.holland));

  // Part 3: 能力画像 — 详细能力分析
  sections.push(generatePart3(caps));

  // Part 4: 职业发展建议 — 适合做什么
  sections.push(generatePart4(input.bazi));

  // Part 6: 风险提醒 — 潜在短板
  sections.push(generatePart6(caps, input.bazi));

  // Part 7: 数据依据（附录）— 最后才展示原始数据
  sections.push(...generatePart7(input.bazi, input.mbti, input.holland, input.tianzhi, input.talent));

  return { title, summary, sections };
}
