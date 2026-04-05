# Flappy Bird

一个使用 HTML5 Canvas、CSS 和 JavaScript 构建的 Flappy Bird 游戏。

## 游戏特色

### 核心功能
- **经典玩法**：控制小鸟穿越管道，获得高分
- **多端支持**：兼容桌面键盘操作和移动端触摸操作
- **流畅体验**：使用 Canvas 实现高性能游戏渲染

### 新增功能
- **游戏状态管理**：
  - 开始界面：显示游戏标题和最高分
  - 暂停/继续：随时暂停游戏
  - 游戏结束界面：显示最终得分和最高分
  - 重新开始：快速重置游戏

- **动态难度系统**：
  - 每获得 5 分提升一个难度等级
  - 管道速度逐渐加快（上限 6px/帧）
  - 管道间距逐渐缩小（最小间距为屏幕高度的 1/6）

- **本地最高分**：
  - 使用 localStorage 持久化存储最高分
  - 在开始界面和游戏结束界面显示

- **音效系统**：
  - 包含跳跃、得分、死亡音效
  - 音效开关，支持静音
  - 设置自动保存

## 运行方式

### 本地运行
1. 下载或克隆项目到本地
2. 在浏览器中打开 `index.html` 文件
3. 开始游戏！

### 在线运行
直接在浏览器中访问游戏页面即可游玩。

## 操作说明

### 桌面端
- **开始游戏**：点击"开始游戏"按钮
- **跳跃**：空格键 / 上箭头 / X键
- **暂停/继续**：ESC键 / P键
- **重新开始**：游戏结束后按空格键 / 上箭头 / X键

### 移动端
- **开始游戏**：点击"开始游戏"按钮
- **跳跃**：点击或触摸屏幕
- **暂停/继续**：点击暂停按钮
- **重新开始**：点击"重新开始"按钮

## 技术实现

- **HTML5 Canvas**：游戏画面渲染
- **JavaScript**：游戏逻辑、碰撞检测、状态管理
- **CSS3**：UI 样式、响应式设计、动画效果
- **localStorage**：数据持久化存储
- **Web Audio API**：音效播放

## 项目结构

```
flappy-bird/
├── index.html          # 主页面
├── flappybird.js       # 游戏逻辑
├── flappybird.css      # 样式文件
├── README.md           # 项目说明
├── *.png               # 图片资源
└── *.wav               # 音效资源
```

## 游戏截图

![flappy-bird-sample](https://user-images.githubusercontent.com/78777681/219966636-72584cb3-d471-41c0-872f-62c230dccc47.png)

## 开发说明

本项目基于以下教程开发：
- Coding Tutorial: https://youtu.be/jj5ADM2uywg
- Learn how to add music/sounds: https://youtu.be/UQA5jG-yh78
- Learn how to add animations: https://youtu.be/94Vw8teCElM
