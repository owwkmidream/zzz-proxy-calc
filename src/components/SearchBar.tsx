import { useState, forwardRef } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
    ({ searchQuery, onSearchChange }, ref) => {
        const [isFocused, setIsFocused] = useState(false);

        return (
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-orange-500' : 'text-zinc-500'}`} />
                </div>
                <input
                    ref={ref}
                    type="text"
                    className="w-full bg-black/40 border border-zinc-700/50 text-zinc-100 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-orange-500/50 focus:bg-black/60 transition-all font-mono shadow-inner"
                    placeholder="搜索副本名称, 拼音或缩写... (Press '/')"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-[10px] text-zinc-600 font-mono border border-zinc-800/50 rounded px-1.5 py-0.5 bg-zinc-900/50">ESC</span>
                </div>
            </div>
        );
    }
);

SearchBar.displayName = 'SearchBar';
