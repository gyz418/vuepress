## js优化

### 图片

雪碧图

base64

webp svg

### cdn

### gzip  

webpack4有 gzip压缩

### 代码压缩

## 问题

1. ETags

2. 延迟加载、预加载、懒加载

3. window.performance

   ```js
   const timingInfo = window.performance.timing;
   console.log({
   "TCP连接耗时":timingInfo.connectEnd - timingInfo.connectStart,
   "DNS查询耗时":timingInfo.domainLookupEnd - timingInfo.domainLookupStart,
   "获得⾸首字节耗费时间，也叫TTFB":timingInfo.responseStart -
   timingInfo.navigationStart,
   "domReady时间":timingInfo.domContentLoadedEventStart -
   timingInfo.navigationStart,
   "DOM资源下载":timingInfo.responseEnd - timingInfo.responseStart
   })
   ```

   ![image-20200731155043970](./.vuepress/public/md-img/4.png)

   FP:首次渲染时间

   FCP：白屏

   FMP：有意义的绘制，主要内容出现时

   TTI：用户可交互时间，优化重点

4. chrome的performance

   

5. lighthouse

6. dns-prefetch(淘宝例子)

7. IP TCP HTTP

8. 缓存控制

9. 浏览器缓存

## 其他

发现百度网盘慕课网有一些优化的视频。

书

Web 前端性能优化 陈铎鑫 2020 这书找不到

高效前端：Web高效编程与优化实践  2018

大型网站性能检测、分析与优化  2016-6   

web性能权威指南 2013

