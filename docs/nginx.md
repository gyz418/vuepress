#nginx windows版1.17.10

[下载](http://nginx.org/en/download.html)

1. 解压后双击 nginx.exe 就启动nginx， 浏览器访问 localhost就有页面了

2. 常用命令
   - `start nginx` 启动 
   - `nginx -s reload` 热重启  
   - `nginx -s stop` 关闭
   - `nginx -s reopen`  重启nginx
   
3. [Nginx 从入门到实践，万字详解！](https://segmentfault.com/a/1190000022508020)
   
4. 修改nginx.conf
    ```
    server {
      listen       8800;   // 默认80端口，不改的话可直接浏览器访问  localhost，改端口就必须 localhost:8800
      server_name  localhost;
    
      #charset koi8-r;
    
      #access_log  logs/host.access.log  main;
    
      # 这5个暂时用不到
      #add_header 'Access-Control-Allow-Origin' *;   # 全局变量获得当前请求origin，带cookie的请求不支持*
      #add_header 'Access-Control-Allow-Credentials' 'true';    # 为 true 可带上 cookie
      #add_header 'Access-Control-Allow-Methods' *;  # 允许请求方法
      #add_header 'Access-Control-Allow-Headers' *;  # 允许请求的 header，可以为 *
      #add_header 'Access-Control-Expose-Headers' *;
        
      location / {                     // F:/test20190408/index.html 
          root   F:/test20190408;      // localhost访问的目录
          index  index.html index.htm; // localhost访问的目录下的index.html 
          #proxy_pass http://192.168.1.200:3000;  // 表示 localhost:8800 访问 localhost:3000
      }
      location ~ /apis/ {
                     # 这里重写了请求，将正则匹配中的第一个分组的path拼接到真正的请求后面，并用break停止后续匹配
                 #rewrite ^/apis/(.*)$ /$1 break;
                 proxy_pass http://192.168.1.200:3000;  // 跨域代理  前端接口访问时就用自己的端口号了。
          }         
    }
    ```
    // nginx.html
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Title</title>
    </head>
    <body>
    12343434
    <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
    <script>
      // 代理了之后，就用自己的端口号来访问接口
      $.get('http://localhost:80/apis/getData').then(res=>{
        console.log('res',res);
        document.body.append(res[0].name+res[0].id)
      }).catch(err=>{
        console.log('err', err);
      })
    
    </script>
    </body>
    </html>
    ```
5. 可以用vi 来打开编辑conf/nginx.conf

6. 简单请求
   - 请求方法是 HEAD、GET、POST 三种之一；
   - HTTP 头信息不超过右边着几个字段：Accept、Accept-Language、Content-Language、Last-Event-ID
   - Content-Type 只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain；
   
7. 非简单请求
   
   - 请求方法是 PUT 或 DELETE，或 Content-Type 值为 application/json。 发送一次 HTTP 预检 OPTIONS 请求
   
8. 非同源跨域
   ```html
    // 不同源的例子
    http://example.com/app1   # 协议不同
    https://example.com/app2
    
    http://example.com        # host 不同
    http://www.example.com
    http://myapp.example.com
    
    http://example.com        # 端口不同
    http://example.com:8080
   ```
   
9. 正向代理
   
   - 浏览器访问谷歌，通过代理服务器，正向代理隐藏了真实的客户端，为客户端收发请求，使真实客户端对服务器不可见；
10. 反向代理
   - 跨域请求 反向代理隐藏了真实的服务器，为服务器收发请求，使真实服务器对客户端不可见。
   - 跨域需要请求的是nginx的地址，nginx代理了真实服务器的地址   
11. 负载均衡
   - 将客户端请求分发到各个服务器上，这就是负载均衡，核心是「分摊压力」。Nginx 实现负载均衡，是指将请求转发给服务器集群。
12. 动静分离
   - 将动态资源和静态资源分开. nginx将静态资源部署在 Nginx 上.如果请求的是静态资源，直接到静态资源目录获取资源，如果是动态资源的请求，则利用反向代理的原理，把请求转发给对应后台应用去处理，从而实现动静分离。      
