## nodejs

[node.js简单爬虫](https://segmentfault.com/a/1190000008530636)

nodejs 的 axios 请求任何链接都不会跨域，可以当爬虫用，可以获取到html的源代码

### modules.exports  exports
```js
/*
* 在 Node 中，每个模块内部都有一个自己的 module 对象
* 该 module 对象中，有一个成员叫：exports 也是一个对象
*
*   var module = {
*     exports:{
*       ...
*     }
*   }
*
*  return module.exports
*
*  exports=module.exports
*  导出多个成员  exports.xxx = xxx  exports.yyy = yyy
*  导出多个成员也可以  module.exports = {}  // 少用。。
*  导出单个成员   module.exports= xxx
*  也可以不管 exports
*  两者不要一起用
*  https://www.cnblogs.com/gyz418/p/9711427.html
*/
```
### require
```js
//========= demo1  导出1个或多个 exports
// a.js
exports.test1 = 'abc';
exports.fn = () => {
  console.log('fn', 123);
};
// b.js
const {test1,fn} = require('./a');  // 对象解构
//========= demo2  导出1个
// a2.js 
module.exports=()=>{ console.log(123);}
// module.exports = '666'  // console.log(require('./a2')) // 666 
// b2.js
require('./a2')()  // 直接出结果  函数要执行一下
// const abc = require('./a2')  // 可随便找个变量接收
// abc()
```

### 获取命令行参数

```js
// node a.js 123
const arguments = process.argv.splice(2);
console.log('参数',arguments);  // 123
```

### path.resolve()

路径拼接 将返回当前工作目录的绝对路径
```js
let url = path.resolve('../pcgo/' + arguments[0] + '/api/index.js');
console.log(url);   // 这样就可以了 
```
### process.cwd() 路径问题

```js
process.cwd() 方法会返回 Node.js 进程的当前工作目录,
即 node src/index.js 和 node index.js 不同层级的返回结果是不一样的，
可通过 npm link来避开
```

### chalk 控制台颜色

```js
const chalk = require('chalk');
console.log(chalk.red('this is red'));
```
### commander 命令行

```js
const program = require('commander');  // 命令行
const execa = require('execa');
// version
program.version('0.0.1');
console.log(program.version());

// option
program.option('-t, --test','this is a test','abc')
// 自定义命令   简写   全称         描述         默认值

program.command('mkdir <app-name>')     // node demo/0.js mkdir
  .description('mkdir test')
.action(function (name,cmd) {
  // 执行命令
  console.log('cmd',cmd);
  execa('mkdir',[name])  // 运行命令
});


if(program.test){
  // 如果输入某个命令，执行一些对应的操作
  console.log('hello');    // node 0.js -t  会输出hello
  console.log(program.test);  // abc
}

program.parse(process.argv)  // 解析输入的命令
```
### inquirer 交互命令行

```js
var inquirer = require('inquirer');
console.log('Hi, welcome to inquirer');
let question = [
 {
   type: 'confirm',
   name: 'sass',
   message: 'install sass?',
   default: true
 }
];
inquirer.prompt(question).then(res => {
 console.log('res', res);
}).catch(err => {
 console.log('err', err);
});
```

### process

```js
process.cwd(); // 当前文件的根路径 f:/xx/xx
```

### require传参数

```js
// b.js
require('./a')('abc','def');

// a.js
module.exports=(...args)=>{
  console.log(...args); // 接收传递过来的参数 abc def
  return test(...args)
};
function test (a,b) {
  console.log(a + b);
}
```

### execa
```js
const execa = require('execa');
// execa('git', ['init'],{cwd:'f:/mycli/demo'})   // 第三个参数是git生成的目录，不写是在node的执行路径文件夹
execa('git', ['init']);

let str = 'git init';
console.log(str.split(/\s+/));
let [command, ...args] = str.split(/\s+/);
console.log(command);
console.log(...args);
console.log(args);
```

### PromptModuleAPI 给类注入数据
```js
// 给类注入数据
class PromptModuleAPI {
  constructor (creator) {
    this.creator = creator;
  }

  injectPrompt (prompt) {
    this.creator.injectedPrompts.push(prompt);
  }

}

const fn = cli => {    // cli参数是一个类的实例
  cli.injectPrompt({  // 调的是类的方法，并传参
    name: 'kang'
  });
};
let obj3 = {
  injectedPrompts: []
};
let cli = new PromptModuleAPI(obj3);
console.log('xxxx', cli.creator);
fn(cli);  // 函数参数是个class 实例，就可以调方法
console.log('xxxx', cli.creator);
```

### 批量导出导入文件 

在src/node-export-all

### writeFile

```js
fs.writeFile('./a/b/c/d/e.js',()=>{})  // 目录必须先创建，不然报错
```

## npm发包

1. 查看配置 `npm config list` 
2. 改register `npm config set registry https://registry.npmjs.org/`
3. 注册账号 `npm adduser` 
   - 可官网注册
   - 账号：gyz418
   - 密码：老密码+数字凑到10位，密码要10位
   - 注册完要到邮箱验证一下 
4. `npm whoami` 查看当前npm用户   
5. 项目 npm init -y
   - package.json 的name 不能大写，不能跟其他包名重复,可在npmjs.com搜一下有没有重复
6. 发包  `npm publish` 
7. 登陆 `npm login`   
8. 重设淘宝镜像 `npm config set registry https://registry.npm.taobao.org`
### npm包兼容全局库，默认es module可用
```js
// c.js
;(function (global,factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :  // node
    global.fn = factory()  // 全局库
}(this,(function () {
  function add (a,b) {
    return a+b
  }
  function minus(e,f){
    return e-f
  }
  return {
    add,minus
  }
})));
```
// 全局应用
```html
<script src="c.js"></script>
<script>
  console.log(fn.add(1,2),fn.minus(3,4));
</script>
```
// node应用
```js
let fn = require('./c');
console.log(fn.add(1,2),fn.minus(3,4));
```
// es module应用
```js
import fn from 'c'  // c 是npm发布后的package name
console.log(fn.add(1,2),fn.minus(3,4));
```

### shelljs 

node复制文件夹

### mddir

全局安装后，直接mddir，可在当前目录下生成文件树.md

### path

path.win32.relative()  // 统一显示window上的  \

path.posix.relative()  // 统一显示posix上的 /

path.relative() // 默认是当前运行的环境

### new

nodejs   multiparty  文件上传模块    koa-multer 

## mongodb
必须在根目录创建(D)   D:/data/db  注意是根目录



## npx

npm 从5.2版开始，增加了 npx 命令

[npx](http://www.ruanyifeng.com/blog/2019/02/npx.html)

npx可以调用项目内部安装的模块（默认要在package.json的script标签里面才能用）、避免全局安装模块

npx http-server // 开启本地服务    如果没安装全局，会临时下载，用完自动删除

## 快速服务器

### serve

serve -s dist // 把dist文件夹放进服务器中

### http-server

## eslint

 eslint不认识 window、navigator全局变量
    解决：需要修改package.json中eslintConfig配置
      "env": {
        "browser": true // 支持浏览器端全局变量
      }

node包无穷无尽，真可怕

