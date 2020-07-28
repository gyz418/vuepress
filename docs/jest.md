## jest 
facebook的单元测试

### 入门

sum.js

```js
function sum (a,b) {
  return a+b;
}
module.exports=sum;
```

sum.test.js

```js
const sum = require('./sum');
describe('测试组',()=>{         // 这个可省略
  test('1+1=2',()=>{
    expect(sum(1,2)).toBe(3)
  })
})
```

package.json

```json
{
  "name": "jest",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "jest"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "jest": "^26.0.1"
  }
}
```

npm run test

### 代码提交前执行单元测试

package.json  // npm install husky --save-dev

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test",
      "pre-push": "npm test",
    }
  }
}
```

### vue单元测试

利用vue cli4 使用jest进行vue单元测试

test.vue

```vue
<template>
  <div>
    <span>{{msg}}</span>
    <button @click="add">btn</button>
    <hr>
    <input type="text" v-model="text" @keyup.enter="addList">
    <div class="list">
      <div class="item" v-for="(val,key) in list" :key="key">
         {{val}}
      </div>
    </div>
    <hr>
    <p @click="getData">axios</p>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        msg:'hello',
        text:'',
        list:[]
      };
    },
    methods: {
      add(){
        this.msg='world'
      },
      addList(){
        this.list.push(this.text)
        this.text=''
      },
      getData(){
        return axios.get('/abc').then(res=>{
          console.log('res',res);
          return res;
        }).catch(err=>{
          console.log('err', err);
        })
      }
    }
  };
</script>
```

test.spec.js

```js
/*
* e2e端到端测试，黑盒测试，是UI为主。测试人员不知道代码，只看到浏览器，由于需求经常变，只写核心、重点
* 打开cypress浏览器来测试   tests/e2e/specs/test.js
* */
/*
* unit 单元测试
* 写一堆单元测试，反过来来完善代码，解决各种bug
* 官方有教程 用 jest https://vue-test-utils.vuejs.org/zh/
* */
// test.vue 测试
/*
  package.json
  "jest": {
  "preset": "@vue/cli-plugin-unit-jest",
  "collectCoverage": true  // 添加测试报告,会生成coverage文件夹，里面的index.html
  }
}*/
import Vue from 'vue';
import test from '@/components/test.vue';
import { mount,shallowMount,createLocalVue } from '@vue/test-utils';
import axios from 'axios';

// jest 拦截axios
jest.mock('axios')

// vue test
describe('vue test', () => {
  it('测试生命周期created', () => {
    expect(typeof test.created).toBe('function');
  });
  it('测试data中的数据', () => {
    let vm = new Vue(test).$mount();
    expect(vm.msg).toBe('hello');
  });
  it('点击', () => {
    let wrapper = mount(test);  // yarn add @vue/test-utils -D
    // jq语法
    wrapper.find('button').trigger('click');  // 找到按钮并点击
    expect(wrapper.vm.msg).toBe('world');
  });
});

// axios 不完整
/*const localVue = createLocalVue()
localVue.prototype.$axios= axios
describe('axios test',()=>{
  let wrapper;
  beforeEach(()=>{
    axios.mockClear()
    wrapper=shallowMount(test,{
      localVue,
      stubs:['p']
    })
  })
  afterEach(()=>{
    wrapper.destroy()
  })
  it('axios test',()=>{
    wrapper.vm.getData().then(res=>{
    })
  })
})*/

/*  <input type="text" id= v-model="text" @keyup.enter="addList"> */
describe('input test',()=>{
  it('输入框测试',()=>{
    const wrap = shallowMount(test)
    wrap.find('input').setValue('haha')
    expect(wrap.vm.text).toBe('haha')
  })
  it('回车测试',()=>{
    const wrap = shallowMount(test)
    const len = wrap.vm.list.length;
    const input = wrap.find('input')
    input.setValue('横说竖说')
    input.trigger('keyup.enter')
    expect(wrap.vm.list.length).toBe(length+1)
    expect(wrap.vm.text).toBe('')
  })
})
```

