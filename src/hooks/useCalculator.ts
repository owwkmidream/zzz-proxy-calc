import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import type { Task, PlanResult, Benchmarks } from '../types';
import { LIMITS, TASKS } from '../constants';
import { calculateDynamicPlan, generateBenchmarks, calculateSingleTaskCounts } from '../utils/solver';

// 动画变化值的类型
export interface AnimationDeltas {
    contrib: number | null;
    credit: number | null;
    maxHunt: number | null;
    maxExpert: number | null;
}

// LocalStorage keys
const STORAGE_KEYS = {
    CONTRIB: 'calc_currContrib',
    CREDIT: 'calc_currCredit',
    MAX_HUNT: 'calc_maxHunt',
    MAX_EXPERT: 'calc_maxExpert',
} as const;

// 从 localStorage 读取值
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        if (stored === null) return defaultValue;
        return JSON.parse(stored) as T;
    } catch {
        return defaultValue;
    }
};

export const useCalculator = () => {
    // 初始化时从 localStorage 读取
    const [currContrib, setCurrContrib] = useState<string | number>(() =>
        loadFromStorage(STORAGE_KEYS.CONTRIB, '')
    );
    const [currCredit, setCurrCredit] = useState<string | number>(() =>
        loadFromStorage(STORAGE_KEYS.CREDIT, '')
    );
    const [maxHunt, setMaxHunt] = useState<number>(() =>
        loadFromStorage(STORAGE_KEYS.MAX_HUNT, 3)
    );
    const [maxExpert, setMaxExpert] = useState<number>(() =>
        loadFromStorage(STORAGE_KEYS.MAX_EXPERT, 5)
    );

    // 动画变化值状态
    const [animationDeltas, setAnimationDeltas] = useState<AnimationDeltas>({
        contrib: null,
        credit: null,
        maxHunt: null,
        maxExpert: null,
    });
    const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 持久化到 localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.CONTRIB, JSON.stringify(currContrib));
    }, [currContrib]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.CREDIT, JSON.stringify(currCredit));
    }, [currCredit]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.MAX_HUNT, JSON.stringify(maxHunt));
    }, [maxHunt]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.MAX_EXPERT, JSON.stringify(maxExpert));
    }, [maxExpert]);

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

    // 计算理论最大所需次数（用于UI上限限制）
    const singleTaskCounts = useMemo(() => {
        const reqC = Math.max(0, LIMITS.CONTRIB - (Number(currContrib) || 0));
        const reqCr = Math.max(0, LIMITS.CREDIT - (Number(currCredit) || 0));
        return calculateSingleTaskCounts(reqC, reqCr);
    }, [currContrib, currCredit]);

    // 添加奖励并减少对应的任务限制
    const addReward = useCallback((task: Task) => {
        // 计算变动值
        const deltas: AnimationDeltas = {
            contrib: task.contrib > 0 ? task.contrib : null,
            credit: task.credit > 0 ? task.credit : null,
            maxHunt: task.id === 'hunt' ? -1 : null,
            maxExpert: task.id === 'expert' ? -1 : null,
        };

        // 设置动画状态
        setAnimationDeltas(deltas);

        // 清除之前的定时器
        if (animationTimerRef.current) {
            clearTimeout(animationTimerRef.current);
        }

        // 1秒后清除动画状态
        animationTimerRef.current = setTimeout(() => {
            setAnimationDeltas({
                contrib: null,
                credit: null,
                maxHunt: null,
                maxExpert: null,
            });
        }, 1000);

        // 更新值
        setCurrContrib(prev => Math.min(LIMITS.CONTRIB, Number(prev) + task.contrib));
        setCurrCredit(prev => Math.min(LIMITS.CREDIT, Number(prev) + task.credit));

        // 根据任务类型减少对应的限制计数
        if (task.id === 'hunt') {
            setMaxHunt(prev => Math.max(0, prev - 1));
        } else if (task.id === 'expert') {
            setMaxExpert(prev => Math.max(0, prev - 1));
        }
    }, []);

    const resetCalc = () => {
        setCurrContrib('');
        setCurrCredit('');
        setMaxHunt(5);
        setMaxExpert(5);
    };

    const handleAdjust = (
        setter: React.Dispatch<React.SetStateAction<number>>,
        value: number,
        maxVal: number = 99 // 默认回退值
    ) => {
        setter(prev => Math.max(0, Math.min(maxVal, prev + value)));
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
        // Animation
        animationDeltas,
        // Computed
        benchmarks,
        dynamicPlan,
        singleTaskCounts, // Expose this
        // Actions
        addReward,
        resetCalc,
        handleAdjust,
        // Constants
        TASKS,
        LIMITS,
    };
};
