## vue2源码

### Object.defineProperty

```js
let obj  = {}
// 数据拦截   拦截之后不做任何操作，会导致下面的赋值失败
// configurable: true 可配置表示数据可以被删除 delete obj.id
// enumerable: true   可枚举表示可以 for in 或  Object.keys() 输出， 
// 特殊的 __ob__ 就是enumberable：false
Object.defineProperty(obj,'name',{
  get(){
    console.log('get');
  },
  set(){
    console.log('set');
  }
})
obj.name='kang'  //  赋值失效
console.log(obj.name);  // undefined
```

demo2

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
hi,<span id="msg"></span>
<script>
  let obj  = {}
  // 数据拦截
  Object.defineProperty(obj,'name',{
    get(){
      console.log('get');
      return document.getElementById('msg').innerHTML    // get 控制了dom元素
    },
    set(val){
      console.log('set');
      document.getElementById('msg').innerHTML=val    // set 设置了dom元素
    }
  })
  obj.name='kang'  //  
  console.log(obj.name);  // dom元素会更新  hi,kang
</script>
</body>
</html>
```

demo3: 通过改变data值来更新页面数据

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <script src="kvue.js"></script>
</head>
<body>
<div id="app"></div>
<script>
  const app = new KVue({
    data:{
      msg:'abc',
      msgObj:{
        age:'30'
      }
    }
  })
  app.$data.msg='abcd'  // 赋值后，会促发 Object.defineProperty的 set()属性  可在那更新页面
</script>
</body>
</html>
```

kvue.js

```js
/*
* new KVue({
    data:{
      msg:'abc',
      msgObj:{
        age:'30'
      }
    }
  })
*
* */
class KVue {
  constructor (options) {
    this.$options = options;   // 所有数据  data  methods 等
    this.$data = options.data;  // data
    this.observe(this.$data);  // 观察data
  }

  observe (obj) {
    // 非对象返回
    if (!obj || typeof obj !== 'object') {
      return;
    }
    Object.keys(obj).forEach(key => {
      // 数组处理
      if(Array.isArray(obj[key])){   // 解决的是 list:[{id:1},{id:2}]
        obj[key].forEach(val2=>{     // arr:[1,2] 这个解决不了
          this.observe(val2)
        })
      }else{
      	// 响应式处理
      	this.defineReactive(obj, key, obj[key]);
      }
    });
  }

  defineReactive (obj, key, val) {

    this.observe(val);  // 递归  val 可能是个对象  {age:'30'},   递归有判断停止条件

    Object.defineProperty(obj, key, {
      get () {
        return val;
      },
      set (newVal) {
        if (newVal !== val) {
          val = newVal;
          console.log(key + '属性更新了');
          // 更新页面
        }
      }
    });
  }
}
```

坑，不能直接用表达式，

```js
let obj2 = {}
let val = ''  // 出现了全局变量，应用时包个函数就行了，把它作为参数
Object.defineProperty(obj2,'name',{
  get(){
    // return obj2.name  这里不能用表达式， 注意：同时使用get和set 需要一个中间变回量来存储真正的数据
    return val
  },
  set(newVal){
    // obj2['name']=newVal
    val=newVal
  }
})
obj2.name='666'
console.log(obj2.name);
```

用表达式包个函数

```js
let obj2 = {name:'aaa'}
function test(obj2,key){
  Object.defineProperty(obj2,key,{
    get(){
      return obj2[key]   // 包个函数就可以用表达式了
    },
    set(newVal){
      obj2[key]=newVal
    }
  })

}
test(obj2)
obj2.name='666'
console.log(obj2.name);
```

### Object.keys()

```js
let obj = {
  name:'kang',
  age:30
}
console.log(Object.keys(obj));  // ['name','age']
```

### dep watcher

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <script src="kvue.js"></script>
</head>
<body>
<div id="app"></div>
<script>
  const app = new KVue({
    data:{
      msg:'abc',
      msgObj:{
        age:'30'
      }
    }
  })
  app.msg='abcd'  // 赋值后，会促发 Object.defineProperty的 set()属性  可在那更新页面
</script>
</body>
</html>
```

```js
/*
* new KVue({
    data:{
      msg:'abc',
      msgObj:{
        age:'30'
      }
    }
  })
*
* */
class KVue {
  constructor (options) {
    this.$options = options;   // 所有数据  data  methods 等
    this.$data = options.data;  // data
    this.observe(this.$data);  // 观察data

    new Watcher(this,'msg')   // new 了后 Dep.target就有值为 Watcher
    this.msg;    // 触发get   为什么不能在html中加？
  }

  observe (obj) {
    // 非对象返回
    if (!obj || typeof obj !== 'object') {
      return;
    }
    Object.keys(obj).forEach(key => {
      // 响应式处理
      this.defineReactive(obj, key, obj[key]);
      // 代理后   从  this.$data.msg ->  this.msg
      this.proxyData(key);
    });
  }

  defineReactive (obj, key, val) {

    this.observe(val);  // 递归  val 可能是个对象  {age:'30'},   递归有判断停止条件

    // dep
    const dep = new Dep();   // 每个key都加个dep 进行监听

    Object.defineProperty(obj, key, {
      get () {
        // 依赖收集  $on监听
        Dep.target && dep.addDep(Dep.target);
        return val;
      },
      set (newVal) {          // 执行更新
        if (newVal !== val) {
          val = newVal;
          // console.log(key + '属性更新了');
          // 更新页面
          dep.notify()
        }
      }
    });
  }

  proxyData (key) {
    // this指 kvue实例
    Object.defineProperty(this, key, {
      get () {
        return this.$data[key];
      },
      set (newVal) {
        this.$data[key] = newVal;
      }
    });
  }
}

// 创建 Dep   观察者模式  bus
class Dep {
  constructor () {
    this.deps = [];
  }

  addDep (dep) {   // $on
    this.deps.push(dep);
  }

  notify () {    // $emit
    this.deps.forEach(dep => dep.update());
  }
}

// watcher
class Watcher{
  constructor (vm,key){

    Dep.target=this;  // Dep类的属性 target
    this.vm=vm;
    this.key=key;
  }
  // 更新
  update(){
    console.log(this.key+'更新了4');
  }
}
```

### Array.from

```javascript
// NodeList对象
let ps = document.querySelectorAll('p');
Array.from(ps).filter(p => {
  return p.textContent.length > 100;
});
```

### fragment vue1

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>0.html</title>
</head>
<body>
<div id="app">
  <p>{{msg}}</p>
  <div>{{val}}</div>
</div>
<script>
  let fragment = test();
  document.getElementById('app').appendChild(fragment)  // 转成fragment后，元素就消失了，需要把元素加回去
  function test () {
    const fragment = document.createDocumentFragment()
    let el = document.getElementById('app')
    console.log(el);
    while(el.firstChild){   // 循环 取出每一个元素  #text <p>{{msg}}</p> #text <div>{{val}}</div>
      console.log(el.firstChild);   // 空格换行解析为 #text
      fragment.appendChild(el.firstChild)
    }
    return fragment
  }
</script>
</body>
</html>
```

### compile

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>11.html</title>
</head>
<body>
<div id="app">
  <p>{{msg}}</p>
  <div>{{val}}</div>
</div>
<script>
  let fragment = test();
  compile(fragment);

  function test () {
    const fragment = document.createDocumentFragment();
    let el = document.getElementById('app');
    while (el.firstChild) {
      fragment.appendChild(el.firstChild);
    }
    return fragment;
  }

  function compile (el) {
    console.log(el);
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      if (node.nodeType === 1) {
        // 元素
        console.log('编译元素' + node.nodeName); // p
      } else if (this.isInter(node)) {
        // 只关心{{xxx}}
        console.log('编译插值文本' + node.textContent);  // {{msg}}
      }
      //  子节点处理  遍历 递归    针对 <p>{{msg}} 再遍历
      if (node.children && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }
  function isInter (node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    //   let reg =  /\{\{(.+?)\}\}/g  严格点的匹配{{}}  最好从源码复制出来最完美
  }
</script>
</body>
</html>
```

### node 节点

```js
node.attributes  attr.name attr.value 
node.textContent
node.nodeType   // 1 元素 3 文本节点 
node.nodeName
node.children

el.childNodes;
el.firstChild;

children和 childNodes的区别
<div>
  <p>123</p>
</div>
div的children是 HTMLCollection[p] 也就是p元素
div的childNodes是 NodeList  [text,p,text]    // text是空格 回车，文字等
```

```html
<div id="app" attr="world" class="test1" style="background: #fff;">hello</div>
<script>
  let node = document.querySelector('#app')
  console.log([node])  // 折叠起来
  console.log(node.nodeName)  // 'DIV'
  console.log(node.tagName)  // 'DIV'
  console.log(node.nodeType)  // 1
  console.log(node.nodeValue) // null
  console.log(node.id)  // app
  console.log(node.childNodes)  // NodeList [text]
  console.log(node.children)  //  HTMLCollection []
  console.log(node.attributes) // NamedNodeMap {0:id, 1:attr 2:class 3:style, id:id, attr:attr, class:class,length:4}
  console.log(node.className)  // test1
  console.log(node.style.cssText)  // background:rgb(255,255,255);
  console.log(node.firstChild) //  [text]
  console.log(node.textContent)  // 'hello'
  console.log(node.innerText)    // 'hello'
  // 整理attributes
  let attr = node.attributes;
  let obj = {}
  for(let i=0;i<attr.length;i++){
    obj[attr[i].name]=attr[i].nodeValue
  }
  console.log(obj)
    // 文本节点处理
  let child = node.childNodes
  for (let i = 0; i < child.length; i++) {
    console.log([child[i]])  // 看所有属性
    if (child[i].nodeType === 3) {
      console.log(child[i].nodeValue)  // 文本节点才有 nodeValue 也就是 hello
    }
  }
</script>
```

[相关老笔记](https://www.cnblogs.com/gyz418/p/10102599.html)

## 小函数

### replace(reg,fn)

```js
let txt = '1{{abc}}2{{def}}'
    let reg =  /\{\{(.+?)\}\}/g
    console.log(txt.replace(reg,(_,bb)=>{
       console.log(_,bb)  // {{abc}}  abc
       return 'a'}))  
    // replace，传函数参数，返回值是替换的结果    
clone
let tmpNode = document.querySelector( '#root' ); /
let generateNode = tmpNode.cloneNode( true ); // 复制 DOM 元素
```

### a.b.c.d.e

```js
function getValueByPath( obj, path ) {
      let paths = path.split( '.' ); // [ xxx, yyy, zzz ]
      let res = obj;
      let prop;
      while( prop = paths.shift() ) {
        res = res[ prop ];
      }
      return res;
    }

    var o = {
      a: {
        b: {
          c: {
            d: {
              e: '正确了'
            }
          }
        }
      }
    };

    var res = getValueByPath( o, 'a.b.c.d.e' );
// 递归方式 
function  getLastVal (obj, arr) {
    let objRes = obj[arr[0]];
    arr.shift(1);
    if (arr.length > 0) {
      return getLastVal(objRes, arr);   // 为什么这里也要return ?
    } else {
      return objRes;
    }
  }
  var res2 = getLastVal(o,'a.b.c.d.e'.split('.'))
  console.log(res2)
```

### fn

```js
function calc (val) {
    console.log('num', this.num);
    return val * this.num;
  }
  let obj3 = {
    num: 20
  };
  console.log(calc.call(obj3, 30))
// 执行函数  calc()   替换this, 传参30

function test(fn){
  return fn(10)
}

let fn = i=>5*i
console.log('test{fn}',test(fn))  // 传函数参数
```

### with new Function

with

```js
let obj ={
  age:30  
}
let newVal;
with(obj){
  newVal=age*20   // age是 obj.age
}
console.log(newVal)  // 600
```

```js
let obj={
  age:30,
  getAge:function(){
    return this.age*10
  }
}

let fn2 = function(){with(this){return getAge(age)}}  // 函数执行 getAge
console.log(fn2.call(obj))  // 30*10 = 300
```

new Function

```js
let fn = new Function('a','return a*8')   // 最后一个参数是函数表达式，前面参数是函数参数，可选
console.log(fn(8)); // 64   

let obj={
  age:30
}
let fn2 = new Function('a','with(this){return age*3*a}')
console.log(fn2.call(8))  // 30*3*8 = 720
```

### 数组去重

```js
let arr = [1,1,2,2,2,3,3,3,3,3]
let obj ={}
let newArr = []
arr.forEach(val=>obj[val] || (obj[val]=true,newArr.push(val)) )  
/*arr.forEach(val=>{
    return obj[val] || (obj[val]=true,newArr.push(val))
})
*/
console.log(newArr)
```

### hasOwn简写

```js
let obj ={name:'kang'}
// 1
let res = obj.hasOwnProperty('name')
console.log(res)

// 2 
let res2 = Object.prototype.hasOwnProperty.call(obj,'name')
console.log(res2)

// 代码简写..
const hasOwnProperty = Object.prototype.hasOwnProperty
function hasOwn(obj,key){
    return hasOwnProperty.call(obj,key)
}
// 3
let res3 = hasOwn(obj,'name')
console.log(res3)
```

### Promise.resolve()

```js
setTimeout(function () {
  console.log('three');  // 下一轮“事件循环”开始时执行
}, 0);

Promise.resolve().then(function () {
  console.log('two');   // 本轮“事件循环”结束时执行
});

console.log('one');  // one two three 
```

## AST

抽象语法树

```html
<body>
<script src="../dist/vue.js"></script>
<div id="app">{{msg}}</div>
<script>
  new Vue({
    el:'#app',
    data:{
      msg:'abc'
    }
  })
</script>
</body>
</html>
<!--
当没有render时，会通过 el参数，拿到<div id="app">{{msg}}</div>
再通过正则（src/compiler/parser/html-parser.js） 把它转成 一个对象 
const ast = {type:1,tag:'div',children:[{type:2,text:"{{msg}}"}]}
// type 1 元素 2表达式 3文本
-->
```

src/compiler/index.js  最终的 ast

```js
const ast = parse(template.trim(), options)
// const ast = {type:1,tag:'div',children:[{type:2,text:"{{msg}}"}]}
optimize(ast, options)
// 静态标记节点和根节点，为ast添加  static:false, 方便diff更新时，跳过比较
// const ast = {type:1,...,  static:false,staticRoot:false,}
const code = generate(ast, options)
// 生成  code = {render: "with(this){return _c('div',{attrs:{"id":"app"}},[_v(_s(msg))])}", staticRenderFns: Array(0)}
// _c createElement _v createTextVNode  _s toString
// 定义在   src/core/instance/render-helpers/index.js 
// 再  new Function(code.render) 变成函数，可执行
/*
ƒ anonymous() {
with(this){return _c('div',{attrs:{"id":"app"}},[_v(_s(msg))])}
}
*/
```

流程

```js
entry-runtime-with-compiler.js
const { render, staticRenderFns } = compileToFunctions(template, {}
                                                       
./compiler/index
const { compile, compileToFunctions } = createCompiler(baseOptions)  

src/compiler/index.js 
export const createCompiler = createCompilerCreator(function baseCompile(){
  return {
    ast,
    render:
    
  }
})

src/compiler/create-compiler.js
function createCompilerCreator(){
  return function createCompiler(){
    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}
```

'<div>xx</div>'->ast -> vnode -> DOM

[7种方式写vue](https://www.w3cplus.com/vue/seven-ways-to-define-a-component-template-by-vuejs.html) 有三种方式写 vue ，标准和 render和template字符串,

```js
//========= 标准
<div id="app">{{msg}}</div>
<script>
  new Vue({
    el:'#app',
    data:{
      msg:'abc'
    }
  })
</script>
//========= template字符串
 new Vue({
    el:'#app',
    data:{
      msg:'abc'
    },
    template:'<div id="app">{{msg}}</div>'
  })
//======== render 
<div id="app"></div>
<script>
  var app = new Vue({
    el: '#app',
    render: function (createElement) {
      return createElement('div', {
        attrs: {
          id: 'app'
        },
      }, this.message)
    },
    data: {
      message: 'Hello Vue!'
    }
  })
</script>
//=======  分析 
/*
如果有render() 直接跳过ast，直接生成vnode
如果是标准，可获取dom，也可直接生成vnode，源码没这样做
如果是template，必须转成ast,字符串的dom,用js解析为ast对象，再生成vnode
*/
```

[vue模板编译原理](https://segmentfault.com/a/1190000023708158)

[ast实现思路分析](https://juejin.cn/post/6875967807922798599/)

## 分析

### npm run dev

package.json 中 script的 dev 添加 --sourcemap 代码不压缩 , npm run dev运行后会生成一个打包文件 dist/vue.js, 服务启动时，一添加注释都会重新打包生成文件

### example

调试代码在 examples，记得把 引入的vue.min.js 改为vue.js。 并在html中添加` <meta charset="UTF-8"> `解决console.log中文乱码问题

initRender(vm)

```js
creaeElement()
defineReactive();  // 数据拦截 Object.defineProperty
```

### Object.defineProperty

在src/core/observer/index.js

### rollup

可把es6代码打包成nodejs代码，浏览器代码

cjs: CommonJS

umd: 浏览器和 Nodejs

iife:   浏览器

```
"dev": "rollup -w -c scripts/config.js --environment TARGET:web-full-dev --sourcemap",
-w 监听 -c 使用配置文件
```

### 目录

```
|-- src 源码
    |-- compiler  # 编译相关   ast 可构建时处理（借助webpack 推荐），可运行时处理
    |-- core      # 核心 代码
    |-- platforms # 不同平台的⽀持   web和app
	|-- server    # 服务端渲染
	|-- sfc       # .vue ⽂件解析
    |-- shared    # 共享代码   解析运行.vue
```

### package.json

npm run build会生成各种环境（浏览器、node）下的vue.js文件

npm run dev: 打包指定环境的vue.js文件，可实时监听

### vue版本概念

runtime only  是借助 webpack的vue-loader把 .vue编译成js ， 源码少  vue运行核心代码，没有模板template编译器  vue.runtime.js 

runtime+compiler  源码多（编译耗时）

```js
// 需要编译器的版本
new Vue({
	template: '<div>{{ hi }}</div>'   
    // runtime+compiler 可执行，最终渲染是通过render函数
})
// 这种情况不需要
new Vue({
	render (h) {           
		return h('div', this.hi)     // runtime only 可执行（开发推荐）
	}
})    
```

umd 用于浏览器script标签 包含运行时和编译器 vue.js **完整版**

### 全局api

src/core/global-api/index.js

```
nextTick() set() 等
```

### vm._update()

// 取出VNode的各种属性节点，进行DOM操作，一次性操作

```js
function createPatchFunction(backend){
     return function patch (oldVnode, vnode, hydrating, removeOnly) {
         // oldVnode: <div id = "app"> 这个最后被删除掉
         // vnode
         // false false
         oldVnode = emptyNodeAt(oldVnode) // 转成vnode
         const oldElm = oldVnode.elm  // <div id = "app">
         const parentElm = nodeOps.parentNode(oldElm)  // body
         createElm(vnode,parentElm)  // 此时插入了有值的DOM元素 <div id="app">hello</div>
         removeVnodes([oldVnode])  // 删除原来的<div id="app"></div>
     }
}
function emptyNodeAt(elm){
    return new VNode(elm)  // VNode{tag:'div',data:{},children:[],elm:div#app}
}
function createElm(vnode,parentElm){
    const data = vnode.data  //  {attrs:{xx}}
    const children = vnode.children //  [VNode]
    const tag = vnode.tag  // div
    vnode.elm = nodeOps.createElement(tag,vnode)  // 创建了div
    createChildren(vnode, children, insertedVnodeQueue)   // 创建子元素
    insert(parentElm,vnode.elm,refElm) // 插入DOM元素
}
function createElement(tag,vnode){
    const elm = document.createElement(tagName)  // 创建div
    return elm
}
function createChildren(vnode,children){
    for(let i = 0; i < children.length; ++i){
        createElm(children[i])   // 递归创建元素
    }
}
function insert(parent,elm,ref){
    nodeOps.insertBefore(parent, elm, ref)  // 插入元素
}
```

## 组件化

```js
// 断点调试方法，package.json dev:esm添加--sourcemap 打包 vue.runtime.esm.js 复制到vue-cli项目中，运行vue-cli项目，开始调试
//import Vue from 'vue'
import Vue from './vue.runtime.esm'  // 引入打包的文件
import App from './App.vue'
var app = new Vue({
	el: '#app',
// 这⾥的 h 是 createElement ⽅法
	render: h => h(App)   
})
```

src/core/vdom/create-element.js

```js
// 流程跟上面一样  也是 执行vnode 和 update 区别在于，执行vnode时  
vnode = createComponent(tag, data, context, children)
```

vdom/create-component.js

```
function createComponent(){
	const baseCtor = context.$options._base
	Ctor = baseCtor.extend(Ctor)  // 构造Vue的子类
	 installComponentHooks(data)  // 安装组件钩子函数 
	const vnode = new VNode('vue-component-1',data,);
	return vnode
}
// 暂停于64页
```

## new Vue

```js
function Vue(){
  this.init()
}

initMixin(Vue)
function initMixin(Vue){
  console.log(1)
  Vue.prototype.init=function(){
    console.log('hello')
  }
}
//把上面放到某个js文件中，引入它就会执行 initMixin()，输出1了,并定义了一个函数
new Vue();  // 再输出hello
```

## watch dep

watcher栈？ 存：把之前的保存起来，再设置当前值，   删： 把栈删掉一个，并赋值，

watch 存 n个dep 每个dep又存了同个watch   互相关联

### 响应式

```js
// core/instance/state.js 151行
//let data = {msg:'123'}
observe(data)
export function observe(value){
  let ob
  if(hasOwn(value,'__ob__'){
    ob = value.__ob__    // 响应式标志  __ob__
  }else{
    ob = new Observer(value)  // 响应式
  }
  return ob
}
export class Observer{
  constructor(value){
    this.value = value
    this.dep = new Dep()
    def(value, '__ob__', this)   //  data.__ob__ = Observer 
    if (Array.isArray(value)) {
      //  给数组添加__proto__
      this.observeArray(value)   // 数组
    }else{
      this.walk(value)  // 对象
    }
  }
	walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])   // 响应式
    }
  }
	observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])   // 递归   
    }
  }
}
export function defineReactive(obj,key,val){
  const dep = new Dep()
  val =obj[key]
  observe(val)
  Object.defineProperty(obj,key,{
    get(){
      if(Dep.target){
        dep.depend()
      }
    },
    set(newVal){
      val = newVal
      observe(newVal)
      dep.notify()
		}
  })
}
```

watcher怎么update()?

```js
// core/observer/watcher.js update()  164行断点
// app.msg = 444  触发 
class Watcher{
  update(){
    queueWatcher(this)
  }
}
export function queueWatcher(watcher){
  nextTick(flushSchedulerQueue)
}
// next-tick.js
let callbacks=[]
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
let timerFunc
const p = Promise.resolve()   // promise 会在本轮事件循环完再来执行 flushCallbacks
timerFunc=()=>{
  p.then(flushCallbacks)
}
export function nextTick(cb?:Function){
  callbacks.push(()=>{
    cb.call(null)   // 放了一个函数不会执行
  })
  timerFunc()  // 绕了一个弯来执行 flushSchedulerQueue   
  //  最后居然执行了  Watcher.get() 函数。。  执行经典的 vm._update(vm._render()),会生成新的vnode  //  vm._update()会 执行经典的patch()  这次是更新   复杂patch.js ...
}
```

## 总结

1. new Vue() 就会执行 new watcher(), 就会执行 `vm._update(vm._render())` 页面渲染完成 
2. 响应式在 new Vue() 时执行，在vm.$mount()前面
3. Object.defineProperty()的 set方法中的dep.notify()只有修改数据才会触发 ，第一次渲染时不触发

## 其他

### 思维导图

 [vue源码思维导图](https://www.processon.com/view/link/5d1eb5a0e4b0fdb331d3798c#map)

### chrome

f12-source,  ctrl+p 可打开任意文件

## diff算法

渲染

patch.js

```
// 744行	
patch(oldVnode,vnode)
oldVnode:   <div id="app"></div>
vnode 是 VNode  {tag:"div",children:Array[3]}
1. 把 oldVnode(DOM) 转成空Vnode  {tag:'div',children:[]}
2. 拿到 DOM元素oldElm  <div id="app"></div>  父节点parentElm  // body   
   // nodeOps是工具函数web/runtime/node-ops.js
3. createElm()  // 在页面生成新的DOM元素
4. removeVnodes()  // 删除原来的元素

```

createElm(vnode,parentElm)

```
vnode
parentElm 父元素 // body
1. vnode.elm = nodeOps.createElement(tag,vnode)   // 创建div元素  <div></div>
2. createChildren(vnode,children,ins)   // 递归调用 createElm()  创建子元素
3. insert(parentElm, vnode.elm, refElm)   插入元素
```

createChildren

```
function createChildren(){
	for(...){
		createElm(children[i])
	}
	//  文本就直接 appendChild
}
```

更新

```
// lifecycle.js
Vue.prototype._update=function(){
  vm.$el = vm.__patch__(prevVnode,vnode)
}
// patch.js
patch(oldVnode,vnode){
   patchVnode(oldVnode,vnode)   // 第一次全部vnode走这里
}
function patch(oldVnode,vnode){
	if(isDef(data) && isPatchable(vnode)){   //有属性判断是否更新相关属性
			for(xxx) cbs.update[i](oldVnode,vnode)  // updateAttrs() Class Style
	}
	// 先比较最外层div 
	updateChildren(elm,oldCh,ch)
}
function updateChildren(parentElm,oldCh,newCh){
	while(oldStartIdx< oldEndIdx && newStartIndx <=newEndIdx){
		// 取出第一个子节点vnode <p>
		if(sameVnode(oldStartVnode,newStartVnode)){
			pathchVnode(oldStartVnode,newStartVnode)   //  递归判断
		}
	}
}
<div>
	<p>{{msg}}</p>
	<button>change<button>
</div>	
1. 最外层 div  patchVnode()、更新属性，updateChildren(parentElm,oldCh,newCh)
   // 取出children(vnode)
2. updateChildren 第一次是 p，sameVnode,  取出第一个vnode p 递归 patchVnode()，又取出p的子vnode 文本vnode 更新updateChildren() 递归patchVnode(), 此时，发现文本不相等，更新文本  node.textContent = text   <p>元素结束，此时才更新游标，换行vnode, 再更新游标，再<button>元素再更新游标，此时结束
看一下需不需要增加或者删除 addVnodes(parentElm,refElm,newCh)
```

```
### 原理

diff算法 基于Snabbdom, 比较同层的树节点，复杂度O(n) ，同层级只做三件事：增删改。具体规则是：**new VNode不存在就删；old VNode不存在就增**；都存在就比较类型，类型不同直接替换、类型相同执行更新；

### 整体增删改

第700行 patch()，逻辑在上面

### 具体的修改

自定义组件 patchVnode  在 src/core/vdom/patch.js 第500行

- 有无子节点的修改

1. 纯静态文本直接替换 
2. 新老节点都有children子节点 调 updateChildren() 子节点对比更新   **重点难点**
3. 如果老节点没有子节点而新节点存在子节点，先清空老节点DOM的文本内容，然后为当前DOM节点加入子节点。
4. 当新节点没有子节点⽽老节点有子节点的时候，则移除该DOM节点的所有子节点。
5. 当新老节点都无子节点的时候，只是文本的替换。

updateChildren()  **重点难点**  在  本文件 patch.js 404行  75：00  

- 都有子节点的修改	

1. 新旧开始结束对比
2. 队首队尾两两不同，循环对比
3. 循环结束剩余的处理

// vue1对每个{{msg}}都添加一个watcher实例，项目大了，太慢，
// vue2每一个组件.vue一个watcher实例，通过虚拟DOM去更新对应的{{msg}}
```

## 分享

vnode 虚拟dom

1.直接提供render函数

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
<script src="../dist/vue.js"></script>
<div id="app"></div>
<script>
  var app = new Vue({
    el: '#app',
    render: function (createElement) {
      return createElement('div', {
        attrs: {
          id: 'app'
        },
      }, this.message)
    },
    data: {
      message: 'Hello Vue!'
    }
  })
</script>
</body>
</html>

```

js

```js
// 1.代码位置
core/instance/lifecycle.js
vm._update(vm._render())   // 执行
vm._render=function(){}  //定义  core/instance/index.js renderMixin(Vue)
Vue.prototype._render=function(){
   let vnode;
   const {render} = vm.$options   
   /*
   function (createElement) {
      return createElement('div', {
        attrs: {
          id: 'app'
        },
      }, this.message)
    },
   */
   vnode = render.call(vm._renderProxy,vm.$createElement)   // render()
}

vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

// create-element.js
export function createElement(context,tag,data,children){
//  context: vue tag:'div' data:{attrs:{id:"app"}}  children 'hello vue'
  return _createElement()
}
 function _createElement(a,b,c,children){
     let vnode
		 children = normalizeChildren(children)  // 先创建子节点的VNode
   // 'hello vue'-> {tag:undefined,text:'hello vue'}
     vnode = new VNode()  // 创建父节点VNode
     return vnode
 }

 function normalizeChildren(){
 	return [createTextVNode(children)]  // 创建文本节点  new VNode()
 }
export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}
export class class VNode{
  constructor(tag,data,children,text){
    this.tag=tag
    this.data=data
    this.children=children
  }
}
```

2.常见形式

html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
<script src="../dist/vue.js"></script>
<div id="app">{{msg}}</div>
<script>
  let app  = new Vue({
    el:'#app',
    data:{
      msg:'abc',
    }
  })
  console.log('aa',app)
</script>
</body>
</html>

```

js

```js
render:
/*
ƒ anonymous() {     // ast
	with(this){return _c('div',{attrs:{"id":"app"}},[_v(_s(msg))])}
}
*/
render()->    _c('div',{attrs:{"id":"app"}},[_v(_s(msg))])
_c createElement
msg: 'abc'
_s: toString()
_v: createTextVNode()
// core/instance/render-helpers/index.js
```

demo

```js
let obj={
  age:30
}
let fn2 = function(){with(this){return age*3}}
console.log(fn2.call(obj))  // 30*3 = 90
```

