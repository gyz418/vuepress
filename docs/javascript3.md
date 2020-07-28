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

### 5.装饰器模式

对现有的功能模块进行引用修改，满足新需求，又不改变原来的需求。(注意:装饰器模式和装饰器不一样)

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
### 6.适配器模式[不懂]  axios ?

### 7.代理模式[不懂] 

proxy 在某些情况下，出于种种考虑/限制，一个对象不能直接访问另一个对象，需要一个第三者（代理）牵线搭桥从而间接达到访问目的

### 8.观察者模式

[vue双向绑定]  @all  消息的发布者只有一人，而消息的接受者却有多人。然后每个人都能收到消息

### 9.迭代器模式

[不懂] es6 Iterator

### 10.策略格式

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

[JavaScript 设计模式核心原理与应用实践](https://yihzo.com/archives/158)

[JavaScript 设计模式与开发实践](https://github.com/JChehe/blog/issues/35)

总结：感觉设计模式不好应用上
