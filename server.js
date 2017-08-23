const express=require('express');
const static=require('express-static');
const mysql=require('mysql');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const consolidate=require('consolidate');
const expressRoute=require('express-route');
const multer=require('multer');

const objMulter=multer({dest: './static/upload'});

var server=express();
server.listen(8000);

//请求数据
server.use(bodyParser.urlencoded());
server.use(objMulter.any());

//cookie session
server.use(cookieParser());
(function(){
  var keys=[];
  for(var i=0;i<10000;i++){
    keys[i]='a'+Math.random();
  }

  server.use(cookieSession({
    name:'sess_id',
    keys:keys,
    maxAge:20*60*1000
  }));
})();

//模板
server.engine('html',consolidate.ejs);
server.set('views','template');
server.set('view engine','html');

//route

server.use('/',require('./route/web/index.js')());
server.use('/admin/',require('./route/admin/index.js')());

//default static
server.use(express.static(__dirname+"/static/"))