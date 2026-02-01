import type { PlanResult, Benchmarks } from '../types';
import { TASKS, LIMITS } from '../constants';

// 核心解算器 (贪心: 狩猎 > 挑战 > 空洞)
export const solveOptimalPlan = (
    reqC: number,
    reqCr: number,
    limitHunt: number,
    limitExpert: number
): PlanResult => {
    let c = 0;
    let cr = 0;
    const counts: Record<string, number> = { hollow: 0, hunt: 0, expert: 0 };
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

        if (!bestTask) break;

        counts[bestTask.id]++;
        c += bestTask.contrib;
        cr += bestTask.credit;
        totalTime += bestTask.time;
    }

    return { counts, totalTime, finalContrib: c, finalCredit: cr };
};

// 生成引用基准 (从零开始)
export const generateBenchmarks = (): Benchmarks => {
    // 场景 1: 最好情况 (假设能打 5 次狩猎，剩下全空洞)
    const best = solveOptimalPlan(LIMITS.CONTRIB, LIMITS.CREDIT, 5, 0);
    // 场景 2: 适中情况 (假设能打 5 次挑战，剩下全空洞)
    const mod = solveOptimalPlan(LIMITS.CONTRIB, LIMITS.CREDIT, 0, 5);
    // 场景 3: 最差情况 (全空洞)
    const worst = solveOptimalPlan(LIMITS.CONTRIB, LIMITS.CREDIT, 0, 0);

    return { best, mod, worst };
};

// 计算用户动态方案
export const calculateDynamicPlan = (
    currContrib: number,
    currCredit: number,
    maxHunt: number,
    maxExpert: number
): PlanResult | null => {
    const reqC = Math.max(0, LIMITS.CONTRIB - currContrib);
    const reqCr = Math.max(0, LIMITS.CREDIT - currCredit);

    // 如果已经满了，就不用计算了
    if (reqC === 0 && reqCr === 0) return null;

    return solveOptimalPlan(reqC, reqCr, maxHunt, maxExpert);
};
