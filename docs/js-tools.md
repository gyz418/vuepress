## js-tools

### remainTime

```js

/**
 * 剩余时间
 * @param val 与当前时间戳的差值，单位为秒
 * @returns {string}
 */
export function remainTime (val) {
  let d, h, m, s;
  d = parseInt(val / (24 * 3600));
  h = parseInt((val - d * 24 * 3600) / 3600);
  m = parseInt((val - d * 24 * 3600 - h * 3600) / 60);  // 分钟
  s = val - d * 24 * 3600 - h * 3600 - m * 60;
  return {
    // d, h, m, s
    d: d >= 10 ? d : '0' + d,
    h: h >= 10 ? h : '0' + h,
    m: m >= 10 ? m : '0' + m,
    s: s >= 10 ? s : '0' + s
  };
}

/**
  * 时间格式化
  * @param date 时间戳
  * @param isInt 是否返回整数，默认返回字符串  yyyy-mm-dd hh:mm:ss
  * @returns {{d: string, h: any | number, y: number, m: string, minute: any | number, second: any | number}}
  */
export function formatDateObj (date, isInt) {
 date = !date ? new Date() : new Date(date);
 let y = date.getFullYear();
 let m = date.getMonth() + 1;
 m = m < 10 ? ('0' + m) : m;
 let d = date.getDate();
 d = d < 10 ? ('0' + d) : d;
 let h = date.getHours();
 h = h < 10 ? ('0' + h) : h;
 let minute = date.getMinutes();
 let second = date.getSeconds();
 minute = minute < 10 ? ('0' + minute) : minute;
 second = second < 10 ? ('0' + second) : second;
 return {
   y,
   m: isInt ? +m : m,
   d: isInt ? +d : d,
   h: isInt ? +h : h,
   minute: isInt ? +minute : minute,
   second: isInt ? +second : second,
 };
}
 
 /**
  * 获取url参数 返回一个对象
  * @returns {{}}
  */
export function getRequestParameters () {
 let url = window.location.href;
 let obj = {};
 let index = url.lastIndexOf('?');
 if (index === -1) return {};
 url = url.substr(index + 1);
 let arr = url.split('&');
 for (let i = 0; i < arr.length; i++) {
   let b = arr[i].indexOf('=');
   obj[arr[i].substr(0, b).toLocaleLowerCase()] = arr[i].substr(b + 1); // 把地址栏参数名转成小写
 }
 return obj;
}


```
