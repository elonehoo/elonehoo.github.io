---
title: 纯CSS图标方案
date: 2022-08-14
author: Elone Hoo
twitter: '@huchengye'
---

> 我想开启一个新坑，在编写实验🧪项目[pick](https://github.com/elonehoo/pick) 时，设计了一个[组件 pick-icon](https://pick.elonehoo.xyz/components/icon.html)

我认识到了一个很酷的[仓库](https://github.com/iconify/iconify)，他提供了超过 100,000 个图标的 100 多个图标集，这是一个非常疯狂的实验项目，我想创建一个icon的组件，他基于 iconify 可以基于我们所安装的图标集，按需加载图标。

---

## 现有的解决方案

其实社区早已经有一个名为 [css.gg](https://github.com/astrit/css.gg) 的纯css图标的解决方案。它完全通过伪元素（`::before`，`::after`）来构建图标。因为如果需要使用这个解决方案，那么就需要我们对于 CSS 的工作原理有一个十分深刻的理解，但是同时很难创造出一个更为复杂的图标(因为它只有3个元素可以供我们使用)。我的脑海里产生了一个非常酷炫的想法，我觉得可以应用在所有的图标上而并非只局限于在特定的集合中进行有限的选择。

## 我的想法

用 CSS 中的 [Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) 中的文件模式作为背景图，并且产生一段 CSS:

```css
.my-icon {
  background: url(data:...) no-repeat center;
  background-color: transparent;
  height: 1.2em;
  width: 1.2em;
}
```

有了这种方案，我们就可以使用一个单独的类在 CSS 中内嵌任何图像。

## 实现

我们可以使用 [iconify](https://github.com/iconify/iconify) 的utils包来实现我们的想法，初步设计为

```typescript
import { iconToSVG, getIconData } from '@iconify/utils'
// (假的，意思到了就可以了)
const svg = iconToSVG(getIconData('mdi', 'alarm'))
```

当我们得到 SVG 字符串后，可以将其转换为 DataURLs：

```typescript
const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
```

这样的话，基本效果就实现了。

## 后续

还需要继续设计，不然肯定不能用。
