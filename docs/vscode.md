## vscode

1. 自定义代码片段
    file- preference - user snippets 
    定义 js 就搜索 javascript.json,里面有规则
    - print to 后面填的是你这个代码块的名字 随便取 符合命名规则就行
    - prefix 冒号里填的是 在 Intellisense 中选择代码片段时将使用的前缀,即你要打出的快捷键
    - body 冒号后面填的是你要定义的代码段的完整代码
    - 美元$符号+数字代表光标位置 即你打出代码段后光标所在的位置
    - description 冒号后面填的是 这个代码段的描述 随便写就行
    
2. 历史记录 [不好用]
    local history

安装eslint插件(ctrl + p，输入ext install eslint安装)，此时编辑器就会eslint标红提示

### 实时格式化

```
利用编辑器
打开 xx/code/user/settings.json,
添加如下代码
	"editor.codeActionsOnSave": {
        "source.fixAll.eslint": true  // 自动保存
    },
    /* 关闭编辑器自带保存格式化功能，此功能会用Vetur进行格式化。*/
    "editor.formatOnSave": false

重启vscode,此时，按ctrl+s会自动格式化代码
```

