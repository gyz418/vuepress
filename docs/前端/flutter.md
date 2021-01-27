## flutter

## 2021-1

[flutter中文网](https://flutterchina.club/)

[电子书](https://book.flutterchina.club/)

### 环境配置

jdk [备用](https://github.com/AdoptOpenJDK/openjdk8-binaries/releases)    

```
// 百度网盘 rn 相关包
JAVA_HOME: F:\soft\jdk1.8.0_121
新增 path %JAVA_HOME%\bin;%JAVA_HOME%\jre\bin;
CLASSPATH .;JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar;
cmd:java 表示安装成功
```

下载sdk [备用](https://developer.android.com/studio#command-tools)  

```
// 百度网盘 rn 相关包 
安装installer_r24.3.4-windows.exe
1. 取消 android R 和  Android 10(API 29) 安装 
2. 先安装 tools文件夹下的 android sdk tools / android sdk platform-tools  / android sdk build-tools 和 extras文件夹下的  google usb driver
3. 再安装 android10(api 29)下的 SDK platform(最后没用上。。补安装28.0.3)
ANDROID_HOME： D:soft\android-sdk
新增path ;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools;
```

下载adb [备用]([https://dl.google.com/android/repository/platform-tools-latest-windows.zip](http://bit.ly/2tyUEo4))

```
// 百度网盘 rn 相关包
解压 platform-tools,放到android-sdk文件夹下，
新增path F:\soft\android-sdk\platform-tools   
cmd:  adb devices 查看连接的设置  手机连上电脑就有结果
```

下载flutter sdk  v1.22.5

```
flutter_console.bat 运行并启动**flutter命令行**
cmd : `flutter doctor` 检测安装
`flutter doctor --android-licenses` accept sdk licenses  这个不管
环境变量（用户变量）
PUB_HOSTED_URL：https://pub.flutter-io.cn
FLUTTER_STORAGE_BASE_URL：https://storage.flutter-io.cn
新增path:  F:\soft\flutter1.22.5\flutter\bin
```

### 运行

```
flutter create xx // 创建项目
flutter run  // 运行
// 需要安装 Android SDK build-tools 28.0.3
```

### dart

```
webstorm 根据提示配置 dark sdk : F:\soft\flutter1.22.5\flutter\bin\cache\dart-sdk
git/cmd 运行: dark a.dart
v2.10.4
语法要分号。。。
```

## flutter

### 快搜键

```
r Hot reload 只更新 build函数
R Hot restart 更新整 个app

ctrl+alt+b 查看所有抽象类的继承者
alt+enter 代码wrap   StatelessWidget 转 StateFulWidget
ctrl+o  生成overwrite函数(还是手写有代码补充)
ctrl+f12 源码的代码结构
ctrl+alt+m  抽离出方法
alt+insert 生成 toString()
```

生命周期

setState会重新执行build生命周期

## flutter doctor 没反应

f:\soft\flutter1.22.5\flutter\packages/flutter_tools/lib/src/version.dart

// 修改flutter git源

```
//String get _flutterGit => globals.platform.environment['FLUTTER_GIT_URL'] ?? 'https://github.com/flutter/flutter.git';
String get _flutterGit => globals.platform.environment['FLUTTER_GIT_URL'] ?? 'https://mirrors.tuna.tsinghua.edu.cn/flutter';
```

flutter1.22.5/flutter/bin/cache/lockfile

[flutter doctor 没反应](https://blog.csdn.net/QQ2856639881/article/details/109126184)

## 线程

dart单线程

flutter 多线程

```
UI Runner  GPU Runner  IO Runner Platform Runner
```

## 问题

1. 调试 dart devtools

2. API不熟

3. UI不熟

4. 原生操作不熟

5. 最大的坑，所有的特效，功能全部重新来一遍。。

6. `const int timeout = 5000;` 变量要写几个？一般好像写两个  const int dynamic var final  

7. ```dart
   main(){
     var p = Person('xiaoming',money: 20);
     print(p.money);
   }
   class Person{
     String name;
     final money;
   
     Person(this.name,{int money}):this.money = money ?? 10;  //具体什么时候用？
   }
   ```

8. flutter json转 model

   面向对象编程需要多这一步，js就直接循环显示了。

   

   

## 布局

1. 先来个container 再来row或 column
2. 每一块都套个container
3. 多写点函数
4. 各组件用sizedBox解决外边距
5. 列的垂直居中要包个container给个高度

## UI

### container

```dart
padding: EdgeInsets.all(8),
padding: EdgeInsets.fromLTRB(10, 5, 10, 5),   // 左  上右下
width:double.infinity,  // 宽100%
// 边框
decoration: BoxDecoration(
        border:Border(
          bottom:BorderSide(width: 10,color: Colors.pink),
        ),
		  borderRadius: BorderRadius.circular(3),  // 圆角
      ),
```

### color

```dart
color:Colors.red 
color:Color(0xff111111)
  Color.fromARGB(255,123,123,123)  //  argb的 a是啥？
```

### image

```dart
ClipRRect(  // 圆角
          borderRadius: BorderRadius.circular(8),
          child: Image.network(movie.icon,width: 50,))
```

### 间距

```dar
sizedBox(height:8)   
// margin
```

### icon

```dart
Icon(Icons.face),
```

### text

```dart
Text(movie.name,style: TextStyle(fontSize: 20),),
Text.rich(), // 自动换行  全用WidgetSpan 才可对齐  alignment: PlaceholderAlignment.middle
// 两行...
Text(
  '设计图转代码种子用户招募啦！',
  maxLines: 2,
  overflow: TextOverflow.ellipsis,
);
```

### flex:1

```
Expanded
```

统一高度

```dart
IntrinsicHeight   // 统一高度
```



## flutter 转json

https://javiercbk.github.io/json_to_dart/

或  **FlutterJsonBeanFactory**插件

## Dio

```
// 内部bug
SocketException: OS Error: Software caused connection abort, errno = 103, address = 192.168.3.92, port = 44857
```

