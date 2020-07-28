#deno 
###v1.0.1 --2020-5-22

> 旧的是node

1. deno不需要package.json,直接引用具体包 `import { serve } from "https://deno.land/std@0.50.0/http/server.ts";`
2. deno只支持es6的import模块，不支持nodejs的commonJS
3. deno内置ts
4. deno注重安全，使用沙盒执行代码

[Deno 正式发布，彻底弄明白和 node 的区别](https://segmentfault.com/a/1190000022672883)

[了不起的 Deno 入门教程, Deno初体验，失败](https://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651558773&idx=1&sn=280ec5c734e67d0f25882808308fb59e&chksm=802544b4b752cda2b04b49dc5146627335b2592c3c1080c288d79da066e08193e15e647c0a52&scene=126&sessionid=1590112418&key=1f9c0c74438521b6ecb9432f3935b1cfb1090a4df213e11d9d96c6231fbfbf64f82c30e0ffc4bff363b628d140a8a8d1139edb3f6f0f73176942abc31b471a23df9bc90bc143ccf29842bfe2319697ae&ascene=1&uin=MzgxOTk1Nzk1&devicetype=Windows+10&version=62080079&lang=zh_CN&exportkey=AyMYGTYqGDkdy2wHdN5kDWc%3D&pass_ticket=KscVkqfCfQwNSIAtKwM%2Bwjr2kKHeaYkf1n%2F%2FjemmG1U%2FlYpdXa7wnSmiskmqhxtk)

[powerShell v7.0.1](https://github.com/PowerShell/PowerShell/releases)

使用powerShell 安装deno 
> iwr https://deno.land/x/install/install.ps1 -useb | iex

Deno was installed successfully to C:\Users\123\.deno\bin\deno.exe

###暂时只能在powerShell安装和使用deno

```js
console.log(123);  // 运行失败 deno run xx.js   invalid dnsname
import { serve } from "https://deno.land/std@v0.50.0/http/server.ts";

const PORT = 8080;
const s = serve({ port: PORT });

console.log(` Listening on <http://localhost>:${PORT}/`);

for await (const req of s) {
  req.respond({ body: "Hello Semlinker\\n" });
}

```

