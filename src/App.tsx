import { useState, useEffect, useRef } from 'react';
import { Search, X, Calculator, Sword, Trophy, Ghost } from 'lucide-react';

// --- 类型定义 ---
interface Task {
  id: string;
  name: string;
  contrib: number;
  credit: number;
  time: number;
}

interface RawDataItem {
  name: string;
  time: string;
  sec: number;
  py: string;
  abbr: string;
}

// --- 常量配置 ---
const LIMITS = { CONTRIB: 1000, CREDIT: 5000 };

// 调整后的基准参数
const TASKS: Record<string, Task & { limit?: number }> = {
  HOLLOW: { id: 'hollow', name: "普通空洞", contrib: 80, credit: 600, time: 150 },
  HUNT: { id: 'hunt', name: "恶名狩猎", contrib: 100, credit: 500, time: 60 },
  EXPERT: { id: 'expert', name: "专业挑战", contrib: 70, credit: 250, time: 60 }
};

// --- 数据源 (保持不变) ---
const rawData = [
  // --- 极速档 (0-2m) ---
  { name: "雨果的心魔", time: "00:42", sec: 42, py: "yuguodexinmo", abbr: "ygdxm" },
  { name: "再见校园", time: "00:43", sec: 43, py: "zaijianxiaoyuan", abbr: "zjxy" },
  { name: "黑暗中的足迹", time: "00:50", sec: 50, py: "heianzhongdezuji", abbr: "hazdzj" },
  { name: "深度「叛变」", time: "00:51", sec: 51, py: "shendupanbian", abbr: "sdpb" },
  { name: "拯救邦布泰迪", time: "00:55", sec: 55, py: "zhengjiubangbutaidi", abbr: "zjbbtd" },
  { name: "御猫出巡", time: "00:56", sec: 56, py: "yumaochuxun", abbr: "ymcx" },
  { name: "猫鼠异位", time: "00:57", sec: 57, py: "maoshuyiwei", abbr: "msyw" },
  { name: "有些团子的保质期是永远", time: "01:00", sec: 60, py: "youxietuanzidebaozhiqishiyongyuan", abbr: "yxtzdbzqsyy" },
  { name: "死路直通车", time: "01:04", sec: 64, py: "siluzhitongche", abbr: "slztc" },
  { name: "因缘之战", time: "01:05", sec: 65, py: "yinyuanzhizhan", abbr: "yyzz" },
  { name: "休眠体回收计划", time: "01:06", sec: 66, py: "xiumiantihuishoujihua", abbr: "xmthsjhua" },
  { name: "兔与绳", time: "01:08", sec: 68, py: "tuyusheng", abbr: "tys" },
  { name: "一种循环", time: "01:10", sec: 70, py: "yizhongxunhuan", abbr: "yzxh" },
  { name: "以身作局", time: "01:13", sec: 73, py: "yishenzuoju", abbr: "yszj" },
  { name: "高报酬的指名委托", time: "01:15", sec: 75, py: "gaobaochoudezhimingweituo", abbr: "gbcdzmwt" },
  { name: "好事发生", time: "01:15", sec: 75, py: "haoshifasheng", abbr: "hsfs" },
  { name: "火爆末班车", time: "01:17", sec: 77, py: "huobaomobanche", abbr: "hbmbc" },
  { name: "有福共享", time: "01:18", sec: 78, py: "youfugongxiang", abbr: "yfgx" },
  { name: "舞步上行", time: "01:18", sec: 78, py: "wubushangxing", abbr: "wbsx" },
  { name: "昔日锋芒", time: "01:18", sec: 78, py: "xirifengmang", abbr: "xrfm" },
  { name: "战场寻踪", time: "01:19", sec: 79, py: "zhanchangxunzong", abbr: "zcxz" },
  { name: "以假乱真的测试", time: "01:19", sec: 79, py: "yijialuanzhendeceshi", abbr: "yjlzdcs" },
  { name: "逃出生天", time: "01:19", sec: 79, py: "taochushengtian", abbr: "tcst" },
  { name: "诡异的来信", time: "01:20", sec: 80, py: "guiyidelaixin", abbr: "gydlx" },
  { name: "盲目的寻踪", time: "01:22", sec: 82, py: "mangmudexunzong", abbr: "mmdxz" },
  { name: "溯源", time: "01:24", sec: 84, py: "suyuan", abbr: "sy" },
  { name: "「贼猫」捉贼", time: "01:27", sec: 87, py: "zeimaozhuozei", abbr: "zmzz" },
  { name: "杀意的邀约", time: "01:32", sec: 92, py: "shayideyaoyue", abbr: "sydyy" },
  { name: "隐形帮手", time: "01:33", sec: 93, py: "yinxingbangshou", abbr: "yxbs" },
  { name: "于雨夜穿透脏腑", time: "01:35", sec: 95, py: "yuyuyechuantouzangfu", abbr: "yyyctzf" },
  { name: "重返校园", time: "01:37", sec: 97, py: "zhongfanxiaoyuan", abbr: "zfxy" },
  { name: "烈拳对峙", time: "01:38", sec: 98, py: "liequanduizhi", abbr: "lqdz" },
  { name: "稍等，信号不好", time: "01:38", sec: 98, py: "shaodengxinhaobuhao", abbr: "sdxhbh" },
  { name: "洞中谍", time: "01:39", sec: 99, py: "dongzhongdie", abbr: "dzd" },
  { name: "危险使命", time: "01:45", sec: 105, py: "weixianshiming", abbr: "wxsm" },
  { name: "牲鬼核心", time: "01:48", sec: 108, py: "shengguihexin", abbr: "sghx" },
  { name: "以真乱假", time: "01:50", sec: 110, py: "yizhenluanjia", abbr: "yzlj" },
  { name: "拯救大黑客芮恩", time: "01:52", sec: 112, py: "zhengjiudaheikeruien", abbr: "zjdhkra" },
  { name: "急中生智的自救", time: "01:55", sec: 115, py: "jizhongshengzhidezijiu", abbr: "jzszdzj" },
  // --- 普通档 (2-4m) ---
  { name: "盗窃者与守护者", time: "02:00", sec: 120, py: "daoqiezheyushouhuzhe", abbr: "dqzyshz" },
  { name: "未完成事项", time: "02:00", sec: 120, py: "weiwanchengshixiang", abbr: "wwcsx" },
  { name: "小小大失控", time: "02:00", sec: 120, py: "xiaoxiaodashikong", abbr: "xxdsk" },
  { name: "甩开跟踪", time: "02:04", sec: 124, py: "shuaikaigenzong", abbr: "skgz" },
  { name: "绳与兔", time: "02:04", sec: 124, py: "shengyutu", abbr: "syt" },
  { name: "称颂与空洞", time: "02:06", sec: 126, py: "chengsongyukongdong", abbr: "csykd" },
  { name: "机性的爱", time: "02:08", sec: 128, py: "jixingdeai", abbr: "jxda" },
  { name: "疾速追机", time: "02:18", sec: 138, py: "jisuzhuiji", abbr: "jszj" },
  { name: "紧急救援2", time: "02:18", sec: 138, py: "jinjijiuyuan2", abbr: "jjjy2" },
  { name: "背叛与否的终点", time: "02:19", sec: 139, py: "beipanyufoudezhongdian", abbr: "bpyfdzd" },
  { name: "格莉丝的「弗兰肯斯坦」", time: "02:24", sec: 144, py: "gelisidefulankensitan", abbr: "glsdflkst" },
  { name: "兄弟！要出发了！", time: "02:25", sec: 145, py: "xiongdiyaochufale", abbr: "xdycfl" },
  { name: "绳之道III", time: "02:28", sec: 148, py: "shengzhidao3", abbr: "szd3" },
  { name: "绳之道II", time: "02:31", sec: 151, py: "shengzhidao2", abbr: "szd2" },
  { name: "以身试险的觉悟", time: "02:42", sec: 162, py: "yishenshixiandejuewu", abbr: "yssxdjw" },
  { name: "以弱胜强的技巧", time: "02:48", sec: 168, py: "yiruoshengqiangdejiqiao", abbr: "yrsqdjq" },
  { name: "追本溯源", time: "02:55", sec: 175, py: "zhuibensuyuan", abbr: "zbsy" },
  { name: "「魔女」审判", time: "02:59", sec: 179, py: "monvushenpan", abbr: "mnsp" },
  { name: "捷足先登的买手", time: "03:05", sec: 185, py: "jiezuxiandengdemaishou", abbr: "jzxdnms" },
  { name: "逃生早鸟票", time: "03:13", sec: 193, py: "taoshengzaoniaopiao", abbr: "tsznp" },
  { name: "以微知著的真心", time: "03:14", sec: 194, py: "yiweizhizhudezhenxin", abbr: "ywzzdzx" },
  { name: "歌声是星环闪耀", time: "03:15", sec: 195, py: "geshengshixinghuanlanyao", abbr: "gssxhsy" },
  { name: "意想不到的挑战", time: "03:40", sec: 220, py: "yixiangbudaodetiaozhan", abbr: "yxbddtz" },
  { name: "欺骗者与背叛者", time: "03:43", sec: 223, py: "qipianzheyubeipanzhe", abbr: "qpzybzz" },
  { name: "失踪的证人", time: "03:58", sec: 238, py: "shizongdezhengren", abbr: "szdzr" },
  { name: "绳之道IV", time: "03:59", sec: 239, py: "shengzhidao4", abbr: "szd4" },
  // --- 久坐档 (>4m) ---
  { name: "烈拳困斗", time: "04:00", sec: 240, py: "liequankundou", abbr: "lqkd" },
  { name: "绳之道I", time: "04:00", sec: 240, py: "shengzhidao1", abbr: "szd1" },
  { name: "紧急追捕", time: "04:01", sec: 241, py: "jinjizhuibu", abbr: "jjzb" },
  { name: "如获新生", time: "04:20", sec: 260, py: "ruhuoxinsheng", abbr: "rhxs" },
  { name: "宿命的重逢", time: "04:48", sec: 288, py: "sumingdechongfeng", abbr: "smdcf" },
  { name: "英雄诞生的骑行", time: "04:53", sec: 293, py: "yingxiongdanshengdeqixing", abbr: "yxdxdqx" },
  { name: "诅咒，礼物和爱", time: "05:33", sec: 333, py: "zuzhouliwuheai", abbr: "zzlwha" },
  { name: "业与劫", time: "06:40", sec: 400, py: "yeyujie", abbr: "yyj" },
  { name: "空洞奇妙日", time: "06:46", sec: 406, py: "kongdongqimiaori", abbr: "kdqmr" },
  { name: "谁在深渊中凝望", time: "07:55", sec: 475, py: "shuizaishenyuanzhongningwang", abbr: "szsyznw" },
];

// --- 工具函数 ---

// 修复后的热力图颜色算法 (>=30s start, 2m=Yellow, 4m=Red)
const getHeatmapColor = (seconds: number) => {
  if (seconds <= 30) return `hsl(130, 100%, 60%)`; // 0-30s same as Green

  let hue = 0;
  if (seconds <= 120) {
    // 30 -> 120s: Green (130) -> Yellow (60)
    const t = (seconds - 30) / 90;
    hue = 130 - (t * 70);
  } else if (seconds <= 240) {
    // 120 -> 240s: Yellow (60) -> Red (0)
    const t = (seconds - 120) / 120;
    hue = 60 - (t * 60);
  } else {
    // > 240s: Red (0)
    hue = 0;
  }
  return `hsl(${hue}, 100%, 60%)`;
};

// --- 算法逻辑 ---

// 核心解算器 (贪心: 狩猎 > 挑战 > 空洞)
const solveOptimalPlan = (reqC: number, reqCr: number, limitHunt: number, limitExpert: number) => {
  let c = 0;
  let cr = 0;
  let counts: Record<string, number> = { hollow: 0, hunt: 0, expert: 0 };
  let totalTime = 0;

  const priority = [
    { ...TASKS.HUNT, limit: limitHunt },
    { ...TASKS.EXPERT, limit: limitExpert },
    { ...TASKS.HOLLOW, limit: Infinity }
  ];

  // 循环直到两个目标都达成
  while (c < reqC || cr < reqCr) {
    let bestTask = null;

    for (const task of priority) {
      if (counts[task.id] >= (task.limit ?? Infinity)) continue;
      bestTask = task;
      break;
    }

    if (!bestTask) break; // Should not happen given infinite Hollows

    counts[bestTask.id]++;
    c += bestTask.contrib;
    cr += bestTask.credit;
    totalTime += bestTask.time;
  }

  return { counts, totalTime, finalContrib: c, finalCredit: cr };
}

// 生成引用基准 (从零开始)
const generateBenchmarks = () => {
  // 场景 1: 最好情况 (假设能打 5 次狩猎，剩下全空洞)
  const best = solveOptimalPlan(LIMITS.CONTRIB, LIMITS.CREDIT, 5, 0);
  // 场景 2: 适中情况 (假设能打 5 次挑战，剩下全空洞)
  const mod = solveOptimalPlan(LIMITS.CONTRIB, LIMITS.CREDIT, 0, 5);
  // 场景 3: 最差情况 (全空洞)
  const worst = solveOptimalPlan(LIMITS.CONTRIB, LIMITS.CREDIT, 0, 0);

  return { best, mod, worst };
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<RawDataItem[]>(rawData);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 计算器状态
  const [currContrib, setCurrContrib] = useState<string | number>('');
  const [currCredit, setCurrCredit] = useState<string | number>('');
  const [maxHunt, setMaxHunt] = useState<number>(3);
  const [maxExpert, setMaxExpert] = useState<number>(5);

  const benchmarks = generateBenchmarks();

  // 动态计算用户方案
  const getDynamicPlan = () => {
    const c = Number(currContrib) || 0;
    const cr = Number(currCredit) || 0;
    const reqC = Math.max(0, LIMITS.CONTRIB - c);
    const reqCr = Math.max(0, LIMITS.CREDIT - cr);

    // 如果已经满了，就不用计算了，或者返回一个全0的
    if (reqC === 0 && reqCr === 0) return null;

    return solveOptimalPlan(reqC, reqCr, maxHunt, maxExpert);
  };

  const dynamicPlan = getDynamicPlan();

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredData(rawData);
      return;
    }
    const results = rawData.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.py.includes(query) ||
      item.abbr.includes(query)
    );
    setFilteredData(results);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addReward = (task: Task) => {
    setCurrContrib(prev => Math.min(LIMITS.CONTRIB, Number(prev) + task.contrib));
    setCurrCredit(prev => Math.min(LIMITS.CREDIT, Number(prev) + task.credit));
  };

  const resetCalc = () => {
    setCurrContrib('');
    setCurrCredit('');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-orange-500/30 pb-20">

      {/* 顶部：计算器 */}
      <div className="bg-[#121214] border-b border-zinc-800 sticky top-0 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col gap-6">

            {/* 标题栏 */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">
                    PROXY <span className="text-orange-500">CALC</span>
                  </h1>
                  <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                    智能委托规划
                  </p>
                </div>
              </div>

              {/* 输入区域 */}
              <div className="flex-1 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* 进度输入 */}
                <div className="bg-black/40 p-2 rounded border border-white/5 flex items-center gap-2 group focus-within:border-purple-500/50 transition-colors">
                  <Ghost className="w-4 h-4 text-purple-500 shrink-0" />
                  <input
                    type="number"
                    value={currContrib}
                    onChange={e => setCurrContrib(e.target.value)}
                    placeholder="0"
                    className="bg-transparent w-full text-sm font-mono text-white focus:outline-none placeholder-zinc-700"
                  />
                  <span className="text-[10px] text-zinc-600 font-mono">/{LIMITS.CONTRIB}</span>
                </div>

                <div className="bg-black/40 p-2 rounded border border-white/5 flex items-center gap-2 group focus-within:border-teal-500/50 transition-colors">
                  <Calculator className="w-4 h-4 text-teal-500 shrink-0" />
                  <input
                    type="number"
                    value={currCredit}
                    onChange={e => setCurrCredit(e.target.value)}
                    placeholder="0"
                    className="bg-transparent w-full text-sm font-mono text-white focus:outline-none placeholder-zinc-700"
                  />
                  <span className="text-[10px] text-zinc-600 font-mono">/{LIMITS.CREDIT}</span>
                </div>

                {/* 限制配置 */}
                <div className="bg-black/40 p-2 rounded border border-white/5 flex items-center gap-2 group focus-within:border-orange-500/50 transition-colors cursor-help relative" title="本周剩余可打次数">
                  <Sword className="w-4 h-4 text-orange-500 shrink-0" />
                  <input
                    type="number"
                    value={maxHunt}
                    onChange={e => setMaxHunt(Number(e.target.value))}
                    className="bg-transparent w-full text-sm font-mono text-white focus:outline-none placeholder-zinc-700"
                  />
                  <span className="text-[10px] text-zinc-600 font-mono whitespace-nowrap">Hunt Max</span>
                </div>

                <div className="bg-black/40 p-2 rounded border border-white/5 flex items-center gap-2 group focus-within:border-blue-500/50 transition-colors cursor-help relative" title="本周剩余可打次数">
                  <Trophy className="w-4 h-4 text-blue-500 shrink-0" />
                  <input
                    type="number"
                    value={maxExpert}
                    onChange={e => setMaxExpert(Number(e.target.value))}
                    className="bg-transparent w-full text-sm font-mono text-white focus:outline-none placeholder-zinc-700"
                  />
                  <span className="text-[10px] text-zinc-600 font-mono whitespace-nowrap">Expert Max</span>
                </div>
              </div>

              {/* 控制按钮 */}
              <div className="flex gap-2">
                <button onClick={resetCalc} className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 结果展示区：双卡布局 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">

              {/* 卡片1：动态规划结果 (左侧) */}
              <div className={`bg-zinc-900/50 border ${dynamicPlan ? 'border-orange-500/30' : 'border-zinc-800'} rounded-xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]`}>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    🚀 当前规划
                    {dynamicPlan && <span className="text-[10px] px-1.5 py-0.5 bg-orange-500/20 text-orange-300 rounded border border-orange-500/20">CUSTOM</span>}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">基于左侧进度与上限设置的特定方案</p>
                </div>

                {dynamicPlan ? (
                  <div className="mt-4">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-black text-white tracking-tighter">{Math.ceil(dynamicPlan.totalTime / 60)}</span>
                      <span className="text-xs font-bold text-zinc-500 uppercase">Minutes Needed</span>
                    </div>
                    <div className="flex gap-2">
                      {dynamicPlan.counts.hunt > 0 && <span className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-xs text-orange-300 font-mono font-bold flex items-center gap-1"><Sword className="w-3 h-3" /> {dynamicPlan.counts.hunt}</span>}
                      {dynamicPlan.counts.expert > 0 && <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-300 font-mono font-bold flex items-center gap-1"><Trophy className="w-3 h-3" /> {dynamicPlan.counts.expert}</span>}
                      {dynamicPlan.counts.hollow > 0 && <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-300 font-mono font-bold flex items-center gap-1"><Ghost className="w-3 h-3" /> {dynamicPlan.counts.hollow}</span>}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-600 text-sm font-mono mt-4">
                    目标已达成 / 无需规划
                  </div>
                )}
                {/* 动态背景光效 */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
              </div>

              {/* 卡片2：基准参考 (右侧，三合一) */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 relative overflow-hidden flex flex-col gap-3">
                <div>
                  <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-2">📊 每周概览</h3>
                  <p className="text-xs text-zinc-500 mt-1">从零开始打满周上限的耗时参考</p>
                </div>

                <div className="grid grid-cols-1 gap-2 mt-1">
                  {/* Best */}
                  <div className="flex items-center justify-between p-2 rounded bg-emerald-500/5 border border-emerald-500/10">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-bold text-emerald-100">高效率</span>
                      <span className="text-[10px] text-zinc-500 font-mono">(5Hunt + Hollow)</span>
                    </div>
                    <span className="text-sm font-black text-emerald-400 font-mono">{Math.ceil(benchmarks.best.totalTime / 60)} <span className="text-[10px] text-zinc-600">MIN</span></span>
                  </div>
                  {/* Mid */}
                  <div className="flex items-center justify-between p-2 rounded bg-blue-500/5 border border-blue-500/10">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span className="text-xs font-bold text-blue-100">均衡型</span>
                      <span className="text-[10px] text-zinc-500 font-mono">(5Expert + Hollow)</span>
                    </div>
                    <span className="text-sm font-black text-blue-400 font-mono">{Math.ceil(benchmarks.mod.totalTime / 60)} <span className="text-[10px] text-zinc-600">MIN</span></span>
                  </div>
                  {/* Worst */}
                  <div className="flex items-center justify-between p-2 rounded bg-rose-500/5 border border-rose-500/10">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span className="text-xs font-bold text-rose-100">基础型</span>
                      <span className="text-[10px] text-zinc-500 font-mono">(All Hollow)</span>
                    </div>
                    <span className="text-sm font-black text-rose-400 font-mono">{Math.ceil(benchmarks.worst.totalTime / 60)} <span className="text-[10px] text-zinc-600">MIN</span></span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 底部：搜索与列表 */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* 搜索框 */}
        <div className="relative mb-8 group z-20">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-orange-500' : 'text-zinc-500'}`} />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-zinc-900 border-2 border-zinc-800 text-zinc-100 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-orange-500/50 focus:bg-zinc-900/80 transition-all font-mono shadow-lg"
            placeholder="搜索副本名称, 拼音或缩写... (Press '/')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-xs text-zinc-700 font-mono border border-zinc-800 rounded px-2 py-1">ESC to blur</span>
          </div>
        </div>

        {/* 列表内容 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredData.map((item, index) => {
            const heatColor = getHeatmapColor(item.sec);

            // 难度标签根据时间判断
            let diffLabel = "极速";
            let diffColor = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
            if (item.sec > 120) { diffLabel = "普通"; diffColor = "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"; }
            if (item.sec > 240) { diffLabel = "困难"; diffColor = "text-rose-400 border-rose-500/30 bg-rose-500/10"; }

            // Heat Bar Scale Calculation
            const MIN_SEC = 30;
            const PIVOT_SEC = 240;
            const PIVOT_PER = 90;
            const MAX_SEC = 480;

            const getPercent = (s: number) => {
              if (s <= MIN_SEC) return 0;
              if (s <= PIVOT_SEC) {
                return ((s - MIN_SEC) / (PIVOT_SEC - MIN_SEC)) * PIVOT_PER;
              }
              return PIVOT_PER + ((s - PIVOT_SEC) / (MAX_SEC - PIVOT_SEC)) * (100 - PIVOT_PER);
            };

            const percent = Math.min(getPercent(item.sec), 100);
            const p2m = getPercent(120);
            const p4m = PIVOT_PER;

            return (
              <div
                key={index}
                onClick={() => addReward(TASKS.HOLLOW)}
                className="group bg-zinc-900/50 border border-zinc-800/50 hover:border-orange-500/50 rounded-lg p-4 transition-all hover:bg-zinc-800/50 cursor-pointer relative overflow-hidden flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black font-mono tracking-tighter" style={{ color: heatColor }}>
                      {item.time}
                    </span>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${diffColor}`}>
                    {diffLabel}
                  </div>
                </div>

                <div className="mb-4 relative z-10">
                  <h3 className="font-bold text-zinc-200 group-hover:text-orange-400 transition-colors line-clamp-1" title={item.name}>
                    {item.name}
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-600 mt-1 uppercase">ID: {item.abbr}</p>
                </div>

                {/* Heat Bar */}
                <div className="relative h-2 bg-zinc-800/50 rounded-full w-full overflow-hidden mt-auto z-10">
                  {/* Tick Marks */}
                  <div className="absolute top-0 bottom-0 w-[2px] bg-zinc-700/80 z-10" style={{ left: `${p2m}%` }}></div>
                  <div className="absolute top-0 bottom-0 w-[2px] bg-zinc-700/80 z-10" style={{ left: `${p4m}%` }}></div>

                  {/* Progress */}
                  <div className="h-full rounded-full transition-all duration-500 relative" style={{ width: `${percent}%`, backgroundColor: heatColor }}></div>
                </div>

                {/* 悬停提示 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 backdrop-blur-[1px] transition-opacity z-20">
                  <span className="text-orange-400 font-bold text-sm tracking-widest uppercase flex items-center gap-1">
                    <Calculator className="w-3 h-3" /> 点击添加
                  </span>
                </div>

                {/* Card BG Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100" style={{ backgroundColor: heatColor, opacity: 0.1 }}></div>

              </div>
            );
          })}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-20 text-zinc-500 font-mono">
            无匹配结果 / NO RESULTS
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
