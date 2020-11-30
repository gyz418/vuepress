## vue2源码

### Object.defineProperty

```js
let obj  = {}
// 数据拦截   拦截之后不做任何操作，会导致下面的赋值失败
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
      // 响应式处理
      this.defineReactive(obj, key, obj[key]);
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

坑，不能用表达式

```js
let obj2 = {}
let val = obj2.name
Object.defineProperty(obj2,'name',{
  get(){
    // return obj2.name  这里不能用表达式
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

### nodeType

```js
// 1是元素 3 是文本
function nodeType () {
  var p = document.createElement("p");
  p.textContent = "很久很久以前...";

  console.log(Node.ELEMENT_NODE === 1)  // p
  console.log(Node.TEXT_NODE === 3)    //  很久很久以前...

  console.log(p.nodeType === Node.ELEMENT_NODE) // true
  console.log(p.firstChild) // 很久很久以前...
  console.log(p.firstChild.nodeType === Node.TEXT_NODE) // true
}
```

### fragment

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
  }
</script>
</body>
</html>
```

node 节点

```js
node.attributes  attr.name attr.value 
node.textContent
node.nodeType
node.nodeName
node.children

el.childNodes;
el.firstChild
```

[相关老笔记](https://www.cnblogs.com/gyz418/p/10102599.html)

### vue版本

commonjs   旧版打包器 browserify/webpack1  vue.runtime.common.js

esm   用于webapck2以上  vue.runtime.esm.js

### 源码调试

npm run dev: 添加 --sourcemap 居然是打包了dist/vue.js，没有 localhost:8080可以用

打包后，用 example文件夹下的代码进行调试。。。只能调试。。改一下引用的vue.min.js为vue.js  打断点调试。。

### 代码分析

5. src/core/instance/init.js 


  数据响应式

1. src/core/instance/state.js    initData
2. src/core/observer/index.js  observe

 [vue源码思维导图](https://www.processon.com/view/link/5d1eb5a0e4b0fdb331d3798c#map)

### chrome

f12-source,  ctrl+p 可打开任意文件

## 要解决的问题

vnode

export default vue  有啥区别？

数据响应式

2-5 vue源码2      分析各文件、数据响应式

## 虚拟DOM

vue1对每个{{msg}}都添加一个watcher实例，项目大了，太慢，

vue2每一个组件.vue一个watcher实例，通过虚拟DOM去更新对应的{{msg}}

只了解源理就行了

### 找文件

2-6 vue源码3    23:20开始讲虚拟dom，29：32开始找代码

`src/platforms/web/runtime/index.js`  

```js
Vue.prototype.$mount=function(){
	return mountComponent()
}
```

src/core/instance/lifecycle.js  找到 mountComponent()   

```js
1. 
updateComponent = () => {
   vm._update(vm._render(), hydrating)
}
2. new Watcher(updateComponent)   调用 updateComponent    
```

vm.render()  在 src\core\instance\render.js的  renderMixin()中

```js
const { render, _parentVnode } = vm.$options;
vnode = render.call(vm._renderProxy, vm.$createElement);
```

vm._update()在 src\core\instance\lifecycle.js的  lifecycleMixin()中

```js
if (!prevVnode) {
      // initial render  初始化
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates   更新
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
```

`__patch__` 在 src/platforms/web/runtime/index.js 

```js
import { patch } from './patch'
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

patch.js

```js
export const patch: Function = createPatchFunction({ nodeOps, modules })
```

createPatchFunction 在 src/core/vdom/patch.js    直接看函数的返回，在第700行  patch()

**终于找到目标了**  57:00  先整体处理 增删改的问题，具体的修改在  patchVnode

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

## AST

抽象语法树

```<script src='vue.js'>```
这种方式 会把  <div id="#app">{{msg}}</div> 转成ast  转成  render函数
.vue 会由webpack处理
src/platforms/web/entry-runtime-with-compiler.js 

65行 compileToFunctions() 

xxx/web/compiler/index.js

src/compiler/index.js  最终的 ast

[vue模板编译原理](https://segmentfault.com/a/1190000023708158)

## 代码执行过程

### npm run dev

package.json 中 script的 dev 添加 --sourcemap 代码不压缩 , npm run dev运行后会生成一个打包文件 dist/vue.js, 服务启动时，一添加注释都会重新打包生成文件

### example

调试代码在 examples，记得把 引入的vue.min.js 改为vue.js。 并在html中添加` <meta charset="UTF-8"> `解决console.log中文乱码问题

### 断点

html引入app.js 打断点 new Vue()开始

new Vue()在src/core/instance/index.js

```js
// src/core/instance/index.js
function Vue (options) {
  console.log('执行2');
  this._init(options)
}
 initMixin(Vue)  // 实现上面的 _init
 console.log('这些函数先执行1');
 console.log('这些函数都在同一层目录')
 stateMixin(Vue)  // $watch  $set $delete $data $props
 eventsMixin(Vue)  // $emit $on $once $off
 lifecycleMixin(Vue)  // _update, $forceUpdate, $destroy
 renderMixin(Vue)   // _render $nextTick
export default Vue
```

### initMinxin

```js
initProxy(vm);  // 真代理proxy 不知道干嘛	
initLifecycle(vm); // 定义并获取 $parent $root
initEvents(vm)； // 没干啥
initRender(vm); // 见下文
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props  没干啥
initState(vm);  //  初始化 method data computed watch
initProvide(vm) // resolve provide after data/props   
callHook(vm, 'created')
// 先 created() 再  vm.$mount()
```

### vm.$mount() 扩展

```
// src/platforms/web/entry-runtime-with-compiler.js

获取 $options,先判断render,
再判断 template,没template直接 template=getOuterHTML(el)
得到<div id = "#app">xxx全部标签xxx</div>
通过 compileToFunctions 获取 render, 
$options.render=render
// 扩展时 Vue 来自这里
import Vue from './runtime/index' 
Vue.prototype.$mount=function(){}  //  真正的 $mount
```

真正的 $mount()

```js
// src/platforms/web/runtime/index.js
Vue.prototype.$mount=function(){ return mountComponent()}
```

initRender(vm)

```js
creaeElement()
defineReactive();  // 数据拦截 Object.defineProperty
```

### Object.defineProperty

在src/core/observer/index.js

## 11-23

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

### 入口

`src/platforms/web/entry-runtime-with-compiler.js`

研究 runtime + compiler

### vue来源

entry-runtime-with-compiler.js

```
import Vue from './runtime/index'
```

runtime/index.js

```
import Vue from 'core/index'
```

src/core/index.js

```
import Vue from './instance/index'
```

src/core/instance/index.js   **最终来源**

```js
function Vue (options) {
  this._init(options)
}
initMixin(Vue)  // 实现上面的 _init()    => src/core/instance/init.js
stateMixin(Vue)  // $watch  $set $delete
eventsMixin(Vue)  // $emit $on
lifecycleMixin(Vue)  // _update, $forceUpdate, $destroy
renderMixin(Vue)   // _render $nextTick
```

src/core/instance/init.js

```js
initLifecycle(vm)  // $parent
initEvents(vm)    //  事件监听器
initRender(vm)   // $createElement
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
initState(vm)   // data, compunted methods
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')
```

### runtime api

src/platforms/web/runtime/index.js

```
Vue.prototype.__patch__ = inBrowser ? patch : noop
Vue.prototype.$mount=function(){}
```

### 全局api

src/core/global-api/index.js

```
nextTick() set() 等
```

### 带compiler的mount

在入口处`src/platforms/web/entry-runtime-with-compiler.js`

分析了带compiler的mount, 原先的Vue.prototype.$mount已经可以在 runtime Only版本运行了，这里加上了 render属性，提供给 compiler版本用

```js
const mount = Vue.prototype.$mount // 缓存原来的$mount
//1. 对el做限制，不能挂载到body/html上
Vue.prototype.$mount = function(el,hydrating){
    const options = this.$options
    if(!options.render){
        let template = options.template
        if(template){
			template = xx
        }else if(el){
			template = xx
        }
        // 拿到template
        if(template){
            const { render, staticRenderFns } = compileToFunctions(template)
            options.render = render  // 拿到render
        }
    }
    return mount.call(this, el, hydrating)
    // 调用  mount()函数，并传参，改变函数的this指向
}
// 所有.vue组件或el template等，最终都转成render,调用compileToFunctions实现
```

### 原型 mount

src/platform/web/runtime/index.js

```js
Vue.prototype.$mount = function (el,hydrating){
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)  // hydrating 服务端渲染相关
}
```

### mountComponent位置

src/core/instance/lifecycle.js

```js
function mountComponent(vm){
    if (!vm.$options.render) {
	  vm.$options.render = createEmptyVNode  // 实现 render
    }
    callHook(vm, 'beforeMount')   // beforeMount
	let updateComponent
	updateComponent = ()=>{
		vm._update(vm._render(), hydrating)  
         // vm._update 更新DOM     Vue初始化时由 lifecycleMixin(Vue)实现了
        // vm._render() 生成虚拟node  Vue初始化时由 renderMixin(Vue)实现了

	}
	new Watcher(vm,updateComponent)
    // 初始化时执行回调函数updateComponent, 当数据变化时再次执行回调函数
    if (vm.$vnode == null) {
    	vm._isMounted = true
    	callHook(vm, 'mounted')  // mount
  }
}
```

### render

src/core/instance/render.js

```js
function renderMixin(Vue){
Vue.prototype._render=function(){
	const { render, _parentVnode } = vm.$options 
    // render() 在 ../lifecycle.js的 mountComponent
	let vnode
		vnode = render.call(vm._renderProxy,vm.$createElement)
	}
//    vm.$createElement 在当前文件的  initRender()  返回vnode 虚拟Dom
    return vnode;
}
```

### Virtural Dom

src/core/vdom/vnode.js

### createElement

src/core/vdom/create-element.js

vue利用 createElement 创建vnode

```js
function createElement(){
	return _createElement()
}
function _createElement(context,tag,data,children,normalizationType){
  children = normalizeChildren(children)   
    // ask1   把第四个参数调整为 vnode类型
    // 判断 tag类型
    let vnode
    vnode = createComponent()
    return vnode
}
```

### _update()

把vnode渲染成真实 的DOM 	

src/core/instance/lifecycle.js

```js
function lifecycleMixin(Vue){
	Vue.prototype._update=function(){
        vm.$el = vm.__patch__(a,b,c,d)  // 核心 有区分 web和 weex
    }
}
// web在 src/platforms/web/runtime/index.js
// Vue.prototype.__patch__ = inBrowser ? patch : noop  
// web又区分是否服务器渲染， web是  patch
```

patch

src/platforms/web/runtime/patch.js

```js
export const patch=createPatchFunction()
```

### src/core/vdom/patch.js 

800行代码 

```js
function createPatchFunction(){
	return function patch(a,b,c,d){
        oldVnode = emptyNodeAt(oldVnode)
        createElm()
    }
}
// 最终  vm.__patch__(a,b,c,d)就是调了 patch(a,b,c,d)
```

## vnode 和 update

```js
// render函数  
var app = new Vue({
    el: '#app',
    render: function (createElement) {
      return createElement('div', {
        attrs: {
          id: 'app'
        },
      }, this.message)
    },
  })
```

 `src/core/instance/lifecycle.js`

```js
function mountComponent(){vm._update(vm._render(),hydrating)}
// vm._render()最终是VNode类实例 new VNode{tag:'div',data:'xx',children:[Vnode]}
     
```

vm._render()

```js
Vue.prototype._render=function(){
	let vnode
	vnode = render.call(vm._renderProxy, vm.$createElement)  
    retun vnode; // 最终是个 new VNode();里面的子节点也是VNode
}
 vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
 function createElement(){
 	return _createElement()
 }
 function _createElement(a,b,c,children){
     let vnode
	children = normalizeChildren(children)  // 先创建子节点的VNode
     vnode = new VNode()  // 创建父节点VNode
     return vnode
 }
 function normalizeChildren(){
 	return [createTextVNode(children)]  // 创建文本节点  new VNode()
 }
 
```

vm._update()

// 取出VNode的各种属性节点，进行DOM操作，一次性操作

```js
Vue.prototype._update=function(vnode){
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false)
}
Vue.prototype.__patch__ = inBrowser ? patch : noop
export const patch: Function = createPatchFunction({ nodeOps, modules })
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

### 组件化

```js
import Vue from 'vue'
import App from './App.vue'
var app = new Vue({
	el: '#app',
// 这⾥的 h 是 createElement ⽅法
	render: h => h(App)
})
```

src/core/vdom/create-element.js

```js
vnode = createComponent(tag, data, context, children)
```

vdom/create-component.js

```
// 暂停
```

### 编译

## 非关键函数代码先跳过

最后有兴趣再来过一下各个细节,忽略 flow 

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

