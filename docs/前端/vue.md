## vue 
### vue watch 

```vue
watch: {
  a: function (val, oldVal) {
    console.log('new a: %s, old: %s', val, oldVal)
  },
  // 方法名
  b: 'someMethod',
  // 深度 watcher
  c: {
    handler: function (val, oldVal) {
      console.log('new c: %s, old: %s', val, oldVal)
    },
    deep: true
  },
  // 该回调将会在侦听开始之后被立即调用
  d: {
    handler: function (val, oldVal) {
      console.log('new d: %s, old: %s', val, oldVal)
    },
    immediate: true
  }
```
### Object.defineProperty()  
在一个对象上定义一个新属性，并给值

```js
const object1 = {};

Object.defineProperty(object1, 'property1', {
  value: 42,
  writable: false
});

object1.property1 = 77;
// throws an error in strict mode

console.log(object1.property1);
// expected output: 42
```
### webp
判断webp https://www.jianshu.com/p/3ab716ee1a2e

Google官方文档是这样处理的（先加载一个WebP图片，如果能获取到图片的宽度和高度，就说明是支持WebP的，反之则不支持）

### 组件调用

```js
//   this.$parent.toLogin()   子组件调父组件方法

父调子通过 ref 
<child ref="child"></child>
 this.$refs.child.fn() // 调用子组件的方法
 console.log(this.$refs.child.msg) // 获取子组件的属性
```
### 指令
directive : 看官方文档 [未完成]

```vue
1. 加个标志就可以执行一系列操作
2. 是个js
3. 代码复用和抽象的主要形式是组件
4. 当需要对普通 DOM 元素进行底层操作，此时就会用到自定义指令
5. 但是，对于大幅度的 DOM 变动，还是应该使用组件

// 最简指令 index.js  
Vue.directive('focus',{
  inserted:function (el) {
    el.focus()
  }
})
// 应用
<input v-focus/>
// 倒计时未完成  https://www.cnblogs.com/lguow/p/11937807.html
function getFormatTime(val,i){
  // return parseInt((+new Date()-val)/1000)
  return val-i;
}
Vue.directive('time', {
  bind(el, binding) {
    let i=0;
    el.innerHTML = getFormatTime(binding.value,i)
    el.__timeout__ = setInterval(() => {
      el.innerHTML = getFormatTime(binding.value,i)
      if(i===binding.value){
        clearInterval(el.__timeout__)
        delete el.__timeout__
      }
      i++;
    }, 1000)
  },
  unbind(el) {
    console.log('unbind');
    clearInterval(el.__timeout__)
    delete el.__timeout__
  }
})
 
 <div class="main" v-if="showTime">
     <p v-time="time" :class="{'active':!time}"></p>
     <p v-time="time1"></p>
     <p v-time="time2"></p>
     <p v-time="time3"></p>
     <p v-time="time4"></p>
     <p @click="showTime=false">stop</p>
   </div>
   
   data(){
    return{
      showTime:true,
      time:20,
      time1:70,
      time2:80,
      time3:90,
      time4:100,
    }
   }

```
### bus

```js
// bus.js
import Vue from 'vue'
const Bus = new Vue();
export default Bus

```
```js
// index.js // 入口文件
import Bus from './bus'
Vue.prototype.$Bus=Bus

// Vue.prototype.$Bus=new Vue() // 最简bus
```

#### 组件1 Tes1.vue

```vue
<template>
    <p @click="email">click test1.vue</p>
</template>
<script>
  export default {
    methods: {
      email(){
        this.$Bus.$emit('emailClick','i am email')
        // 点击后，通过bus给另一组件传数据
      }
    }
  };
</script>
```
#### 组件2 接收数据 Test2.vue

```vue
<template>
    <p>test1.vue: {{email}}</p>
</template>
<script>
  export default {
    data () {
      return {
        email:''
      };
    },
    mounted(){
      this.$Bus.$on('emailClick',res=>{  // 跨router-view 监听,加了 bus 文件
        this.email=res   // 通过bus监听，接收数据
      })
    },
  };
</script>
```
#### bus实现

```js
class Bus{
  constructor() {
    this.callback={}
  }
  $on(name,fn){     // 监听时把函数放入数组
    this.callback[name]=this.callback[name] || [];
    this.callback[name].push(fn)
  }
  $emit(name,args){   // 提交时执行监听函数
    if(this.callback[name]){
      this.callback[name].forEach(cb=>cb(args))
    }
  }
}

Vue.prototype.$bus=new Bus();
```
### $on $emit

订阅、发布模式（观察者）

```js
class Event {
  constructor () {
    this.callbacks = {};
  }

  $off (name) {
    this.callbacks[name] = null;
  }

  $emit (name, args) {
    let cbs = this.callbacks[name];
    if (cbs) {
      cbs.forEach(c => {
        c.call(this, args);
      });
    }
  }

  // 监听
  $on (name, fn) {
    // (this.callbacks[name] || (this.callbacks[name] = [])).push(fn) // 简写
    this.callbacks[name] = this.callbacks[name] || [];
    this.callbacks[name].push(fn);  // 数组才能push , 使用数组是因为，一次emit提交可以多个地方不同on监听，执行不同结果
    /*if(!this.callbacks[name]){
      this.callbacks[name]=fn   // 只有一个fn的话，emit提交后，其他监听无法生效
    }*/
  }
}

let event = new Event();
event.$on('event1', function (arg) {
  console.log('事件1', arg);
});
event.$on('event1', function (arg) {
  console.log('事件11', arg);
});
event.$on('event1', function (arg) {
  console.log('事件111', arg);
});
event.$on('event2', function (arg) {
  console.log('事件2', arg);
});
event.$emit('event1', {name: '开课吧'});
event.$emit('event2', {name: '全栈'});
console.log('-'.repeat(50));
console.log(event.callbacks);
event.$off('event1');  // 关闭监听，就无法  $emit了
event.$emit('event1', {name: '开课吧'});  // 不执行
event.$emit('event2', {name: '开课吧ssssssssssss'});
```

### 祖先后代

只用于组件库，开发不用

#### // app.vue

```vue
export default {
    provide(){  // 祖先提供数据 函数返回对象
      return{
        todayNum: 63400
      }
    },
    
    /*provide:{  // 祖先提供数据， 也可以直接一个对象
       todayNum: 333
    },*/
}
```
#### // son.vue

```vue

export default {
    inject:['todayNum'],  // 以字符串数组的形式接收
},
```
### 插槽：看官方文档

```
有个作用域插槽，子组件显示`{{user.name}}` 父组件引用时可用`{{user.familyName}}`来替换掉
```

### vue插件-toast

> 添加全局功能
```
官网：https://cn.vuejs.org/v2/guide/plugins.html

// MyPlugin.js插件
// 必须有个install方法,第一个参数为Vue构造器，第二个参数为可选对象
// 如果插件是一个对象，必须提供 install 方法。如果插件是一个函数，它会被作为 install 方法
// 是个js,需要可引入vue文件
MyPlugin.install=function(Vue,options){
  //1.添加全局方法 Vue.globalMethod=function(){}
  //2.指令        Vue.directive 
  //3.注入组件     Vue.mixin 
  //4.添加实例方法 Vue.prototype.$myMethod=function(){}
}
//使用插件： 
Vue.use(MyPlugin)
// 最简插件
Vue.use(function (Vue) {
  Vue.prototype.$myFn=(str)=>{
    console.log('myFn',str);
  }
})
// 使用 this.$myFn('1234')
```

> 进阶看 src/myFn
```
1.index.js 是最终版， index2.js 是初级版  index3.js index4.js index5.js 中高级版
2.项目入口文件添加
  import myFn from '../myFn/index5'
  Vue.use(myFn)
3.vue中调用  this.$myFn('12345666')
```
> 相关知识点
```
1. Vue.extend 使用基础 Vue 构造器，创建一个“子类”。
var demo = Vue.extend({}) 
new Demo().$mount('#app');  // 创建实例，挂载到元素上  <div id='#app'>xxx</div> 该元素会被替换掉。 

vm.$mount()    
手动挂载一个未挂载的实例。 // 参数为空的话，默认挂载到body元素下
https://cn.vuejs.org/v2/api/#vm-mount

// 或者，在文档之外渲染并且随后挂载 【来自官网】
var component = new MyComponent().$mount()
document.getElementById('app').appendChild(component.$el)

vm.$el (this.$el)

Vue实例使用的根DOM元素， 某个vue组件时，this.$el就是当前<template>中的DOM内容
 
vm.$destroy

this.$destroy(true)  // 完全销毁一个实例。触发 beforeDestroy 和 destroyed

[vue.extend文档](https://www.cnblogs.com/hentai-miao/p/10271652.html) 


Vue.use() 

安装 Vue.js 插件。如果插件是一个对象，必须提供 install 方法。如果插件是一个函数，它会被作为 install 方法。install 方法调用时，会将 Vue 作为参数传入。

在线文档： https://www.jianshu.com/p/89a05706917a
```
### vue插件-confirm
代码在 src/confirm中

```
1.项目入口文件添加
  import myFn from '../myFn/index5'
  Vue.use(myFn)
2.vue中调用  
this.$showConfirm({
  title:'我是标题',
  content:'确定吗？'
}).then(()=>{
  console.log('点击确定')
}).catch(err=>{
  console.log('err', err);
})
```

### 子组件v-model

> 简单版 son.vue 
```vue
<template>
  <input type="text" :value="val2" @input="input">
</template>
<script>
  export default {
    name: 'Test',
    props: {
      val2: {}  // 这里的变量随意 
    },
    methods: {
      input (e) {
        this.$emit('input', e.target.value);
      }
    }
  };
</script>
```
father.vue
```vue
<template>
  <Son v-model="val"/>
</template>
```
[复杂版](https://www.cnblogs.com/gyz418/p/8582711.html)

### 组件 .sync 
显示指出被子组件双向绑定的props
应用： 显示隐藏 maskShow， ruleShow是双向绑定
son.vue

```vue
<template>
  <div v-if="ruleShow">
    <div class="close" @click="$emit('update:ruleShow',false)">关闭弹层</div>
                          <!-- 更新父组件 ruleShow 值为 false ,false 也可以省略，''也是false -->
                          
    <!--<div class="close" @click="$emit('close')">原来的写法</div>--> 
    <p>son...</p>                      
  </div>
</template>
<script>
   export default {
      props: {
        ruleShow: false
      },
    };
</script>
```
father.vue
```vue
<template>
  <son :ruleShow.sync="ruleShow"></son>
  <!--<son :ruleShow="ruleShow" @update:ruleShow="ruleShow=$event"/>-->
  
  <!--<son :ruleShow="ruleShow" @close="ruleShow=false"></son> 原来的写法-->
</template>
<script>
  export default {
    data(){
      return{
        ruleShow:false
      }
    }
  }
</script>

```
[文档](https://medium.com/%E4%B8%80%E5%80%8B%E5%B0%8F%E5%B0%8F%E5%B7%A5%E7%A8%8B%E5%B8%AB%E7%9A%84%E9%9A%A8%E6%89%8B%E7%AD%86%E8%A8%98/vue-%E4%BD%BF%E7%94%A8-props-async-%E5%90%8C%E6%AD%A5%E7%88%B6%E5%AD%90%E7%B5%84%E5%BB%BA%E4%B9%8B%E9%96%93%E7%9A%84%E5%82%B3%E5%80%BC-f7b1d3007836)

#vue事件广播与接收  
> 任一组件发起数据emit, 其他任一组件可接收数据

[Vue2.0 事件的广播与接收(观察者模式)](http://www.luyixian.cn/javascript_show_162081.aspx)

### tree

递归组件tree在 src/tree

### k-form

仿element-ui form表单在 src/k-form

### kvue-router

实现vue-router 在 src/kvue-router

动态路由 router.addRoutes()

面包屑利用 this.$route.matched

### VUE列表左滑删除

```vue
<template>
  <div class="main">
    <div class="list">
      <div class="item flex-center" :class="{move:index===key}" v-for="(val,key) in list" :key="key"
           @touchstart="touchstart(val,key)" @touchend="touchend(val,key)">
        <div class="flex-center">
          <img :src="val.img" alt="">
          <p class="name">{{val.name}}</p>
        </div>
        <p class="hour">{{val.hour}}</p>
        <div class="del flex-center" @click="del(key)">删除</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        list: [
          {img: 'http://placekitten.com/200/198', name: '中国', hour: 124},
          {img: 'http://placekitten.com/200/198', name: '中国中国中国', hour: 125},
          {img: 'http://placekitten.com/200/198', name: '中国中国中国中国', hour: 126},
          {img: 'http://placekitten.com/200/198', name: '中国中国', hour: 127},
          {img: 'http://placekitten.com/200/198', name: '中国中国中国中国', hour: 128},
        ],
        x1: '',
        index: -1,
      };
    },
    methods: {
      touchstart () {
        // 记录开始滑动的鼠标位置
        this.x1 = event.changedTouches[0].pageX;
        // console.log('x1', this.x1);
      },
      touchend (val, key) {
        // 记录结束滑动的鼠标位置
        // https://juejin.im/post/5d70846751882546ce277628
        let x2 = event.changedTouches[0].pageX;
        // console.log('x2', this.x2);
        // 判断滑动距离大于50，判定为滑动成功，
        if (this.x1 - x2 > 50) {
          if (event.cancelable) {
            event.preventDefault();
          }
          this.index = key;
        } else {
          this.index = -1;
        }
      },
      // 删除
      del (key) {
        this.list.splice(key, 1);
        this.index = -1;
      }
    }
  };
</script>

<style scoped lang="scss">
  .list {
    overflow-x: hidden;

    .item {
      padding: 0 50px;
      border-bottom: 1px solid #c3c3c3;
      height: 200px;
      position: relative;
      transform: translateX(0);
      transition: all .3s; /*滑动效果更生动*/
      &.move {
        transform: translateX(-160px); /*滑动后x轴位移-60px,使其可见*/
      }

      img {
        width: 100px;
        height: 100px;
      }

      .del {
        position: absolute;
        top: 0;
        right: -1px;
        z-index: 3;
        width: 160px;
        height: 100%;
        color: #fff;
        justify-content: center;
        background-color: #ff5b45;
        transform: translateX(160px); /*默认x轴位移60px，使其隐藏*/
      }
    }
  }
</style>

```

### vue scrollData

```vue
<template>
  <div class="main">
    <div class="list" @scroll="scrollData" ref="scrollOut">
      <div class="item flex-center" v-for="(val,key) in list" :key="key">
        <img :src="val.icon" alt="">
        <p class="name">{{val.name}}</p>
        <p class="status flex1">{{val.status}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        list: [],
        canLoad: true, // 滚动加载
      };
    },
    mounted () {
      this.getData();
    },
    methods: {
      getData () {
        let s = this;
        let res = [{
          icon: 'http://placekitten.com/200/198',
          name: 'xxx',
          status: 0,
        }, {
          icon: 'http://placekitten.com/200/198',
          name: 'xxx',
          status: 1,
        }, {
          icon: 'http://placekitten.com/200/198',
          name: 'xxx',
          status: 2,
        }];
        this.list = this.list.concat(res);
      },
      // 滚动监听
      scrollData () {
        let outH = this.$refs.scrollOut.scrollHeight,
          currentH = this.$refs.scrollOut.offsetHeight,
          offH = this.$refs.scrollOut.scrollTop;
        if (currentH + offH >= outH - 100 && this.canLoad) {
          console.log('加载数据');
          this.getData();
        }
      },
    }
  };
</script>

<style scoped lang="scss">
  .main {
    text-align: center;
    font-size: 30px;
  }

  .list {
    padding: 0 30px;
    border: 1px solid red;
    height: 300px;
    box-sizing: border-box;
    overflow-y: scroll;

    .item {
      height: 100px;

      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-right: 30px;
      }

      .name {

      }

      .status {
        text-align: right;
      }
    }
  }
</style>
```

### vue 滑动tab

```vue
<template>
  <div class="tab flex-center1">
    <div class="item flex-btn1" :class="{active:index===key}" v-for="(val,key) in tab" :key="key"
         @click="tabSel(key)">
      <p style="position: relative;z-index: 100;">{{val}}</p>  <!-- 文字再加一层p -->
      <!--{{val}}-->
    </div>
    <div class="bg flex-btn1" :class="{active:index===1}"></div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tab: ['房间收益', '家族收益'],
        index: 0,
      };
    },
    methods: {
      tabSel (key) {
        this.index = key;
      }
    }
  };
</script>

<style scoped lang="scss">
  .flex-center1 {
    display: flex;
    align-items: center;
  }

  .flex-btn1 {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: normal;
  }

  .tab {
    width: 360px;
    height: 64px;
    border-radius: 32px;
    margin: 30px auto;
    position: relative;
    background: #FFFFFF;

    .item {
      width: 180px;
      height: 64px;
      font-size: 28px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      border-radius: 32px;

      &.active {
        /*background: #FE973C;*/
        color: #FFFFFF;
      }
    }
  }

  // 移动层
  .bg {
    width: 180px;
    height: 64px;
    position: absolute;
    background: #FE973C;
    top: 0;
    left: 0;
    border-radius: 32px;
    color: #fff;
    z-index: 1;
    transition: .5s transform;

    &.active {
      transform: translateX(180px);
    }
  }
</style>

```

