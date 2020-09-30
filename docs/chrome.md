## chrome

## chrome插件

1. ndm插件(Neat Download Manager)+网盘助手插件+百度网盘网页版 下载

2. vimium插件  浏览器快捷键

   map w scrollUp
   map s scrollDown
   map a scrollLeft
   map d scrollRight
   map h previousTab
   map j nextTab
   map S scrollPageDown
   map W scrollPageUp

3. ghelper插件 可翻墙

4. Tampermonkey

5. 店查查

## 调试技巧

### 断点

有多个断点时，f8是跳断点

f10是跳函数，一行一行执行

f11是查看函数详情

[JS调试参考](https://developers.google.cn/web/tools/chrome-devtools/javascript/reference)

### 快捷键

```js
location //  {'href':'xxx'}
copy(location)  // 复制变量值
ctrl+ [  ] 切换面板
ctrl+shift+p 打开面板等功能
ctrp+p 打开文件
控制台可直接用 await 

```

### Elements

```
ctrl+c 可任意复制 Elements中的元素
alt+ 点击： 全展开代码
$0 复制当前选择的元素
$_ 最近的值
$('img') === document.querySelector('img')
$$('img') === document.querySelectorAll('img')
sources  ctrl+p 可打开任意源文件
按住h可以隐藏元素，再按h就显示，截图隐藏敏感信息用。
元素可拖拽,按 ctrl+ 上下箭头可移动元素。。。 ctrl+c ctrl+v ctrl+z 撤销
样式中有个阴影编辑器，手机端rem不合适，还有各种编辑器，颜色，动画等
可快速插入颜色，背景色，阴影，字体阴影等
ctrl+shift+p 可打开 quick source 看源码
```

### console

```js
看源码时，可通过添加条件断点来console.log(xxx), 随时可以删除掉。线上代码也可以，前提是没压缩
let href = location.href;
      console.log({href});  // {href:'xxx'}  快捷键打起来不方便
      console.dir($("li"))  // <li class="item">展开更多代码</li>
	  console.log('%c 123','color:#f00')
眼睛是实时 javascript表达式，有啥用？
任意面板打开console  按 esc 显示 再按隐藏
ctrl+L 清屏
filter:  -system 隐藏system相关输出
```

### network

过滤器 larger-than:100k  mini  app.js

按 ctrl 可同时选择js /css 等

waterfall 展示请求的先后顺序，在http1.1上，Chrome每个主机最多允许六个同时TCP连接。

绿色表示从服务器接收第一个字节的时间。如果时间长，则使用CDN或优化数据库等

蓝色表示请求需要很长时间才能下载，如果时间长，用CDN或少请求

### 代码段 sources->Snippets

ctrl+shift+p   snip 快速打开代码段

ctrl+p  ! 快速执行代码段

### other

自定义转换器  https://juejin.im/book/6844733783166418958/section/6844733783212589063

sensors 传感器 模拟经纬度 ctrl+shift+p 打开

Network conditions 模拟断网，还可以选择User agent

Coverage 可查看线上代码的使用率，不太实用。

workspace 把代码拉到chrome去编辑调试，可实时更新代码

[掘金小册](https://juejin.im/book/6844733783166418958/section/6844733783187390477)

[chrome devTools](https://developers.google.cn/web/tools/chrome-devtools)

### 问题

ctrl+shift+p  Animations 检查动画  不会。。  [教程](https://developers.google.cn/web/tools/chrome-devtools/inspect-styles/animations)

[DOM断点](https://developers.google.cn/web/tools/chrome-devtools/dom#breakpoints) 不会  [DOM断点监听](https://juejin.im/book/6844733783166418958/section/6844733783216766989)