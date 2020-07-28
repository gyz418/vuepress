## git

### git stash

git stash 把代码暂时保存，不提交，

gip stash pop 把保存的代码取出来

### git大小写问题

Git 忽略文件名大小写，因此上传的文件夹如果大小写有问题，本地改动是无法提交的

git config core.ignorecase false

### git url

 - https://github.com/gyz418/gyz418.github.io.git
 - https://github.com/gyz418/test.git

### 安装git

1. 安装时 取消Enable Git Credential Manager，该工具默认缓存git账号和密码 取消后方便切换用户
2. git credential-manager remove 停止使用管理工具
3. git credential-manager delete 清除保存的密码
4. git --version

### 开始
创建本地仓库 (工作区-> 暂存区-> 版本库)

1. 桌面-> git bash here
2. mkdir mygit
3. git init 初始化
4. ls -a 查看隐藏文件
5. clear 清屏
6. git status
7. git add x.js 添加文件到缓存区
8. git commit -m “注释” 缓存区提交到版本库
   - git commit -a -m '注释' 修改过的文件才能同时加缓存区并提交到版本库，新文件不行，要先git add
>以上是本地仓库，最终要提交到远程仓库,才能共享; 方法是需要添加远程仓库再推送等，比较麻烦

>一般是拉远程仓库的代码下来 git clone xx.git

### 拉代码
git clone xx.git

###设置git用户的名称和邮箱
会在电脑上当前用户的路径生成 C:\Users\Administrator.gitconfig

 - git config –global user.name “Your Name”

 - git config –global user.email “email@example.com“ github上收邮件用

### 查看当前用户
git config –global user.name

###查看所有配置
git config –list

###git 工作区、暂存区、版本库

- 工作区：开发区
- 暂存区（比svn多出来一个暂存区）
- 版本库

### 注释

1. untracked files 未跟踪的文件（新文件、工作区文件）
2. changes to be committed 暂存区的文件
3. changes not staged for commit 工作区文件

### git 命令
git status 查看当前文件状态

###git 添加 提交

 - git add x.js 添加文件到缓存区
 - git add . 添加所有文件到缓存区
 - git commit -m “注释” 提交到版本库
 - git commit -a -m “注释” 直接把修改的文件提交到工作区（ -a 是 add 的简写）

### git 记录

- git log 查看提交记录（最新记录在最上面） 如果记录太多 可以按 回车键查看其他记录 退出 按 Q
- gitk 以图形界面显示提交记录

### git 文件对比

- git diff 查看工作区和暂存区的对比，用绿色显示出来（用处不大）
- git diff -cached（–stage） 暂存区和版本库的对比
- git diff master 工作区与版本库的差异 （用处不大）

### git 代码撤消

- git reset HEAD a.js 把暂存区的代码撤回工作区（在webstorm看不出任何差别）
- git checkout a.js 撤消工作区的代码，跟版本库代码一致（webstorm 撤消文件的修改 Verson Control-> Default a.js — Revert）
- git commit -m “xx” –amend

  - 1.撤消上一次的版本库提交，变成两个分支 要 git pull 合并远程代码到自己的版本 再 git push 推送到远程
  - 2.代码没改动时，修改提交的注释
  

### git 重新提交

1. 撤销上次提交git reset --soft HEAD~1，代码会保留   git reset --hard HEAD~1 代码不保留
2. git push origin master --force(需要输入git账号密码) 代码撤回后，再推送远程，之前的提交记录就没了，
3. 改完代码再正常提交

### git 删除

- git rm -f a.txt 删除工作区文件、暂存区文件
- git rm –cached a.txt 保留本地文件、删除工作区、暂存区文件（类似文件撤消 Revert）
- 删除版本库的文件，产生暂存区 要提交后才能真正的删除 git rm xx
- 把暂存区文件退回工作区 git rm –cached xx
- 工作区的新文件只能手动删除。。

### git 撤回老版本

> 撤回老版本后，又可以再撤回新版本
- git reset –hard HEAD^ 撤回上个版本
- git reset –hard 版本id 版本id 从 git log 中获取，可只获取一小段id 没啥用
- git reflog 操作记录

1. 假设已有版本10，撤回版本6：git reset –hard 版本6，
2. 想回到版本10，可git pull,也可git reset –hard 版本10， 版本10的id从 git reflog中找

- git remote -v 查看 git地址
- git push origin master 同步远程仓库。。多了这一块，其他人才能看到最新代码

### git 代码合并
远程仓库：origin/master

- git fetch 拉代码 手动合并
- git diff master origin/master 红色是本地的，绿色是原程的
- git merge origin/master 合并冲突文件，要本地手动修改代码 先显示本地，再显示远程的
- git pull 拉代码自动合并（上面三步简成一步，都要手动解决冲突）
- git commit -a -m ‘xxx’ 再提交
- git push 推送远程

### git 分支

- git branch 查看分支
- git branch 2.0 新建分支
- git checkout 2.0 切换分支
- git checkout -b 3.0 新建并切换分支
- git merge 2.0 在master分支的基础上，把2.0分支合并过来（还没git push）
- git branch -d 2.0 合并后，把2.0删除
  - git branch -D 3.0 强制删除未合并分支
- git branch –merged 在master分支上 查看合并的分支
- git branch –no-merged 在master分支上 查看没合并的分支

### 合并冲突分支
git merge 4.0 在 master分支上 直接合并分支 再手动修改

### 提交分支
git push origin 5.0

### git 标签

- git tag 1.0
- git push origin 1.0 github 生成 release版本

###git 在线文档
[git文档](http://git.oschina.net/progit/)

百度搜索“git教程” 有一个廖雪峰的git

[廖雪峰git](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)

[阮一峰git](http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)

### git-bash

- pwd 当前路径
- ls
  - ls -a 查看隐藏文件
- clear 清屏
- rmdir 只能删除空目录
- rm
  - rm 文件名
  - rm -rf 目录名 删除非空目录
- cd .. 后退(有空格)
- touch a.html 创建文件
- vi a.html 打开文件

### vi 操作
git-bash有些bug，建议虚拟机装linux系统用vi的增强版 vim

- i 编辑状态
- esc 退出编辑
- :wq 保存退出
  - :q! 强制退出不保存修改
  - :q 退出vi
  - :w 保存编辑
- cat：查看文件
- less：查看大文本文件 按 q 退出 空格 翻页 b 上一页 git log 会自动进入less模式
- dd 剪切行
- p 粘贴行

[git分支管理策略](http://www.ruanyifeng.com/blog/2012/07/git.html)

[Git 工作流程](http://www.ruanyifeng.com/blog/2015/12/git-workflow.html)

### git flow

> 工作流 长期 master、develop两分支

> 一般由项目经理、技术经理处理，多人开发才用到
- 只有一个master分支
- 开发时创建 develop 分支，最后要合并到master分支再发布 git merge --no-ff develop
- 临时分支 多人合作时创建，最后合并到master分支，再删除
  - feature-login 功能分支
  - release-1.1 预发布分支
  - fixbug-bugname bug分支
    

### github flow
只有一个master分支， 开源项目

### gitlab flow

1. 只有一个master开发分支，
2. 创建预发布分支pre-production，由master推送到pre-production
3. 创建生产分支production，由预发布推送到生产

###gitlab

1. gitlab 是开源的类似github的系统，开源免费部署到自己的公司内容，需要安装到Linux
2. 码云是第三方的

###github
new repository 添加一个仓库

###github 创建个人博客
创建时,名字跟gitHub用户名一样 gyz418.github.io

###github 设置别名
git config –global alias.co checkout git co 2.0 => git checkout 2.0

### hexo 博客框架

1. yarn global add hexo-cli 全局安装
2. hexo init blog 初始化
3. hexo server 本地服务 http://localhost:4000
4. hexo new git 创建md文件
5. 发布代码
   - _config.yml 配置 git, repo: https://github.com/gyz418/gyz418.github.io.git 加上用户名 密码
   - npm install hexo-deployer-git --save
   - hexo deploy --generate 发布代码
6. 更换主题：官网 或 github: hexo theme
   - cd themes/git clone https://github.com/iissnan/hexo-theme-next.git –depth=1
   - –depth=1 表示只下载最新代码，不要历史记录版本

### webstorm

1. webstorm会提示是否添加新文件到git,即Verson control中的 default 代表了git的暂存区 git add xxx，
2. unversioned files 即未处理。修改的文件默认属于工作区，但webstorm把它添加到了暂存区

webstorm 分支
- 黄色是 HEAD 代表当前所处的位置，
- 绿色是各个分支
- 紫色是远程分支 origin/master

git修改远程仓库
- git remote set-url origin xxx.git

webstorm拉代码 ctrl+t 会自动化命令执行 git stash \ git pull \ git stash pop三连招

### gyz418.github.io

github主页，可以删掉重新创建，只要仓库名是gyz418.github.io就可以了

### vuepress

vuepress 发布到github主页 Permission denied (publickey)

```text
cat ~/.ssh/id_rsa.pub   # 查看ssh key，如果有key，会输出
ssh-keygen -t rsa # 生成ssh key
打开github  网站的"account settings" 依次点击"Setting -> SSH Keys"->"New SSH key", 添加ssh key
发布到github: . deploy.sh
```

[文档](https://www.zhihu.com/question/21402411)