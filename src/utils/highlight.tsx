import type { ReactNode } from 'react';

// 高亮样式常量
const HIGHLIGHT_CLASS = "text-orange-500 bg-orange-500/10 font-bold rounded-[1px]";

// 高亮算法 - 根据搜索查询高亮显示名称
export const getHighlightedName = (
    name: string,
    query: string,
    abbr: string,
    py: string
): ReactNode => {
    if (!query) return <>{name}</>;
    const q = query.toLowerCase();

    // 1. 汉字直接匹配
    if (name.toLowerCase().includes(q)) {
        const parts = name.split(new RegExp(`(${q})`, 'gi'));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === q ?
                        <span key={i} className={HIGHLIGHT_CLASS}>{part}</span> : part
                )}
            </>
        );
    }

    // 2. Abbr (首字母) 匹配 - 精准汉字高亮
    if (abbr.includes(q)) {
        const map: number[] = [];

        // 构建 name 的有效字符索引映射
        for (let i = 0; i < name.length; i++) {
            const char = name[i];
            // 假设有效字符对应 abbr 中的一个字符
            if (/^[\u4e00-\u9fa5a-zA-Z0-9]$/.test(char)) {
                map.push(i);
            }
        }

        const matchIdx = abbr.indexOf(q);
        if (matchIdx !== -1 && matchIdx + q.length <= map.length) {
            const startNameIdx = map[matchIdx];
            const endNameIdx = map[matchIdx + q.length - 1];

            const prefix = name.substring(0, startNameIdx);
            const highlight = name.substring(startNameIdx, endNameIdx + 1);
            const suffix = name.substring(endNameIdx + 1);

            return (
                <>
                    {prefix}
                    <span className={HIGHLIGHT_CLASS}>{highlight}</span>
                    {suffix}
                </>
            );
        }
    }

    // 3. 全拼匹配 - 降级为全高亮
    if (py.includes(q)) {
        return <span className={HIGHLIGHT_CLASS}>{name}</span>;
    }

    return <>{name}</>;
};
