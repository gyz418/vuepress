
## css

### 1.最简动画

```less
.mini-animation {
  animation: zoom 0.5s;
  @keyframes zoom { // 内容出来每次都加动画
    from {
      transform: scale(0.5); // 缩放
      opacity: 0.5;
    }
  }
}
```

### 2.上下移动动画

```less
.up-down-animation {
  animation: upDown 6s linear infinite reverse;
  @keyframes upDown {
    0% {
      transform: translateY(0px);
    }
    25% {
      transform: translateY(10px);
    }
    50% {
      transform: translateY(0px);
    }
    75% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
}
```

### 3.mask

```less
.mask-bg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  //opacity: .6;
  //background: #000;
  background: rgba(0, 0, 0, .6);
  z-index: 1000;
  @extend .flex-center;
  justify-content: center;
}
```

### 4.box-bg

```less
.box-bg {
  //background: url('../img/bg/box.png') no-repeat;
  width: 723px;
  height: 583px;
  background-size: 100% 100%;
  font-size: 30px;
  //margin: 494px auto 0;
  box-sizing: border-box;
}
```

### 5.旋转闪光

```less
.shine-light {
 // background-image: url('../img/bg-light.png');
  background-repeat: no-repeat;
  width: 277px;
  height: 279px;
  background-size: 100% 100%;
  position: absolute;
  top: -30px;
  left: -30px;
  right: 0;
  margin: 0 auto;
  z-index: 2;
  animation: 6s rotate linear infinite both;
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
```

### 6.光线移动

```less
.move-light {
  overflow: hidden;
  position: absolute;
  /*width: 175px;*/
  /*height: 255px;*/
  width: 185px;
  height: 210px;
  top: 3px;
  left: 15px;
  box-sizing: border-box;
  //border: 1px solid red;
  &:after {
    position: absolute;
    z-index: 22;
    left: -90%; /*改变left的值，让其相对box影藏*/
    top: 0;
    width: 30%;
    height: 100%;
    /*height: 90%;*/
    content: "";
    /* Safari 5.1 - 6.0 */
    //  rgba(224,152,234,1)
    background: -webkit-linear-gradient(left, rgba(255, 255, 255, 1) 0, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 1) 100%);
    background: linear-gradient(to right, rgba(255, 255, 255, 1) 0, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 1) 100%);

    transform: skewX(-40deg);
    animation: 1.5s linear light-animation infinite;
    //opacity: 0.08;
    opacity: 0.48;
    @keyframes light-animation {
      to {
        left: 150%;
      }

    }
  }
}
```

### 7.背景图 require backgroundImage

```vue
<div class="gift-border" :style="backgroundImage:`url(${require(`../../img/border/${val.type}.png`)})`}">
</div>
<div :style="{backgroundImage:'url('+val.bgImg+')'}"></div>
<div class="man-img" :style="{backgroundImage:`url(${val.id>todayId?al.img2:val.img})`}"></div>

```

### 8.img require

```vue
<img class="win-img" v-if="key<=2" :src="require(`../../img/rank/${key+1}.png`)" alt="">
<img v-if="key<4" :src="require(`../img/task/${val.isFinish?1:2}.png`)"/>

```

### 9.loading动画简洁版

```vue
  <div class="loading" v-if="isLoading">
    <div class="content"></div>
  </div>
```

```less
.loading {
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  z-index: 9999;
  @extend .flex-center;
  justify-content: center;
  .content {
    margin: 0 auto;
    z-index: 9999;
    display: inline-block;
    border: 10px solid rgba(0, 0, 0, 0.1);
    border-left-color: #7983ff; /* 这是重点*/
    border-radius: 50%;
    width: 130px;
    height: 130px;
    animation: donut-spin 1.2s linear infinite;
    @keyframes donut-spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
}
```

### 10.添加两个动画

```less
 .twoAnimation {
   animation: move_wave 1s linear infinite, height 1s ease;
 }
```

### 11.识别\n 并换行

```less
.wrap {
   white-space: pre-line; 
}
```

### 12.网站变灰代码

```less
// https://blog.csdn.net/sxyx2008/article/details/9354541
html {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  filter: grayscale(100%);
}
```

### 12.垂直居中 transform: translateX(-50%)

```html
<div class="box">
  <div class="content"></div>
</div>
```

```less
.box{
    width: 500px;
    height: 500px;
    border: 1px solid red;
    position: relative;
    .content{
      width: 200px;
      height: 200px;
      background: blue;
      transform: translateX(-50%) translateY(-50%);
      left:50%;
      top:50%;
      position: absolute;
    }
  }
```

### 13.星星闪烁

```
 <img class="shine-star" src="img/star.png" alt="">
```

```less
.shine-star {
  //border: 1px solid red;
  width: 210px;
  height: 116px;
  position: absolute;
  z-index: 200;
  top: 40px;
  left: 350px;
  animation: star 1s ease-in-out infinite;
  @-webkit-keyframes star {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
}
```

### 15.calc

```less
// calc里面要加减号要加空格
.a{
  height: calc(100vh - 434px)
}
```

### 16.放大缩小

```less
.play {
  width: 105px;
  height: 99px;
  animation: play 1s linear infinite;
  @-webkit-keyframes play {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
}
```

### 17.video

```vue
// playsinline
  webkit-playsinline   // ios video播放时不全屏
  x5-video-player-type="h5-page"   // 解决微信视频始终在最顶层问题
  
<video 
  playsinline
  webkit-playsinline
  controls
  x5-video-player-type="h5-page"  
  src="xx.mp4"
  ref="video1"
  />  
<script >
  function videoPlay(){
    let video = this.$refs[ref];
    video.currentTime = 0;
    video.play();
    video.onended = () => {
      this.isPlay = false;    // 播放结束回调
    };
     setTimeout(() => {
        this.fullScreen(video);
     }, 300);
     
  }
  //进入全屏
  function fullScreen (target) {
    if (target.requestFullscreen) {
      target.requestFullscreen();
    } else if (target.mozRequestFullScreen) {
      target.mozRequestFullScreen();
    } else if (target.webkitRequestFullScreen) {
      target.webkitRequestFullScreen();
    }
  }
</script>
```

### 18.css渐变文字

```vue
<div class="gardient-text">dfdf</div>
<style>
  .gardient-text{
    background: -webkit-linear-gradient(180deg, rgba(64, 26, 2, 1) 0%, rgba(153, 76, 11, 1) 100%);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
  }
</style>
// 有个坑就是渐变文字的按钮不能有背景图片，必须分成两个div,如下
<div class="bg">
  <div class="gardient-text">渐变文字</div>
</div>
```

### 19.point-event

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<style>
  .wrap {
    border: 1px solid red;
    width: 600px;
    height: 600px;
    position: relative;
  }

  .red {
    background: red;
    width: 300px;
    height: 300px;
    position: relative;
    z-index: 1;
  }

  .inner {
    position: absolute;
    background: blue;
    width: 400px;
    height: 400px;
    z-index: 100;
    left:0;
    top:0;
    pointer-events: none;    /* 挡在上面，点击穿透*/
  }
</style>
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
pointer-events 的值为 none 时，如果元素上绝对定位，那在它下一层的元素可以被选中。
<div class="wrap">
  <div class="red"></div>
  <div class="inner"></div>
</div>
<body>
<script>
  $('.red').click(function () {
    console.log('red');
  });
</script>
</body>
</html>
```

### 20.时钟字体 

clockicons.woff2， 可在html引入后，在浏览器的源元件查看字体内容

```vue
<style>
    @font-face {
      font-family: clockicons;
      src:url(clockicons.woff2)
    }
    body{
      font-family: clockicons,sans-serif;
    }
  </style>
  <body>
  12345
</body>
```

### 21.中文字体 抽取

```JS
// https://aotu.io/notes/2020/02/28/webfont-processing/
const Fontmin = require('fontmin');
const Promise = require('bluebird');

async function extractFontData (fontPath) {
  const fontmin = new Fontmin()
    .src('../file/kuhei.ttf')
    .use(Fontmin.glyph({
      text: '字体预览'
    }))
    .use(Fontmin.ttf2woff2())
    .dest('./dist');

  await Promise.promisify(fontmin.run, { context: fontmin })()
}
extractFontData()
```

### 22.vue的 :class动态绑定

```vue
 <!--    :class="'star'+val.level">-->
 <!--   :class="['count', `result-${item}`]"  -->
<div class="item" :class="[{'active':selArr.includes(key),'gray':val.total===0},'test'+key]" v-for="(val,key) in mergeData" :key="key"></div>
<div v-bind:class="[isActive ? activeClass : '']"></div>
还有以下几种 https://www.jianshu.com/p/45dbac5035e2
```

### 23.sass for

```SCSS
// sass for循环   一个div一个背景图
      @for $i from 1 through 4 {
        .four-#{$i} {
          background-image: url('../img/four/#{$i}.png');

          &.active {
            background-image: url('../img/four/#{$i}-active.png');
          }
        }
      }
      // 生成
      .four-1{
        background-image: url('../img/four/1.png');
        &.active{
          background-image: url('../img/four/1-active.png');
        }
      }
      .four-2{
        background-image: url('../img/four/2.png');
        &.active{
          background-image: url('../img/four/2-active.png');
        }
      }

     // sass each
     @each $btn,$num in (btn1:26px,btn2:370px,btn3:420px,btn4:410px,btn5:400px,btn6:405px){
      .#{$btn}{
        top: $num;
      }
      // 生成
      .btn1{
         top: 26px;
       }
       .btn2{
          top: 370px;
       }

    }
```

### 24.ios css:active无效

``` JS
// 给对应按钮绑定touchstart事件
this.$refs.btn.addEventListener('touchstart', function () {}, false); // 解决ios的 css:active无效问题
<div @touchstart="() => {}"> xxx </div>
```

### 25.background

```CSS
1. 简写是  background-position / background-size
background: url('../img/index2.png') bottom/100% no-repeat;
2. background-size:
  cover: 将背景图片等比例缩放到完全覆盖容器大小。 有可能背景图片大小会超出容器。
  contain：将背景图片等比例缩放到宽度或高度与容器相等的一边。背景图片一定会在里面， 不会超出。 但是有可能宽或高不够出现空白区域 
  
  https://www.cnblogs.com/yanggeng/p/11198516.html
  
.a{
  //background: url('../../img/bg/index2.png') center top/100% no-repeat;
  width: 750px;
} 
```

### 26.z-index

[z-index深入理解](https://www.cnblogs.com/benbendu/p/5811534.html)

1. 后来者居上
2. 祖先优先原则
3. 祖先后来者居上

### 27.两次动画

放前面执行两次动画，放后面执行一次

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <style>
    div{
      border: 1px solid red;
      width: 200px;
      height: 200px;
    }
    .a{
      transition: 2s width;
    }
    .a:hover{
      width:400px;
    }
    .b:hover{
      width:400px;
      transition: 2s width;
      color: #0f0;
    }
  </style>
</head>
<body>
<div class="a">transition放前面会执行两次动画</div>
<div class="b">transition放后面只执行一次动画</div>
</body>
</html>
```

### 多重背景

```css
.more-bg {
 background: url('../img/mainBg/1.png') no-repeat, url('../img/mainBg/2.png') no-repeat 0 936px,
  url('../img/mainBg/3.png') no-repeat 0 1770px;
 width: 100%;
 background-size: 100% 936px, 100% 835px, 100% 1187px;
 box-sizing: border-box;
}
```

### ios 点击去除阴影

```css
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
}
```

### flex

```css
flex-shrink: 0;    // 不缩小
```

### 长字母截断

```css
word-wrap:break-word; // 长字母截断
```

### 滚动条颜色

```less
.list{
    // 滚动条宽度
    &::-webkit-scrollbar {
        width: 6px;
    }

    // 滚动条颜色
    &::-webkit-scrollbar-thumb {
        background-color: #373B68;
    }
}
```

css3缺一角

```vue
<div class="bg cover"></div>
<style>

.bg{
  width: 120px;
  height: 80px;
  background: #58a;
} /* 下文元素都使用了此样式 */
    .cover{
position: relative;
}
.cover::before {
content: '';
width: 0;
height: 0;
position: absolute;
right: 0;
bottom: 0;
border: 5px solid #fff;
border-top-color: transparent;
border-left-color: transparent;
}
.cover::after{
content: '';
width: 0;
height: 0;
position: absolute;
left: 0;
top: 0;
border: 5px solid #fff;
border-bottom-color: transparent;
border-right-color: transparent;
}
</style>
//  参考：https://juejin.im/post/6844904024240586760
```

### 两端对齐

```css
text-align-last: justify;
width:200px;
```

## postcss

 Autoprefixer  前缀

cssnext   var() @apply()语法 太新

css-modules  react中才有

stylelint   样式的 eslint 

cssnano 又是压缩css ?

