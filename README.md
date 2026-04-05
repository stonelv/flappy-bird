# [Flappy Bird](https://youtu.be/jj5ADM2uywg)
- Coding Tutorial: https://youtu.be/jj5ADM2uywg
- Demo: https://imkennyyip.github.io/flappy-bird/
- Learn how to add music/sounds: https://youtu.be/UQA5jG-yh78
- Learn how to add animations: https://youtu.be/94Vw8teCElM

In this tutorial, you will learn to create the flappy bird game with html, css, and javascript. Specifically, you will learn how to code the game using html5 canvas. 

Throughout the tutorial, you will learn how to create the game loop, add images onto the canvas, add click handlers to make the flappy bird jump, randomly generate pipes and move them across the screen, detect collisions between the flappy bird and each pipe, and add a running score. 

![flappy-bird-sample](https://user-images.githubusercontent.com/78777681/219966636-72584cb3-d471-41c0-872f-62c230dccc47.png)

## 新增功能

### 游戏状态系统
- **开始页面**：游戏启动时显示开始界面，包含游戏标题、操作说明和最高分
- **游戏中**：正常游戏状态，显示当前分数和最高分
- **暂停功能**：按P键可暂停游戏，再次按P键恢复
- **游戏结束页面**：游戏结束时显示得分、最高分和重新开始提示

### 动态难度系统
- 分数每增加5分，游戏难度提升一次
- 提升内容包括：管道移动速度增加、管道间距减小、管道生成间隔缩短
- 难度等级上限为5级，防止难度过高

### 本地存储
- 使用localStorage存储最高分
- 持久化保存音效开关设置

### 音效系统
- 包含翅膀扇动、得分、碰撞、死亡和 swooshing 音效
- 按M键可切换音效开关
- 音效设置会被持久化保存

## 操作说明

### 桌面端
- **空格键**：开始游戏/跳跃/重新开始
- **上箭头键**：跳跃
- **X键**：跳跃
- **P键**：暂停/继续游戏
- **M键**：切换音效开关

### 移动端
- **点击屏幕**：开始游戏/跳跃/重新开始

## 运行指南

1. 克隆或下载本项目到本地
2. 打开 `index.html` 文件即可在浏览器中运行游戏
3. 无需安装任何依赖，纯前端实现

## 技术实现

- 使用 HTML5 Canvas 绘制游戏画面
- 使用 JavaScript 实现游戏逻辑
- 使用 localStorage 进行本地数据存储
- 响应式设计，支持桌面端和移动端
