// MBTI 测评题目（精简版 15 题）
export const questions = [
  // E/I 维度 (1-4)
  { id: 1, text: '周末你更倾向于', options: ['约朋友聚会', '自己待着'], dimension: 'EI', direction: 'E' },
  { id: 2, text: '在团队中你通常', options: ['主动发言', '更多倾听'], dimension: 'EI', direction: 'E' },
  { id: 3, text: '你获取能量的方式', options: ['和人交往', '独处思考'], dimension: 'EI', direction: 'E' },
  { id: 4, text: '你的社交风格是', options: ['朋友多且广', '朋友少但深'], dimension: 'EI', direction: 'E' },

  // S/N 维度 (5-8)
  { id: 5, text: '你更关注', options: ['具体的事实细节', '整体的概念可能'], dimension: 'SN', direction: 'S' },
  { id: 6, text: '你更相信', options: ['亲身经验', '直觉预感'], dimension: 'SN', direction: 'S' },
  { id: 7, text: '你更喜欢谈论', options: ['实际事务', '未来设想'], dimension: 'SN', direction: 'S' },
  { id: 8, text: '学习时你喜欢', options: ['按部就班', '先看全貌'], dimension: 'SN', direction: 'S' },

  // T/F 维度 (9-12)
  { id: 9, text: '做决定时你更依赖', options: ['逻辑分析', '内心感受'], dimension: 'TF', direction: 'T' },
  { id: 10, text: '你更看重', options: ['公平公正', '和谐体谅'], dimension: 'TF', direction: 'T' },
  { id: 11, text: '别人倾诉时你会', options: ['分析问题', '给予安慰'], dimension: 'TF', direction: 'T' },
  { id: 12, text: '你更容易被说服', options: ['数据和逻辑', '情感共鸣'], dimension: 'TF', direction: 'T' },

  // J/P 维度 (13-15)
  { id: 13, text: '你更喜欢', options: ['计划安排', '灵活随意'], dimension: 'JP', direction: 'J' },
  { id: 14, text: '你的桌面通常是', options: ['整洁有序', '随性摆放'], dimension: 'JP', direction: 'J' },
  { id: 15, text: '面对截止日期', options: ['提前完成', '最后冲刺'], dimension: 'JP', direction: 'J' },
];
