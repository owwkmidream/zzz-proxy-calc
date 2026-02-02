import type { PlanResult, Benchmarks } from '../types';
import { TASKS, LIMITS } from '../constants';

// 任务类型（带限制）
type TaskWithRuntimeLimit = typeof TASKS.HUNT & { limit: number };

/**
 * 计算任务的综合效率
 * 效率 = (对两个资源的归一化贡献之和) / 时间
 * 这样可以让两个资源尽可能同时达到上限
 */
const calculateEfficiency = (
    task: TaskWithRuntimeLimit,
    remainingC: number,
    remainingCr: number,
    targetC: number,
    targetCr: number,
    currentCount: number
): number => {
    // 如果任务次数用完了，不可用
    if (currentCount >= task.limit) return -1;

    // 如果两个目标都达成了，不需要继续
    if (remainingC <= 0 && remainingCr <= 0) return -1;

    // 计算该任务实际能贡献的量（不超过剩余需求，避免浪费）
    const effectiveC = Math.min(task.contrib, Math.max(0, remainingC));
    const effectiveCr = Math.min(task.credit, Math.max(0, remainingCr));

    // 如果这个任务对我们没有任何帮助
    if (effectiveC === 0 && effectiveCr === 0) return -1;

    // 计算归一化进度（相对于原始目标，避免除以0）
    const cProgress = targetC > 0 ? effectiveC / targetC : 0;
    const crProgress = targetCr > 0 ? effectiveCr / targetCr : 0;

    // 综合效率 = 总进度贡献 / 时间
    return (cProgress + crProgress) / task.time;
};

/**
 * 核心解算器 (动态效率贪心算法)
 * 每次选择"综合效率"最高的任务，让两个资源尽可能同时达到上限
 */
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

    // 构建任务列表（从常量动态读取，支持后续调整）
    const tasks: TaskWithRuntimeLimit[] = [
        { ...TASKS.HUNT, limit: limitHunt },
        { ...TASKS.EXPERT, limit: limitExpert },
        { ...TASKS.HOLLOW, limit: Infinity }
    ];

    // 循环直到两个目标都达成
    while (c < reqC || cr < reqCr) {
        const remainingC = reqC - c;
        const remainingCr = reqCr - cr;

        // 找到综合效率最高的任务
        let bestTask: TaskWithRuntimeLimit | null = null;
        let bestEfficiency = -1;

        for (const task of tasks) {
            const eff = calculateEfficiency(
                task,
                remainingC,
                remainingCr,
                reqC,
                reqCr,
                counts[task.id]
            );
            if (eff > bestEfficiency) {
                bestEfficiency = eff;
                bestTask = task;
            }
        }

        // 没有可用任务了
        if (!bestTask || bestEfficiency < 0) break;

        // 执行该任务
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
