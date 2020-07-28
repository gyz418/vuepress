## typescript

[官方文档不推荐](https://www.tslang.cn/index.html)

[TypeScript 入门教程](https://ts.xcatliu.com/)

[深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/)

> npm install -g typescript

### 编译成js文件

1. `tsc a.ts`
2. 添加配置文件`tsconfig.json`,运行`tsc`

```
tsconfig.json
{
    "compilerOptions": {
        "outDir": "./built",
        "allowJs": true,
        "target": "es5"
    },
    "include": [
        "./src/**/*"
    ]
}
```

1. `tsc --init` 生成 tsconfig.json
2. 打包文件改`webpack-dev-server`为`webpack`就可以了！
3. `tslint --init` 生成 tslint.json

### tslint

ts的 symbol功能 比es6少 ts可以不需要babel

\#class ts有修饰符 public protected private

[interface 和 type的区别](https://www.cnblogs.com/EnSnail/p/11233592.html)

> 项目要统一，优先用 interface

[ts高级类型 Pick](https://www.cnblogs.com/Grewer/p/10973744.html)

[你不知道的 TypeScript 泛型（万字长文，建议收藏）](https://segmentfault.com/a/1190000022993503)

[ts-namespace](https://www.runoob.com/typescript/ts-namespace.html)

17.装饰器没看 18.Mixin混入，没看

[tsconfig.json配置](https://www.tslang.cn/docs/handbook/tsconfig-json.html)

"declaration": true, // 生成x.d.js文件，写ts发npm包用，使用时有ts提示

### 声明文件

1. 为了写ts有提示。。
2. 安装声明文件 yarn add @types/xxx
3. 给条三方写声明文件
   - 打开tsconfig.js中的baseUrl 和path
   - 详见 typings文件夹

### ? !

1. 属性或参数中使用 ？：表示该属性或参数为可选项
2. 属性或参数中使用 ！：表示强制解析（告诉typescript编译器，这里一定有值），常用于vue-decorator中的@Prop
3. 变量后使用 ！：表示类型推断排除null、undefined

## 笔记在对应代码中