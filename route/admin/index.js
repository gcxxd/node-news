const express=require('express');
const mysql=require('mysql');

var db=mysql.createPool({host: 'localhost', user: 'root', password: '', database: 'learn'});

module.exports=function (){
  var router=express.Router();
  //检查登录状态
  router.use((req, res, next)=>{
    if(!req.session['admin_id'] && req.url!='/login'){
      res.redirect('/admin/login');
    }else{
      next();
    }
  });
  
 router.get('/', (req, res)=>{
    res.render('admin/index.ejs', {});
  });

  router.use('/login', require('./login.js')());

  router.use('/banners', require('./banners.js')());
  router.use('/custom',require('./custom.js')());

  return router;
};
