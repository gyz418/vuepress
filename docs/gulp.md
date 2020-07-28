#gulp4

[gulp4.0入门指南](https://segmentfault.com/a/1190000019495629)

[gulp](https://www.cnblogs.com/gyz418/p/6056729.html)

> 全局安装 `npm i gulp-cli -g`

> 项目安装 `npm i gulp -D`

> `gulp -v`: 
```text
cli version:2.2.1 
local version 4.0.2 
```

1. 利用gulp转换sass为.wxss
```js
// guipfile.js
const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');

// 嵌套输出方式 nested
// 展开输出方式 expanded
// 紧凑输出方式 compact
// 压缩输出方式 compressed
gulp.task('sass', () => {
  // 记得return，否者会卡在这个地方，无法执行下一次监听的回调
  return gulp.src('./scss/**/*.scss', {'base': ''})
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(rename({
      // dirname: "main/text/ciao",
      // basename: "aloha",
      // prefix: "bonjour-",
      // suffix: "-hola",
      extname: '.wxss'
    }))
    .pipe(gulp.dest('css'));
});

gulp.task('watch', function () {
  gulp.watch('./scss/**/*.scss', gulp.parallel('sass'));
});

// 1. npm i -D gulp-rename gulp-sass
// 2. 运行 gulp watch

```

