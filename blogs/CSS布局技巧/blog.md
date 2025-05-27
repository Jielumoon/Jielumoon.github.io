---
title: CSS 布局技巧分享
date: 2025.04.12 09:30:00
---

# CSS 布局技巧分享

网页布局是前端开发的基础，CSS 提供了多种布局方式。这里分享几个常用的布局技巧。

## Flexbox (弹性盒子布局)

Flexbox 非常适合用于**一维布局**（行或列）。它是构建响应式导航栏、对齐项目、分配空间的最常用方式之一。

**核心概念**:
*   `display: flex` 应用于容器。
*   `flex-direction`: 控制主轴方向（`row` 或 `column`）。
*   `justify-content`: 主轴对齐方式。
*   `align-items`: 交叉轴对齐方式。
*   `flex-grow`, `flex-shrink`, `flex-basis`: 控制子项的伸缩和基础尺寸。

## Grid (网格布局)

Grid 布局则更擅长处理**二维布局**（行和列）。它非常适合创建复杂的页面结构，如仪表盘、卡片式布局等。

**核心概念**:
*   `display: grid` 应用于容器。
*   `grid-template-columns`, `grid-template-rows`: 定义网格的列宽和行高。
*   `grid-gap` (或 `gap`): 设置网格线之间的间距。
*   `grid-column`, `grid-row`: 指定项目跨越的网格线。

## 定位 (Positioning)

`position` 属性（`static`, `relative`, `absolute`, `fixed`, `sticky`）用于更精细地控制元素的位置。

*   `relative`: 相对于自身原始位置进行定位。
*   `absolute`: 相对于最近的**非 static 定位祖先元素**进行定位。常用于创建模态框、下拉菜单等覆盖效果。
*   `fixed`: 相对于**视口**进行定位，常用于创建固定导航栏或页脚。
*   `sticky`: 结合了 `relative` 和 `fixed` 的特性，在滚动到特定阈值前表现为 `relative`，之后表现为 `fixed`。

## 响应式设计

结合媒体查询 (`@media`) 和上述布局技术，可以创建在不同设备尺寸下都能良好显示的响应式网页。例如，在小屏幕上将多列布局变为单列布局。

选择哪种布局方式取决于具体的场景需求。熟练掌握 Flexbox 和 Grid 是现代前端开发的必备技能。
