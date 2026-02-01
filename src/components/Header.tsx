import { Calculator } from 'lucide-react';

export const Header = () => {
    return (
        <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-orange-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">
                    PROXY <span className="text-orange-500">CALC</span>
                </h1>
                <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                    智能委托规划
                </p>
            </div>
        </div>
    );
};
