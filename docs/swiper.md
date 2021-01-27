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
            slidesPerView: 3, // 显示3行，
//            slidesPerGroup：3, // 一次轮播3个  默认轮播一个
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

## vue-awesome-swiper4.x

跟swiper一起用的话，会冲突，项目必须2选1

不需要 new Swiper

```vue
<swiper class="record-swiper" :options="swiperOption">
	<swiper-slide class="content">1</swiper-slide>
  	<swiper-slide class="content">2</swiper-slide>
</swiper>
<script>
 import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'
    components:{
        Swiper,
      SwiperSlide,
    },
        data(){
            return{
                swiperOption:{
          autoplay: {
            delay: 2000,
            disableOnInteraction: false
          },
          direction: 'vertical',
          loop: true,
          slidesPerView: 2,
          slidesPerGroup: 4,
          observer: true,//修改swiper自己或子元素时，自动初始化swiper
          observeParents: false,//修改swiper的父元素时，自动初始化swiper
        } 
            }
        }
        
</script>
```

