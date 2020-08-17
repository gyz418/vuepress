## js 设计模式

### 1.构造器模式

初始化对象、解决多个类问题

``` js
function User (name, age) {
  this.name=name;
  this.age=age;
}
ps:有大量构造函数，调用大量new的地方，就要用工厂模式
```
### 2.简单工厂模式

解决多个实例问题

``` js
function User (name, identity, work) {
  this.name = name;
  this.identity = identity;
  this.work = work;
}

function UserFactory (name, identity) {
  let work;    // 抽出不同 
  switch (identity) {
    case 'teacher':
      work = '教书';
      break;
    case 'student':
      work = '学习';
      break;
  }
  return new User(name, identity,work);
}

console.log(new UserFactory('xx', 'teacher').work);
console.log(new UserFactory('xxx', 'student').work);
```

### 3.抽象工厂模式

（抽象类，定义一些规范，需要子类去实现）

```js
class MobileFactory{
  createOS(){
    throw new Error('不能直接调用，需要重写')
  }
}
class XiaomiFactory extends MobileFactory{
  createOS () {
    return new AndroidOS();
  }
}

class AndroidOS{} 
```

### 4.单例模式

``` js
class SingleOne {

  static getSingleOne () {
    if (!SingleOne.instance) {
      SingleOne.instance = new SingleOne();
    }
    return SingleOne.instance;
  }
}
const s1 = SingleOne.getSingleOne();
const s2 = SingleOne.getSingleOne();
console.log(s1 === s2);


// 闭包实现   自调用函数返回一个函数
class SingleTwo {}

SingleTwo.instance = (function () {
  let instance = null;
  return function () {
    if (!instance) {
      instance = new SingleTwo();
    }
    return instance;
  };
})();

const s3 = SingleTwo.instance()
const s4 = SingleTwo.instance()
console.log(s3 === s4);

ps: 代码没实际意义
应用 展示模态框、确认框
```

单例弹窗

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    .model {
      border: 1px solid black;
      position: fixed;
      width: 300px;
      height: 300px;
      top: 20%;
      left: 50%;
      margin-left: -150px;
      text-align: center;
    }
  </style>
</head>
<body>
<div id="loginBtn">点我</div>
<script>
  // 把fn转成单例
  var getSingle = function (fn) {
    var result;
    return function () {
      return result || (result = fn.apply(this, arguments));
    };
  };
  var createLoginLayer = function () {
    var div = document.createElement('div');
    div.innerHTML = '我是登录浮窗';
    div.className = 'model';
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
  };
  var createSingleLoginLayer = getSingle(createLoginLayer);
  document.getElementById('loginBtn').onclick = function () {
    var loginLayer = createSingleLoginLayer();
    loginLayer.style.display = 'block';
  };
</script>
</body>
</html>
```

### 5.装饰器模式

对现有的功能模块进行引用修改，满足新需求，又不改变原来的需求。(注意:装饰器模式和装饰器不一样)

常见应⽤:react的⾼高阶组件, 或者react-redux中的@connect 或者⾃自⼰己定义一些高阶组件

飞机大战游戏中：一开始这些⻜飞机只能发射普通的⼦子弹，升到第二级时可以发射导弹，升到第三级时可以发射原子弹。

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>单例模式弹框</title>
</head>
<style>
  #modal {
    height: 200px;    width: 200px;    line-height: 200px;    position: fixed;    left: 50%;    top: 50%;    transform: translate(-50%, -50%);    border: 1px solid black;    text-align: center;
  }
</style>
<body>
<button id='open'>打开弹框</button>
<button id='close'>关闭弹框</button>
</body>
<script>
  // 核心逻辑，
  // 单例模态框 
  // 这里采用了闭包思路来实现单例模式    // 原有的
  const Modal = (function () {
    let modal = null;
    return function () {
      if (!modal) {
        modal = document.createElement('div');
        modal.innerHTML = '我是一个全局唯一的Modal';
        modal.id = 'modal';
        modal.style.display = 'none';
        document.body.appendChild(modal);
      }
      return modal;
    };
  })();

  // 新增，对原有进行扩展，改变按钮文字
  class ShowButton {
    show () {
      const modal = new Modal();
      modal.style.display = 'block';
    }
  }

  // 装饰器扩展原有逻辑
  class ModalDecorator {
    constructor (button) {
      this.button = button;   // 传入对象实例
    }

    show () {
      this.button.show();
      this.changeButtonText();
    }

    changeButtonText () {
      const btn = document.getElementById('open');
      btn.innerText = '快去登录';
    }
  }

  // 点击打开按钮展示模态框
  document.getElementById('open').addEventListener('click', function () {
    // 未点击则不创建modal实例，避免不必要的内存占用
    // const modal = new Modal()
    // modal.style.display = 'block'

    // 新增
    const button = new ShowButton();
    const decorator = new ModalDecorator(button);
    decorator.show();
    // button.show()
  });

  // 点击关闭按钮隐藏模态框
  document.getElementById('close').addEventListener('click', function () {
    const modal = new Modal();
    if (modal) {
      modal.style.display = 'none';
    }
  });
</script>
</html> 
```
### 6.适配器模式

适配器模式的作用是解决两个软件实体间的接口不兼容的问题。使⽤用适配器模式之后，原本 由于接口不兼容而不能工作的两个软件实体可以一起⼯工作。适配器器模式主要⽤用来解决两个已有接口之间不匹配的问题，它不不考虑这些接⼝口是怎样实 现的，也不考虑它们将来可能会如何演化。适配器器模式不需要改变已有的接⼝口，就能够 使它们协同作⽤用。

axios?

### 7.代理模式

代理理模式的定义：为⼀一个对象提供⼀一个代⽤用品或占位符，以便便控制对它的访问。
常⽤用的虚拟代理理形式：某⼀一个花销很⼤大的操作，可以通过虚拟代理的方式延迟到这种需要它的时候才去
创建（例：使⽤用虚拟代理理实现图片懒加载）

图片懒加载、节流防抖

### 8.观察者模式

[vue双向绑定]  @all  消息的发布者只有一人，而消息的接受者却有多人。然后每个人都能收到消息  vue笔记中的$on $off 

### 9.迭代器模式

迭代器器模式是指提供⼀种方法顺序访问⼀个聚合对象中的各个元素，⽽又不需要暴露该对象的内部表示。迭代器器模式可以把迭代的过程从业务逻辑中分离出来,在使⽤用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素

 es6 Iterator   each map等

```js
var each = function( ary, callback ){
for ( var i = 0, l = ary.length; i < l; i++ ){
callback.call( ary[i], i, ary[ i ] );
}
};
each( [ 1, 2, 3 ], function( i, n ){
alert ( [ i, n ] );
})
```

### 10.策略格式

应用：表单校验 element ui

```js
function calc (level, salary) {
  if (level === 'S') {
    return salary * 4;
  }
  if (level === 'A') {
    return salary * 3;
  }
  if (level === 'B') {
    return salary * 2;
  }
}

function calc2 (level, salary) {
  switch (level) {
    case 'S':
      return salary * 4;
    case 'A':
      return salary * 3;
    case 'B':
      return salary * 2;
  }
}

//  策略模式，感觉还是 switch 好点
function calc3 (level, salary) {
  var obj = {
    S: function (salary) {
      return salary * 4;
    },
    A: function (salary) {
      return salary * 3;
    },
    B: function (salary) {
      return salary * 2;
    }

  };

  return obj[level](salary);
}

console.log(calc3('S', 30));
```


### 11.中介者模式

通过⼀一个中介者对象，其他所有的相关对象都通过该中介者对象来通信，⽽而不不是相
互引⽤用，当其中的⼀一个对象发⽣生改变时，只需要通知中介者对象即可。

应用： vuex

### 12.外观模式

涉及到兼容性，参数支持多格式，有很多这种代码，对外暴暴露露统⼀的api，

```js
function addEvent (dom, type, fn) {
  if (dom.addEventListener) {
    dom.addEventListener(type, fn, false);
  } else if (dom.attachEvent) {
    dom.attachEvent('on' + type, fn);
  } else {
    dom['on' + type] = fn;
  }
}
```

### 13.建造者模式

和工厂模式相比，参与了更多创建的过程 或者更复杂

### 14.享元模式

⽤用于性能优化的模式。运⽤用共享技术来有效支持大量细粒度的对象。如弹窗，只弹一个，但弹窗的内容可修改

### 15.模板方法模式

模板⽅方法模式在一个方法中定义⼀个算法的⻣骨架，而将⼀些步骤的实现延迟到子类中。模板方法使得子类可以在不改变算法结构的情况下，重新定义算法中某些步骤的具体实现

vue中的slot

### 16.备忘录模式

可以恢复到对象之前的某个状态，其实⼤大家学习react或者redux的时候，时间旅行的功能，就算是备忘录模式的⼀个应用

王者荣耀中的游戏录相

### 总结

[JavaScript 设计模式核心原理与应用实践](https://yihzo.com/archives/158)

[JavaScript 设计模式与开发实践](https://github.com/JChehe/blog/issues/35)

