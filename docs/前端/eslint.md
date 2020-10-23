### eslint

注重代码质量：未使用变量等

```
WebStorm eslint插件报错解决 - TypeError: this.CliEngine is not a constructor
将eslint更新版本后，出现TypeError: this.CliEngine is not a constructor的错误。
解决办法：

1.编辑 X:\WebStorm\plugins\JavaScriptLanguage\languageService\eslint\bin\eslint-plugin.js

2.找到以下片段
if (this.initError == null) {
    this.linter = require(this.basicPath + "lib/cli.js");
    this.options = require(this.basicPath + "lib/options");
    this.CliEngine = require(this.basicPath + "lib/cli-engine").CLIEngine;
}
// 最后一行加上  .CLIEngine
// https://www.cnblogs.com/gugia/p/11855131.html
```

### 校验vue中的js

eslint-plugin-vue

package.json

```json
"scripts":{
	"lint": "eslint --ext js,vue --fix src/",  
}
// --fix 会自动修动某些错误 如 let会转成 const 但  const a = 1; 未使用的变量解决不了
```

.eslintrc.js

```
module.exports={
	extends:[
	'plugin:vue/essential',
	'plugin:prettier/recommended'  // 格式化
	],
	rules:{
	'prettier/prettier': ['error',{"endOfLine":"auto"}],  // lf/crlf问题
	"no-unused-vars": [2, { 
      // 允许声明未使用变量
      "vars": "local",
      // 参数不检查
      "args": "none" 
    }],
	}
}
```

[文档](https://vue-loader.vuejs.org/zh/guide/linting.html#eslint)

###  .prettierc

格式化代码

"printWidth": 200 控制一行长度

### 注释

```
const a = 1;  // eslint-disable-line
如上，可通过添加指定注释 //eslint-disable-line  可取消该行代码的eslint检测
其他技巧详见： https://cn.eslint.org/docs/user-guide/configuring
```

