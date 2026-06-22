/**
 * 五层职业推荐模型
 *
 * 先天特质 (五行/日主/十神)
 *   ↓
 * 行为特征 (可观察的现实行为)
 *   ↓
 * 能力倾向 (可培养的能力标签)
 *   ↓
 * 职业能力模型 (职业能力库)
 *   ↓
 * 职业方向 (工作类型/环境/角色/路径)
 */

// ===================== 第一层：先天特质 =====================

/** 五行 → 先天倾向 */
const WU_XING_TRAITS: Record<string, {
  label: string;
  tendencies: string[];
  description: string;
}> = {
  '木': {
    label: '木性',
    tendencies: ['喜欢探索新事物', '追求成长与变化', '独立自主', '向往自由', '有开拓精神'],
    description: '木曰曲直，你天性喜欢生长、探索和变化。你对新鲜事物充满好奇，不喜欢被束缚，有强烈的自主意识和开拓精神。思维活跃，善于从不同角度看问题。',
  },
  '火': {
    label: '火性',
    tendencies: ['表达欲强', '行动迅速', '热情有感染力', '喜欢被关注', '善于激励他人'],
    description: '火曰炎上，你天生热情开朗，表达欲望强烈，行动力强。你的热情能够感染周围的人，喜欢在人群中展现自己，有较强的表现力和号召力。',
  },
  '土': {
    label: '土性',
    tendencies: ['稳重务实', '包容大度', '注重规则和秩序', '善于协调和承载', '有耐心和毅力'],
    description: '土曰稼穑，你天性稳重踏实，做事有条理，善于规划和组织。你包容性强，能够承载压力，是团队中可靠的稳定力量。注重实际效果，不尚空谈。',
  },
  '金': {
    label: '金性',
    tendencies: ['规则感强', '标准意识高', '追求精确和完美', '善于分析和判断', '有原则性'],
    description: '金曰从革，你对规则和标准有天然的敏感度，做事严谨认真，追求精确和品质。善于分析和判断，有较强的逻辑思维和批判性思维。注重原则和底线。',
  },
  '水': {
    label: '水性',
    tendencies: ['善于深度思考', '灵活应变', '包容接纳', '有智慧和洞察力', '善于整合资源'],
    description: '水曰润下，你思维深邃，善于思考和内省。你灵活应变，能适应不同的环境和角色。包容性强，善于整合不同资源和信息，有较强的洞察力和智慧。',
  },
};

/** 日主天干 → 先天倾向（在五行基础上细化） */
const DAY_STEM_TRAITS: Record<string, {
  tendencies: string[];
  nuance: string;
}> = {
  '甲': {
    tendencies: ['有领导欲', '敢于担当', '喜欢开拓新局面', '有成长型思维'],
    nuance: '甲木为阳木，如参天大树。你的领导力和开拓精神尤为突出，喜欢从零到一开创局面。',
  },
  '乙': {
    tendencies: ['灵活柔韧', '善于协调', '适应力强', '善于在变化中寻找机会'],
    nuance: '乙木为阴木，如藤蔓花草。你灵活柔韧，善于在复杂环境中找到生存和发展之道，协调能力强。',
  },
  '丙': {
    tendencies: ['热情大方', '感染力强', '喜欢影响他人', '有表现欲'],
    nuance: '丙火为阳火，如太阳当空。你的热情和感染力最为突出，善于鼓舞团队，适合需要表现力和影响力的角色。',
  },
  '丁': {
    tendencies: ['细腻敏锐', '洞察力强', '注重品质和细节', '有审美追求'],
    nuance: '丁火为阴火，如灯烛之光。你细腻敏锐，洞察力强，善于发现细节中的价值，注重内涵和品质。',
  },
  '戊': {
    tendencies: ['稳重厚实', '包容大度', '善于管理', '有统筹能力'],
    nuance: '戊土为阳土，如高山之土。你最为稳重可靠，统筹能力强，善于管理和组织，是团队的中坚力量。',
  },
  '己': {
    tendencies: ['务实细腻', '善于滋养他人', '注重实际操作', '有服务精神'],
    nuance: '己土为阴土，如田园沃土。你务实细腻，善于成就和支持他人，适合需要耐心和细致的工作。',
  },
  '庚': {
    tendencies: ['果断刚毅', '意志坚强', '敢于突破', '有改革精神'],
    nuance: '庚金为阳金，如刀剑之金。你最为果断刚毅，执行力强，敢于攻坚克难和推动变革。',
  },
  '辛': {
    tendencies: ['精致优雅', '追求完美', '有审美判断', '善于精雕细琢'],
    nuance: '辛金为阴金，如珠玉之金。你追求完美，审美出众，善于精雕细琢和品质把控。',
  },
  '壬': {
    tendencies: ['智慧深邃', '气度不凡', '善于统筹全局', '有战略眼光'],
    nuance: '壬水为阳水，如江海之水。你智慧豁达，善于统筹全局，有较强的战略规划能力。',
  },
  '癸': {
    tendencies: ['聪敏内敛', '富于想象', '有灵性和感应力', '善于创意和表达'],
    nuance: '癸水为阴水，如雨露之水。你聪敏内敛，富于灵感，擅长创意策划和深度思考。',
  },
};

/** 十神 → 社会关系倾向 */
const SHI_SHEN_BEHAVIOR: Record<string, {
  interpersonal: string;
  workStyle: string;
}> = {
  '比肩': { interpersonal: '平等合作，与同事关系融洽，喜欢团队协作', workStyle: '自主性强，适合需要独立负责的岗位' },
  '劫财': { interpersonal: '竞争意识强，善于在竞争中合作', workStyle: '行动力强，适合需要快速反应的工作' },
  '食神': { interpersonal: '温和包容，善于表达和分享', workStyle: '创意丰富，适合需要创造力的工作' },
  '伤官': { interpersonal: '表达直接，有批判精神，不愿随波逐流', workStyle: '创新能力强，适合需要突破常规的工作' },
  '偏财': { interpersonal: '交际广泛，善于整合资源', workStyle: '灵活多变，适合需要社交能力的工作' },
  '正财': { interpersonal: '务实守信，做事踏实可靠', workStyle: '稳定务实，适合需要持续积累的工作' },
  '七杀': { interpersonal: '有威慑力，敢于管理，适合领导角色', workStyle: '执行力强，适合需要决断力的工作' },
  '正官': { interpersonal: '遵纪守法，尊重权威，有责任感', workStyle: '规范有序，适合需要规则意识的工作' },
  '偏印': { interpersonal: '独立思考，不喜社交，注重内在', workStyle: '研究能力强，适合需要深度思考的工作' },
  '正印': { interpersonal: '有耐心，善于教导和帮助他人', workStyle: '学习能力强，适合需要知识积累的工作' },
};


// ===================== 第二层：行为特征 =====================

/** 五行 × 行为映射 */
const WU_XING_BEHAVIORS: Record<string, string[]> = {
  '木': [
    '主动探索新领域、新知识',
    '喜欢独立决策和自主安排工作',
    '不喜被过多规则和流程约束',
    '经常提出新的想法和方案',
    '愿意尝试不同的工作方法',
    '对环境变化反应积极，善于调整',
  ],
  '火': [
    '在会议或讨论中主动表达观点',
    '行动迅速，想到就做，不拖延',
    '能够带动团队气氛，鼓舞他人',
    '喜欢在公众场合展示自己',
    '做事有激情，但容易三分钟热度',
    '善于用热情感染和说服他人',
  ],
  '土': [
    '按计划和流程有条不紊地工作',
    '善于协调不同部门和人员的资源',
    '承担稳定可靠的角色，让人放心',
    '注重工作的规范性和完整性',
    '有耐心处理重复性和事务性工作',
    '在团队中起到稳定军心的作用',
  ],
  '金': [
    '注重工作细节和质量标准',
    '做事条理清晰，逻辑性强',
    '善于发现问题和漏洞',
    '喜欢有明确规则和标准的工作',
    '对数据敏感，善于定量分析',
    '追求精确，不喜欢模糊和不确定性',
  ],
  '水': [
    '喜欢花时间深入思考和分析问题',
    '善于从多角度理解复杂情况',
    '学习新知识速度快，吸收能力强',
    '在不同角色和任务间灵活切换',
    '善于整合不同来源的信息和资源',
    '在压力下保持冷静，善于应变',
  ],
};

/** 日主强弱修正（身强 vs 身弱） */
const STRONG_WEAK_BEHAVIORS: Record<string, {
  strong: string[];
  weak: string[];
}> = {
  '木': {
    strong: ['自信心强，敢于担当', '喜欢主导局面', '勇于冒险和尝试'],
    weak: ['善于配合和支持', '注重团队和谐', '愿意向他人学习'],
  },
  '火': {
    strong: ['表现欲极强', '喜欢成为焦点', '感染力强，能带动他人'],
    weak: ['善于观察和倾听', '谨慎表达', '注重他人感受'],
  },
  '土': {
    strong: ['固执已见，不易改变', '喜欢掌控资源', '承担责任'],
    weak: ['灵活性好，善于配合', '愿意接受建议', '注重他人需求'],
  },
  '金': {
    strong: ['标准极高', '批判性强', '不易妥协'],
    weak: ['注重合作中的标准', '善于吸收他人意见', '在规则和灵活间寻找平衡'],
  },
  '水': {
    strong: ['思维深广', '善于谋划', '独立判断能力强'],
    weak: ['善于借鉴他人智慧', '注重信息收集', '在交流中深化思考'],
  },
};


// ===================== 第三层：能力倾向 =====================

/** 行为 → 可培养能力映射 */
const BEHAVIOR_TO_ABILITY: Record<string, string[]> = {
  // 探索类行为 → 创新能力
  '探索': ['创新能力', '学习能力', '适应能力'],
  '独立决策': ['决策能力', '判断能力', '担当能力'],
  '新想法': ['创意思维', '发散思维', '概念化能力'],
  '尝试': ['实验能力', '实践能力', '快速迭代能力'],

  // 表达类行为 → 沟通能力
  '表达': ['沟通表达能力', '说服能力', '公众演讲能力'],
  '行动迅速': ['执行力', '时间管理能力', '优先级判断能力'],
  '带动': ['团队激励能力', '影响力', '组织动员能力'],
  '展示': ['呈现能力', '表现力', '自信心'],

  // 规划类行为 → 管理能力
  '计划': ['计划能力', '目标管理能力', '流程设计能力'],
  '协调': ['协同合作能力', '资源整合能力', '谈判能力'],
  '稳定': ['抗压能力', '情绪管理能力', '可靠性'],
  '规范': ['标准化能力', '质量控制能力', '制度建设能力'],

  // 分析类行为 → 分析能力
  '细节': ['细节把控能力', '观察能力', '精确性'],
  '逻辑': ['逻辑思维能力', '结构化思维能力', '推理能力'],
  '发现': ['问题发现能力', '批判性思维', '风险识别能力'],
  '数据': ['数据分析能力', '量化思维能力', '数据工具使用能力'],

  // 思考类行为 → 研究能力
  '深入思考': ['深度思考能力', '系统思维能力', '概念分析能力'],
  '多角度': ['多视角思维能力', '换位思考能力', '全局思维能力'],
  '学习': ['快速学习能力', '知识管理能力', '信息检索能力'],
  '整合': ['资源整合能力', '跨界思维能力', '综合归纳能力'],
};

/** 完整能力标签库 */
const ALL_ABILITIES: Record<string, {
  name: string;
  description: string;
  developMethod: string;
}> = {
  '创新能力': { name: '创新能力', description: '产生新想法、新方案的能力', developMethod: '多接触跨界知识，练习头脑风暴和逆向思维' },
  '学习能力': { name: '学习能力', description: '快速掌握新知识和新技能的能力', developMethod: '建立知识框架，采用费曼学习法，定期复盘' },
  '适应能力': { name: '适应能力', description: '在变化中快速调整的能力', developMethod: '主动接触不同环境，练习走出舒适区' },
  '决策能力': { name: '决策能力', description: '在信息不完全时做出合理判断的能力', developMethod: '练习用决策矩阵分析，从小决策开始积累经验' },
  '创意思维': { name: '创意思维', description: '产生原创想法的能力', developMethod: '保持好奇心，多读跨领域书籍，练习联想思维' },
  '沟通表达能力': { name: '沟通表达能力', description: '清晰准确传递信息的能力', developMethod: '练习结构化表达（金字塔原理），多做公开分享' },
  '说服能力': { name: '说服能力', description: '让他人接受自己观点的能力', developMethod: '学习逻辑论证和故事讲述，了解对方需求' },
  '公众演讲能力': { name: '公众演讲能力', description: '在公众场合有效表达的能力', developMethod: '从小范围开始练习，录制回看改进' },
  '执行力': { name: '执行力', description: '将计划转化为行动和结果的能力', developMethod: '使用OKR分解目标，建立行动清单习惯' },
  '时间管理能力': { name: '时间管理能力', description: '合理安排时间、提高效率的能力', developMethod: '使用番茄工作法，学习四象限法则' },
  '团队激励能力': { name: '团队激励能力', description: '激发团队积极性和潜能的能力', developMethod: '学习每个成员的动机，给予及时正向反馈' },
  '影响力': { name: '影响力', description: '自然影响他人思想和行为的能力', developMethod: '建立专业权威，增强人际信任' },
  '呈现能力': { name: '呈现能力', description: '将信息以视觉化方式有效展示的能力', developMethod: '学习PPT/数据可视化技巧，练习讲故事' },
  '计划能力': { name: '计划能力', description: '制定合理目标和路径的能力', developMethod: '学习项目管理和目标拆解方法' },
  '目标管理能力': { name: '目标管理能力', description: '设定和追踪目标的能力', developMethod: '使用SMART原则设定目标，定期复盘' },
  '协同合作能力': { name: '协同合作能力', description: '与他人高效配合达成共同目标的能力', developMethod: '练习倾听和反馈，建立互信关系' },
  '资源整合能力': { name: '资源整合能力', description: '将分散资源有效组合利用的能力', developMethod: '建立人脉网络，学习系统思维' },
  '抗压能力': { name: '抗压能力', description: '在压力下保持稳定表现的能力', developMethod: '练习正念冥想，建立支持系统，合理运动' },
  '情绪管理能力': { name: '情绪管理能力', description: '识别和调节自己和他人情绪的能力', developMethod: '练习情绪日记，学习情商相关知识和技巧' },
  '细节把控能力': { name: '细节把控能力', description: '关注和处理好细节的能力', developMethod: '建立检查清单，培养复盘习惯' },
  '逻辑思维能力': { name: '逻辑思维能力', description: '按照逻辑规律进行思考和分析的能力', developMethod: '练习结构化思维，学习逻辑论证方法' },
  '结构化思维能力': { name: '结构化思维能力', description: '将复杂问题分解为结构模块的能力', developMethod: '学习金字塔原理和MECE原则' },
  '数据分析能力': { name: '数据分析能力', description: '从数据中提取有价值信息的能力', developMethod: '学习统计学基础，掌握Excel/SQL等工具' },
  '问题发现能力': { name: '问题发现能力', description: '识别潜在问题和风险的能力', developMethod: '练习5Why分析法，培养批判性思维' },
  '批判性思维': { name: '批判性思维', description: '对信息进行客观分析和评估的能力', developMethod: '主动寻找反面证据，练习论证分析' },
  '深度思考能力': { name: '深度思考能力', description: '透过表象看到本质的思考能力', developMethod: '练习第一性原理思考，多问为什么' },
  '系统思维能力': { name: '系统思维能力', description: '从整体和关联角度理解问题的能力', developMethod: '学习系统论，练习因果回路图' },
  '快速学习能力': { name: '快速学习能力', description: '在短时间内掌握新领域知识的能力', developMethod: '掌握二八法则，先建立框架再填充细节' },
  '知识管理能力': { name: '知识管理能力', description: '有效获取、整理和应用知识的能力', developMethod: '建立第二大脑系统，练习知识输出' },
  '综合归纳能力': { name: '综合归纳能力', description: '将零散信息整合为系统结论的能力', developMethod: '练习摘要和总结，学习思维导图' },
};


// ===================== 第四层：职业能力模型 =====================

interface CareerCompetency {
  title: string;
  requiredAbilities: string[];
  description: string;
  relatedCareers: string[];
}

const CAREER_COMPETENCIES: Record<string, CareerCompetency> = {
  '产品设计': {
    title: '产品设计',
    requiredAbilities: ['创新能力', '逻辑思维能力', '协同合作能力', '用户理解能力', '数据分析能力'],
    description: '从用户需求出发，设计产品功能和体验，协调研发、设计、运营等团队推进产品落地。',
    relatedCareers: ['产品经理', '产品设计师', '需求分析师'],
  },
  '技术研发': {
    title: '技术研发',
    requiredAbilities: ['逻辑思维能力', '深度思考能力', '快速学习能力', '结构化思维能力', '问题发现能力'],
    description: '通过技术手段解决复杂问题，开发和维护软件系统，持续学习和应用新技术。',
    relatedCareers: ['软件工程师', '算法工程师', '系统架构师'],
  },
  '创意设计': {
    title: '创意设计',
    requiredAbilities: ['创意思维', '呈现能力', '细节把控能力', '审美能力', '沟通表达能力'],
    description: '通过视觉、交互等方式传递信息和情感，创造有美感和功能性的设计作品。',
    relatedCareers: ['UI/UX设计师', '平面设计师', '品牌设计师'],
  },
  '市场运营': {
    title: '市场运营',
    requiredAbilities: ['沟通表达能力', '数据分析能力', '创意思维', '执行力', '团队激励能力'],
    description: '制定市场策略，运营用户和内容，推动品牌传播和业务增长。',
    relatedCareers: ['市场专员', '运营经理', '品牌策划'],
  },
  '销售商务': {
    title: '销售商务',
    requiredAbilities: ['沟通表达能力', '说服能力', '影响力', '抗压能力', '资源整合能力'],
    description: '开拓市场和客户，维护商务关系，推动产品和服务的销售转化。',
    relatedCareers: ['销售经理', '商务拓展', '客户成功经理'],
  },
  '项目管理': {
    title: '项目管理',
    requiredAbilities: ['计划能力', '目标管理能力', '协同合作能力', '抗压能力', '决策能力'],
    description: '规划项目目标和路线图，协调资源，控制进度和风险，确保项目按时高质量交付。',
    relatedCareers: ['项目经理', 'Scrum Master', '项目集经理'],
  },
  '数据分析': {
    title: '数据分析',
    requiredAbilities: ['数据分析能力', '结构化思维能力', '逻辑思维能力', '问题发现能力', '综合归纳能力'],
    description: '收集、清洗、分析数据，发现业务规律和问题，为决策提供数据支持。',
    relatedCareers: ['数据分析师', '商业分析师', '数据科学家'],
  },
  '咨询顾问': {
    title: '咨询顾问',
    requiredAbilities: ['逻辑思维能力', '沟通表达能力', '综合归纳能力', '快速学习能力', '深度思考能力'],
    description: '深入理解客户问题和需求，运用专业知识和分析方法提供解决方案和建议。',
    relatedCareers: ['管理咨询顾问', 'IT咨询顾问', '战略分析师'],
  },
  '教育培训': {
    title: '教育培训',
    requiredAbilities: ['沟通表达能力', '影响力', '情绪管理能力', '知识管理能力', '团队激励能力'],
    description: '设计和实施教学内容，引导学员学习和成长，传递知识和技能。',
    relatedCareers: ['培训师', '教师', '教育产品经理'],
  },
  '研究开发': {
    title: '研究开发',
    requiredAbilities: ['深度思考能力', '系统思维能力', '快速学习能力', '创意思维', '综合归纳能力'],
    description: '在专业领域进行深入研究，探索新理论、新技术、新方法，推动知识边界拓展。',
    relatedCareers: ['研究员', '研发工程师', '学术研究者'],
  },
  '运营管理': {
    title: '运营管理',
    requiredAbilities: ['计划能力', '执行力', '协同合作能力', '细节把控能力', '决策能力'],
    description: '管理日常运营流程，优化效率，保障业务稳定运行和持续改进。',
    relatedCareers: ['运营主管', '流程经理', '供应链管理'],
  },
  '质量控制': {
    title: '质量控制',
    requiredAbilities: ['细节把控能力', '结构化思维能力', '问题发现能力', '批判性思维', '逻辑思维能力'],
    description: '制定和执行质量标准，检测和发现产品或流程中的问题，推动质量改进。',
    relatedCareers: ['测试工程师', '质量经理', '审计师'],
  },
};


// ===================== 第五层：职业方向 =====================

interface CareerDirection {
  workTypes: string[];
  workEnvironments: string[];
  teamRoles: string[];
  developmentPaths: string[];
  avoidWorkTypes: string[];
}

/** 五行 → 职业方向 */
const WU_XING_DIRECTIONS: Record<string, CareerDirection> = {
  '木': {
    workTypes: [
      '探索型工作 — 需要不断拓展新领域、尝试新方法',
      '创新驱动型工作 — 需要持续产出新想法和方案',
      '成长型工作 — 有明确的成长空间和学习机会',
      '自主型工作 — 有较大的自主决策权和灵活性',
    ],
    workEnvironments: [
      '创新团队 — 鼓励尝试和试错，容忍失败',
      '扁平化组织 — 层级少，沟通直接',
      '快速成长期公司 — 变化快，机会多',
      '弹性工作制 — 时间和地点灵活',
    ],
    teamRoles: [
      '开拓者 — 负责新业务、新市场的探索',
      '创意发起人 — 提出新想法和新方向',
      '独立贡献者 — 自主负责重要模块',
    ],
    developmentPaths: [
      '从0到1的阶段更适合你发挥开拓优势',
      '多样化项目经验比深耕单一领域更适合',
      '创业或内部创业是理想的发展方向',
    ],
    avoidWorkTypes: [
      '高度重复的日常执行工作',
      '流程固定、缺乏变化的工作',
      '严格按标准操作、没有自主空间的工作',
    ],
  },
  '火': {
    workTypes: [
      '表现型工作 — 需要公开表达和展示',
      '影响型工作 — 通过影响力推动事情发生',
      '快节奏工作 — 行动迅速，反馈即时',
      '社交型工作 — 大量人际互动和沟通',
    ],
    workEnvironments: [
      '充满活力的团队 — 氛围活跃，士气高涨',
      '注重结果而非过程的组织',
      '有舞台和曝光机会的平台',
      '年轻人多的团队 — 思维活跃，节奏快',
    ],
    teamRoles: [
      '鼓舞者 — 带动团队士气，活跃团队气氛',
      '代言人 — 对外代表团队发声',
      '推动者 — 推动事务快速落地执行',
    ],
    developmentPaths: [
      '从一线执行到团队带动者的路径适合你',
      '市场和销售方向是天然优势领域',
      '公众表达和影响力培养是关键成长点',
    ],
    avoidWorkTypes: [
      '长期独立工作、缺乏人际互动',
      '沉闷保守、缺乏活力的工作环境',
      '需要长时间保持沉默和聆听的工作',
    ],
  },
  '土': {
    workTypes: [
      '管理型工作 — 需要统筹规划和组织协调',
      '稳定型工作 — 有清晰的职责和预期',
      '服务型工作 — 支持和成就他人',
      '运营型工作 — 维护和优化现有系统',
    ],
    workEnvironments: [
      '成熟稳定的团队 — 制度完善，职责清晰',
      '注重规范和流程的组织',
      '层级清晰的管理体系',
      '长期稳定的行业和公司',
    ],
    teamRoles: [
      '稳定器 — 在团队中提供稳定可靠的支持',
      '组织者 — 负责协调和安排团队事务',
      '执行者 — 可靠地完成任务交付',
    ],
    developmentPaths: [
      '从专业执行到综合管理是自然的成长路径',
      '在稳定平台上深耕比频繁跳槽更适合',
      '流程优化和团队管理能力值得重点培养',
    ],
    avoidWorkTypes: [
      '频繁变动、缺乏稳定预期的工作',
      '缺乏规则和流程的混乱环境',
      '需要频繁出差和高度不确定性的工作',
    ],
  },
  '金': {
    workTypes: [
      '分析型工作 — 需要深入分析和判断',
      '技术型工作 — 需要专业技术和精确操作',
      '标准制定型工作 — 需要设定规则和标准',
      '质量控制型工作 — 需要审核和改进',
    ],
    workEnvironments: [
      '专业导向的团队 — 重视专业能力',
      '有明确标准和质量要求的组织',
      '数据驱动决策的环境',
      '重视制度和规则的公司',
    ],
    teamRoles: [
      '分析师 — 负责数据分析和问题诊断',
      '质量把关者 — 确保标准和品质',
      '专家角色 — 在专业领域提供深度支持',
    ],
    developmentPaths: [
      '在专业领域深耕成为专家最适合你',
      '从技术执行到技术管理的路径',
      '认证和资质对你有实际价值',
    ],
    avoidWorkTypes: [
      '混沌无序、缺乏标准的工作环境',
      '要求模糊、目标不清晰的任务',
      '需要大量社交而缺乏深度分析的工作',
    ],
  },
  '水': {
    workTypes: [
      '研究型工作 — 需要深度思考和探索',
      '战略型工作 — 需要统筹全局和长远规划',
      '顾问型工作 — 需要提供专业建议',
      '整合型工作 — 需要跨界整合资源',
    ],
    workEnvironments: [
      '开放包容的文化 — 鼓励不同观点',
      '重视思考和创新而非机械执行的组织',
      '学习型组织 — 持续学习和知识共享',
      '国际化或多元文化环境',
    ],
    teamRoles: [
      '智囊 — 提供深度分析和战略建议',
      '连接者 — 整合不同领域的信息和资源',
      '观察者 — 发现趋势和潜在机会',
    ],
    developmentPaths: [
      '专家路线 — 在专业领域建立深度优势',
      '战略路线 — 从专业到全局的战略思维发展',
      '跨界路线 — 利用整合能力连接不同领域',
    ],
    avoidWorkTypes: [
      '节奏极快、没有思考时间的工作',
      '重复性事务工作、缺乏智力挑战',
      '严格按指令执行、不需要独立思考的工作',
    ],
  },
};


// ===================== 主算法：从八字数据生成完整映射 =====================

export interface CareerAnalysisInput {
  fiveElements: Record<string, number>;  // e.g. {木:3, 火:1, 土:0, 金:2, 水:2}
  dayStem: string;                        // e.g. '甲'
  shiShen?: Record<string, string>;       // e.g. {甲: '比肩', 丙: '食神', ...}
  gender?: string;
}

export interface LayerOutput {
  /** 第一层：先天特质 */
  innateTraits: {
    primaryElement: string;
    elementalTendencies: string[];
    elementalDescription: string;
    dayStemTendencies: string[];
    dayStemNuance: string;
    shiShenInfluences: { stem: string; shen: string; interpersonal: string; workStyle: string }[];
  };
  /** 第二层：行为特征 */
  behaviors: string[];
  /** 第三层：能力倾向 */
  abilities: {
    labels: string[];
    details: { name: string; description: string; developMethod: string }[];
  };
  /** 第四层：职业能力 */
  careerCompetencies: {
    title: string;
    requiredAbilities: string[];
    description: string;
    relatedCareers: string[];
  }[];
  /** 第五层：职业方向 */
  direction: CareerDirection;
}

function getPrimaryElement(fiveElements: Record<string, number>): string {
  const sorted = Object.entries(fiveElements).sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
}

/** 根据五行映射行为关键词，再映射到能力 */
function getAbilityLabelsFromBehaviors(behaviors: string[]): string[] {
  const abilitySet = new Set<string>();
  for (const behavior of behaviors) {
    for (const [keyword, abilities] of Object.entries(BEHAVIOR_TO_ABILITY)) {
      if (behavior.includes(keyword)) {
        abilities.forEach(a => abilitySet.add(a));
      }
    }
  }
  return Array.from(abilitySet);
}

/** 根据能力匹配职业能力模型 */
function getMatchingCompetencies(abilityLabels: string[]): CareerCompetency[] {
  const scored: { competency: CareerCompetency; score: number }[] = [];

  for (const comp of Object.values(CAREER_COMPETENCIES)) {
    const matchCount = comp.requiredAbilities.filter(a => abilityLabels.includes(a)).length;
    const score = matchCount / comp.requiredAbilities.length;
    if (score > 0) {
      scored.push({ competency: comp, score });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(s => s.competency);
}

export function analyzeCareer(input: CareerAnalysisInput): LayerOutput {
  const primaryElement = getPrimaryElement(input.fiveElements);

  // ===== L1: 先天特质 =====
  const wxTrait = WU_XING_TRAITS[primaryElement] || WU_XING_TRAITS['木'];
  const dayStemTrait = DAY_STEM_TRAITS[input.dayStem] || DAY_STEM_TRAITS['甲'];
  const shiShenList = Object.entries(input.shiShen || {}).map(([stem, shen]) => {
    const info = SHI_SHEN_BEHAVIOR[shen] || { interpersonal: '', workStyle: '' };
    return { stem, shen, ...info };
  });

  // ===== L2: 行为特征 =====
  const wxBehaviors = WU_XING_BEHAVIORS[primaryElement] || WU_XING_BEHAVIORS['木'];
  const stemBehaviors = dayStemTrait.tendencies;
  const allBehaviors = [...wxBehaviors, ...stemBehaviors];

  // 去重
  const uniqueBehaviors = Array.from(new Set(allBehaviors)).slice(0, 10);

  // ===== L3: 能力倾向 =====
  const abilityLabels = getAbilityLabelsFromBehaviors(uniqueBehaviors);
  const abilityDetails = abilityLabels
    .filter(a => ALL_ABILITIES[a])
    .map(a => ALL_ABILITIES[a]);

  // ===== L4: 职业能力模型 =====
  const competencies = getMatchingCompetencies(abilityLabels);

  // ===== L5: 职业方向 =====
  const direction = WU_XING_DIRECTIONS[primaryElement] || WU_XING_DIRECTIONS['木'];

  return {
    innateTraits: {
      primaryElement,
      elementalTendencies: wxTrait.tendencies,
      elementalDescription: wxTrait.description,
      dayStemTendencies: dayStemTrait.tendencies,
      dayStemNuance: dayStemTrait.nuance,
      shiShenInfluences: shiShenList,
    },
    behaviors: uniqueBehaviors,
    abilities: {
      labels: abilityLabels,
      details: abilityDetails,
    },
    careerCompetencies: competencies,
    direction,
  };
}


// ===================== 格式化为报告文本 =====================

export function formatCareerAnalysis(analysis: LayerOutput): string {
  const parts: string[] = [];

  // L1: 先天特质
  parts.push('**🧬 先天特质分析**\n\n');
  parts.push(`你的先天核心特质为「${analysis.innateTraits.primaryElement}性」。\n\n`);
  parts.push(analysis.innateTraits.elementalDescription + '\n\n');
  parts.push(`你的主要先天倾向：\n`);
  analysis.innateTraits.elementalTendencies.forEach(t => { parts.push(`- ${t}\n`); });
  parts.push('\n');
  parts.push(`${analysis.innateTraits.dayStemNuance}\n\n`);

  if (analysis.innateTraits.shiShenInfluences.length > 0) {
    parts.push('十神关系对你行为模式的影响：\n');
    analysis.innateTraits.shiShenInfluences.forEach(s => {
      parts.push(`- ${s.stem}为「${s.shen}」：${s.interpersonal}，${s.workStyle}\n`);
    });
    parts.push('\n');
  }

  // L2: 行为特征
  parts.push('**📋 现实行为特征**\n\n');
  parts.push('基于先天特质，你在现实中容易出现以下行为：\n');
  analysis.behaviors.forEach(b => { parts.push(`- ${b}\n`); });
  parts.push('\n');

  // L3: 能力倾向
  parts.push('**💪 能力倾向分析**\n\n');
  parts.push('你的行为特征可以培养为以下核心能力：\n');
  analysis.abilities.details.forEach(a => {
    parts.push(`- **${a.name}**：${a.description}\n  *培养建议：${a.developMethod}*\n`);
  });
  parts.push('\n');

  // L4: 职业能力模型
  parts.push('**🎯 适配的职业能力方向**\n\n');
  if (analysis.careerCompetencies.length > 0) {
    analysis.careerCompetencies.forEach(c => {
      parts.push(`**${c.title}** — ${c.description}\n`);
      parts.push(`需要能力：${c.requiredAbilities.join('、')}\n`);
      parts.push(`相关职位：${c.relatedCareers.join('、')}\n\n`);
    });
  } else {
    parts.push('暂未找到高度匹配的职业方向，建议结合其他测评结果综合评估。\n\n');
  }

  // L5: 职业方向
  parts.push('**🧭 职业发展建议**\n\n');

  parts.push('✅ **适合的工作类型：**\n');
  analysis.direction.workTypes.forEach(t => { parts.push(`- ${t}\n`); });
  parts.push('\n');

  parts.push('✅ **适合的工作环境：**\n');
  analysis.direction.workEnvironments.forEach(e => { parts.push(`- ${e}\n`); });
  parts.push('\n');

  parts.push('✅ **适合的团队角色：**\n');
  analysis.direction.teamRoles.forEach(r => { parts.push(`- ${r}\n`); });
  parts.push('\n');

  parts.push('📈 **适合的发展路径：**\n');
  analysis.direction.developmentPaths.forEach(p => { parts.push(`- ${p}\n`); });
  parts.push('\n');

  parts.push('❌ **应避免的工作类型：**\n');
  analysis.direction.avoidWorkTypes.forEach(a => { parts.push(`- ${a}\n`); });
  parts.push('\n\n');

  return parts.join('');
}
