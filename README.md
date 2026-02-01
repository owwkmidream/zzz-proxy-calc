# 📟 ZZZ Proxy Calc | 绝区零委托进度规划器

[![Deno Deploy](https://img.shields.io/badge/Deploy-Deno--Deploy-black?logo=deno)](https://deno.com/deploy)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)](https://vercel.com/)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify)](https://www.netlify.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare_Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com/)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222222?logo=github)](https://pages.github.com/)
[![Zeabur](https://img.shields.io/badge/Deploy-Zeabur-000000?logo=zeabur)](https://zeabur.com/)
[![Railway](https://img.shields.io/badge/Deploy-Railway-131415?logo=railway)](https://railway.app/)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render)](https://render.com/)
[![Surge](https://img.shields.io/badge/Deploy-Surge-01ADEE?logo=surge)](https://surge.sh/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org/)

一个专为《绝区零》(Zenless Zone Zero) 绳匠设计的周常委托进度规划与查询工具。通过热力图直观展示委托耗时，并根据当前奖励进度提供多种刷取方案。

## ✨ 特性

- **🔍 智能搜索**: 支持中文名称、拼音全拼及首字母简拼快速搜索委托
- **🔥 耗时热力图**: 直观的颜色标识（绿色 < 2min, 黄色 < 4min, 红色 > 4min）
- **🧮 进度计算器**: 输入当前进度，立即获取最优补位建议
- **⚡ 智能规划**: 基于贪心算法自动计算最优刷取方案
- **📟 赛博工业风 UI**: 深度还原《绝区零》视觉风格的暗色系交互界面

## 📁 项目结构

```
src/
├── types/                    # 类型定义
│   └── index.ts              # Task, RawDataItem, PlanResult, Benchmarks
├── constants/                # 常量配置
│   └── index.ts              # LIMITS, TASKS, rawData
├── utils/                    # 工具函数
│   ├── heatmap.ts            # 热力图颜色算法、难度信息
│   ├── solver.ts             # 贪心规划算法、基准生成
│   └── highlight.tsx         # 搜索高亮逻辑
├── hooks/                    # 自定义 Hooks
│   ├── useSearch.ts          # 搜索状态管理
│   ├── useKeyboardShortcuts.ts  # 键盘快捷键
│   └── useCalculator.ts      # 计算器状态与逻辑
├── components/               # UI 组件
│   ├── Header.tsx            # 标题栏
│   ├── PlanCard.tsx          # 当前规划卡片
│   ├── BenchmarkCard.tsx     # 每周概览卡片
│   ├── ControlPanel.tsx      # 控制面板
│   ├── SearchBar.tsx         # 搜索栏
│   ├── TaskCard.tsx          # 副本任务卡片
│   └── index.ts              # 统一导出
├── App.tsx                   # 主组件
└── main.tsx                  # 入口文件
```

### 核心模块

| 模块 | 职责 |
|------|------|
| `types/` | 统一类型定义，确保类型安全 |
| `constants/` | 集中管理配置常量和副本数据 |
| `utils/` | 纯函数工具，无副作用 |
| `hooks/` | 状态逻辑封装，实现关注点分离 |
| `components/` | 纯 UI 组件，接收 props 渲染视图 |

## 🚀 快速开始

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/owwkmidream/zzz-proxy-calc.git
cd zzz-proxy-calc

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## 🌐 部署

本项目为纯静态站点，支持部署到任何静态托管平台:

- **Deno Deploy** / **Vercel** / **Netlify** / **Cloudflare Pages**
- **GitHub Pages** / **Zeabur** / **Railway** / **Render**

### 部署到 Deno Deploy

1. 在 [Deno Deploy 控制台](https://dash.deno.com/) 创建新项目
2. 连接 GitHub 仓库
3. 配置构建设置:
   - **Framework Preset**: `Vite`
   - **Build Command**: `pnpm install && pnpm build`
   - **Publish Directory**: `dist`
4. 点击 Deploy

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **Core** | React 19 + TypeScript |
| **Bundler** | Vite 7 |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `/` | 聚焦搜索框 |
| `ESC` | 取消搜索框聚焦 |

## 📄 开源协议

MIT License
