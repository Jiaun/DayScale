---
name: dayscale-tech-stack
description: DayScale 仓库的技术栈与代码风格约束。用于在本仓库中生成或修改代码时提供统一约束，尤其适用于 React 19、TypeScript、TanStack Start/Router/Query、Tailwind CSS v4、shadcn/radix-ui 组件、Prisma、Better Auth、Paraglide 国际化、Vite 与服务端路由处理相关任务。
---

# DayScale 技术栈约束

## 遵循技术栈

使用 TypeScript 与 React 19 开发。

使用 Vite 与 TanStack Start，不要引入 Next.js、Remix、Express 或自定义 webpack 架构模式。

使用 `src/routes/**` 下基于文件的 TanStack Router 路由。

客户端异步状态使用 TanStack Query，并复用 `src/integrations/tanstack-query/root-provider.tsx` 中的共享 provider。

样式使用 `src/styles.css` 中的 Tailwind CSS v4 能力，保持与现有 CSS 变量主题体系一致。

可复用 UI 优先使用 `src/components/ui/**` 中的 shadcn 风格基础组件、Radix UI、`class-variance-authority`，以及 `@/lib/utils` 中的 `cn()`。

数据库访问使用 Prisma，并从 `@/db` 引入共享客户端。

认证使用 `@/lib/auth` 与 `@/lib/auth-client` 中现有的 Better Auth 封装。

多语言与本地化路由使用 Paraglide runtime helper，保持现有本地化策略不变。

## 遵循代码风格

编写严格模式下的 TypeScript 代码。

优先使用 `@/` 路径别名，避免过深的相对路径导入。

遵循仓库当前格式化规则：

- 使用单引号。
- 不写分号。
- 在合法位置保留尾随逗号。

组件与工具函数保持小而可组合，遵循现有函数组件风格，不使用 class 组件。

优先复用现有 helper 与共享封装，不要重复造轮子。类名合并使用 `cn()`，HTTP、认证、Redis 等能力优先走已有封装。

## 遵循路由与应用结构

页面与 API 路由统一放在 `src/routes/**` 下。

使用 `createFileRoute()` 或仓库中已经采用的 TanStack Router API。

路由、Query、主题与国际化的接线方式要与现有根路由和 router 配置保持一致。

不要额外引入第二套路由层或独立的 app shell 模式。

## 遵循 UI 约定

新的可复用基础 UI 组件放在 `src/components/ui/**`。

布局组件或业务功能组件不要放进 `src/components/ui/**`。

组件实现优先复用 shadcn-ui 体系，不要为常见按钮、输入框、弹窗、表单容器、下拉、抽屉、标签页等基础交互重复自建一套。

布局实现遵循以下优先级：`flex` 弹性盒布局 > `grid` 栅格布局 > `absolute` 绝对定位。

默认优先使用 `flex` 处理一维排布、对齐、间距与响应式收缩。

当页面或模块明确属于二维布局时，再使用 `grid`，例如卡片矩阵、表单网格、仪表盘区块。

只有在确实需要脱离文档流的覆盖、装饰、浮层角标、精确叠放等场景下，才使用绝对定位；不要把 `absolute` 当作常规排版手段。

优先使用 Tailwind 原子类和现有主题 token，避免随意写内联样式。

当组件存在多个视觉变体或尺寸时，优先复用 `cva()` 模式组织变体。

图标库优先使用 `lucide-react`，不要混用多套图标系统，除非任务明确要求品牌图标或专用图标资源。

除非任务明确要求重设计，否则保持现有 shadcn/radix-vega 的设计语言。

## 遵循动画规范

全局动画实现统一使用 `motion`，不要在项目中混用多套动画方案。

如果需要新增动画能力，优先围绕 `motion` 设计实现，而不是再引入其他动画库。

动画配置、共享变体、过渡参数与常用封装统一放到专门的动画文件中集中管理，不要把相同动画参数散落在各个页面和组件里。

优先创建可复用动画模块，例如 `src/lib/motion/**`、`src/components/motion/**` 或同类集中目录，并在多个页面之间复用。

在适合加入动画的地方默认补充动画，但要克制，重点覆盖以下场景：

- 页面进入与切换。
- 模态框、抽屉、下拉、popover 的出现与消失。
- 列表、卡片、表单区块的渐入、位移、stagger 动画。
- 按钮、可点击卡片、交互反馈的 hover 与 press 状态。

动画应服务于信息层级与交互反馈，不要为了动画而动画，避免影响可读性、性能与可访问性。

## 遵循数据层与服务端约定

Prisma 必须从 `@/db` 引入，不要到处手动创建新的 `new PrismaClient()` 实例。

`src/generated/prisma/**` 下的 Prisma 生成结果只作为输出使用，不要手动修改生成文件。

在 JSON 响应中谨慎处理 `BigInt`，相关场景优先复用已有序列化 helper。

Redis 访问使用 `@/lib/redis` 中的共享 helper，不要自行创建独立客户端。

## 尊重生成文件边界

除非任务明确就是处理生成流程，否则不要手动修改以下生成或派生文件：

- `src/generated/prisma/**`
- `src/paraglide/**`
- `src/routeTree.gen.ts`

应该修改源输入，再执行重新生成。

## 避免不兼容做法

当现有技术栈已经能满足需求时，不要额外引入新的状态库、样式系统、路由库、ORM 或认证框架。

没有明确技术理由时，不要绕过现有共享封装。

不要引入与 TanStack Start SSR、Paraglide URL 重写机制或 Tailwind v4 主题体系冲突的实现模式。
