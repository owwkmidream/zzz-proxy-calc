import { useState, forwardRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onClear: () => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
    ({ searchQuery, onSearchChange, onClear }, ref) => {
        const [isFocused, setIsFocused] = useState(false);

        return (
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-orange-500' : 'text-zinc-500'}`} />
                </div>
                <input
                    ref={ref}
                    type="text"
                    className="w-full bg-black/40 border border-zinc-700/50 text-zinc-100 rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:border-orange-500/50 focus:bg-black/60 transition-all font-mono shadow-inner"
                    placeholder="搜索副本名称, 拼音或缩写... (Press '/')"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-orange-500 transition-colors g-zinc-900"
                        aria-label="清空搜索"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        );
    }
);

SearchBar.displayName = 'SearchBar';
