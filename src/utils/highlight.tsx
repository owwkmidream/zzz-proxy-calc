import type { ReactNode } from 'react';

// 高亮样式常量
const HIGHLIGHT_CLASS = "text-orange-500 bg-orange-500/10 font-bold rounded-[1px]";

/**
 * 构建字符到拼音的映射关系
 * @param name 原始名称（含汉字和其他字符）
 * @param py 完整拼音字符串
 * @param abbr 首字母缩写
 * @returns 每个有效字符在拼音中的 [start, end) 区间数组
 */
const buildPinyinMap = (
    name: string,
    py: string,
    abbr: string
): Array<{ charIdx: number; pyStart: number; pyEnd: number }> => {
    const map: Array<{ charIdx: number; pyStart: number; pyEnd: number }> = [];

    // 收集有效字符索引（汉字、字母、数字）
    const validCharIndices: number[] = [];
    for (let i = 0; i < name.length; i++) {
        if (/^[\u4e00-\u9fa5a-zA-Z0-9]$/.test(name[i])) {
            validCharIndices.push(i);
        }
    }

    // 如果有效字符数与 abbr 长度不匹配，无法精确映射
    if (validCharIndices.length !== abbr.length) {
        return [];
    }

    // 根据 abbr 推断每个字符在 py 中的边界
    let pyPos = 0;
    for (let i = 0; i < abbr.length; i++) {
        const expectedFirstChar = abbr[i].toLowerCase();
        const charIdx = validCharIndices[i];

        // 找到当前字符拼音的起始位置
        if (pyPos >= py.length || py[pyPos] !== expectedFirstChar) {
            // 映射失败
            return [];
        }

        const pyStart = pyPos;

        // 向后扫描直到遇到下一个 abbr 字符或结束
        if (i + 1 < abbr.length) {
            const nextExpected = abbr[i + 1].toLowerCase();
            // 找到下一个 abbr 字符在 py 中的位置
            let nextPos = pyPos + 1;
            while (nextPos < py.length && py[nextPos] !== nextExpected) {
                nextPos++;
            }
            map.push({ charIdx, pyStart, pyEnd: nextPos });
            pyPos = nextPos;
        } else {
            // 最后一个字符，拼音延伸到末尾
            map.push({ charIdx, pyStart, pyEnd: py.length });
        }
    }

    return map;
};

/**
 * 根据拼音映射查找匹配的字符索引范围
 */
const findMatchingCharIndices = (
    query: string,
    py: string,
    pinyinMap: Array<{ charIdx: number; pyStart: number; pyEnd: number }>
): { startCharIdx: number; endCharIdx: number } | null => {
    const matchPyStart = py.indexOf(query);
    if (matchPyStart === -1) return null;
    const matchPyEnd = matchPyStart + query.length;

    let startMapIdx = -1;
    let endMapIdx = -1;

    for (let i = 0; i < pinyinMap.length; i++) {
        const { pyStart, pyEnd } = pinyinMap[i];
        // 找第一个与查询区间有交集的字符
        if (startMapIdx === -1 && pyEnd > matchPyStart && pyStart < matchPyEnd) {
            startMapIdx = i;
        }
        // 找最后一个与查询区间有交集的字符
        if (pyStart < matchPyEnd && pyEnd >= matchPyEnd) {
            endMapIdx = i;
            break;
        }
        if (pyEnd > matchPyStart && pyStart < matchPyEnd) {
            endMapIdx = i;
        }
    }

    if (startMapIdx === -1 || endMapIdx === -1) return null;

    return {
        startCharIdx: pinyinMap[startMapIdx].charIdx,
        endCharIdx: pinyinMap[endMapIdx].charIdx
    };
};

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

    // 3. 全拼匹配 - 精准汉字高亮
    if (py.includes(q)) {
        const pinyinMap = buildPinyinMap(name, py, abbr);

        if (pinyinMap.length > 0) {
            const match = findMatchingCharIndices(q, py, pinyinMap);

            if (match) {
                const prefix = name.substring(0, match.startCharIdx);
                const highlight = name.substring(match.startCharIdx, match.endCharIdx + 1);
                const suffix = name.substring(match.endCharIdx + 1);

                return (
                    <>
                        {prefix}
                        <span className={HIGHLIGHT_CLASS}>{highlight}</span>
                        {suffix}
                    </>
                );
            }
        }

        // 映射失败时降级为全高亮
        return <span className={HIGHLIGHT_CLASS}>{name}</span>;
    }

    return <>{name}</>;
};
