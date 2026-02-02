import { Sword, Trophy, Ghost } from 'lucide-react';
import type { Benchmarks } from '../types';

interface BenchmarkCardProps {
    benchmarks: Benchmarks;
}

export const BenchmarkCard = ({ benchmarks }: BenchmarkCardProps) => {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 relative overflow-hidden flex flex-col gap-3">
            <div>
                <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-2">📊 每周概览</h3>
                <p className="text-xs text-zinc-500 mt-1">从零开始打满周上限的耗时参考</p>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-1">

                {/* 高效率 */}
                <div className="flex items-center justify-between p-2 rounded bg-emerald-500/5 border border-emerald-500/10">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="text-xs font-bold text-emerald-100">高效率</span>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono ml-1">
                            ({benchmarks.best.counts.hunt} <Sword className="w-3 h-3 text-orange-500" /> + {benchmarks.best.counts.hollow} <Ghost className="w-3 h-3 text-purple-500" />)
                        </div>
                    </div>
                    <span className="text-sm font-black text-emerald-400 font-mono">
                        {Math.ceil(benchmarks.best.totalTime / 60)} <span className="text-[10px] text-zinc-600">MIN</span>
                    </span>
                </div>

                {/* 均衡型 */}
                <div className="flex items-center justify-between p-2 rounded bg-blue-500/5 border border-blue-500/10">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <span className="text-xs font-bold text-blue-100">均衡型</span>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono ml-1">
                            ({benchmarks.mod.counts.expert} <Trophy className="w-3 h-3 text-blue-500" /> + {benchmarks.mod.counts.hollow} <Ghost className="w-3 h-3 text-purple-500" />)
                        </div>
                    </div>

                    <span className="text-sm font-black text-blue-400 font-mono">
                        {Math.ceil(benchmarks.mod.totalTime / 60)} <span className="text-[10px] text-zinc-600">MIN</span>
                    </span>
                </div>

                {/* 基础型 */}
                <div className="flex items-center justify-between p-2 rounded bg-rose-500/5 border border-rose-500/10">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span className="text-xs font-bold text-rose-100">基础型</span>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono ml-1">
                            ({benchmarks.worst.counts.hollow} <Ghost className="w-3 h-3 text-purple-500" /> )
                        </div>
                    </div>
                    <span className="text-sm font-black text-rose-400 font-mono">
                        {Math.ceil(benchmarks.worst.totalTime / 60)} <span className="text-[10px] text-zinc-600">MIN</span>
                    </span>
                </div>
            </div>
        </div>
    );
};
