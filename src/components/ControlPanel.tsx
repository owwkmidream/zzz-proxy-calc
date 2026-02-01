import { X, Sword, Trophy, Ghost } from 'lucide-react';
import { ContribIcon, CreditIcon } from './Icons';
import type { Task, TaskWithLimit } from '../types';

interface ControlPanelProps {
    currContrib: string | number;
    setCurrContrib: (value: string | number) => void;
    currCredit: string | number;
    setCurrCredit: (value: string | number) => void;
    maxHunt: number;
    setMaxHunt: React.Dispatch<React.SetStateAction<number>>;
    maxExpert: number;
    setMaxExpert: React.Dispatch<React.SetStateAction<number>>;
    onAddReward: (task: Task) => void;
    onReset: () => void;
    handleAdjust: (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => void;
    TASKS: Record<string, TaskWithLimit>;
    LIMITS: { CONTRIB: number; CREDIT: number };
}

export const ControlPanel = ({
    currContrib,
    setCurrContrib,
    currCredit,
    setCurrCredit,
    maxHunt,
    setMaxHunt,
    maxExpert,
    setMaxExpert,
    onAddReward,
    onReset,
    handleAdjust,
    TASKS,
    LIMITS,
}: ControlPanelProps) => {
    return (
        <div className="flex flex-col xl:flex-row gap-6 items-stretch xl:items-center">
            {/* 1. 进度与限制 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                {/* 贡献度输入 */}
                <div className="bg-black/40 p-1.5 rounded border border-white/5 flex items-center gap-2 group focus-within:border-purple-500/50 transition-colors">
                    <div className="h-8 w-8 rounded bg-purple-500/10 flex items-center justify-center shrink-0">
                        <ContribIcon className="w-5 h-5 text-purple-500" />
                    </div>
                    <input
                        type="number"
                        value={currContrib}
                        onChange={e => setCurrContrib(e.target.value)}
                        placeholder="0"
                        className="no-spinner bg-transparent w-full text-sm font-mono text-white focus:outline-none placeholder-zinc-700"
                    />
                    <span className="text-[10px] text-zinc-600 font-mono pr-2">/{LIMITS.CONTRIB}</span>
                </div>

                {/* 信用点输入 */}
                <div className="bg-black/40 p-1.5 rounded border border-white/5 flex items-center gap-2 group focus-within:border-teal-500/50 transition-colors">
                    <div className="h-8 w-8 rounded bg-teal-500/10 flex items-center justify-center shrink-0">
                        <CreditIcon className="w-5 h-5 text-teal-500" />
                    </div>
                    <input
                        type="number"
                        value={currCredit}
                        onChange={e => setCurrCredit(e.target.value)}
                        placeholder="0"
                        className="no-spinner bg-transparent w-full text-sm font-mono text-white focus:outline-none placeholder-zinc-700"
                    />
                    <span className="text-[10px] text-zinc-600 font-mono pr-2">/{LIMITS.CREDIT}</span>
                </div>

                {/* 狩猎上限 (带 +/-) */}
                <div className="bg-black/40 p-1.5 rounded border border-white/5 flex items-center gap-1 group focus-within:border-orange-500/50 transition-colors">
                    <div className="h-8 w-8 rounded bg-orange-500/10 flex items-center justify-center shrink-0 cursor-help" title="Hunt Max">
                        <Sword className="w-4 h-4 text-orange-500" />
                    </div>
                    <button
                        onClick={() => handleAdjust(setMaxHunt, -1)}
                        className="w-32 h-8 flex items-center justify-center rounded bg-white/5 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/20 transition-all active:scale-95"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        value={maxHunt}
                        onChange={e => setMaxHunt(Number(e.target.value))}
                        className="no-spinner bg-transparent w-full text-center text-sm font-bold font-mono text-white focus:outline-none"
                    />
                    <button
                        onClick={() => handleAdjust(setMaxHunt, 1)}
                        className="w-32 h-8 flex items-center justify-center rounded bg-white/5 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/20 transition-all active:scale-95"
                    >
                        +
                    </button>
                </div>

                {/* 专家上限 (带 +/-) */}
                <div className="bg-black/40 p-1.5 rounded border border-white/5 flex items-center gap-1 group focus-within:border-blue-500/50 transition-colors">
                    <div className="h-8 w-8 rounded bg-blue-500/10 flex items-center justify-center shrink-0 cursor-help" title="Expert Max">
                        <Trophy className="w-4 h-4 text-blue-500" />
                    </div>
                    <button
                        onClick={() => handleAdjust(setMaxExpert, -1)}
                        className="w-32 h-8 flex items-center justify-center rounded bg-white/5 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/20 transition-all active:scale-95"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        value={maxExpert}
                        onChange={e => setMaxExpert(Number(e.target.value))}
                        className="no-spinner bg-transparent w-full text-center text-sm font-bold font-mono text-white focus:outline-none"
                    />
                    <button
                        onClick={() => handleAdjust(setMaxExpert, 1)}
                        className="w-32 h-8 flex items-center justify-center rounded bg-white/5 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/20 transition-all active:scale-95"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* 2. 操作按钮组 */}
            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 border-t border-zinc-800 pt-3 md:border-t-0 md:pt-0 md:border-l md:pl-6">
                <div className="flex gap-2">
                    <button onClick={() => onAddReward(TASKS.HUNT)} className="flex flex-col items-center justify-center w-14 h-12 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all group" title="+1 恶名狩猎">
                        <Sword className="w-4 h-4 text-orange-500 mb-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] text-zinc-500 font-mono">HUNT</span>
                    </button>
                    <button onClick={() => onAddReward(TASKS.EXPERT)} className="flex flex-col items-center justify-center w-14 h-12 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all group" title="+1 专业挑战">
                        <Trophy className="w-4 h-4 text-blue-500 mb-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] text-zinc-500 font-mono">EXP</span>
                    </button>
                    <button onClick={() => onAddReward(TASKS.HOLLOW)} className="flex flex-col items-center justify-center w-14 h-12 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all group" title="+1 普通空洞">
                        <Ghost className="w-4 h-4 text-purple-500 mb-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] text-zinc-500 font-mono">HOL</span>
                    </button>
                </div>

                <button onClick={onReset} className="w-10 h-12 flex items-center justify-center bg-zinc-900 hover:bg-red-500/20 text-zinc-500 hover:text-red-500 rounded border border-zinc-800 transition-colors" title="重置">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
