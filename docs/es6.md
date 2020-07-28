## es6

### export import

```js
export function test(){

}
import {test} from 'tool.js'

es2020 新增 import() 可动态引入模块  if(true){ import('xx.js')}
```

### map

```js
// map默认返回数组
let arr = [{id:1},{id:2},{id:3}].map(p=>p.id);  // 箭头函数只有一个表达式可省略{}和return
console.log(arr);  // [1,2,3]


let brr = [1,2,3].map(p=>p*2);  // 标准
console.log(brr);  // [2,4,6]

let arr2=['a','b','c'];
let crr = arr2.map(val=>{   // ['axx','bxx','cxx']  可省略{}和return
  return val+'xx'
});
console.log(crr);

```
### Object.assign

```js
let obj ={mes:{name:'age',jia:'xx'}};
let obj2={mes:{name:'kang',haha:'dfd'}};

console.log(Object.assign({}, obj, obj2));
// 双重对象合并，以后面的为主 {mes:{name:'kang',haha:'dfd'}} 前面多余的被舍弃  // jia没了

let obj3={name:'age',jia:'xx'};
let obj4={name:'age2'};

console.log(Object.assign(obj3, obj4));  // 保留第一个 jia
console.log(obj3); // {name:'age2',jia:'xx'} 默认合并到第一个对象 

```
### Object

```js
let obj = {mes:'kang'};
if('mes' in obj){
  console.log('对象是否有某属性');
}
console.log(Object.keys(obj));  //  ['mes']
```

### ...

```js
let arr = [
  'a', 'b', 'c'
];
console.log(...arr);  // a b c    记住：arr是一个数组！

function test2 (a, b) {
  return a + b;
}

let arr2 = [1, 2];
console.log(test2(...arr2));

function test3 (...args) {
  let sum = 0;
  for (let i of args) {
    sum += i;
  }
  return sum;
}

console.log(test3(1, 2, 3, 4));
console.log(test3(...[1, 2, 3, 4]));
```
### class

```js
// 1 函数计数器
let fn = () => fn.count++;
fn.count = 0;
fn();
console.log(fn.count);  // 1
fn();
console.log(fn.count);  // 2
fn();
console.log(fn.count);  // 3

// 2. 对象的get  set
var Tea = {
  _age: 18,   // 表示私有而已
  get age () {
    return this._age;
  },
  set age (val) {
    this._age = val;
  }
};
console.log(Tea.age);

class Tea2 {
  constructor (age) {
    this._age = age;
  }

  get ageXX () {
    return this._age;
  }

  set ageXX (val) {
    this._age = val+30;
  }
}

let tea2=new Tea2(18);  // {_age:18}
console.log(tea2);
console.log('age',tea2.ageXX);
tea2.ageXX=199;
console.log('age',tea2.ageXX);


//3  es6只有静态方法，没静态属性
function _fun2 () {}

let Tea3 = class {
  z = 100;  // 直接设置值
  constructor () {}

  func1 () {
    _fun2.call(this);   // 调用外部函数
  }
};
Tea3.age = 12;
console.log(new Tea3().z);  // 100

//4 限制父类不能实例化  通过new target来判断
// super用法  this指向子类实例
class Parent {
  constructor () {
    this.name = 'parent';
    if (new.target === Parent) {
      throw new Error('不能实例化');
    }
  }

  test1 () {
    console.log('hi', this.name);  // this指子类实例
  }
}

Parent.test2 = () => {
  console.log('test2');
};

class Child extends Parent {
  constructor () {
    super();
    this.name = 'child';
  }

  test () {
    super.test1();  // hi，child
  }

  static test22 () {
    super.test2();  // 'test2'
  }
}

let c = new Child();
// console.log(new Parent()); // 不能实例化
c.test();
Child.test22();

```
### 枚举
```js
let obj = {};
obj[obj['ok'] = 0] = 'ok';
obj[obj['err'] = 1] = 'err';
console.log(obj);
```

### defaultIconGray 默认图

```vue
<img class="icon" :src="val.iconUrl" alt="" :onerror="defaultIconGray">
<script>
    data(){
      return{
       defaultIconGray: 'this.src="' + require('../../../img/prize/default.png') + '"',
      }
    }
</script>
```

### delay

```js
// 延迟执行
function delay(ms){
	return new Promise(resolve=>setTimeout(resolve,ms))	
}
// delay(3000).then(console.log('延迟3秒'))
```

### [复杂的this](https://github.com/mqyqingfeng/Blog/issues/7)

``` js
Reference  只存在于规范里的抽象类型
var foo = 1;

// 对应的Reference是：
var fooReference = {
    base: EnvironmentRecord,    属性所在的对象或者就是 EnvironmentRecord    //  base value 
    name: 'foo',                                                            // referenced name 
    strict: false
};
GetValue(fooReference) // 1;    返回对象属性真正的值


function foo() {
    console.log(this)
}

foo(); // MemberExpression 是 foo     

简单理解 MemberExpression 其实就是()左边的部分。
IsPropertyReference 方法，如果 base value 是一个对象，结果返回 true。
GetBase(ref) 返回 reference 的 base value
调用 GetValue，返回的将是具体的值，而不再是一个 Reference
ImplicitThisValue 方法的介绍：该函数始终返回 undefined。


1. 看 MemberExpression 的结果是不是 Reference. 

2.1 如果是 Reference 并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)
2.2 如果 ref 是 Reference，并且 base value 值是 Environment Record, 那么this的值为 ImplicitThisValue(ref)
2.3 如果 ref 不是Reference，那么 this 的值为 undefined,非严格模式下，其值会被隐式转换为全局对象

实际上 () 并没有对 MemberExpression 进行计算

= || , 因为使用了 GetValue，所以返回的不是 Reference 类型
```

### for 省略条件

```js
// 1 省略第一个条件，可以吧i的初值放在括号外面
var i = 0;
for (; i < 5; i++) {
  if (i % 2 !== 0) {
    console.log(i);
  }
}
// 省略第二个条件，要用到 break 语句

for (let j = 0; ; j++) {
  if (j >= 5) {
    break;
  }
  if (j % 2 !== 0) {
    console.log(j);
  }
}

// 3.省略第二个条件，可以把第三个条件放到最后面
for (let k = 0; k < 5;) {
  if (k % 2 !== 0) {
    console.log(k);
  }
  k++;
}
// 4. 全省略
let m = 0;
for (; ;) {
  if (m >= 5) break;
  if (m % 2 !== 0) {
    console.log(m);
  }
  m++;
}
```

### js变量

JavaScript采用的是静态作用域

```js
var value = 1;

function foo3() {
  console.log(value);
}

function bar() {
  var value = 2;
  foo3();   // 执行 foo3() 先看有没有局部变量 value,
}           // 如果没有，根据书写的位置，查找上面一层的代码，结果 是 1

bar();


console.log(flag);   //  undefined  var flag会提前执行
var flag = 10;


function foo4() {
  console.log(a);
  a = 1;
}

foo4(); //报错 Uncaught ReferenceError: a is not defined。
       // 输出 a时，前面没有局部变量，上面一层代码没有 定义 a


function bar5() {
  a = 1;
  console.log(a);
}
bar(); // 1   向上找，有a=1

```

### 数组求和

```js
// arguments
function fn () {
  let res = 0;
  for (let i = 0; i < arguments.length; i++) {
    res += arguments[i];
  }
  return res;
}

console.log(fn(1, 2, 3, 4, 5));  // 15   传的是数字

function add (...param) {
  let res = 0;
  for (let i = 0; i < param.length; i++) {
    res += param[i];
  }

  return res;
}

console.log(add(1, 2, 3, 4, 5));    // 15   传的是数字

function add2 (arr) {
  console.log(arr);
  let res = 0;
  for (let i = 0; i < arr.length; i++) {
    res += arr[i];
  }
  return res;
}

console.log(add2([1, 2, 3, 4, 5]));    // 15   传的是数组

```

### 闭包

``` js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

// for循环执行完之后，只是给data[i]赋值

data[0]();  // 真正执行的时候，console.log(i) 不是data[i]传入的， i会从全局找 3
data[1]();
data[2]();

```

### [实现 call/apply](https://github.com/mqyqingfeng/Blog/issues/11)

### 实现bind,好复杂

 https://github.com/mqyqingfeng/Blog/issues/12

### 类数组对象

```js
// 类数组
var arrayLike={
  0:'name',
  1:'age',
  2:'sex',
  length:3
}

console.log(arrayLike[0]);
console.log(arrayLike.length);
for(var i=0,len=arrayLike.length;i<len;i++){

}
// console.log(arrayLike.push(4));  没有数组的方法

// 可用call 引入数组方法
Array.prototype.push.call(arrayLike,'hobby')  // push
console.log(arrayLike);
console.log(Array.prototype.slice.call(arrayLike, 0));  // 转成数组 slice
console.log(Array.prototype.slice.call(arrayLike));  // 转成数组 slice

console.log(Array.from(arrayLike));   // 转成数组

function foo (name, age, sex) {
  console.log(arguments);  // 类数组
}
foo('kang',12,1)


//  把foo2的参数传递给bar
function foo2() { bar.apply(this, arguments); }
function bar(a, b, c) { console.log('参数',a, b, c) }
foo2(1, 2, 3)

// 闭包demo
/**
 *   (data[i] = function () {console.log(arguments.callee.i)}).i = i;
 *   相当于
 *   data[i]= function () {console.log(arguments.callee.i)}   // data[i]是个函数
 *   data[i].i=i;      // data[i]的属性i 赋值为 i
 */
var data = [];
for (var i = 0; i < 3; i++) {
  (data[i] = function () {
    console.log(arguments.callee.i)
  }).i = i;
}
data[0]();  // 0
data[1]();  // 1
data[2]();  // 2

/**
 * arguments.callee 返回函数本身  demo  再访问它的属性isShow
 * @type {boolean}
 */
demo.isShow=false
function demo () {
  console.log('demo',arguments.callee.isShow);  // false
}
demo()
```

> 

### pageShow

```ecmascript 6
// 由前进/后退按钮以及load事件触发后引起的pageshow事件
window.addEventListener('pageshow', (event)=> {
    console.log('pageshow:');
    console.log(event);
});
```

### h5全面屏细节

微信有顶部状态栏，iphone6的高度100vh理论上为667px，实际上为603px

### 微信ios点键盘

完成后，点击事件无效

```js
keyboardEvents();  // 直接调用 
function keyboardEvents() {
  let myFunction;
  document.body.addEventListener('focusin', () => { // 软键盘弹起事件
    clearTimeout(myFunction)
  })
  document.body.addEventListener('focusout', () => { // 软键盘关闭事件
    clearTimeout(myFunction)
    myFunction = setTimeout(function () {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      }) // =======当键盘收起的时候让页面回到原始位置
    }, 200)
  })
}
```

### app内嵌页ios点键盘

完成后点击事件无效

```vue
<input type="text" @blur="gotoView">
```

```js
 // 解决 ios 点击键盘完成后，点击事件无效
  function gotoView (event) {
    let This = event.currentTarget;
    setTimeout(() => {
      This.scrollIntoView({
        block: 'end',
        behavior: 'smooth'
      });
    }, 500);
    // 当内容超出当前屏幕时，keyboardEvents()不能直接调用，要放这里
    keyboardEvents(); 
  }
```

[微信ios键盘点完成问题](https://www.codeleading.com/article/39261830468/ )
[微信ios键盘点完成问题](https://juejin.im/post/5c07442f51882528c4469769)
[微信ios键盘点完成问题](https://www.google.com/search?newwindow=1&rlz=1C1CHWL_zh-CNUS839US839&sxsrf=ALeKk00J7MFZ8UgPASv95XojTnN4FWV1RQ%3A1587970283324&ei=64CmXte8E4iImAXThI6IDg&q=ios+%E5%BE%AE%E4%BF%A1%E6%B5%8F%E8%A7%88%E5%99%A8%E7%82%B9%E5%87%BB%E9%94%AE%E7%9B%98%E5%AE%8C%E6%88%90%E5%90%8E%EF%BC%8C%E7%82%B9%E5%87%BB%E4%BA%8B%E4%BB%B6%E6%97%A0%E6%95%88&oq=ios+%E5%BE%AE%E4%BF%A1%E6%B5%8F%E8%A7%88%E5%99%A8%E7%82%B9%E5%87%BB%E9%94%AE%E7%9B%98%E5%AE%8C%E6%88%90%E5%90%8E%EF%BC%8C%E7%82%B9%E5%87%BB%E4%BA%8B%E4%BB%B6%E6%97%A0%E6%95%88&gs_lcp=CgZwc3ktYWIQAzoECCMQJzoCCAA6BAgAEEM6BQgAEIMBOgQIABADOgQIABAMOgQIABAeOgkIIRAKEKABECo6BQghEKABUNAGWL-cAWDRnQFoBXAAeACAAbQCiAG4G5IBCDI0LjkuMS4xmAEAoAEBqgEHZ3dzLXdpeg&sclient=psy-ab&ved=0ahUKEwiX3pqlgojpAhUIBKYKHVOCA-EQ4dUDCAw&uact=5)

### js惰性函数

```js
var t = '';
var test2 = function () {
  if (t) {
    console.log('if判断');
    return t;
  }
  t = new Date().getTime();
  return t;
};
console.log(test2());
console.log(test2());
console.log(test2());
console.log(test2());
// 惰性函数
var test = function () {
  console.log(1);
  var t = new Date().getDate();
  test = function () {
    return t;
  };
  return test();
};
console.log(test());  // 多次执行时，改写了原来的函数，不用判断，直接返回
console.log(test());
console.log(test());
console.log(test());
 // https://blog.csdn.net/orchid_djl/article/details/79955021
```

### i++和++j的区别

```js
let i = 10;
let res = i++;
console.log(i,res);  // 11 10
// 本身都会增加，i++, 先把i赋值给res,本身i再加1
let j = 10;
let res2 = ++j; // 把j加1后再赋值给res2
console.log(j,res2); // 11 11 
```

### console.log()

```js
console.log() 打印的东西不会进行垃圾回收，因为需要在控制台中看到相关信息，所以正式环境不要用console.log()
let obj = {
  a: 1,
  b: 2,
  c: {
    c1: 3,
  }
};
console.log(JSON.stringify(obj, null, 2));  // 命令行格式化打印

```

### 图片预加载

```js
created(){
  let img = new Image();
  img.src=require('xx.png')
}
```

### 对象中的[]

```vue
<script>
  export default {
    data () {
      return {
        name:'xiaoming',
      };
    },
    mounted () {
      let obj = {
        [this.name]:'haha'  // 中括号是括起来而已。。
      };
      console.log('obj',obj);  //  {xiaoming:haha}
    },
  }
</script>
```

### 解构

```js
let person = {
  firstName: 'Stephen',
  lastName: 'Curry'
};
const {firstName, lastName} = person;  // 解构一

// 函数解构参数
function sayName ({firstName: f, lastName: l}) {
  console.log(firstName + ' ' + lastName);// 注意这里可以直接访问到两个解构赋值的变量
  console.log(f, l);  // 别名
}

sayName(person); // Stephen Curry  // 解构二
```

### 排序

```js
let obj = [
  {price: 100, name: 'bbb'},
  {price: 10, name: 'aaa'},
];
obj = obj.sort((a, b) => a.price - b.price);
console.log(obj);   // 排序
```

apply

```js'
window.num = 10;

function calc (val) {
  console.log('num', this.num);
  return val * this.num;
}

console.log(calc(10));
let obj2 = {
  num: 20
};
console.log(calc.apply(obj2, [30]));  // 600 apply 使函数calc中this是obj,[]是函数calc传参
```

箭头表达式

```js
const foo = (x, y) => x + y; //如果只有一个表达式，并且省略掉{ ...} 的话，则意味着表达式前面有一个隐含的 return
const foo2 = (x, y) => {
  return x + y;
};  // 两者一样
```

### 防止代码覆盖

```js
// 别人的代码
window.onload = function () {
  alert(1)
}

// 用变量存起来
var _onload = window.onload || function () {}

window.load = function () {
  _onload()   // 调用别人的代码
  alert(2)    // 自己的代码
}
```

### Array.prototype.slice.call(arguments,1)

```js
// 获取函数参数的第二个参数到最后一个参数
function test () {
  let res = Array.prototype.slice.call(arguments,1)
  console.log(res);

  let res2=[].slice.call(arguments,1)
  console.log(res2);

}

test('a','b','c')   //  ['b','c']
```

### 获取随机数

```js
function getRandom (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
```

### 滑动bug

Ignored attempt to cancel a touchmove event with cancelable=false, for example because scrolling is in progress and cannot be interrupted.

```js
if (e.cancelable) {
   e.preventDefault();
}
```

### 元素抖动bug

可尝试该元素添加 flex

### 元素移动

使用transform:translateX(3px) 替换 position:absolute; left:3px;

防抖[暂停]

