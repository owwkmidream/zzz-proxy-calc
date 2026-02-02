import { Sword, Trophy, Ghost } from 'lucide-react';
import type { PlanResult } from '../types';
import { calculateSingleTaskCounts } from '../utils/solver';
import { LIMITS } from '../constants';

interface PlanCardProps {
    dynamicPlan: PlanResult | null;
    currContrib: number;
    currCredit: number;
}

export const PlanCard = ({ dynamicPlan, currContrib, currCredit }: PlanCardProps) => {
    // 计算剩余需求
    const reqC = Math.max(0, LIMITS.CONTRIB - currContrib);
    const reqCr = Math.max(0, LIMITS.CREDIT - currCredit);

    // 计算单一任务参考数据
    const singleCounts = calculateSingleTaskCounts(reqC, reqCr);

    return (
        <div className={`bg-zinc-900/50 border ${dynamicPlan ? 'border-orange-500/30' : 'border-zinc-800'} rounded-xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]`}>
            <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    🚀 当前规划
                    {dynamicPlan && <span className="text-[10px] px-1.5 py-0.5 bg-orange-500/20 text-orange-300 rounded border border-orange-500/20">CUSTOM</span>}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">基于左侧进度与上限设置的特定方案</p>
            </div>

            {dynamicPlan ? (
                <div className="mt-4">
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-4xl font-black text-white tracking-tighter">{Math.ceil(dynamicPlan.totalTime / 60)}</span>
                        <span className="text-xs font-bold text-zinc-500 uppercase">Minutes Needed</span>
                    </div>
                    <div className="flex gap-2">
                        {dynamicPlan.counts.hunt > 0 && (
                            <span className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-xs text-orange-300 font-mono font-bold flex items-center gap-1">
                                <Sword className="w-3 h-3" /> {dynamicPlan.counts.hunt}
                            </span>
                        )}
                        {dynamicPlan.counts.expert > 0 && (
                            <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-300 font-mono font-bold flex items-center gap-1">
                                <Trophy className="w-3 h-3" /> {dynamicPlan.counts.expert}
                            </span>
                        )}
                        {dynamicPlan.counts.hollow > 0 && (
                            <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-300 font-mono font-bold flex items-center gap-1">
                                <Ghost className="w-3 h-3" /> {dynamicPlan.counts.hollow}
                            </span>
                        )}
                    </div>

                    {/* 单一任务参考 */}
                    <div className="mt-4 pt-3 border-t border-zinc-800">
                        <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">单一任务参考</p>
                        <div className="flex gap-3 text-xs">
                            <span className="flex items-center gap-1 text-zinc-500" title="只刷恶名狩猎需要的次数">
                                <Sword className="w-3 h-3 text-orange-500/60" />
                                <span className="font-mono">{singleCounts.hunt === Infinity ? '∞' : singleCounts.hunt}</span>
                            </span>
                            <span className="flex items-center gap-1 text-zinc-500" title="只刷专业挑战需要的次数">
                                <Trophy className="w-3 h-3 text-blue-500/60" />
                                <span className="font-mono">{singleCounts.expert === Infinity ? '∞' : singleCounts.expert}</span>
                            </span>
                            <span className="flex items-center gap-1 text-zinc-500" title="只刷普通空洞需要的次数">
                                <Ghost className="w-3 h-3 text-purple-500/60" />
                                <span className="font-mono">{singleCounts.hollow === Infinity ? '∞' : singleCounts.hollow}</span>
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-zinc-600 text-sm font-mono mt-4">
                    目标已达成 / 无需规划
                </div>
            )}
            <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
        </div>
    );
};
