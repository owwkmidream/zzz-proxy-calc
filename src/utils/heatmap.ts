// 热力图颜色算法 (>=30s start, 2m=Yellow, 4m=Red)
export const getHeatmapColor = (seconds: number): string => {
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

// 获取难度标签和样式
export const getDifficultyInfo = (sec: number): { label: string; colorClass: string } => {
    if (sec > 240) {
        return { label: "困难", colorClass: "text-rose-400 border-rose-500/30 bg-rose-500/10" };
    }
    if (sec > 120) {
        return { label: "普通", colorClass: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" };
    }
    return { label: "极速", colorClass: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" };
};

// 热力条百分比计算
const HEAT_BAR_CONFIG = {
    MIN_SEC: 30,
    PIVOT_SEC: 240,
    PIVOT_PER: 90,
    MAX_SEC: 480,
} as const;

export const getHeatBarPercent = (seconds: number): number => {
    const { MIN_SEC, PIVOT_SEC, PIVOT_PER, MAX_SEC } = HEAT_BAR_CONFIG;

    if (seconds <= MIN_SEC) return 0;
    if (seconds <= PIVOT_SEC) {
        return ((seconds - MIN_SEC) / (PIVOT_SEC - MIN_SEC)) * PIVOT_PER;
    }
    return PIVOT_PER + ((seconds - PIVOT_SEC) / (MAX_SEC - PIVOT_SEC)) * (100 - PIVOT_PER);
};

export const MARKER_POSITIONS = {
    TWO_MINUTES: getHeatBarPercent(120),
    FOUR_MINUTES: HEAT_BAR_CONFIG.PIVOT_PER,
} as const;
