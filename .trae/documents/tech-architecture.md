## 1. 架构设计

```mermaid
graph TB
    subgraph "前端层"
        "React 应用" --> "Zustand 状态管理"
        "React 应用" --> "路由 React Router"
        "React 应用" --> "组件库 Tailwind CSS"
    end
    subgraph "数据层"
        "Zustand Store" --> "LocalStorage 持久化"
        "Zustand Store" --> "天气快照缓存"
        "Zustand Store" --> "预约草稿存储"
    end
    subgraph "离线层"
        "Online/Offline 检测" --> "天气快照读取"
        "Service Worker 缓存" --> "静态资源"
    end
```

## 2. 技术说明

- 前端：React 18 + TypeScript + Tailwind CSS 3 + Vite
- 状态管理：Zustand（含 persist 中间件实现 LocalStorage 持久化）
- 路由：React Router DOM v6
- 初始化工具：vite-init（react-ts 模板）
- 后端：无（纯前端，使用 Mock 数据）
- 数据库：无（LocalStorage 持久化 + 内存 Mock 数据）
- 图标：lucide-react

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| `/` | 营位地图主页，含天气筛选、风险提示、撤离警告 |
| `/reserve/:siteId` | 预约草稿页面，选择营位后填写预约信息 |
| `/drafts` | 草稿列表页面，查看/恢复/删除草稿 |
| `/admin` | 管理面板，维护营位和天气标签 |

## 4. 数据模型

### 4.1 数据模型定义

```mermaid
erDiagram
    "CampSite" {
        "string id PK" ""
        "string name" ""
        "number row" ""
        "number col" ""
        "string type" ""
        "string weatherTagId FK" ""
    }
    "WeatherTag" {
        "string id PK" ""
        "string label" ""
        "string icon" ""
        "number riskLevel" ""
        "string color" ""
    }
    "ReservationDraft" {
        "string id PK" ""
        "string siteId FK" ""
        "string guestName" ""
        "string date" ""
        "number guests" ""
        "number createdAt" ""
    }
    "WeatherSnapshot" {
        "string siteId FK" ""
        "string weatherTagId FK" ""
        "number timestamp" ""
        "number riskLevel" ""
    }
    "CampSite" }o--|| "WeatherTag" : "has"
    "ReservationDraft" }o--|| "CampSite" : "for"
    "WeatherSnapshot" }o--|| "CampSite" : "of"
```

### 4.2 核心类型定义

```typescript
interface CampSite {
  id: string;
  name: string;
  row: number;
  col: number;
  type: 'tent' | 'rv' | 'cabin';
  weatherTagId: string;
}

interface WeatherTag {
  id: string;
  label: string;
  icon: string;
  riskLevel: 0 | 1 | 2 | 3;
  color: string;
  isStrongWind: boolean;
}

interface ReservationDraft {
  id: string;
  siteId: string;
  guestName: string;
  date: string;
  guests: number;
  createdAt: number;
}

interface WeatherSnapshot {
  siteId: string;
  weatherTagId: string;
  timestamp: number;
  riskLevel: number;
}
```

### 4.3 风险等级定义

| 等级 | 名称 | 颜色 | 行为 |
|------|------|------|------|
| 0 | 安全 | 绿色 `#27AE60` | 正常预约 |
| 1 | 注意 | 黄色 `#F1C40F` | 正常预约，显示注意提示 |
| 2 | 警告 | 橙色 `#E67E22` | 正常预约，显示警告提示 |
| 3 | 危险（强风） | 红色 `#C0392B` | 不可预约，显示撤离提示 |

## 5. 关键技术实现

### 5.1 离线快照

- 使用 `navigator.onLine` 和 `online/offline` 事件监听网络状态
- 每次天气数据更新时，将快照写入 Zustand persist（LocalStorage）
- 离线时从 store 读取最后快照，显示快照时间戳
- 离线标识：右上角徽章 + 快照时间文字

### 5.2 撤离提示

- 当任一营位风险等级 >= 2 时，顶部显示撤离提示横幅
- 风险等级 = 3（强风）时，横幅升级为紧急撤离样式
- 使用 CSS 动画实现横幅滑入和文字脉冲效果

### 5.3 预约草稿

- 草稿保存在 LocalStorage（通过 Zustand persist）
- 草稿包含：营位ID、姓名、日期、人数、创建时间
- 强风营位（riskLevel === 3）预约按钮 disabled
- 页面加载时检测是否有未提交草稿，提示恢复

### 5.4 营位地图

- 使用 CSS Grid 渲染营位网格
- 每个营位卡片显示：名称、天气图标、风险色条
- 筛选逻辑：按天气标签过滤，支持多选
- 点击营位打开预约面板
