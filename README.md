# node-news

## 基于Node.js及Vue.js的新闻网站
前台请求数据并使用Vue进行渲染新闻展示及用户评论，后台登录管理者模式对新闻及用户评价在数据库中进行增删改查
>![image text](https://github.com/gcxxd/node-news/raw/master/img/p1.jpg)
>![image text](https://github.com/gcxxd/node-news/raw/master/img/p2.jpg)
>![image text](https://github.com/gcxxd/node-news/raw/master/img/p3.jpg)
## 安装与运行

``` bash
# 安装依赖
npm install express express-static mysql consolidate body-parser cookie-parser cookie-session express-route multer

# 服务端运行访问localhost:8080
node server.js

# build for production and view the bundle analyzer report
npm run build --report
