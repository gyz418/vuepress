## webstorm

### 修改LF 格式

```
settings-editor-code style line separator, 选择 unix and os x (\n)
```

[文档](https://blog.csdn.net/qq_34035425/article/details/83038599)

### 格式化

[保存自动格式化](https://juejin.im/post/6844903950441791501)

### webstorm激活码

> 2020-5-8

[教程](https://www.jianshu.com/p/133af2e4fe3f)

永久激活方式：使用已下载的激活文件就好(教程里下载的jar包 2019.3.4)`../file/jebrains-agent-latest.zip`

#other
1. 设置 搜索 html attribute ：  unknown html tag attribute  添加一些react 或 vue的属性到这，可取消编辑器报错、警告等

### 快捷键

快捷键文档
https://wiki.jikexueyuan.com/project/intellij-idea-tutorial/keymap-introduce.html
```
ctrl + w    选中代码块
Ctrl + E	显示最近打开的文件记录列表 （必备）
Ctrl + P	方法参数提示显示 （必备）
Ctrl + Q	光标所在的变量 / 类名 / 方法名等上面（也可以在提示补充的时候按），显示文档内容
Ctrl + B	进入光标所在的方法/变量的接口或是定义处，等效于 Ctrl + 左键单击 （必备）
Ctrl + H	显示当前类的层次结构
Ctrl + Delete	删除光标后面的单词或是中文句 （必备）
Ctrl + 左方向键	光标跳转到当前单词 / 中文句的左侧开头位置 （必备）
Ctrl + 右方向键	光标跳转到当前单词 / 中文句的右侧开头位置 （必备）


Alt + `|显示版本控制常用操作菜单弹出层 （必备）
Alt + Home	定位 / 显示到当前文件的 Navigation Bar
Alt + Enter	IntelliJ IDEA 根据光标所在问题，提供快速修复选择，光标放在的位置不同提示的结果也不同 （必备）
Alt + 左右方向键	切换当前已打开的窗口中的子视图，比如Debug窗口中有Output、Debugger等子视图，用此快捷键就可以在子视图中切换 （必备）
Alt + 前后方向键	当前光标跳转到当前文件的前一个方法名位置 （必备）

Shift + F2	跳转到上一个高亮错误 或 警告位置
Shift + F4	对当前打开的文件，使用新Windows窗口打开，旧窗口保留
Shift + Tab	取消缩进 （必备）
Shift + End/home	选中光标到当前行尾位置


Ctrl + Alt + T	对选中的代码弹出环绕选项弹出层 （必备）
Ctrl + Alt + F7	显示使用的地方。寻找被该类或是变量被调用的地方，用弹出框的方式找出来
Ctrl + Alt + 左右方向键	退回到上一个操作的地方 （必备）
Ctrl + Alt + 右括号（[]）	在打开多个项目的情况下，切换下一个项目窗口

Ctrl + Shift + R	根据输入内容替换对应内容，范围为整个项目 或 指定目录内文件 （必备）
Ctrl + Shift + J	自动将下一行合并到当前行末尾 （必备）
Ctrl + Shift + N	通过文件名定位 / 打开文件 / 目录，打开目录需要在输入的内容后面多加一个正斜杠 （必备）
Ctrl + Shift + U	对选中的代码进行大 / 小写轮流转换 （必备）
Ctrl + Shift + C	复制当前文件磁盘路径到剪贴板 （必备）
Ctrl + Shift + V	弹出缓存的最近拷贝的内容管理器弹出层
Ctrl + Shift + B	跳转到类型声明处 （必备）
Ctrl + Shift + I	快速查看光标所在的方法 或 类的定义
Ctrl + Shift + []	选中从光标所在位置到它的顶部中括号位置 （必备）
Ctrl + Shift +-	展开所有代码 （必备）
Ctrl + Shift + 1,2,3...9	快速添加指定数值的书签 （必备）
Ctrl + Shift + 左方向键	在代码文件上，光标跳转到当前单词 / 中文句的左侧开头位置，同时选中该单词 / 中文句 （必备）
Ctrl + Shift + 前方向键	光标放在方法名上，将方法移动到上一个方法前面，调整方法排序 （必备）

F4	编辑源 （必备）
F11	添加书签 （必备）
ESC	从工具窗口进入代码文件窗口 （必备）




打开文件  ctrl+shift+n 
打开同级文件 alt +home 

文件切换   alt+ 左右箭头
写代码  ESC 

文件快速浏览  alt+上下箭头

找函数  ctrl+b 
快速移动行光标  ctrl+左右箭头
选择 ctrl+w 




ctrl+e 打开过的文件
ctrl+p 参数提示
alt+enter  代码警告时优化处理
ctrl+shift+v 最近的剪切版
大窗口切换 ctrl+alt + 左右【】
shift+f4 新窗口
ctrl+shift+j 把后面的代码合并到当行

F2跳转到下一个高亮错误 或 警告位置  
Shift + F2	跳转到上一个高亮错误 或 警告位置  
ctrl+f1 查看错误提示 具体位置：`keymap->main menu->view->error description`
```

### namespace 'v-lazy' is not bound

```
file-settings-inspections-xml-> unbound XML namespace prefix 去掉
```

### alias路径

项目添加一个alias.config.js,【为了保证路径正确，保存在项目alias.js所有目录下】，并进行如下格式改写，以提供给webstorm识别路径用

```nodejs
module.exports = {
  resolve: {
    alias: {
      @:xxx
    }
  }
}  
```

接着，在`settings->language & frameworks -> webpack -> `选择以上 alias.config.js的路径

[参考](https://juejin.cn/post/6844903802185891848)

