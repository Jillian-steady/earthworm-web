# Earthworm Web

基于 Next.js 14 的英语学习 Web 应用，通过打字练习的方式学习英语句子。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 状态管理 | Zustand |
| 样式 | TailwindCSS + DaisyUI |
| 认证 | Logto |
| 单元测试 | Vitest + React Testing Library |
| E2E 测试 | Cypress |

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/             # 主布局路由组
│   │   ├── page.tsx        # 首页
│   │   ├── course-pack/    # 课程包列表/详情
│   │   ├── user/           # 用户中心/设置
│   │   ├── mastered-elements/ # 已掌握内容
│   │   ├── privacy-policy/ # 隐私政策
│   │   └── terms/          # 服务条款
│   ├── game/               # 游戏页面
│   │   └── [coursePackId]/[id]/ # /game/:coursePackId/:courseId
│   ├── callback/           # Logto OAuth 回调
│   └── api/                # BFF API 路由 (代理后端)
│       ├── course-pack/    # 课程包 API
│       ├── course-history/ # 课程历史
│       ├── user/           # 用户信息
│       ├── user-course-progress/ # 学习进度
│       ├── user-learning-activities/ # 学习活动
│       ├── mastered-elements/ # 已掌握元素
│       ├── rank/           # 排行榜
│       └── tool/           # 工具 API
├── components/             # React 组件
│   ├── game/               # 游戏核心组件
│   │   ├── QuestionInput.tsx   # 打字输入框
│   │   ├── Answer.tsx          # 答案展示
│   │   ├── Tips.tsx            # 快捷键提示栏
│   │   ├── CourseContents.tsx  # 课程目录弹窗
│   │   ├── mode/               # 游戏模式
│   │   │   ├── ChineseToEnglishQuestion.tsx  # 中译英
│   │   │   └── DictationQuestion.tsx         # 听写模式
│   │   └── hooks/              # 游戏相关 hooks
│   │       ├── useQuestionInput.ts     # 输入框逻辑
│   │       ├── useInputLogic.ts        # 输入/校验/纠错
│   │       ├── useWrapperQuestionInput.ts # 组合 hook
│   │       ├── useTypingSound.ts       # 打字/正确/错误音效
│   │       └── useAnswerError.ts       # 答错处理
│   └── common/             # 通用组件
├── hooks/                  # 全局 React Hooks
│   ├── useSound.ts         # 声音设置 (打字音/自动播放)
│   ├── useEnglishSound.ts  # 英语发音播放
│   ├── usePronunciation.ts # 口音切换 (美音/英音)
│   ├── useGameMode.ts      # 游戏模式 (答题/答案)
│   ├── useAnswerTip.ts     # 答案提示
│   ├── useAutoNext.ts      # 自动下一题
│   ├── useSubmitKey.ts     # 提交键设置
│   ├── useErrorTip.ts      # 错误提示
│   ├── useShortcutKey.ts   # 快捷键设置
│   ├── useShowWordsWidth.ts # 单词宽度显示
│   ├── useRanking.ts       # 排行榜
│   ├── useSummary.ts       # 完课总结
│   ├── useShareImage.ts    # 分享图片生成
│   ├── useDictationToolbar.ts # 听写工具栏
│   ├── useLearningTimeTracker.ts # 学习时间追踪
│   └── useCalendarGraph.ts # 日历热力图
├── stores/                 # Zustand 状态管理
│   ├── course.ts           # 课程状态 (当前课程/句子导航)
│   ├── course-pack.ts      # 课程包
│   ├── user.ts             # 用户信息
│   └── mastered-elements.ts # 已掌握元素
├── services/               # 服务层
│   └── auth.ts             # Logto 认证
├── utils/                  # 工具函数
│   ├── audio.ts            # 音频播放引擎
│   ├── fetcher.ts          # API 请求封装
│   ├── localStorage.ts     # localStorage Hook
│   ├── keyboardShortcuts.ts # 快捷键注册
│   ├── bonus.ts            # 奖励计算
│   ├── date.ts             # 日期工具
│   └── confetti.ts         # 撒花动画
├── types/                  # TypeScript 类型定义
├── tests/                  # 测试工具
│   ├── setup.ts            # Vitest 全局 setup
│   └── helper/             # 测试辅助函数
└── styles/                 # 全局样式
```

## 快速开始

### 环境要求

- Node.js >= 18
- Yarn

### 安装依赖

```bash
yarn install
```

### 环境配置

复制 `.env.example` 为 `.env.local` 并填写：

```env
NEXT_PUBLIC_API_BASE=/api
API_BACKEND_URL=http://localhost:3001          # 后端 API 地址
NEXT_PUBLIC_LOGTO_ENDPOINT=http://localhost:3010/  # Logto 认证服务
NEXT_PUBLIC_LOGTO_APP_ID=your-app-id           # Logto 应用 ID
NEXT_PUBLIC_LOGTO_SIGN_IN_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_LOGTO_SIGN_OUT_REDIRECT_URI=http://localhost:3000
```

### 启动开发服务

```bash
yarn dev
```

访问 http://localhost:3000

## 运行测试

### 单元测试

```bash
# 运行所有单测 (27 个文件, 182 个测试)
yarn test

# watch 模式 (文件变化自动重跑)
yarn test:watch

# 运行指定文件
npx vitest run src/stores/__tests__/course.spec.ts

# 运行匹配关键字的测试
npx vitest run -t "should setup"

# 查看覆盖率
npx vitest run --coverage
```

### E2E 测试

```bash
# 先启动开发服务
yarn dev

# 然后在另一个终端运行 E2E
yarn test:e2e

# 或打开 Cypress UI 交互式运行
yarn cypress:open
```

### 测试覆盖范围

| 分类 | 文件数 | 说明 |
|------|--------|------|
| Stores | 3 | course, coursePack, user |
| Hooks (用户设置) | 7 | sound, autoNext, submitKey, pronunciation, showWordsWidth, errorTip, shortcutKey |
| Hooks (游戏核心) | 7 | gameMode, answerTip, summary, ranking, englishSound, dictationToolbar, learningTimeTracker |
| Utils | 7 | localStorage, date, bonus, keyboardShortcuts, calendarGraph, confetti, shareImage |
| Components | 2 | getWordWidth, useQuestionInput |
| Services | 1 | auth |
| **E2E** | 1 | 游戏启动流程 |

## 核心游戏流程

```
首页 → 点击"开启Earthworm" → /game/:coursePackId/:courseId
    ↓
显示中文句子 → 用户打字输入英文
    ↓
Enter 提交 → 校验每个单词
    ├─ 全部正确 → 播放正确音效 → 自动下一题 或 显示答案页
    └─ 有错误 → 播放错误音效 → 进入纠错模式 (逐词修正)
    ↓
全部完成 → 完课总结弹窗 → 进入下一课
```

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| Enter | 提交答案 / 下一题 |
| Ctrl+1 (可自定义) | 播放发音 |
| Ctrl+2 (可自定义) | 显示/隐藏答案 |
| Ctrl+3 (可自定义) | 标记为已掌握 |
