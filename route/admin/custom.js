const express=require('express');
const mysql=require('mysql');
const fs=require('fs');
const pathLib=require('path');
var db=mysql.createPool({host: 'localhost', user: 'root', password: '', database: 'learn'});

module.exports=function(){
  var router=express.Router();
  router.get('/',(req,res)=>{
    switch(req.query.act){
      case 'del':   
        db.query(`SELECT * FROM custom_evolution_table WHERE ID='${req.query.id}'`,
        (err,data)=>{
          if(err){
            console.log(err);
            res.status(500).send('database error').end();
          }else{
            if(data.length==0){
              res.status(404).send("no this custom").end();
            }else{
              fs.unlink('static/upload/'+data[0].src,
              (err)=>{
                if(err){
                  res.status(500).send('database error').end();
                }
                else{
                  db.query(`DELETE FROM custom_evolution_table WHERE ID='${req.query.id}'`,
                  (err,data)=>{
                    if(err){
                      console.log(err);
                      res.status(500).send('database error').end();
                    }else{
                      res.redirect('/admin/custom');
                    }
                  })
                }
              })
            }  
          }
        });
        break;
      case 'mod':
        db.query(`SELECT * FROM custom_evolution_table WHERE ID='${req.query.id}'`,
        (err,data)=>{
          if(err){
            console.log(err);
            res.status(500).send("database error").end();
          }else if(data.length==0){
            res.status(400).send("no this custom").end();
          }else{
            db.query(`SELECT * FROM custom_evolution_table`,(err,evaluations)=>{
              if(err){
                console.log(err);
                req.status(500).send('database error').end();
              }else{
                res.render('admin/custom.ejs',{evaluations,mod_data:data[0]});
              }
            })
          }
        })
        break;
      default:
        db.query(`SELECT * FROM custom_evolution_table`, (err, evaluations)=>{
          if(err){
            console.error(err);
            req.status(500).send('database error').end();
          }else{
            res.render('admin/custom.ejs', {evaluations});
          }
        });
    }
  });

  router.post('/',(req,res)=> {
    var title=req.body.title;
    var description=req.body.description;
    var article=req.body.article;
    var ext=pathLib.parse(req.files[0].originalname).ext;
    var oldPath=req.files[0].path;
    var newPath=req.files[0].path+ext;
    var newFileName=req.files[0].filename+ext;
    if(newFileName){
      fs.rename(oldPath,newPath,(err)=>{
      if(err){
        res.status(500).send('file operation error');
      }else{
        if(req.body.mod_id){
          db.query(`SELECT * FROM custom_evolution_table WHERE ID=${req.body.mod_id}`, 
          (err, data)=>{
              if(err){
                console.error(err);
                res.status(500).send('database error').end();
              }else if(data.length==0){
                res.status(404).send('old file not found').end();
              }else{
                fs.unlink('static/upload/'+data[0].src, (err)=>{
                if(err){
                  console.error(err);
                  res.status(500).send('file opration error').end();
                }else{
                  db.query(`UPDATE custom_evolution_table SET 
                    title='${title}', article='${article}', 
                    description='${description}' ,src='${newFileName}'
                    WHERE ID=${req.body.mod_id}`, (err)=>{
                      if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                      }else{
                        res.redirect('/admin/custom');
                      }
                    });
                }
              });
            }
          });
        }else{
          db.query(`INSERT INTO custom_evolution_table 
            (title, article, description, src)
            VALUES('${title}', '${article}', '${description}', '${newFileName}')`, (err, data)=>{
              if(err){
                console.error(err);
                res.status(500).send('database error').end();
              }else{
                res.redirect('/admin/custom');
              }
            });
        }  
      }
    })
    }else{
       if(req.body.mod_id){  //修改
        //直接改
        db.query(`UPDATE custom_evolution_table SET 
          title='${title}', description='${description}' 
          WHERE ID=${req.body.mod_id}`, (err)=>{
            if(err){
              console.error(err);
              res.status(500).send('database error').end();
            }else{
              res.redirect('/admin/custom');
            }
          });
      }else{                //添加
        db.query(`INSERT INTO custom_evolution_table \
        (title, article, description, src)
        VALUES('${title}', '${article}', '${description}'), '${newFileName}'`, (err, data)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else{
            res.redirect('/admin/custom');
          }
        });
      }
    }
  });

  return router;
};