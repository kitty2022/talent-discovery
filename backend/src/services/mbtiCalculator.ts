// MBTI 测评计分器

export interface MBTIAnswer {
  questionId: number;
  answer: number; // 1-5 或 0/1
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  direction: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
}

export interface MBTIResult {
  type: string;
  dimensions: {
    ei: number;  // 正值=E, 负值=I
    sn: number;  // 正值=S, 负值=N
    tf: number;  // 正值=T, 负值=F
    jp: number;  // 正值=J, 负值=P
  };
  description: string;
}

// MBTI 类型描述
const TYPE_DESCRIPTIONS: Record<string, string> = {
  'ISTJ': '严谨务实，认真负责。安静、严肃、可靠，注重事实和细节。适合审计、会计、法律等职业。',
  'ISFJ': '温暖友善，尽职尽责。安静、友善、有责任感，乐于助人。适合医疗、教育、社会工作。',
  'INFJ': '洞察力强，理想主义。有独特的远见和使命感，善于理解复杂概念。适合咨询、心理咨询、写作。',
  'INTJ': '独立理性，战略思维。有远见的策划者，善于系统性思考和创新。适合科技、战略规划、研究。',
  'ISTP': '冷静务实，善于动手。灵活、理性的观察者，擅长分析和解决实际问题。适合工程、技术、急救。',
  'ISFP': '温和敏感，艺术气质。安静、友善、敏感，重视自由和美感。适合设计、艺术、园艺。',
  'INFP': '理想主义者，富有同情心。充满热情和创造力，坚持自己的价值观。适合写作、心理咨询、艺术。',
  'INTP': '逻辑严谨，创新思维。理性思考者，善于理论分析和抽象概念。适合科学研究、编程、哲学。',
  'ESTP': '行动派，善于交际。精力充沛、务实果断，善于把握机会。适合销售、创业、体育。',
  'ESFP': '热情开朗，乐于分享。活泼外向、乐于助人，善于带动气氛。适合表演、销售、旅游。',
  'ENFP': '富有创意，热情洋溢。充满想象力和热情，善于发现可能性。适合创意、媒体、咨询。',
  'ENTP': '聪明机智，善于辩论。思维敏捷、富有创意，善于从多角度思考。适合创业、咨询、技术。',
  'ESTJ': '果断务实，组织力强。善于管理、注重效率，是天生的领导者。适合管理、行政、执法。',
  'ESFJ': '热心助人，责任感强。善于合作、注重和谐，乐于为他人服务。适合教育、护理、人事。',
  'ENFJ': '魅力十足，鼓舞人心。善于激励他人，有感染力的领导者。适合教育、培训、人力资源。',
  'ENTJ': '果断强势，战略领袖。天生的领导者，善于规划和执行大目标。适合管理、创业、政治。',
};

export function calculateMBTI(answers: MBTIAnswer[]): MBTIResult {
  // 初始化维度分数
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  answers.forEach((a) => {
    const value = a.answer;
    const key = a.direction;
    if (key in scores) {
      scores[key as keyof typeof scores] += value;
    }
  });

  // 计算各维度倾向和强度
  const totalEI = scores.E + scores.I;
  const totalSN = scores.S + scores.N;
  const totalTF = scores.T + scores.F;
  const totalJP = scores.J + scores.P;

  const eiScore = totalEI > 0 ? ((scores.E - scores.I) / totalEI * 100) : 0;
  const snScore = totalSN > 0 ? ((scores.S - scores.N) / totalSN * 100) : 0;
  const tfScore = totalTF > 0 ? ((scores.T - scores.F) / totalTF * 100) : 0;
  const jpScore = totalJP > 0 ? ((scores.J - scores.P) / totalJP * 100) : 0;

  // 确定类型
  const type = [
    eiScore >= 0 ? 'E' : 'I',
    snScore >= 0 ? 'S' : 'N',
    tfScore >= 0 ? 'T' : 'F',
    jpScore >= 0 ? 'J' : 'P',
  ].join('');

  return {
    type,
    dimensions: {
      ei: Math.round(eiScore),
      sn: Math.round(snScore),
      tf: Math.round(tfScore),
      jp: Math.round(jpScore),
    },
    description: TYPE_DESCRIPTIONS[type] || '无法确定类型描述',
  };
}

// 获取 MBTI 类型描述
export function getMBTIDescription(type: string): string {
  return TYPE_DESCRIPTIONS[type] || '未知类型';
}
