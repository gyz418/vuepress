## js特效

### 1.html2canvas

``` vue
// 截图部分
<div class="pic-page" ref="picPage">
  <p>小猫钓鱼</p>
  <img src="../img/1.png" alt="">
  <img src="../img/qrcode.png" alt="">
  <p>长按保存</p>
</div>
    
// 生成图片
  createImg () {
    let $pic = this.$refs.picPage,
      $picW=$pic.offsetWidth,
      $picH=$pic.offsetHeight;
    return new Promise((resolve, reject) => {
      let s = this;
      setTimeout(() => {
        html2canvas(this.$refs.picPage, {
          allowTaint: false, // 跨域
          useCORS: true,
        }).then(function (canvas) {
          var canvas2 = document.createElement('canvas');
          var context = canvas2.getContext('2d');
          canvas2.width = $picW;
          canvas2.height = $picH;
          context.drawImage(canvas, 0, 0, $picW, $picH);

          // s.newImg = canvas2.toDataURL('image/jpeg', 0.7).replace('data:image/jpeg;base64,', '');
          s.newImg = canvas2.toDataURL('image/jpeg', 0.7)
          resolve(s.newImg);
        }).catch(err => {
          console.log('canvas生成图片失败', err);
        });
      }, 0);
    });
  },
```
### 2.无限轮播

```vue
<template>
  <div class="scroll">
    <ul>
      <li v-for="(val,key) in list" :key="key">
        <img :src="val.img" alt="">
        <p>{{val.name}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      list: {
        type: Array
      }
    },
    methods: {
      /**
       * 轮播
       */
      initSwiper () {
        let oDiv = document.querySelector('.scroll');
        let oUl = oDiv.getElementsByTagName('ul')[0];
        let aLi = oDiv.getElementsByTagName('li');
        let speed = -1;
        let timer = null;
        let isTouch = false;
        let touchStartX = 0;
        let touchEndX = 0;
        let num = 0;
        oUl.innerHTML += oUl.innerHTML;
        oUl.style.width = aLi[0].offsetWidth * aLi.length + 'px';

        // const wWidth = $('.scroll').width();
        const wWidth = oDiv.offsetWidth
        console.log('width2222',wWidth);
        const oUlWidth = parseInt(oUl.style.width);
        console.log('width',oUlWidth);
        timer = setInterval(function () {
          oUl.style.left = oUl.offsetLeft + speed + 'px';
          if (oUl.offsetLeft < -oUl.offsetWidth / 2) {
            oUl.style.left = '0';
          } else if (oUl.offsetLeft > 0) {
            oUl.style.left = -oUl.offsetWidth / 2 + 'px';
          }
        }, 30);
        oUl.addEventListener(
          'touchstart',
          e => {
            clearInterval(timer);
            isTouch = true;
            touchStartX = e.touches[0].pageX;
          },
          false
        );
        oUl.addEventListener(
          'touchmove',
          e => {
            touchEndX = e.touches[0].pageX;
            let diff = touchEndX - touchStartX;
            touchStartX = touchEndX;
            num = diff + parseInt(oUl.style.left);
            num >= 0 && (num = num - oUlWidth / 2);
            num <= -oUlWidth + wWidth && (num = -oUlWidth + wWidth);
            oUl.style.left = `${Math.floor(num)}px`;
          },
          false
        );
        oUl.addEventListener(
          'touchend',
          () => {
            timer = setInterval(function () {
              oUl.style.left = parseInt(oUl.style.left) + speed + 'px';
              if (oUl.offsetLeft <= -oUl.offsetWidth / 2) {
                if (parseInt(oUl.style.left) > -wWidth - oUl.offsetWidth) {
                  oUl.style.left = isTouch
                    ? -oUl.offsetWidth / 2 + wWidth
                    : (parseInt(oUl.style.left) +
                    oUl.offsetWidth / 2) +
                    'px';
                } else {
                  oUl.style.left = oUl.offsetLeft + oUl.offsetWidth / 2 + 'px';
                }
              } else if (oUl.offsetLeft > 0) {
                oUl.style.left = -oUl.offsetWidth / 2 + 'px';
              }
            }, 30);
            isTouch = false;
          },
          false
        );
      }

    }
  };

</script>
<style lang="scss" scoped>
  .scroll {
    overflow: hidden;
    width: 640px;
    position: relative;
    height: 200px;

    ul {
      position: absolute;
      height: 200px;
      display: flex;

      li {
        width: 212px;
        height: 100%;
        text-align: center;
        list-style: none;

        img {
          width: 200px;
          height: 140px;
        }
      }
    }
  }
</style>
```
