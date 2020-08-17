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

### end