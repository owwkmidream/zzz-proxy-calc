import { useState, useMemo } from 'react';
import type { Task, PlanResult, Benchmarks } from '../types';
import { LIMITS, TASKS } from '../constants';
import { calculateDynamicPlan, generateBenchmarks } from '../utils/solver';

export const useCalculator = () => {
    const [currContrib, setCurrContrib] = useState<string | number>('');
    const [currCredit, setCurrCredit] = useState<string | number>('');
    const [maxHunt, setMaxHunt] = useState<number>(3);
    const [maxExpert, setMaxExpert] = useState<number>(5);

    // 使用 useMemo 缓存基准数据，避免重复计算
    const benchmarks: Benchmarks = useMemo(() => generateBenchmarks(), []);

    // 动态计算用户方案
    const dynamicPlan: PlanResult | null = useMemo(() => {
        return calculateDynamicPlan(
            Number(currContrib) || 0,
            Number(currCredit) || 0,
            maxHunt,
            maxExpert
        );
    }, [currContrib, currCredit, maxHunt, maxExpert]);

    const addReward = (task: Task) => {
        setCurrContrib(prev => Math.min(LIMITS.CONTRIB, Number(prev) + task.contrib));
        setCurrCredit(prev => Math.min(LIMITS.CREDIT, Number(prev) + task.credit));
    };

    const resetCalc = () => {
        setCurrContrib('');
        setCurrCredit('');
    };

    const handleAdjust = (
        setter: React.Dispatch<React.SetStateAction<number>>,
        value: number
    ) => {
        setter(prev => Math.max(0, prev + value));
    };

    return {
        // State
        currContrib,
        setCurrContrib,
        currCredit,
        setCurrCredit,
        maxHunt,
        setMaxHunt,
        maxExpert,
        setMaxExpert,
        // Computed
        benchmarks,
        dynamicPlan,
        // Actions
        addReward,
        resetCalc,
        handleAdjust,
        // Constants
        TASKS,
        LIMITS,
    };
};
