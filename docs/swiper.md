## swiper3

### 1.循环轮播点击事件

``` js
      recordSwiper () {
        this.$nextTick(() => {
          let s = this;
          this.mySwiper1 = new Swiper('.record-swiper', {
            autoplay: 3000,//可选选项，自动滑动
            direction: 'vertical',
            loop: true,
            slidesPerView: 3,
            observer: true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents: false,//修改swiper的父元素时，自动初始化swiper
            onSlideChangeEnd: function (swiper) {
              swiper.update();
              swiper.startAutoplay();    //重新自动播放
              swiper.reLoop();    // 重新循环
            },
            onClick (swiper) {
              // 获取自定义属性
              let index = swiper.clickedSlide.getAttribute('data-swiper-slide-index');
              // let index = swiper.clickedSlide.attributes[2].nodeValue;
              console.log(index);
              if (!index) return;
              s.showUserData(s.recordList[index].userId);
            }
          });

          // mySwiper.params.slidesPerView = 3;   // 修改 swiper 属性
          // mySwiper.params.autoplay=100;
        });
      },

```
### 2.轮播偏移

``` css
  &:nth-of-type(1) {
    margin-left: -50px; // 第一个 .swiper-slide偏移
  }
```
### 3.swiper禁止手动滑动

```
  只需要在最外层的容器上增加class="swiper-no-swiping"（在引入了swiper相关css的前提下）
```

### 4.滑到下一个轮播  

```js
mySwiper.slideNext(); 这个点击太快的话，会拼命地往后滑动
mySwiper.slideTo(num); // 滑动到指定轮播页面，解决点击太快的问题

```
### 5.tab切换时轮播暂停和继续

```js
this.mySwiper1 && this.mySwiper1.startAutoplay();
this.mySwiper1 && this.mySwiper1.stopAutoplay();
```
