import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Task, PlanResult, Benchmarks } from '../types';
import { LIMITS, TASKS } from '../constants';
import { calculateDynamicPlan, generateBenchmarks } from '../utils/solver';

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

    // 添加奖励并减少对应的任务限制
    const addReward = useCallback((task: Task) => {
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
