[Service Worker：让你的 Web 应用牛逼起来](https://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651558205&idx=1&sn=dd11567dcd1ab503b9964f6e4606f8c6&chksm=802546fcb752cfeacd11459fed1d98ff60d4574f918a5c96e465637ebefa1c799f4b99295d53&scene=126&sessionid=1587518477&key=0f868f605069a9cd9971bc92db4534ab7f57cf88765060afba80c5252d5afc6b76e0a38d07371f1f02e3f187103afd86630c8ad7aa137112a490cc4946250a0cf0fe8cdaad001e70680275c00307d88a&ascene=1&uin=MzgxOTk1Nzk1&devicetype=Windows+10&version=62080079&lang=zh_CN&exportkey=AwRPA69XIs9ZC0y%2B0vcNdsk%3D&pass_ticket=7atVDA1UwG8U3YKRz%2FDYi41ICNe8jnPg5I8kcuW3Jd1wgodi9Dg7LNTe3BtlTLNn)

> google推出的第三方库workbox

Service Worker是浏览器缓存资源用的,基于h5的web worker，不会阻碍当前js线程的执行，sw最重要的工作原理就是
1. 后台线程：独立于当前网页线程；
2. 网络代理：在网页发起请求时代理，来缓存文件；

- 兼容性： android和ios低版本不支持
- 使用sw判断：Application的Cache Storage中查看缓存的具体内容
- sw 是基于 HTTPS 的,本地localhost可调试

[入门](https://www.cnblogs.com/gyz418/p/10836688.html) 

改天再研究 暂停于2020-4-22

