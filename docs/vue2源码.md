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

runtime 运行时版本，vue运行核心代码，没有模板template编译器  vue.runtime.js  通过 vue-loader提前编译

umd 用于浏览器script标签 包含运行时和编译器 vue.js **完整版**

commonjs   旧版打包器 browserify/webpack1  vue.runtime.common.js

esm   用于webapck2以上  vue.runtime.esm.js

带 compiler支持 template选项，可实时编译模板

```js
// 需要编译器
new Vue({
	template:'<div>{{msg}}</div>'
})
// 不需要编译器
new Vue({
	render(h){
		return h('div',this.msg)
	}
})
```



### 源码调试

npm run dev: 添加 --sourcemap 居然是打包了dist/vue.js，没有 localhost:8080可以用

打包后，用 example文件夹下的代码进行调试。。。只能调试。。改一下引用的vue.min.js为vue.js  打断点调试。。

### 代码分析

 入口 `src/platforms/web/entry-runtime-with-compiler`

1. vue引入 src/platforms/web/runtime/index.js

2. src/core/index.js

3. src/core/global-api/index.js   全局api

4. src/core/instance/index.js  Vue的构造函数

5. src/core/instance/init.js 

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

  数据响应式

1. src/core/instance/state.js    initData
2. src/core/observer/index.js  observe

 [vue源码思维导图](https://www.processon.com/view/link/5d1eb5a0e4b0fdb331d3798c#map)

### chrome

f12-source,  ctrl+p 可打开任意文件

## 要解决的问题

vnode和 ast ?

### 数据响应式

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


<script src='vue.js'>
这种方式 会把  <div id="#app">{{msg}}</div> 转成ast  转成  render函数
.vue 会由webpack处理
src/platforms/web/entry-runtime-with-compiler.js 

65行 compileToFunctions() 

xxx/web/compiler/index.js

src/compiler/index.js  最终的 ast

[vue模板编译原理](https://segmentfault.com/a/1190000023708158)

