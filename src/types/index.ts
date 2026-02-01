// --- 类型定义 ---

export interface Task {
    id: string;
    name: string;
    contrib: number;
    credit: number;
    time: number;
}

export interface TaskWithLimit extends Task {
    limit?: number;
}

export interface RawDataItem {
    name: string;
    time: string;
    sec: number;
    py: string;
    abbr: string;
}

export interface PlanResult {
    counts: Record<string, number>;
    totalTime: number;
    finalContrib: number;
    finalCredit: number;
}

export interface Benchmarks {
    best: PlanResult;
    mod: PlanResult;
    worst: PlanResult;
}
