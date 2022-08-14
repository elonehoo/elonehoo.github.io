import{_ as n,c as s,o as a,a as t}from"./app.a4c755db.js";const p='{"title":"Spring Boot - 构建 RESTful Web 服务","description":"","frontmatter":{"title":"Spring Boot - 构建 RESTful Web 服务","date":"2022-02-26T00:00:00.000Z","author":"Elone Hoo","twitter":"@huchengye"},"headers":[{"level":2,"title":"绝大部分","slug":"绝大部分"},{"level":2,"title":"使用 restful-return","slug":"使用-restful-return"},{"level":2,"title":"结论","slug":"结论"}],"relativePath":"posts/building-restful-web.md","lastUpdated":1660487519376}',o={},c=[t('<p>浏览了大部分的教程，发现并没有任何一篇教程提到 <code>ResponseEntity</code> 作为返回值，都是使用了自己创建一个 <code>Result</code> 类，这样也可以算是成为了 Restful 的返回值了吗？</p><p>我发出了一个疑惑？那这样的还算是一个正常的返回值了吗？</p><hr><h2 id="绝大部分" tabindex="-1">绝大部分 <a class="header-anchor" href="#绝大部分" aria-hidden="true">#</a></h2><p>我随意的复制了一个点赞最高的<a href="https://blog.csdn.net/aiyaya_/article/details/78209992" target="_blank" rel="noopener noreferrer">博客</a></p><p>创建了一个 <code>Result</code> 和 <code>ResultCode</code> 类</p><p>代码如下</p><div class="language-java"><pre><code><span class="token keyword">import</span> <span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Data</span><span class="token punctuation">;</span>\n<span class="token keyword">import</span> <span class="token namespace">java<span class="token punctuation">.</span>io<span class="token punctuation">.</span></span><span class="token class-name">Serializable</span><span class="token punctuation">;</span>\n\n<span class="token annotation punctuation">@Data</span>\n<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Result</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>\n\n\t<span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">long</span> serialVersionUID <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">3948389268046368059L</span><span class="token punctuation">;</span>\n\n\t<span class="token keyword">private</span> <span class="token class-name">Integer</span> code<span class="token punctuation">;</span>\n\n\t<span class="token keyword">private</span> <span class="token class-name">String</span> msg<span class="token punctuation">;</span>\n\n\t<span class="token keyword">private</span> <span class="token class-name">Object</span> data<span class="token punctuation">;</span>\n\n\t<span class="token keyword">public</span> <span class="token class-name">Result</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n\n\t<span class="token keyword">public</span> <span class="token class-name">Result</span><span class="token punctuation">(</span><span class="token class-name">Integer</span> code<span class="token punctuation">,</span> <span class="token class-name">String</span> msg<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">this</span><span class="token punctuation">.</span>code <span class="token operator">=</span> code<span class="token punctuation">;</span>\n\t\t<span class="token keyword">this</span><span class="token punctuation">.</span>msg <span class="token operator">=</span> msg<span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Result</span> <span class="token function">success</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token class-name">Result</span> result <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Result</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t\tresult<span class="token punctuation">.</span><span class="token function">setResultCode</span><span class="token punctuation">(</span><span class="token class-name">ResultCode</span><span class="token punctuation">.</span>SUCCESS<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t\t<span class="token keyword">return</span> result<span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Result</span> <span class="token function">success</span><span class="token punctuation">(</span><span class="token class-name">Object</span> data<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token class-name">Result</span> result <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Result</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t\tresult<span class="token punctuation">.</span><span class="token function">setResultCode</span><span class="token punctuation">(</span><span class="token class-name">ResultCode</span><span class="token punctuation">.</span>SUCCESS<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t\tresult<span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t\t<span class="token keyword">return</span> result<span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Result</span> <span class="token function">failure</span><span class="token punctuation">(</span><span class="token class-name">ResultCode</span> resultCode<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token class-name">Result</span> result <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Result</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t\tresult<span class="token punctuation">.</span><span class="token function">setResultCode</span><span class="token punctuation">(</span>resultCode<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t\t<span class="token keyword">return</span> result<span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Result</span> <span class="token function">failure</span><span class="token punctuation">(</span><span class="token class-name">ResultCode</span> resultCode<span class="token punctuation">,</span> <span class="token class-name">Object</span> data<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token class-name">Result</span> result <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Result</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t\tresult<span class="token punctuation">.</span><span class="token function">setResultCode</span><span class="token punctuation">(</span>resultCode<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t\tresult<span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t\t<span class="token keyword">return</span> result<span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setResultCode</span><span class="token punctuation">(</span><span class="token class-name">ResultCode</span> code<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">this</span><span class="token punctuation">.</span>code <span class="token operator">=</span> code<span class="token punctuation">.</span><span class="token function">code</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t\t<span class="token keyword">this</span><span class="token punctuation">.</span>msg <span class="token operator">=</span> code<span class="token punctuation">.</span><span class="token function">message</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div><div class="language-java"><pre><code><span class="token keyword">public</span> <span class="token keyword">enum</span> <span class="token class-name">ResultCode</span> <span class="token punctuation">{</span>\n\n\t<span class="token comment">/* 成功状态码 */</span>\n\t<span class="token function">SUCCESS</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">&quot;成功&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\n\t<span class="token comment">/* 参数错误：10001-19999 */</span>\n\t<span class="token function">PARAM_IS_INVALID</span><span class="token punctuation">(</span><span class="token number">10001</span><span class="token punctuation">,</span> <span class="token string">&quot;参数无效&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\t<span class="token function">PARAM_IS_BLANK</span><span class="token punctuation">(</span><span class="token number">10002</span><span class="token punctuation">,</span> <span class="token string">&quot;参数为空&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\t<span class="token function">PARAM_TYPE_BIND_ERROR</span><span class="token punctuation">(</span><span class="token number">10003</span><span class="token punctuation">,</span> <span class="token string">&quot;参数类型错误&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\t<span class="token function">PARAM_NOT_COMPLETE</span><span class="token punctuation">(</span><span class="token number">10004</span><span class="token punctuation">,</span> <span class="token string">&quot;参数缺失&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\n\t<span class="token comment">/* 用户错误：20001-29999*/</span>\n\t<span class="token function">USER_NOT_LOGGED_IN</span><span class="token punctuation">(</span><span class="token number">20001</span><span class="token punctuation">,</span> <span class="token string">&quot;用户未登录&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\t<span class="token function">USER_LOGIN_ERROR</span><span class="token punctuation">(</span><span class="token number">20002</span><span class="token punctuation">,</span> <span class="token string">&quot;账号不存在或密码错误&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\t<span class="token function">USER_ACCOUNT_FORBIDDEN</span><span class="token punctuation">(</span><span class="token number">20003</span><span class="token punctuation">,</span> <span class="token string">&quot;账号已被禁用&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\t<span class="token function">USER_NOT_EXIST</span><span class="token punctuation">(</span><span class="token number">20004</span><span class="token punctuation">,</span> <span class="token string">&quot;用户不存在&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\t<span class="token function">USER_HAS_EXISTED</span><span class="token punctuation">(</span><span class="token number">20005</span><span class="token punctuation">,</span> <span class="token string">&quot;用户已存在&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\n\t<span class="token comment">/* 业务错误：30001-39999 */</span>\n\t<span class="token function">SPECIFIED_QUESTIONED_USER_NOT_EXIST</span><span class="token punctuation">(</span><span class="token number">30001</span><span class="token punctuation">,</span> <span class="token string">&quot;某业务出现问题&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\n\t<span class="token comment">/* 系统错误：40001-49999 */</span>\n\t<span class="token function">SYSTEM_INNER_ERROR</span><span class="token punctuation">(</span><span class="token number">40001</span><span class="token punctuation">,</span> <span class="token string">&quot;系统繁忙，请稍后重试&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\n\t<span class="token comment">/* 数据错误：50001-599999 */</span>\n\t<span class="token function">RESULE_DATA_NONE</span><span class="token punctuation">(</span><span class="token number">50001</span><span class="token punctuation">,</span> <span class="token string">&quot;数据未找到&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\t<span class="token function">DATA_IS_WRONG</span><span class="token punctuation">(</span><span class="token number">50002</span><span class="token punctuation">,</span> <span class="token string">&quot;数据有误&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\t<span class="token function">DATA_ALREADY_EXISTED</span><span class="token punctuation">(</span><span class="token number">50003</span><span class="token punctuation">,</span> <span class="token string">&quot;数据已存在&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\n\t<span class="token comment">/* 接口错误：60001-69999 */</span>\n\t<span class="token function">INTERFACE_INNER_INVOKE_ERROR</span><span class="token punctuation">(</span><span class="token number">60001</span><span class="token punctuation">,</span> <span class="token string">&quot;内部系统接口调用异常&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\t<span class="token function">INTERFACE_OUTTER_INVOKE_ERROR</span><span class="token punctuation">(</span><span class="token number">60002</span><span class="token punctuation">,</span> <span class="token string">&quot;外部系统接口调用异常&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\t<span class="token function">INTERFACE_FORBID_VISIT</span><span class="token punctuation">(</span><span class="token number">60003</span><span class="token punctuation">,</span> <span class="token string">&quot;该接口禁止访问&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\t<span class="token function">INTERFACE_ADDRESS_INVALID</span><span class="token punctuation">(</span><span class="token number">60004</span><span class="token punctuation">,</span> <span class="token string">&quot;接口地址无效&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\t<span class="token function">INTERFACE_REQUEST_TIMEOUT</span><span class="token punctuation">(</span><span class="token number">60005</span><span class="token punctuation">,</span> <span class="token string">&quot;接口请求超时&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\t<span class="token function">INTERFACE_EXCEED_LOAD</span><span class="token punctuation">(</span><span class="token number">60006</span><span class="token punctuation">,</span> <span class="token string">&quot;接口负载过高&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\n\t<span class="token comment">/* 权限错误：70001-79999 */</span>\n\t<span class="token function">PERMISSION_NO_ACCESS</span><span class="token punctuation">(</span><span class="token number">70001</span><span class="token punctuation">,</span> <span class="token string">&quot;无访问权限&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n\t<span class="token keyword">private</span> <span class="token class-name">Integer</span> code<span class="token punctuation">;</span>\n\n\t<span class="token keyword">private</span> <span class="token class-name">String</span> message<span class="token punctuation">;</span>\n\n\t<span class="token class-name">ResultCode</span><span class="token punctuation">(</span><span class="token class-name">Integer</span> code<span class="token punctuation">,</span> <span class="token class-name">String</span> message<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">this</span><span class="token punctuation">.</span>code <span class="token operator">=</span> code<span class="token punctuation">;</span>\n\t\t<span class="token keyword">this</span><span class="token punctuation">.</span>message <span class="token operator">=</span> message<span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">public</span> <span class="token class-name">Integer</span> <span class="token function">code</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>code<span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">message</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>message<span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token function">getMessage</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">ResultCode</span> item <span class="token operator">:</span> <span class="token class-name">ResultCode</span><span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t\t<span class="token keyword">if</span> <span class="token punctuation">(</span>item<span class="token punctuation">.</span><span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t\t\t<span class="token keyword">return</span> item<span class="token punctuation">.</span>message<span class="token punctuation">;</span>\n\t\t\t<span class="token punctuation">}</span>\n\t\t<span class="token punctuation">}</span>\n\t\t<span class="token keyword">return</span> name<span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\t<span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Integer</span> <span class="token function">getCode</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">ResultCode</span> item <span class="token operator">:</span> <span class="token class-name">ResultCode</span><span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t\t<span class="token keyword">if</span> <span class="token punctuation">(</span>item<span class="token punctuation">.</span><span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t\t\t<span class="token keyword">return</span> item<span class="token punctuation">.</span>code<span class="token punctuation">;</span>\n\t\t\t<span class="token punctuation">}</span>\n\t\t<span class="token punctuation">}</span>\n\t\t<span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token annotation punctuation">@Override</span>\n\t<span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n</code></pre></div><p>并且编写了一个简单的demo</p><div class="language-java"><pre><code><span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/demo2&quot;</span><span class="token punctuation">)</span>\n<span class="token keyword">public</span> <span class="token class-name">Result</span> <span class="token function">demo2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n  <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> list <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n\t\tlist<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">valueOf</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\t<span class="token class-name">Result</span> result <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Result</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\tresult<span class="token punctuation">.</span><span class="token function">setResultCode</span><span class="token punctuation">(</span><span class="token class-name">ResultCode</span><span class="token punctuation">.</span>DATA_IS_WRONG<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\tresult<span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span>list<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">return</span> result<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>我们来看一下浏览器的结果</p><p><img src="/assets/01.59916890.png" alt="01.png"></p><h2 id="使用-restful-return" tabindex="-1">使用 <code>restful-return</code> <a class="header-anchor" href="#使用-restful-return" aria-hidden="true">#</a></h2><div class="language-java"><pre><code><span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/demo&quot;</span><span class="token punctuation">)</span>\n<span class="token keyword">public</span> <span class="token class-name">Result</span> <span class="token function">demo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n\t<span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> list <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n\t\tlist<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">valueOf</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\t<span class="token keyword">return</span> <span class="token class-name">Result</span><span class="token punctuation">.</span><span class="token function">internalServerError</span><span class="token punctuation">(</span>list<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>结果如下</p><p><img src="/assets/02.0b222842.png" alt="02.png"></p><h2 id="结论" tabindex="-1">结论 <a class="header-anchor" href="#结论" aria-hidden="true">#</a></h2><p>高下立判。</p>',19)];var e=n(o,[["render",function(n,t,p,o,e,u){return a(),s("div",null,c)}]]);export{p as __pageData,e as default};
