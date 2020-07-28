# 开发笔记

1. 使用会管家最初的模板
2. `rem`布局

### tip
1. 本地存储只能存字符串，存不了boolean

### js 
``` 
  // dom 更新后再滚动
 s.$nextTick(() => {  
    document.body.scrollTop = document.body.scrollHeight;
 })
  
   // dom 更新后再滚动
 s.$nextTick(() => { 
   let boxOut = document.querySelector(".overflow-style"),  // 固定高
   boxContent = document.querySelector(".js-allContent");   // 内容高
   boxOut.scrollTop = boxContent.offsetHeight - boxOut.offsetHeight;
 })
  
   // 解决ios返回白屏
 s.$nextTick(() => {    // 获取数据后，滚动两次，解决返回详情页白屏的问题
    window.scrollTo(0, 1)
    window.scrollTo(0, 0)
 })
 
 // 滚动插件
 import BScroll from 'better-scroll'
 
 
 // 微信扫一扫
 wxScan () {
   let s = this
   let obj = {
     Cmd: '10420',
     Body: {
       ShareUrl: window.location.href.replace(/#.*/, '')
     }
   }
   axiosPost({
     data: {
       RequestData: obj
     },
     onSuccess (res) {
       res = res.Body
       wx.config({
         debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
         appId: res.AppId, // 必填，企业号的唯一标识，此处填写企业号corpid
         timestamp: res.Timestamp, // 必填，生成签名的时间戳
         nonceStr: res.NonceStr, // 必填，生成签名的随机串
         signature: res.Signature,// 必填，签名，见附录1
         jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
       })
       wx.ready(function () {
         wx.scanQRCode({
           needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
           scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
           success: function (res) {
             var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
             s.checkTicketApi(result)
           }
         })
       })
     },
     onFailure (res) {
       console.log('接口10420', res.Message)
     }
   })
 },
 
   // 复制手机号码
   this.newPhone = this.newPhone.replace(/^(\+?86)/, '')  // 去掉 +86
   this.newPhone = this.newPhone.replace(/\s+/g, '') // 去掉 ios 空格
   console.log(this.newPhone.length)
   this.newPhone = this.newPhone.replace(/\D/g,'')   // ios 复制号码去掉前后非数字

    // 阻止图片默认事件   
   <img class="wx-share" src="../assets/img/326.jpg" alt="" @click.prevent>
   
   //vue时间插件 ios new Date('y-m-d 00：00') 加上小时、分钟会报错，默认08：00
   this.timeObj.startDate = new Date('2018-09-01')  // 日期插件使用当前日期
    ios   new Date('2019-07-01 00:00:00') 会报错
    new Date('2019-07-01') 默认是 new Date('2019-07-01 08:00:00')
    要再减去8个小时
    或者用  new Date('2019/07/01 00:00:00').getTime()

   // canvas 合并微信头像要加时间戳   
   this.userData.HeadImgUrl + "?v=" + new Date()   // 加时间戳解决。。
   
   // 百度统计 
   index.html
   //  _hmt代码
    var _hmt = _hmt || [];
     // window._hmt = _hmt
       (function() {
         var hm = document.createElement("script");
         hm.src = "https://hm.baidu.com/hm.js?3c187470b692e2d95f347970c5f35210";
         var s = document.getElementsByTagName("script")[0];
         s.parentNode.insertBefore(hm, s);
       })(); 
      
   js
     _hmt && _hmt.push(['_trackEvent', '分享', '点击']);   // 百度统计  点击事件   
   
    // 获取微信授权 code
     getWXCode () {
     let code='';
     if (!getRequestParameters().code) {
        const appid = 'wx41e662e96007e512',
        redirect_uri = encodeURIComponent(window.location.href.replace(/\?.*/, '')),
        scope = 'snsapi_userinfo'; // 不弹页面   snsapi_userinfo 弹页面
        /**
         *  静默授权  snsapi_base
         *  snsapi_userinfo 弹出授权页面， 如果用户已关注，也是静默授权不弹窗
         **/
        let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=' + scope + '#wechat_redirect';
        window.location.replace(url);
     }else{
        code=getRequestParameters().code;
     }
     return code;
     }
     
     //  @blur="gotoView"
     // 解决 ios 点击键盘完成后，点击事件无效
     gotoView (event) {
       let This = event.currentTarget;
       setTimeout(() => {
         This.scrollIntoView({
           block: 'end',
           behavior: 'smooth'
         });
       }, 500);
     },
           
     window.scrollTo(0, 0);  // 回到顶部
     
     // 滚动条顶部
     window.onbeforeunload = function () {
       document.documentElement.scrollTop = 0;  //ie下
       document.body.scrollTop = 0;  //非ie
     };
     
     // js 
     const arr = ['123','456','667']
     arr.map(Number);                 // [123,456,667]
     
     const arr2 = [1,2,[3,4],[5,6,7]]
     arr2.flat();                     // [1,2,3,4,5,6,7]
     
     var paramsString = "q=URLUtils.searchParams&topic=api";
     var searchParams = new URLSearchParams(paramsString);
     
     searchParams.get('topic')  // api 


```  

### 已备份会江项目
