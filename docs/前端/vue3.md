## vue3

### vue3/vue2区别
vue3根本不需要关心具体的 key，它去拦截的是 「修改 data 上的任意 key」 和 「读取 data 上的任意 key」

```
new Proxy(data, {
  get(key) { },
  set(key, value) { },
})
```
// Vue2 中，对于给定的 data，如 { count: 1 }，是需要根据具体的 key 也就是 count，去对「修改 data.count 」 和 「读取 data.count」进行拦截
```
Object.defineProperty(data, 'count', {
  get() {},
  set() {},
})
```

[记一次vue3.0技术分享会](https://segmentfault.com/a/1190000022719461)

### vue3入门

[vue3.0上手体验](https://www.cnblogs.com/wjaaron/p/12993385.html)

1. 在vue-cli4的基础上，`vue add vue-next`升级为vue3 beta
2. vue3 router vuex都为4.0
3. vue3用到啥引入啥，只打包用到的api
4. api可能会变，还是要等正式版上线
5. [vue3部分api](https://composition-api.vuejs.org/zh/)

#### demo

```vue
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{count}}</p>
    <button @click="add">+1</button>
    <p>{{double}}</p>
    <button @click="add2">+2</button>
    <p>{{state.num}}</p>
    <button @click="addNum">addNum</button>
  </div>
</template>
<script>
  import { ref, watch, computed, reactive } from 'vue';  // 手动引入。。

  export default {
    setup () {   // 全都要写在setup() 里
      // 1.ref声明响应式数据
      const count = ref(0);
      const add = () => count.value++;   // 使用xx.value来访问
      watch(   // 两个参数都是函数，第一个是返回要监听的值，第二个是回调函数
        () => count.value,
        (val, oldVal) => {
          console.log(`new val: ${val},old val:${oldVal}`);
        }
      );
      const double = computed(() => count.value * 2);

      // 2.reactive声明响应式数据
      const state = reactive({   // 这种也麻烦 显示要 {{state.num}}
        num: 3,
        age: 4,
      });
      // 两种方式都要返回
      return {
        count,
        add,
        double,
        add2: () => count.value += 2,
        state,
        addNum: () => state.num++    // 这里就不用.value
      };
    }
  };
</script>
```
### vue3 vite 

1. 直接运行vue文件，不用webpack打包，利用浏览器的 `<script type = 'module'>`
2. 利用koa
3. 热更新使用了webSocket   

[github](https://github.com/vitejs/vite)

#### demo

1. `npm init vite-app test` // 可直接运行，不用安装vite-app!
2. `yarn dev`

vite package.json  --2020-06-28
```json
{
  "name": "test0628",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "vue": "^3.0.0-beta.15"
  },
  "devDependencies": {
    "vite": "^1.0.0-beta.3",
    "@vue/compiler-sfc": "^3.0.0-beta.15"
  }
}
```

[vite1](https://segmentfault.com/a/1190000023009604)

### vue3最新源码

[vue-next](https://github.com/vuejs/vue-next)

