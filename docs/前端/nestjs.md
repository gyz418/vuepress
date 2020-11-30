## nestjs

## mysql

mysql-5.7.27-winx64.zip 免安装

[教程](https://www.cnblogs.com/rysinal/p/7565259.html)

## postman

chrome下载 postman rest client插件

192.168.3.87:3008/tigers   查询

controllers的注解是接口查询方式

## docker

[文档](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)

安装docker ce windows版本  20201023   Docker Engine  v19.03.13

### image

查看  `docker image ls `

获取 `docker imag pull library/hello-world`

运行 `docker container run hello-world`

创建 `docker image build -t node-express .`

### container 容器

docker container list --all

### .dockerignore  

```
.git
node_modules
```

### Dockerfile

```dockerfile
FROM node:12.16.3       // node版本 
COPY . /node-express    // 复制所有文件到  docker里的/node-express文件夹
WORKDIR /node-express   // 选择 node-express文件夹
RUN yarn                // yarn
EXPOSE 3000             // 暴露端口
```

```bash
# 生成容器
docker container run -p 8000:3000 -it node-express ../bin/bash
# 8000是可访问端口，3000是Dockerfile的端口， -it 项目映射  最后是启动bash ,路径可能需要调整
# 正常状态如下，可执行命令，如 npm start来运行项目
root@452fff0df368:/node-express# 
# ctrl + c 停止node服务
# ctrl + d 终止docker
```

修改完 Dockerfile 

1. 要创建image文件 `docker image build -t node-express .`

2. 生成容器 `docker container run --rm -p 8000:3000 -it node-express` 用完删除 --rm

### docker compose

[文档](http://www.ruanyifeng.com/blog/2018/02/docker-wordpress-tutorial.html)  docker-compose.yml

同时运行多个容器

启动多个容器 `docker-compose up `

关闭多个容器 `docker-compose stop`

删除 `docker-compose rm`

[docker 文档](http://www.dockerinfo.net/document)

