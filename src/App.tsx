import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Zap, Hexagon, Users, Calculator, Clock, Target, Sword, Trophy, TrendingUp, Timer, LayoutDashboard, Ghost, RotateCcw } from 'lucide-react';

// --- 常量配置 ---
const LIMITS = { CONTRIB: 1000, CREDIT: 5000 };

// 调整后的基准参数
const TASKS = {
  HOLLOW: { id: 'hollow', name: "普通空洞", contrib: 80, credit: 600, time: 150 }, // 2.5 min
  HUNT: { id: 'hunt', name: "恶名狩猎", contrib: 100, credit: 500, time: 60 },     // 1 min
  EXPERT: { id: 'expert', name: "专业挑战", contrib: 70, credit: 250, time: 60 }   // 1 min
};

// 样式常量 (替换原本的 style 标签内容)
const SHORTCUT_BTN_CLASS = "flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded transition-all border";
const STAT_PILL_CLASS = "bg-black/30 rounded px-2 py-1 text-xs font-mono text-zinc-300 flex items-center gap-1.5 border border-white/5 justify-center";

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
const getHeatmapColor = (seconds) => {
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

// 确定性的策略模拟器
const simulateStrategies = (reqC, reqCr, strategy) => {
  let c = 0;
  let cr = 0;
  let counts = { hollow: 0, hunt: 0, expert: 0 };

  // 策略优先级队列
  let order = [];
  if (strategy === 'speed') order = ['hunt', 'expert', 'hollow', 'hunt', 'expert']; // 4:1 ratio approx
  if (strategy === 'balanced') order = ['hollow', 'hunt', 'expert']; // 1:1:1
  if (strategy === 'hollow') order = ['hollow', 'hollow', 'hollow', 'hunt']; // 3:1 ratio approx

  let i = 0;
  while (c < reqC || cr < reqCr) {
    const typeKey = order[i % order.length];
    const task = TASKS[typeKey.toUpperCase()];

    counts[typeKey]++;
    c += task.contrib;
    cr += task.credit;
    i++;
  }

  const totalTime =
    counts.hollow * TASKS.HOLLOW.time +
    counts.hunt * TASKS.HUNT.time +
    counts.expert * TASKS.EXPERT.time;

  return { counts, totalTime };
}

// 生成三种方案
const generatePlans = (currContrib, currCredit) => {
  const neededContrib = Math.max(0, LIMITS.CONTRIB - currContrib);
  const neededCredit = Math.max(0, LIMITS.CREDIT - currCredit);

  if (neededContrib === 0 && neededCredit === 0) return null;

  const planSpeed = simulateStrategies(neededContrib, neededCredit, 'speed');
  const planBalanced = simulateStrategies(neededContrib, neededCredit, 'balanced');
  const planHollow = simulateStrategies(neededContrib, neededCredit, 'hollow');

  return [
    {
      id: 'speed',
      title: '⚡ 极速党',
      desc: '效率至上 (主刷1分钟副本)',
      data: planSpeed,
      color: 'text-yellow-400',
      border: 'border-yellow-500/30'
    },
    {
      id: 'balanced',
      title: '⚖️ 均衡党',
      desc: '劳逸结合 (混合搭配)',
      data: planBalanced,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30'
    },
    {
      id: 'hollow',
      title: '🕳️ 空洞党',
      desc: '深耕空洞 (主刷2.5分钟副本)',
      data: planHollow,
      color: 'text-purple-400',
      border: 'border-purple-500/30'
    }
  ];
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(rawData);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // 计算器状态
  const [currContrib, setCurrContrib] = useState('');
  const [currCredit, setCurrCredit] = useState('');

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
    const handleKeyDown = (e) => {
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

  const addReward = (type) => {
    const newContrib = Math.min(LIMITS.CONTRIB, (Number(currContrib) || 0) + type.contrib);
    const newCredit = Math.min(LIMITS.CREDIT, (Number(currCredit) || 0) + type.credit);
    setCurrContrib(newContrib);
    setCurrCredit(newCredit);
  };

  const resetCalc = () => {
    setCurrContrib('');
    setCurrCredit('');
  };

  const plans = generatePlans(Number(currContrib) || 0, Number(currCredit) || 0);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-orange-500/30 pb-20">

      {/* 顶部：计算器与规划 */}
      <div className="bg-[#121214] border-b border-zinc-800 sticky top-0 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col gap-6">

            {/* 第一行：标题 + 输入 + 按钮 */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-3 min-w-fit">
                <div className="w-10 h-10 bg-orange-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">
                    PROXY <span className="text-orange-500">CALC</span>
                  </h1>
                  <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                    周常进度规划
                  </p>
                </div>
              </div>

              {/* 输入区域 */}
              <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
                <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800 flex items-center gap-2">
                  <Hexagon className="w-4 h-4 text-purple-500 shrink-0" />
                  <input
                    type="number"
                    value={currContrib}
                    onChange={e => setCurrContrib(e.target.value)}
                    placeholder="0"
                    className="bg-transparent w-full text-sm font-mono text-white focus:outline-none placeholder-zinc-600"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">/{LIMITS.CONTRIB}</span>
                </div>

                <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-500 shrink-0" />
                  <input
                    type="number"
                    value={currCredit}
                    onChange={e => setCurrCredit(e.target.value)}
                    placeholder="0"
                    className="bg-transparent w-full text-sm font-mono text-white focus:outline-none placeholder-zinc-600"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">/{LIMITS.CREDIT}</span>
                </div>

                {/* 快捷按钮组 */}
                <div className="col-span-2 flex gap-2 justify-end">
                  <button onClick={() => addReward(TASKS.HOLLOW)} className={`group border-purple-500/30 text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 ${SHORTCUT_BTN_CLASS}`}>
                    <Ghost className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> 普通空洞
                  </button>
                  <button onClick={() => addReward(TASKS.HUNT)} className={`group border-orange-500/30 text-orange-200 bg-orange-500/10 hover:bg-orange-500/20 ${SHORTCUT_BTN_CLASS}`}>
                    <Sword className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> 恶名狩猎
                  </button>
                  <button onClick={() => addReward(TASKS.EXPERT)} className={`group border-blue-500/30 text-blue-200 bg-blue-500/10 hover:bg-blue-500/20 ${SHORTCUT_BTN_CLASS}`}>
                    <Trophy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> 专业挑战
                  </button>
                  <button onClick={resetCalc} className="p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-800 rounded">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 第二行：方案卡片 */}
            {plans && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
                {plans.map((plan) => (
                  <div key={plan.id} className={`bg-zinc-900/40 border ${plan.border} rounded-lg p-3 flex flex-col gap-2 relative overflow-hidden group`}>
                    <div className="flex justify-between items-start z-10">
                      <div>
                        <h3 className={`text-sm font-bold ${plan.color} flex items-center gap-2`}>
                          {plan.title}
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-mono">{plan.desc}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-white font-mono block leading-none">
                          {Math.ceil(plan.data.totalTime / 60)}
                        </span>
                        <span className="text-[10px] text-zinc-600 uppercase font-bold">MINUTES</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 mt-1 z-10">
                      <div className={`${STAT_PILL_CLASS}`}><Ghost className="w-3 h-3 text-purple-400" /> {plan.data.counts.hollow}</div>
                      <div className={`${STAT_PILL_CLASS}`}><Sword className="w-3 h-3 text-orange-400" /> {plan.data.counts.hunt}</div>
                      <div className={`${STAT_PILL_CLASS}`}><Trophy className="w-3 h-3 text-blue-400" /> {plan.data.counts.expert}</div>
                    </div>

                    {/* 背景光效 */}
                    <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity bg-current ${plan.color}`}></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8">

        {/* 居中搜索栏 */}
        <div className="max-w-2xl mx-auto mb-10 relative group">
          <div className={`absolute inset-0 bg-orange-500/20 rounded-full blur-xl transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className="relative flex items-center">
            <Search className={`absolute left-4 w-5 h-5 transition-colors ${isFocused ? 'text-orange-400' : 'text-zinc-500'}`} />
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-[#18181b] border-2 border-zinc-800 hover:border-zinc-700 focus:border-orange-500/50 rounded-full py-4 pl-12 pr-16 text-lg font-bold text-white placeholder-zinc-600 outline-none transition-all shadow-xl"
              placeholder="搜索委托 (按 '/' 快速聚焦)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 p-1 text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* 列表网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredData.map((item, index) => {
            const timeColor = getHeatmapColor(item.sec);
            // 难度标签根据时间判断
            let diffLabel = "极速";
            let diffColor = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
            if (item.sec > 120) { diffLabel = "普通"; diffColor = "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"; }
            if (item.sec > 240) { diffLabel = "困难"; diffColor = "text-rose-400 border-rose-500/30 bg-rose-500/10"; }

            // Heat Bar Scale Calculation
            // Rule: 30s -> 0%, 240s (4m) -> 80%
            const MIN_SEC = 30;
            const PIVOT_SEC = 240;
            const PIVOT_PER = 80;
            const MAX_SEC = 480; // Caps at 8m for remaining 20%

            const getPercent = (s) => {
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
                key={`${item.name}-${index}`}
                className="bg-[#18181b] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between group hover:border-zinc-600 transition-all hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black font-mono tracking-tighter" style={{ color: timeColor }}>
                      {item.time}
                    </span>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${diffColor}`}>
                    {diffLabel}
                  </div>
                </div>

                <div className="mb-4">
                  <h3
                    className="text-lg font-bold leading-tight truncate transition-colors duration-300 text-zinc-200 group-hover:text-white"
                  >
                    {item.name}
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-600 mt-1 uppercase">ID: {item.abbr}</p>
                </div>

                {/* Heat Bar */}
                <div className="relative h-2 bg-zinc-800/50 rounded-full w-full overflow-hidden mt-auto">
                  {/* Tick Marks for 2m and 4m */}
                  <div className="absolute top-0 bottom-0 w-[2px] bg-zinc-700/80 z-10" style={{ left: `${p2m}%` }}></div>
                  <div className="absolute top-0 bottom-0 w-[2px] bg-zinc-700/80 z-10" style={{ left: `${p4m}%` }}></div>

                  {/* Progress with Time Color */}
                  <div
                    className="h-full rounded-full transition-all duration-500 relative"
                    style={{ width: `${percent}%`, backgroundColor: timeColor }}
                  >
                    {/* Leading Edge */}
                    <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                  </div>
                </div>

                <div
                  className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"
                  style={{ backgroundColor: timeColor, opacity: 0.1 }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;