## babel7

babel7 引入@,比如 babel-cli 变成了 @babel/cli

### webpack+babel

 .babelrc

```js
{
  "presets": [
    [
      "@babel/env",   // 只指定这个，箭头函数会转成 fuction(){}
      {
        "useBuiltIns": "usage",  // 按需加载后，会根据设置的浏览器来判断要不要转换箭头函数
        "corejs": {
          "version": 3   // 按需加载必须指定 core-js, 转换promise
        },
        "targets": {
          "edge": "17",
          "firefox": "60",  // 版本要好好填， 60和70的差异是很大的
          "chrome": "67",  // 设为30时，箭头函数会转为function()  设为67等高版本chrome，浏览器本身已支持函数函数，不需要转， 推荐在webapck mode:development下看效果，生产环境的箭头函数要调用才能看到效果
          "safari": "11.1",
            "ie":11   // ie11 打包文件就100k了
        }
      }
    ]
  ],
  "plugins": [
  //  "@babel/plugin-transform-runtime"   // 打包会变小一点，但import功能失效
  ]    
}
```

> 以上配置，几乎所有es6都可以转换并兼容ie11,但ie11 proxy还是解决不了

也可在webapck中直接添加babel配置，这种配置不明显

```js
// webpack.build.config.js
{test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules/,
  options: {
    presets:["@babel/env"]  
  // ... babel配置
  }
}  
        
```

### package.json

```json
"devDependencies": {
    "@babel/core": "^7.10.5",    
    "@babel/preset-env": "^7.10.4",   // 简写 @babel/env 转换箭头函数，依赖 @babel/core 
    "babel-loader": "^8.1.0",         
    "core-js": "^3.6.5",         // 转换所有es6
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.12"
  }
```

### 其他

```json
'@babel/plugin-syntax-dynamic-import',   // 动态import 【发现不需要】
'@babel/plugin-proposal-optional-chaining',  // 可选链   console.log(obj?.abc?.def) 【发现不需要】
"@babel/plugin-transform-runtime"  // 打包会变小一点，但import功能失效,暂时解决不了  
"babel-plugin-proxy": "^1.1.0",   // ie11 proxy 还是解决不了
"@babel/polyfill"："xx" // 为所有API增加兼容方法   太多了 babel7.4拆成两个，详见官网
//plugin-proposal-x 表示该插件是stageX（位于草案中的插件） 
```

## 笔记在对应项目中