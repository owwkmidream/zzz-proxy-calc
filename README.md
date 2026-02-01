# 📟 ZZZ Proxy Calc | 绝区零委托进度规划器

[![Deno Deploy](https://img.shields.io/badge/Deploy-Deno--Deploy-black?logo=deno)](https://deno.com/deploy)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

一个专为《绝区零》(Zenless Zone Zero) 绳匠设计的周常委托进度规划与查询工具。通过热力图直观展示委托耗时，并根据当前奖励进度提供多种刷取方案。

## ✨ 特性

-   **🔍 智能搜索**: 支持中文名称、拼音全拼及首字母简拼快速搜索委托。
-   **🔥 耗时热力图**: 直观的颜色标识（绿色 < 2min, 黄色 < 4min, 红色 > 4min），一眼识别最高效委托。
-   **🧮 进度计算器**: 输入当前「信赖」与「助威」点数，立即获取补位建议。
-   **⚡ 三大规划方案**:
    -   **极速党**: 追求单次 1 分钟内的极致效率。
    -   **均衡党**: 混合不同类型的委托，兼顾趣味与效率。
    -   **空洞党**: 针对高价值长时委托进行规划。
-   **📟 赛博工业风 UI**: 深度还原《绝区零》视觉风格的暗色系交互界面。

## 🚀 快速开始

### 本地开发

1.  克隆仓库:
    ```bash
    git clone https://github.com/YOUR_USERNAME/zzz-proxy-calc.git
    cd zzz-proxy-calc
    ```

2.  安装依赖:
    ```bash
    pnpm install
    ```

3.  启动开发服务器:
    ```bash
    pnpm dev
    ```

### 构建

```bash
pnpm build
```

## 🌐 部署

本项目支持通过 **Deno Deploy** 或 **GitHub Pages** 快速部署。

### 部署到 Deno Deploy

1. 在 [Deno Deploy 控制台](https://dash.deno.com/) 点击 "New Project"。
2. 连接 GitHub 仓库。
3. 选择 `zzz-proxy-calc` 仓库。
4. 配置构建设置:
   - **Framework Preset**: `Vite`
   - **Build Command**: `pnpm install && pnpm build`
   - **Publish Directory**: `dist`
5. 点击 "Deploy Project"。

## 🛠️ 技术栈

-   **Core**: React 19 + TypeScript
-   **Bundler**: Vite 7
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React

## 📄 开源协议

MIT License
