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

### 快捷键

```js
location //  {'href':'xxx'}
copy(location)  // 复制变量值
ctrl+ [  ] 切换面板
ctrl+shift+p 打开面板等功能
ctrp+p 打开文件
控制台可直接用 await 
看源码时，可通过添加条件断点来console.log(xxx), 随时可以删除掉。线上代码也可以，前提是没压缩
let href = location.href;
      console.log({href});  // {href:'xxx'}  快捷键打起来不方便

```

### Elements

ctrl+c 可任意复制 Elements中的元素

 alt+ 点击： 全展开代码

$0 复制当前选择的元素

 sources  ctrl+p 可打开任意源文件


network: 过滤器 larger-than:100k  mini

### 代码段 sources->Snippets

ctrl+shift+p   snip 快速打开代码段

ctrl+p  ! 快速执行代码段

other

自定义转换器  https://juejin.im/book/6844733783166418958/section/6844733783212589063

