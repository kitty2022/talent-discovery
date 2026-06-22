/**
 * 天赋发现测评题库（原天职测评升级版）
 *
 * 基于行为科学 + 优势理论 + 职业发展模型
 * 识别八大天赋维度
 *
 * 题型比例：
 *   40% 过去行为  —— 过去一年你通常……
 *   40% 能力表现  —— 别人更容易找你做什么……
 *   20% 能量来源  —— 什么事情做完最有满足感……
 */

export interface TianZhiQuestion {
  id: number;
  text: string;
  type: 'behavior' | 'ability' | 'energy';
  options: { label: string; text: string; score: number }[];
  dimension: string;
}

export const questions: TianZhiQuestion[] = [
  // ==================== 创造力 ====================
  { id: 1, dimension: 'creativity', type: 'ability',
    text: '别人遇到什么类型的问题时，更容易来找你？',
    options: [
      { label: 'A', text: '需要想一个新点子或者换个角度思考的时候', score: 3 },
      { label: 'B', text: '需要把现有方案优化和改进的时候', score: 1 },
      { label: 'C', text: '需要按照标准流程执行的时候', score: 0 },
    ] },
  { id: 2, dimension: 'creativity', type: 'energy',
    text: '以下哪种场景让你做完后最有满足感？',
    options: [
      { label: 'A', text: '想出一个从没有人用过的新方法并且成功了', score: 3 },
      { label: 'B', text: '把一个复杂的任务高效地完成了', score: 1 },
      { label: 'C', text: '帮助团队解决了一个人际关系问题', score: 0 },
    ] },
  // ==================== 表达力 ====================
  { id: 3, dimension: 'expression', type: 'behavior',
    text: '过去一年，在会议或公开场合中，你通常的表现是？',
    options: [
      { label: 'A', text: '主动发言，经常是表达观点最多的那个人', score: 3 },
      { label: 'B', text: '被点到时会说，但不太会主动抢麦', score: 1 },
      { label: 'C', text: '更倾向先听别人说，很少公开发言', score: 0 },
    ] },
  { id: 4, dimension: 'expression', type: 'ability',
    text: '在工作中，别人更倾向于找你做什么？',
    options: [
      { label: 'A', text: '帮忙写材料、做汇报、准备对外沟通的内容', score: 3 },
      { label: 'B', text: '帮忙分析数据或梳理复杂信息', score: 1 },
      { label: 'C', text: '帮忙检查细节或执行具体操作', score: 0 },
    ] },
  { id: 5, dimension: 'expression', type: 'energy',
    text: '以下哪种时刻让你觉得最有成就感？',
    options: [
      { label: 'A', text: '通过一段演讲或文字打动了很多人', score: 3 },
      { label: 'B', text: '独立完成了一个有挑战的技术任务', score: 1 },
      { label: 'C', text: '组织了一场高效的团队协作', score: 0 },
    ] },
  // ==================== 研究力 ====================
  { id: 6, dimension: 'research', type: 'behavior',
    text: '过去一年，面对一个陌生领域的复杂问题时，你通常会？',
    options: [
      { label: 'A', text: '自己搜集资料、系统研究，直到搞懂为止', score: 3 },
      { label: 'B', text: '请教懂行的人，请对方解释给我听', score: 1 },
      { label: 'C', text: '如果不是必须的，会选择绕开这个问题', score: 0 },
    ] },
  { id: 7, dimension: 'research', type: 'ability',
    text: '同事或朋友更容易因为什么原因来找你？',
    options: [
      { label: 'A', text: '想不清楚某个逻辑关系，让我帮忙梳理', score: 3 },
      { label: 'B', text: '需要有人出主意或者头脑风暴', score: 1 },
      { label: 'C', text: '需要有人帮忙联系资源或协调关系', score: 0 },
    ] },
  // ==================== 执行力 ====================
  { id: 8, dimension: 'execution', type: 'behavior',
    text: '过去一年，接到一个明确的任务后，你通常的行动模式是？',
    options: [
      { label: 'A', text: '马上开始做，快速产出初稿再迭代优化', score: 3 },
      { label: 'B', text: '先规划好再动手，按部就班推进', score: 1 },
      { label: 'C', text: '能拖就拖，直到截止日期前才赶工', score: 0 },
    ] },
  { id: 9, dimension: 'execution', type: 'ability',
    text: '在团队中，别人更容易因为你什么特点而找你合作？',
    options: [
      { label: 'A', text: '事情交给我很放心，一定能按时完成', score: 3 },
      { label: 'B', text: '我能提出不错的想法和方案', score: 1 },
      { label: 'C', text: '我能协调团队关系，让大家合作愉快', score: 0 },
    ] },
  { id: 10, dimension: 'execution', type: 'energy',
    text: '以下哪种工作状态让你最满足？',
    options: [
      { label: 'A', text: '高效完成了一个又一个具体任务，成果看得见', score: 3 },
      { label: 'B', text: '深度思考后得出了一个重要的分析结论', score: 1 },
      { label: 'C', text: '和团队一起头脑风暴出很多创意点子', score: 0 },
    ] },
  // ==================== 领导力 ====================
  { id: 11, dimension: 'leadership', type: 'behavior',
    text: '过去一年，当一群人需要有人牵头做决定时，你的角色是？',
    options: [
      { label: 'A', text: '通常会自然变成那个拿主意的人', score: 3 },
      { label: 'B', text: '会参与讨论，但希望有人做最终决定', score: 1 },
      { label: 'C', text: '更倾向于跟随别人的决定', score: 0 },
    ] },
  { id: 12, dimension: 'leadership', type: 'ability',
    text: '别人在工作中遇到什么情况时会找你帮忙？',
    options: [
      { label: 'A', text: '需要有人拍板做决定或者指明方向的时候', score: 3 },
      { label: 'B', text: '需要有人帮忙细化方案或者落地执行的时候', score: 1 },
      { label: 'C', text: '需要有人帮忙查阅资料或者分析数据的时候', score: 0 },
    ] },
  // ==================== 商业力 ====================
  { id: 13, dimension: 'business', type: 'behavior',
    text: '过去一年，面对一个可能有商业机会的新事物时，你通常的做法是？',
    options: [
      { label: 'A', text: '主动深入了解，评估可行性，思考怎么变现', score: 3 },
      { label: 'B', text: '会关注，但等别人验证后再决定是否跟进', score: 1 },
      { label: 'C', text: '不太关注，专注做好手头的事', score: 0 },
    ] },
  { id: 14, dimension: 'business', type: 'ability',
    text: '在讨论项目或方案时，你更容易贡献什么价值？',
    options: [
      { label: 'A', text: '这个项目能不能赚钱、值不值得做', score: 3 },
      { label: 'B', text: '怎么做才能更高效、质量更好', score: 1 },
      { label: 'C', text: '怎么让大家配合得更好', score: 0 },
    ] },
  // ==================== 服务力 ====================
  { id: 15, dimension: 'service', type: 'behavior',
    text: '过去一年，当身边同事或朋友心情不好或有困难时，你通常的反应是？',
    options: [
      { label: 'A', text: '会主动去关心，想办法让对方好受一些', score: 3 },
      { label: 'B', text: '会留意到，但不确定该不该去打扰对方', score: 1 },
      { label: 'C', text: '不太容易察觉到，或者觉得应该给ta空间', score: 0 },
    ] },
  { id: 16, dimension: 'service', type: 'energy',
    text: '以下哪种回馈让你最受鼓舞？',
    options: [
      { label: 'A', text: '「因为有你的帮助，我变得更好了」', score: 3 },
      { label: 'B', text: '「你的方案太棒了」', score: 1 },
      { label: 'C', text: '「你的效率真高，这么快就完成了」', score: 0 },
    ] },
  // ==================== 成长力 ====================
  { id: 17, dimension: 'growth', type: 'behavior',
    text: '过去一年，你主动学习一项新技能或新知识的频率是？',
    options: [
      { label: 'A', text: '持续在学习，有明确的学习计划和目标', score: 3 },
      { label: 'B', text: '偶尔会学，但不太系统，看兴趣和需要', score: 1 },
      { label: 'C', text: '很少主动学，主要是工作中被动接触', score: 0 },
    ] },
  { id: 18, dimension: 'growth', type: 'ability',
    text: '别人更容易因为什么而找上你？',
    options: [
      { label: 'A', text: '遇到新工具或新方法时，先来问我怎么用', score: 3 },
      { label: 'B', text: '需要有人帮忙梳理思路或分析问题时', score: 1 },
      { label: 'C', text: '需要有人来组织大家分工协作时', score: 0 },
    ] },
];

// ===================== 维度定义 =====================

export interface TianZhiDimension {
  id: string;
  name: string;
  definition: string;
  behavior: string;
}

export const dimensionDefs: TianZhiDimension[] = [
  { id: 'creativity', name: '创造力',
    definition: '从无到有生成新方案、新视角的能力',
    behavior: '经常冒出新点子、不喜欢循规蹈矩、对新鲜事物敏感' },
  { id: 'expression', name: '表达力',
    definition: '通过语言、文字、行动准确传达想法并影响他人的能力',
    behavior: '乐于分享表达、善于用语言打动人、写作或演讲频率高' },
  { id: 'research', name: '研究力',
    definition: '通过系统思考和逻辑分析深入理解事物本质的能力',
    behavior: '喜欢追根究底、对数据和逻辑敏感、享受解决复杂问题' },
  { id: 'execution', name: '执行力',
    definition: '将计划转化为实际行动并高效交付结果的能力',
    behavior: '行动力强、不拖延、注重结果和时效、说到做到' },
  { id: 'leadership', name: '领导力',
    definition: '设定方向、凝聚团队、推动目标达成的能力',
    behavior: '自然成为团队核心、善于做决策、乐于承担责任' },
  { id: 'business', name: '商业力',
    definition: '发现市场机会、整合资源、创造经济价值的能力',
    behavior: '对市场敏感、善于发现需求、有成本收益意识' },
  { id: 'service', name: '服务力',
    definition: '感知他人需求、提供支持、帮助他人成长的能力',
    behavior: '善于倾听、乐于助人、细腻敏感、成就他人' },
  { id: 'growth', name: '成长力',
    definition: '主动学习新知识、适应变化、持续自我提升的能力',
    behavior: '对未知保持好奇、愿意走出舒适区、经常复盘反思' },
];
