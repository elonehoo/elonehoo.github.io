---
title: Java 的微服务能像 Go 一样快吗？
date: 2022-02-24
author: Elone Hoo
twitter: '@huchengye'
---

Peter Nagy 在 2020 年 8 月的 Oracle Groundbreakers Tour 2020 LATAM 上发表了一篇题为“Go Java, Go!”的论文。看完后我问自己一个问题“Java 微服务能像 Go 一样快吗？” 我们创建了一些微服务并进行了一些基准测试，并在那次活动之后展示了我们的结果。但是还有更多需要探索，所以我们决定将我们的演示文稿变成这篇文章。

---

## 前言

我想试验一下，看看 Java 微服务是否可以像 Go 微服务一样快。行业普遍认为 Java 是“老”、“慢”和“无聊”；Go 是“快”、“新”和“酷”的。但我想知道这些特征是否得到实际性能数据的保证或支持。

我想要一个公平的测试，所以我创建了一个非常简单的微服务，没有外部依赖项（例如数据库），并且代码路径非常短（只是操作字符串）。我确实包含了指标和日志记录，因为这些似乎总是包含在任何真正的微服务中。我使用了小型轻量级框架（Java 的 Helidon 和 Go 的 Go-Kit），我还试验了 Java 的纯 JAX-RS。我尝试了不同版本的 Java 和不同的 JVM。我对堆大小和垃圾收集器进行了一些基本调整。我在测试运行之前预热了微服务。

## Java 的一点历史

Java 由 Sun Microsystems 开发，后来被 Oracle 收购。它的 1.0 版本是在 1996 年，最新版本是 2021 年的 Java 17。主要设计目标是 Java 虚拟机和字节码的可移植性，以及带有垃圾收集的内存管理。它仍然是最流行的语言之一（根据 [StackOverflow](https://insights.stackoverflow.com/survey/2021#most-popular-technologies%E2%80%8B) 和 [TIOBE](https://www.tiobe.com/tiobe-index/) 等来源）,并且是[开源](https://openjdk.java.net/)开发的。

接下来，让我们来聊一聊“Java 的问题”。它以缓慢而闻名，这可能不再是合理，而是更具历史意义。它确实有一些性能敏感区域，包括存储对象数据的堆；管理堆的垃圾收集器；以及即时 (JIT) 编译器。

![01.png](/public/java-vs-go/01.png)

多年来，Java 已经有许多不同的垃圾收集算法，包括串行、并行、并发标记/清除、G1 和新的 ZGC 垃圾收集器。现代垃圾收集器也在最大限度地减少垃圾收集 “stop the world” 暂停的持续时间。

Oracle 实验室开发了一种名为 [GraalVM](https://www.graalvm.org/) 的新 Java 虚拟机，它是用 Java 编写的，具有新的编译器和一些令人兴奋的新特性，例如能够将 Java 字节码转换为无需 Java VM 即可运行的本机映像。

## Go 的一点历史

Go 由 Google 的 Robert Griesemer、Rob Pike 和 Ken Thomson 创建。 （他们之间对 UNIX、B、C、Plan9、UNIX 窗口系统等做出了重大贡献。）也是[开源](https://go.dev/)的，在 2012 年发布了 1.0 版，并在 2020 年发布了 1.15 版。它在两个方面都在快速增长 采用以及语言和工具生态系统本身。

Go 受到 C、Python、Javascript 和 C++ 的影响。 它打算成为高性能网络和多处理的最佳语言。

当我在记录这个blog的时候，StackOverflow 有 27,872 个问题标记为“Go”，而 Java 有 1,702,730 个问题。

Go 是一种静态类型的编译语言。 它的语法类似于 C。 它具有内存安全、垃圾收集、结构类型和 CSP 风格的并发（通信顺序进程）。 它具有称为 goroutines 的轻量级进程（这些不是 OS 线程），用于在它们之间进行通信的通道（类型化，FIFO）。 该语言不提供竞争条件保护。

Go 是许多 CNCF 项目的首选语言，例如 Kubernetes、Istio、Prometheus 和 Grafana 都（大部分）用 Go 编写。

它旨在具有快速构建时间和快速执行。 它是固执己见的 —— 我们不要再争论两个或四个空格了！

Go 有什么好处（与 Java 相比）—— 这是根据我的经验得出的个人看法：

- 更容易实现功能模式，如组合、纯函数、不可变状态。
- 样板代码要少得多（但仍然还是太多）。
- 它还处于生命周期的早期，因此它没有向后兼容的沉重负担 —— 但是他们仍然可以通过破坏来改进它。
- 它编译成一个本地静态链接二进制文件 —— 没有虚拟机层 —— 二进制文件包含运行程
序所需的一切，这对于“从头开始”容器来说非常有用。
- 它体积小，启动快，执行快。
- 没有 OOP、继承、泛型、断言、指针算术。
- 括号少，例如 `if x > 3 { whatever }`
- 强制执行没有循环依赖，没有未使用的变量或导入，没有隐式类型转换。

那么，Go 的 "问题" 是什么？
同样，这是我个人的看法，与 Java 相比：

- 工具生态系统不成熟，尤其是依赖管理——有几种选择，但没有一个是完美的，尤其是对于非开源开发；现在有一个明确的“winner”（Go 模块），但并不是每个人都采用它，所以仍然存在兼容性挑战。
- 使用新的(更新)的依赖项构建代码非常慢（就像 Maven 著名的“下载 Internet”问题）。
- 导入将代码绑定到存储库，这使得移动代码成为一场噩梦。
- IDE 适用于编程、文档查找、自动完成等；但是调试、分析等仍然具有挑战性。
- 指针！ 我们以为我们在上个千年把它们留了下来！ 但至少没有指针算法。
- 没有 Java 风格的 try/catch 异常（你最终也会因为写`if err != nil`觉得太频繁了），没有函数风格的原语，如列表、映射函数等。
- 通常最终会实现一些基本算法，因为它尚不可用。最近，我编写了通过 sloe 进行比较和转换来遍历两个字符串（列表）槽的代码。在函数式语言中，我可以使用内置函数 `map` 来做到这一点。
- 没有动态链接！（可是“谁在乎呢？”）如果我们想使用带有“infect”静态链接代码的 GPL 等许可证的代码，这可能是一个真正的问题。
- 用于调整执行或垃圾收集、配置文件执行或优化算法的旋钮并不多 —— Java 有数百个垃圾收集调整选项，Go 有一个 —— 打开或关闭。

## 开始第一轮测试

在第一轮中，我们在一台“小型”机器上进行了测试，在本例中是一台运行 macOS 的 2.5GHz 双核 Intel Core i7 笔记本电脑，配备 16GB RAM。我们运行了 100 个线程，每个线程有 10,000 个循环，加速时间为 10 秒。Java 应用程序在 JDK 11 和 Helidon 2.0.1 上运行。使用 Go 1.13.3 编译的 Go 应用程序。

结果如下：

| Application   | Logging | Warmup | Avg. Response Time (ms) | Transactions / sec | Memory (RSS) (Start/End)                                     |
| :------------ | :------ | :----- | :---------------------- | :----------------- | :----------------------------------------------------------- | 
| Golang        | Yes     | No     | 5.79                    | 15330.60           | 5160KB / 15188KB                                             |      |
| Golang        | No      | No     | 4.18                    | 20364.11           | 5164KB / 15144KB                                             |      |
| Golang        | No      | Yes    | 3.97                    | 21333.33           | 10120KB / 15216KB                                            |      |
| Java(Helidon) | Yes     | No     | 12.13                   | 8168.15            | 296376KB / 427064KB; committed = 169629KB +15976KB (NMT); reserved=1445329KB +5148KB (NMT) |      |
| Java(Helidon) | No      | No     | 5.13                    | 17332.82           | 282228KB / 430264KB; reserved=1444264KB +6280KB; committed=166632KB +15884KB |      |
| Java(Helidon) | No      | Yes    | 4.84                    | 18273.18           | 401228KB / 444556KB                                          |      |

我们宣布 Go 成为了第一轮的获胜者。

这些是我对这些结果的观察：

- 日志记录似乎是一个主要的性能损失，尤其是 java.util.logging。正因为如此，我们在有和没有日志的情况下运行了测试。我们还注意到日志记录是影响 Go 应用程序性能的一个重要因素。
- Java 版本的内存占用要大得多，即使对于如此小而简单的应用程序也是如此。
- 预热对 JVM 产生了很大的影响 —— 我们知道 JVM 在运行时会进行优化，所以这是有道理的。
- 我在这个测试中比较了不同的执行模型——Go 应用程序被编译成本机可执行的二进制文件，而 Java 应用程序被编译成字节码，然后在虚拟机上运行。我决定引入 GraalVM 原生镜像，使 Java 应用程序的执行环境更接近 Go 应用程序的环境。

### GraalVM 原生镜像

GraalVM 具有本机映像功能，可让您获取 Java 应用程序并将其本质上编译为本机可执行代码。来自 GraalVM 网站：

> This executable includes the application classes, classes from its dependencies, runtime library classes, and statically linked native code from JDK. It does not run on the Java VM, but includes necessary components like memory management, thread scheduling, and so on from a different runtime system, called “Substrate VM”. Substrate VM is the name for the runtime components (like the deoptimizer, garbage collector, thread scheduling etc.).

这是添加了 GraalVM 原生镜像测试的第一轮结果（使用 GraalVM EE 20.1.1 - JDK 11 构建的原生镜像）：

| Application    | Logging | Warmup | Avg. Response Time (ms) | Transactions / sec | Memory (RSS) (Start/End)                                     |
| :------------- | :------ | :----- | :---------------------- | :----------------- | ------------------------------------------------------------ |
| Golang         | Yes     | No     | 5.79                    | 15330.60           | 5160KB / 15188KB                                             |
| Golang         | No      | No     | 4.18                    | 20364.11           | 5164KB / 15144KB                                             |
| Golang         | No      | Yes    | 3.97                    | 21333.33           | 10120KB / 15216KB                                            |
| Java(Helidon) | Yes     | No     | 12.13                   | 8168.15            | 296376KB / 427064KB; committed = 169629KB +15976KB (NMT); reserved=1445329KB +5148KB (NMT) |
| Java(Helidon) | No      | No     | 5.13                    | 17332.82           | 282228KB / 430264KB; reserved=1444264KB +6280KB; committed=166632KB +15884KB |
| Java(Helidon) | No      | Yes    | 4.84                    | 18273.18           | 401228KB / 444556KB                                          |
| Native Image   | Yes     | No     | 12.01                   | 7748.27            | 18256KB / 347204KB                                           |
| Native Image   | No      | No     | 5.59                    | 15753.24           | 169765KB / 347100KB                                          |
| Native Image   | No      | Yes    | 5.22                    | 17837.19           | 127436KB / 347132KB                                          |

在这种情况下，与在 JVM 上运行应用程序相比，使用 GraalVM 原生映像并没有看到吞吐量或响应时间有任何实质性改进，但是内存占用更小。

以下是一些测试的响应时间图表：

![02.png](/public/java-vs-go/02.png)
<div align="center">
<font style="color:#757575;font-size:14px;">第一轮的响应时间图</font>
</div>

请注意，在所有三个 Java 变化中，第一个请求的响应时间要长得多（在左轴上寻找那条蓝线）。在所有情况下，我们还看到了一些峰值，我们认为这是由垃圾收集或优化引起的。

## 第二轮

接下来我们决定在更大的机器上运行测试。在这一轮中，我们使用了一台具有 36 个内核（每个内核两个线程）、256GB RAM、运行 Oracle Linux 7.8 的机器。

与第一轮一样，我们使用了 100 个线程，每个线程 10,000 个循环，10 秒的加速时间和相同版本的 Go、Java、Helidon 和 GraalVM。

结果如下：

| Application    | Logging | **Warmup** | Avg. Response Time(ms) | Transactions/ sec | Memory (RSS) (Start/End) |
| :------------- | :------ | :--------- | :--------------------- | :---------------- | ------------------------ |
| Native Image   | Yes     | No         | 5.61                   | 14273.48          | 28256KB / 1508600KB      |
| Native Image   | No      | No         | 0.25                   | 82047.92          | 29368KB / 1506428KB      |
| Native Image   | No      | Yes        | 0.25                   | 82426.64          | 1293216KB / 1502724KB    |
| Golang         | Yes     | No         | 4.72                   | 18540.49          | 132334KB / 72433KB       |
| Golang         | No      | No         | 1.69                   | 37949.22          | 12864KB / 70716KB        |
| Golang         | No      | Yes        | 1.59                   | 39227.99          | 16764KB / 76996KB        |
| Java(Helidon) | Yes     | No         | 7.38                   | 11216.42          | 318545KB / 529848KB      |
| Java(Helidon) | No      | No         | 0.40                   | 74827.90          | 307672KB / 489568KB      |
| Java(Helidon) | No      | Yes        | 0.38                   | 76306.75          | 398156KB / 480460KB      |

我宣布 GraalVM 原生镜像在第二轮中获胜！

以下是这些测试的响应时间图：

![03.png](/public/java-vs-go/03.png)
<div align="center">
<font style="color:#757575;font-size:14px;">启用记录但没有预热的测试运行的响应时间</font>
</div>
![04.png](/public/java-vs-go/04.png)
<div align="center">
<font style="color:#757575;font-size:14px;">没有记录和预热的测试运行的响应时间</font>
</div>
![05.png](/public/java-vs-go/05.png)
<div align="center">
<font style="color:#757575;font-size:14px;">预热但没有记录的测试运行的响应时间</font>
</div>

对于第二轮的一些观察：

- Java 变体在这个测试中表现得更好，并且在不使用日志记录时明显优于 Go
- Java 似乎更能够使用硬件提供的多核和执行线程（与 Go 相比）——这在一定程度上是有道理的，因为 Go 旨在作为一种系统和网络编程语言，而且它是一种更年轻的语言，所以它是可以合理地假设 Java 有更多的时间来开发和调整优化
- 有趣的是，Java 是在多核处理器还不普及的时候设计的，而 Go 是在多核处理器普及的时候设计的。
- 特别是，Java 日志记录似乎已成功卸载到其他线程/内核，并且对性能的影响要小得多
- 这一轮的最佳表现来自 GraalVM 原生镜像，平均响应时间为 0.25 毫秒，每秒处理 82,426 个事务，而 Go 的最佳结果为 1.59 毫秒和 39,227 tps，但代价是内存增加了两个数量级用法！
- GraalVM 原生镜像变体比在 JVM 上运行的相同应用程序快 30-40%
- Java 变体的响应时间似乎更加一致，但峰值更多——我们推测这意味着 Go 正在执行更多、更小的垃圾收集

## 第三轮 在Kubernetes中

在第三轮中，我们决定在 Kubernetes 集群中运行应用程序——你可能会说，这是一个更自然的微服务运行时环境。

在这一轮中，我们使用了一个具有三个工作节点的 Kubernetes 1.16.8 集群，每个节点有两个内核（每个有两个执行线程）、14GB 的 RAM 和 Oracle Linux 7.8。在某些测试中，我们为每个变体运行了一个 pod，在其他测试中运行了 100 个。

应用程序访问是通过 Traefik 入口控制器，其中 JMeter 在 Kubernetes 集群外部运行以进行一些测试，而对于其他测试，我们使用 ClusterIP 并在集群中运行 JMeter。

与之前的测试一样，我们使用了 100 个线程，每个线程 10,000 个循环和 10 秒的加速时间。

以下是每个变体的容器尺寸：

- Go 11.6MB
- Java/Helidon 1.41GB
- Java/Helidon JLinked 150MB
- 本机图像 25.2MB

结果如下：

| Pods | Access    | Application          | Logging | Avg. Response Time (ms)                | Transactions / sec  |
| :--- | :-------- | :------------------- | :------ | :------------------------------------- | ------------------- |
| 1    | Traefik   | Golang               | No      | 5.07                                   | 14651.80            |
| 1    | Traefik   | Native Image         | No      | 5.05                                   | 15812.28            |
| 1    | Traefik   | Java (Helidon)       | No      | 7.05                                   | 11823.69            |
| 1    | Traefik   | Java Jlink (Helidon) | No      | 9.08                                   | 9271.02             |
| 100  | Traefik   | Golang               | No      | 5.06                                   | 15646.75            |
| 100  | Traefik   | Native Image         | No      | 5.17                                   | 15462.40            |
| 100  | Traefik   | Java (Helidon)       | No      | 11.42 without warmup/ 5.07 with warmup | 8015.96 / 15838.32  |
| 100  | Traefik   | Java Jlink (Helidon) | No      | 9.61 / 5.64                            | 9424.62 / 14732.31  |
| 1    | ClusterIP | Golang               | No      | 1.2                                    | 43712.02            |
| 1    | ClusterIP | Native Image         | No      | 2.12                                   | 30497.10            |
| 1    | ClusterIP | Java (Helidon)       | No      | 7.19 / 5.73                            | 12819.52 / 14878.95 |
| 1    | ClusterIP | Java Jlink (Helidon) | No      | 7.19 / 6.27                            | 12610.49 / 13817.68 |
| 100  | ClusterIP | Golang               | No      | 1.25                                   | 34170.51            |
| 100  | ClusterIP | Native Image         | No      | 1.32                                   | 33558.17            |
| 100  | ClusterIP | Java (Helidon)       | No      | 3.35 / 2.04                            | 14358.94 / 24410.48 |
| 100  | ClusterIP | Java Jlink (Helidon) | No      | 2.56 / 1.87                            | 18098.23 / 26520.97 |

以下是一些响应时间图表：

![06.png](/public/java-vs-go/06.png)
<div align="center">
<font style="color:#757575;font-size:14px;">Kubernetes 测试的响应时间
</font>
</div>

那么我们明白到了什么？

- Kubernetes 似乎并没有快速扩展
- Java 似乎比 Go 更擅长使用所有可用的内核/线程——我们在 Java 测试期间看到了更好的 CPU 利用率
- Java 性能在具有更多内核和内存的机器上更好，Go 在更小/不太强大的机器上性能更好
- Go 的性能总体上稍微一致 —— 可能是由于 Java 的垃圾收集
- 在“生产规模”的机器上，Java 很容易与 Go 一样快，或者更快
- 日志记录似乎是我们在 Go 和 Java 中遇到的主要瓶颈
- Java 的现代版本和 Helidon 等新框架在消除/减少 Java 一些众所周知且长期存在的问题（例如冗长、GC 性能、启动时间等）的痛苦方面取得了长足的进步。