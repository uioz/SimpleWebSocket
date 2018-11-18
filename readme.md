# 简介

本项目是一个聊天服务器的基本实现,基于Node使用TypeScript进行编写.

使用了ws模块建立的服务端.

实现了几个聊天的基本功能:
 - 群组功能
 - 广播
 - 上线下线提醒
 - 重复名称提醒
 - 服务端签名验证
 - 用户消息签名验证

另外提供了封装好的客户端可以快速的测试和应用:
 - 命令版本
 - 浏览器环境测试版本
 - Vue可视化版本

![Image text](https://github.com/uioz/socketteach/blob/master/static/screenshot.jpg)

提供一以下的基本功能:
 - 切换群组
 - 发送消息
 - 切换昵称
 - 事件
   - 登录
   - 请求错误
   - 错误
   - 消息
   - 关闭


## 目录结构

**注意**:只提及一些关键文件
```
+- socketteach  
    +- dist TypeScript编译后输出的js
       +- src 编译后的js目录
          +- server.js 服务器 npm server 执行的就是它
          +- socketPackage 客户端包装类 所有的客户端依赖他
       +- test 编译后的js目录
          +- client.js 命令行客户端 npm client 执行的就是它
    +- src 存放TypeScript的目录  
    +- static 存放Vue客户端依赖的内容
    +- test  
       +- client.html 浏览器客户端 简易版本
       +- clientTest.ts 命令行客户端
    +- index.html Vue制作的客户端
```

## 安装

```
git clone https://github.com/uioz/SimpleWebSocket

cd SimpleWebSocket

npm install
```

## 运行(服务端)

例子:
```
npm run server helloworld
```

__服务器启动的时候可以按照下面的顺序传入参数:__
 - 端口号
 - 服务器群组(多个)
 - 服务器签名

其中端口号和群组有默认值:
 - 端口号 8888
 - 群组 ['defaultGroup']

**注意**:默认必须传入一个参数就是服务器签名上例中`helloworld`就是服务器签名.

例子-指定端口号:
```
npm run server 8888 helloworld
```

例子-指定多个群组且指定端口号:
```
npm run server 8888 group1 group2 group3 helloworld
```

## 运行(客户端)

例子(命令行版本):
```
npm run client helloworld
```
这个例子中的`helloworld`要求和服务器的初始签名一致.

接下来就是命令行交互了,这部分写的不好,多使用tab进行补全,命令是先回车后输入的.

提供了几个小功能:
 - connect 连接(使用默认值)/更换名称/更换群组
 - close 关闭连接
 - broadCast 发送消息

例子(浏览器版本):

这个就是一个运行在浏览器中DEMO而已,只提供了输入参数的input,执行方法测试需要在控制台中完成.

你可以利用他来测试在浏览器中工作是否正常.

## 使用Vue创建的可视化客户端

一个超简易的Vue可视化客户端,运行index.html就可以使用.

需要注意的是,在连接远程服务器的时候需要修改url,该url位置在`/static/main.js`的最后.

ps:没有使用构建工具.








