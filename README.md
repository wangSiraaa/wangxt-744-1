# 露营营位天气看板

露营营位天气风险可视化平台。营地主理人维护营位与天气标签，游客查看风险等级并保存预约草稿。

## 功能特性

- **营位地图**：可视化展示营位布局、天气状态色标、风险等级标注
- **天气筛选**：按天气标签（晴/雨/强风/雷暴等）多选筛选营位
- **风险提示**：风险等级 ≥ 2 显示撤离横幅，强风营位不可预约
- **预约草稿**：填写预约信息并保存草稿，支持恢复和删除
- **离线快照**：断网时保留最近天气快照，显示离线标识和快照时间

## 静态预览

```bash
# 安装依赖
npm install

# 开发模式启动
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

开发服务器默认地址：`http://localhost:5173`

## Docker 启动

```bash
# 构建镜像
docker build -t camp-weather-dashboard .

# 运行容器
docker run -d -p 8080:80 camp-weather-dashboard
```

访问 `http://localhost:8080` 即可使用。

## 验证强风营位不可预约

1. 启动应用后进入首页营位地图
2. 找到标记为「强风」的营位（如「溪谷 B3」「山顶 C1」，显示红色危险标签）
3. 点击强风营位，右侧弹出预约面板
4. 确认面板中显示红色警告「该营位当前处于强风状态」
5. 确认底部预约按钮为灰色禁用状态，文字显示「强风不可预约」
6. 对比非强风营位，预约按钮为绿色可用状态

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS 3
- Zustand（状态管理 + LocalStorage 持久化）
- React Router DOM v6
- lucide-react（图标）
