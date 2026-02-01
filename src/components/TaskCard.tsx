import type { ReactNode } from 'react';
import type { RawDataItem } from '../types';
import { getHeatmapColor, getDifficultyInfo, getHeatBarPercent, MARKER_POSITIONS } from '../utils/heatmap';

interface TaskCardProps {
    item: RawDataItem;
    highlightedName: ReactNode;
}

export const TaskCard = ({ item, highlightedName }: TaskCardProps) => {
    const heatColor = getHeatmapColor(item.sec);
    const { label: diffLabel, colorClass: diffColor } = getDifficultyInfo(item.sec);
    const percent = Math.min(getHeatBarPercent(item.sec), 100);

    return (
        <div
            className="group bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 rounded-lg p-4 transition-all relative overflow-hidden flex flex-col justify-between"
        >
            <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex flex-col">
                    <span className="text-3xl font-black font-mono tracking-tighter" style={{ color: heatColor }}>
                        {item.time}
                    </span>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${diffColor}`}>
                    {diffLabel}
                </div>
            </div>

            <div className="mb-4 relative z-10">
                <h3 className="font-bold text-zinc-200 truncate" title={item.name}>
                    {highlightedName}
                </h3>
            </div>

            {/* Heat Bar */}
            <div className="relative h-2 bg-zinc-800/50 rounded-full w-full overflow-hidden mt-auto z-10">
                <div className="absolute top-0 bottom-0 w-[2px] bg-zinc-700/80 z-10" style={{ left: `${MARKER_POSITIONS.TWO_MINUTES}%` }}></div>
                <div className="absolute top-0 bottom-0 w-[2px] bg-zinc-700/80 z-10" style={{ left: `${MARKER_POSITIONS.FOUR_MINUTES}%` }}></div>
                <div className="h-full rounded-full transition-all duration-500 relative" style={{ width: `${percent}%`, backgroundColor: heatColor }}></div>
            </div>

            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100" style={{ backgroundColor: heatColor, opacity: 0.1 }}></div>
        </div>
    );
};
