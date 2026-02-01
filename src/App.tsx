import { useRef, useCallback } from 'react';

// Hooks
import { useSearch } from './hooks/useSearch';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useCalculator } from './hooks/useCalculator';

// Components
import {
  Header,
  PlanCard,
  BenchmarkCard,
  ControlPanel,
  SearchBar,
  TaskCard,
} from './components';

// Utils
import { getHighlightedName } from './utils/highlight';

const App = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  // 搜索逻辑
  const { searchQuery, setSearchQuery, filteredData } = useSearch();

  // 清空搜索
  const clearSearch = useCallback(() => setSearchQuery(''), [setSearchQuery]);

  // 键盘快捷键
  useKeyboardShortcuts(inputRef, clearSearch);

  // 计算器逻辑
  const {
    currContrib,
    setCurrContrib,
    currCredit,
    setCurrCredit,
    maxHunt,
    setMaxHunt,
    maxExpert,
    setMaxExpert,
    benchmarks,
    dynamicPlan,
    addReward,
    resetCalc,
    handleAdjust,
    TASKS,
    LIMITS,
  } = useCalculator();

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-orange-500/30 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col gap-6">

          {/* 标题栏 */}
          <Header />

          {/* 结果数据卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
            <PlanCard dynamicPlan={dynamicPlan} />
            <BenchmarkCard benchmarks={benchmarks} />
          </div>

          {/* 统一交互区 (Controls + Search) */}
          <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col gap-6">
            {/* 上半部分：计算器控制 */}
            <ControlPanel
              currContrib={currContrib}
              setCurrContrib={setCurrContrib}
              currCredit={currCredit}
              setCurrCredit={setCurrCredit}
              maxHunt={maxHunt}
              setMaxHunt={setMaxHunt}
              maxExpert={maxExpert}
              setMaxExpert={setMaxExpert}
              onAddReward={addReward}
              onReset={resetCalc}
              handleAdjust={handleAdjust}
              TASKS={TASKS}
              LIMITS={LIMITS}
            />

            {/* 下半部分：搜索栏 */}
            <SearchBar
              ref={inputRef}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClear={clearSearch}
            />
          </div>

          {/* 列表内容 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredData.map((item, index) => (
              <TaskCard
                key={index}
                item={item}
                highlightedName={getHighlightedName(item.name, searchQuery, item.abbr, item.py)}
              />
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-20 text-zinc-500 font-mono">
              无匹配结果 / NO RESULTS
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
