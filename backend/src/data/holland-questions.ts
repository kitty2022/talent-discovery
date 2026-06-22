/**
 * 霍兰德职业倾向测评题库（行为版 · 精简15题）
 *
 * 每个维度 2-3 题，每题 A/B/C 三选一行为选择
 * 不问「你喜欢什么」，只问「过去半年真实发生过什么」
 */

export interface HollandQuestion {
  id: number;
  text: string;
  options: { label: string; text: string; score: number }[];
  dimension: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  capability: string;
}

export const questions: HollandQuestion[] = [
  // R型（执行）— 3题
  { id: 1, dimension: 'R', capability: '动手实践',
    text: '过去半年，遇到需要动手操作才能解决的问题时（如修理、组装、搭建），你通常的做法是？',
    options: [
      { label: 'A', text: '自己找工具或方法，直接动手尝试解决', score: 3 },
      { label: 'B', text: '先看别人怎么做，再自己动手', score: 1 },
      { label: 'C', text: '找会做的人帮忙，自己不动手', score: 0 },
    ] },
  { id: 2, dimension: 'R', capability: '实操解决',
    text: '过去半年，当工作中出现设备故障或技术问题时，你的第一反应是？',
    options: [
      { label: 'A', text: '尝试自己排查原因，能修就自己修', score: 3 },
      { label: 'B', text: '先查资料看看能不能自己解决', score: 1 },
      { label: 'C', text: '直接报修或找专业人员来处理', score: 0 },
    ] },
  { id: 3, dimension: 'R', capability: '执行交付',
    text: '过去半年，在团队合作中涉及「把计划变成现实」的环节时，你通常扮演什么角色？',
    options: [
      { label: 'A', text: '负责具体落地执行，别人做方案我来实现', score: 3 },
      { label: 'B', text: '参与执行，但需要明确的步骤指导', score: 1 },
      { label: 'C', text: '更擅长做方案策划，执行环节不太参与', score: 0 },
    ] },

  // I型（分析）— 3题
  { id: 4, dimension: 'I', capability: '数据分析',
    text: '过去半年，拿到一组数据或信息时，你通常会怎么做？',
    options: [
      { label: 'A', text: '自己深入分析，找规律、算指标、得出结论', score: 3 },
      { label: 'B', text: '大致看一下，等别人分析好直接看结果', score: 1 },
      { label: 'C', text: '不太关注数据，更依赖直觉和经验判断', score: 0 },
    ] },
  { id: 5, dimension: 'I', capability: '逻辑推理',
    text: '过去半年，面对一个复杂问题时，你解决问题的步骤通常是？',
    options: [
      { label: 'A', text: '先拆解问题、理清因果关系，再逐步推理出方案', score: 3 },
      { label: 'B', text: '先试几种方法看看效果，再选可行的', score: 1 },
      { label: 'C', text: '凭感觉判断，或直接请教有经验的人', score: 0 },
    ] },
  { id: 6, dimension: 'I', capability: '深度钻研',
    text: '过去半年，你是否有过「为了弄懂一个问题，花大量时间查阅资料、深入研究」的经历？',
    options: [
      { label: 'A', text: '有过多次，研究清楚之前不会轻易放过', score: 3 },
      { label: 'B', text: '有过一两次，但一般点到为止', score: 1 },
      { label: 'C', text: '没有，我更希望有人直接告诉我答案', score: 0 },
    ] },

  // A型（创造）— 2题
  { id: 7, dimension: 'A', capability: '创意思维',
    text: '过去半年，当需要提出一个新想法或方案时，你通常的做法是？',
    options: [
      { label: 'A', text: '能想出多个不同角度的方案，经常有让人意外的点子', score: 3 },
      { label: 'B', text: '能想出一两个方案，主要是结合已有经验', score: 1 },
      { label: 'C', text: '更倾向参考别人怎么做，不太擅长凭空想', score: 0 },
    ] },
  { id: 8, dimension: 'A', capability: '创新突破',
    text: '过去半年，你是否尝试过用「和以往完全不同的方式」来完成一项常规任务？',
    options: [
      { label: 'A', text: '有，主动尝试新方法并且有了更好的效果', score: 3 },
      { label: 'B', text: '有尝试，但效果一般或又改回了老方法', score: 1 },
      { label: 'C', text: '没有，用熟悉的方法更稳妥', score: 0 },
    ] },

  // S型（共情）— 3题
  { id: 9, dimension: 'S', capability: '共情理解',
    text: '过去半年，当身边有人情绪低落或遇到困难时，你通常会？',
    options: [
      { label: 'A', text: '主动关心，耐心倾听，让对方感觉被理解', score: 3 },
      { label: 'B', text: '会关心一下，但不太知道该怎么回应', score: 1 },
      { label: 'C', text: '不太会察觉，或者觉得应该给对方空间', score: 0 },
    ] },
  { id: 10, dimension: 'S', capability: '人际敏感',
    text: '过去半年，你能否察觉到团队中微妙的氛围变化（如某人情绪不对、团队关系紧张）？',
    options: [
      { label: 'A', text: '能，我通常是团队里最先察觉到气氛变化的人', score: 3 },
      { label: 'B', text: '偶尔能感觉到，但不一定能说清楚', score: 1 },
      { label: 'C', text: '不太关注，更专注于自己的事情', score: 0 },
    ] },
  { id: 11, dimension: 'S', capability: '冲突调解',
    text: '过去半年，当团队成员之间出现分歧或矛盾时，你通常的角色是？',
    options: [
      { label: 'A', text: '会主动协调，尝试促成双方达成理解', score: 3 },
      { label: 'B', text: '会关注但不太介入，希望他们自己解决', score: 1 },
      { label: 'C', text: '尽量避开，不想被卷入冲突', score: 0 },
    ] },

  // E型（影响）— 2题
  { id: 12, dimension: 'E', capability: '主动领导',
    text: '过去半年，当团队需要一个负责人或牵头人时，你的做法是？',
    options: [
      { label: 'A', text: '主动站出来承担，组织大家分工推进', score: 3 },
      { label: 'B', text: '如果没人做可以顶上，但不会主动争取', score: 1 },
      { label: 'C', text: '更希望别人来牵头，我配合就好', score: 0 },
    ] },
  { id: 13, dimension: 'E', capability: '说服影响',
    text: '过去半年，当你认为自己的想法是对的但别人不认同时，你通常会？',
    options: [
      { label: 'A', text: '找证据和论据，持续沟通直到说服对方或达成共识', score: 3 },
      { label: 'B', text: '尝试解释一两次，如果对方不接受就算了', score: 1 },
      { label: 'C', text: '既然别人不认同，那可能是我有问题', score: 0 },
    ] },

  // C型（结构）— 2题
  { id: 14, dimension: 'C', capability: '规范遵循',
    text: '过去半年，面对公司或团队的规章制度、操作流程，你的态度是？',
    options: [
      { label: 'A', text: '严格遵守，我相信流程和规范能保证质量和效率', score: 3 },
      { label: 'B', text: '大部分遵守，但觉得有些流程太死板会适当变通', score: 1 },
      { label: 'C', text: '不太关注流程，更注重实际效果', score: 0 },
    ] },
  { id: 15, dimension: 'C', capability: '条理规划',
    text: '过去半年，你如何管理工作和生活中的各项事务？',
    options: [
      { label: 'A', text: '有系统化的管理方式（清单/表格/工具），井井有条', score: 3 },
      { label: 'B', text: '心里有数但不会特意记录下来', score: 1 },
      { label: 'C', text: '比较随性，事情来了再处理', score: 0 },
    ] },
];

// ===================== 维度定义 =====================

export interface DimensionDefinition {
  id: string;
  name: string;
  target: string;
  behavior: string;
  abilities: string[];
  environment: string;
}

export const dimensionDefs: DimensionDefinition[] = [
  {
    id: 'R', name: '现实型（执行）',
    target: '评估动手执行、实际操作的能力倾向',
    behavior: '倾向于通过动手操作、工具使用和具体行动来完成任务',
    abilities: ['动手实践', '工具操作', '现场执行', '实操解决'],
    environment: '需要动手操作、现场执行、有具体产出的环境',
  },
  {
    id: 'I', name: '研究型（分析）',
    target: '评估逻辑分析、深度思考的能力倾向',
    behavior: '倾向于通过数据收集、逻辑推理和系统分析来理解问题',
    abilities: ['数据分析', '逻辑推理', '批判思维', '系统思考'],
    environment: '需要深度思考、数据驱动、持续研究的环境',
  },
  {
    id: 'A', name: '艺术型（创造）',
    target: '评估创新思维、创意表达的能力倾向',
    behavior: '倾向于通过创造性思维和发散思考来解决问题',
    abilities: ['创意思维', '审美表达', '发散思考', '创新突破'],
    environment: '需要创意产出、审美判断、鼓励试错的环境',
  },
  {
    id: 'S', name: '社会型（共情）',
    target: '评估人际理解、情感共鸣的能力倾向',
    behavior: '倾向于通过理解他人、情感连接和协作支持来互动',
    abilities: ['共情能力', '倾听理解', '协作支持', '人际敏感'],
    environment: '需要人际互动、情感支持、团队协作的环境',
  },
  {
    id: 'E', name: '企业型（影响）',
    target: '评估领导驱动、影响说服的能力倾向',
    behavior: '倾向于通过目标设定和影响他人来推动事情发生',
    abilities: ['领导驱动', '影响说服', '目标导向', '风险承担'],
    environment: '需要目标驱动、资源整合、鼓励主动性的环境',
  },
  {
    id: 'C', name: '常规型（结构）',
    target: '评估规范执行、系统化思维的倾向',
    behavior: '倾向于通过规则遵循和系统化工作来完成任务',
    abilities: ['规范执行', '流程优化', '细致执行', '系统思维'],
    environment: '需要规则明确、流程清晰、标准严格的环境',
  },
];

// ===================== 维度 → 能力 → 环境 → 方向 映射 =====================

export interface CareerMapping {
  dimension: string;
  abilityLabel: string;
  suitableEnvironment: string;
  developmentDirection: string;
}

export const careerMappings: CareerMapping[] = [
  {
    dimension: 'R（执行）',
    abilityLabel: '动手实践 + 工具操作 + 现场执行',
    suitableEnvironment: '需要动手操作、现场执行、看到具体成果的实操型团队',
    developmentDirection: '技术执行线：从技术执行到技术专家，再到技术管理',
  },
  {
    dimension: 'I（分析）',
    abilityLabel: '数据分析 + 逻辑推理 + 系统思考',
    suitableEnvironment: '鼓励深度思考、数据驱动决策的研究分析型团队',
    developmentDirection: '专业研究线：从分析执行到专业分析，再到策略规划',
  },
  {
    dimension: 'A（创造）',
    abilityLabel: '创意思维 + 审美表达 + 创新突破',
    suitableEnvironment: '鼓励创新、容忍试错、重视审美的创意型团队',
    developmentDirection: '创意专业线：从创意执行到创意指导，再到创意策略',
  },
  {
    dimension: 'S（共情）',
    abilityLabel: '共情能力 + 倾听理解 + 协作支持',
    suitableEnvironment: '重视人际关系、团队合作、人文关怀的服务支持型团队',
    developmentDirection: '人际服务线：从服务执行到团队凝聚，再到组织发展',
  },
  {
    dimension: 'E（影响）',
    abilityLabel: '领导驱动 + 影响说服 + 目标导向',
    suitableEnvironment: '目标导向、结果驱动、鼓励主动性的业务管理型团队',
    developmentDirection: '管理领导线：从业务执行到团队管理，再到业务领导',
  },
  {
    dimension: 'C（结构）',
    abilityLabel: '规范执行 + 流程优化 + 系统思维',
    suitableEnvironment: '规则明确、流程清晰、注重标准和品质的运营型团队',
    developmentDirection: '运营管理线：从规范执行到流程优化，再到系统管理',
  },
];
