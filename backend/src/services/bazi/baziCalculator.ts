// 性格分析引擎（八字排盘）
// 使用 lunar-javascript 库进行农历转换和天干地支计算

const Lunar = require('lunar-javascript');
import { calculateWuYunLiuQi } from './wuYunLiuQi';

export interface BaZiInput {
  birthDate: Date;
  birthHour: number;   // 0-23
  birthMinute: number; // 0-59
  gender: string;      // "male" | "female"
}

export interface BaZiOutput {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  yearStem: string;
  monthStem: string;
  dayStem: string;
  hourStem: string;
  yearBranch: string;
  monthBranch: string;
  dayBranch: string;
  hourBranch: string;
  yearNaYin: string;
  monthNaYin: string;
  dayNaYin: string;
  hourNaYin: string;
  fiveElements: Record<string, number>;
  shiShen: Record<string, string>;
  yongShen: string;
  jiShen: string;
  daYun: DaYunInfo[];
  [key: string]: any;
}

export interface DaYunInfo {
  ageStart: number;
  ageEnd: number;
  pillar: string;
  description: string;
}

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 五行对应
const TIAN_GAN_WU_XING: Record<string, string> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};
const DI_ZHI_WU_XING: Record<string, string> = {
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '辰': '土', '戌': '土', '丑': '土', '未': '土',
  '申': '金', '酉': '金',
  '子': '水', '亥': '水',
};

// 纳音五行
const NA_YIN: Record<string, string> = {
  '甲子': '海中金', '乙丑': '海中金',
  '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木',
  '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金',
  '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水',
  '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金',
  '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水',
  '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火',
  '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水',
  '甲午': '沙中金', '乙未': '沙中金',
  '丙申': '山下火', '丁酉': '山下火',
  '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土',
  '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火',
  '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土',
  '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木',
  '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '沙中土', '丁巳': '沙中土',
  '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木',
  '壬戌': '大海水', '癸亥': '大海水',
};

// 十神关系
const SHI_SHEN_MAP: Record<string, Record<string, string>> = {
  '甲': { '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印' },
  '乙': { '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印' },
  '丙': { '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官' },
  '丁': { '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀' },
  '戊': { '甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财' },
  '己': { '甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财' },
  '庚': { '甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官' },
  '辛': { '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神' },
  '壬': { '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财' },
  '癸': { '甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩' },
};

// 时辰地支对应
const HOUR_BRANCH_MAP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const HOUR_BRANCH_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function getHourBranch(hour: number): string {
  const index = Math.floor((hour + 1) / 2) % 12;
  return HOUR_BRANCH_NAMES[index];
}

function getHourStemIndex(dayStemIndex: number, hourBranchIndex: number): number {
  // 五鼠遁：甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途
  const startMap = [0, 2, 4, 6, 8]; // 甲0,乙2,丙4,丁6,戊8
  const start = startMap[dayStemIndex % 5];
  return (start + hourBranchIndex) % 10;
}

function getNaYin(stem: string, branch: string): string {
  return NA_YIN[stem + branch] || '';
}

// 大运计算
function calculateDaYun(gender: string, monthPillarIndex: number, dayStemIndex: number): DaYunInfo[] {
  const isMale = gender === 'male';
  const isYang = dayStemIndex % 2 === 0; // 阳年
  const isForward = (isMale && isYang) || (!isMale && !isYang);

  const daYun: DaYunInfo[] = [];
  const startAge = 0; // 简化处理，实际需要根据节气计算起运年龄

  for (let i = 0; i < 8; i++) {
    const offset = isForward ? (i + 1) : -(i + 1);
    const branchIndex = ((monthPillarIndex % 12 + offset) + 12) % 12;
    const stemIndex = ((monthPillarIndex + offset * 2) + 20) % 10;
    const pillar = TIAN_GAN[stemIndex] + DI_ZHI[branchIndex];

    daYun.push({
      ageStart: startAge + i * 10,
      ageEnd: startAge + (i + 1) * 10 - 1,
      pillar,
      description: `${startAge + i * 10}-${startAge + (i + 1) * 10 - 1}岁 ${pillar}运`,
    });
  }

  return daYun;
}

// 主排盘函数
export function calculateBaZi(input: BaZiInput): BaZiOutput {
  const { birthDate, birthHour, gender } = input;

  // 使用 lunar-javascript 获取四柱
  const solar = Lunar.Solar.fromDate(birthDate);
  const lunar = solar.getLunar();

  // 获取八字的四柱
  const yearPillar = lunar.getYearInGanZhi();   // 年柱
  const monthPillar = lunar.getMonthInGanZhi();  // 月柱
  const dayPillar = lunar.getDayInGanZhi();      // 日柱

  // 解析天干地支
  const yearStem = yearPillar.charAt(0);
  const yearBranch = yearPillar.charAt(1);
  const monthStem = monthPillar.charAt(0);
  const monthBranch = monthPillar.charAt(1);
  const dayStem = dayPillar.charAt(0);
  const dayBranch = dayPillar.charAt(1);

  // 时柱计算
  const dayStemIndex = TIAN_GAN.indexOf(dayStem);
  const hourBranchName = getHourBranch(birthHour);
  const hourBranchIndex = DI_ZHI.indexOf(hourBranchName);
  const hourStemIndex = getHourStemIndex(dayStemIndex, hourBranchIndex);
  const hourStem = TIAN_GAN[hourStemIndex];
  const hourPillar = hourStem + hourBranchName;

  // 纳音
  const yearNaYin = getNaYin(yearStem, yearBranch);
  const monthNaYin = getNaYin(monthStem, monthBranch);
  const dayNaYin = getNaYin(dayStem, dayBranch);
  const hourNaYin = getNaYin(hourStem, hourBranchName);

  // 五行统计
  const allStems = [yearStem, monthStem, dayStem, hourStem];
  const allBranches = [yearBranch, monthBranch, dayBranch, hourBranchName];
  const fiveElements: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

  allStems.forEach(s => {
    const wx = TIAN_GAN_WU_XING[s];
    if (wx) fiveElements[wx]++;
  });
  allBranches.forEach(b => {
    const wx = DI_ZHI_WU_XING[b];
    if (wx) fiveElements[wx]++;
  });

  // 十神分析（以日干为基准）
  const allGan = [yearStem, monthStem, dayStem, hourStem];
  const shiShen: Record<string, string> = {};
  allGan.forEach(g => {
    shiShen[g] = SHI_SHEN_MAP[dayStem]?.[g] || '';
  });

  // 用神忌神（简化版：根据五行平衡）
  let yongShen = '火';
  let jiShen = '水';
  const sorted = Object.entries(fiveElements).sort((a, b) => a[1] - b[1]);
  yongShen = sorted[0][0]; // 最弱的五行
  jiShen = sorted[sorted.length - 1][0]; // 最强的五行

  // 大运
  const monthStemIndex = TIAN_GAN.indexOf(monthStem);
  const monthBranchIdx = DI_ZHI.indexOf(monthBranch);
  const daYun = calculateDaYun(gender, monthStemIndex * 2 + monthBranchIdx % 12, dayStemIndex);

  return {
    yearPillar, monthPillar, dayPillar, hourPillar,
    yearStem, monthStem, dayStem, hourStem,
    yearBranch, monthBranch, dayBranch, hourBranch: hourBranchName,
    yearNaYin, monthNaYin, dayNaYin, hourNaYin,
    fiveElements,
    shiShen,
    yongShen,
    jiShen,
    daYun,
    // 额外数据
    birthDate: input.birthDate,
    birthHour: input.birthHour,
    gender: input.gender,
    // 详细解读数据
    interpretations: {
      dayMaster: dayStem, // 日主
      dayMasterWuXing: TIAN_GAN_WU_XING[dayStem],
    },
    // 五运六气
    wuYunLiuQi: calculateWuYunLiuQi(yearStem, yearBranch),
  };
}
