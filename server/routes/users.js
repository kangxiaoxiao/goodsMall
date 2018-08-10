var express = require('express');
var router = express.Router();
let mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/goodsMall");
let db=mongoose.connection;
db.on("error",()=>{
  console.log("connection connected error!");
})
db.on("connected",()=>{
  console.log("connected success!")
})
db.on("disconnected",()=>{
  console.log("mongodb disconnected!");
})

let user=require("../models/user");

/* GET users listing. */
router.get('/', function(req, res, next) {
 /* res.send('respond with a resource');*/
  let params={};
  user.find(params,(err,docs)=>{
    if(err){
      console.log("err",err.message);
       res.json({
         status:"1",
         msg:err.message
       })
    }else{
      console.log("find Success!");
      console.log(docs)
      res.json({
        status:"1",
        msg:"",
        result:docs
      })
    }
  })
});
router.post("/login",(req,res,next)=>{
  let params={
    "userName":req.body.userName,
    "userPwd":req.body.userPwd
  };
  console.log(params);
  user.find(params,(err,docs)=>{
    if(err){
      res.json({
        status:"1",
        msg:"登录失败",
      })
    }else{
      if(docs){
        res.json({
          status:"0",
          msg:"",
          result:docs
        })
      }else{
        res.json({
          status:"1",
          msg:"没找到该用户",
        })
      }
    }
  })
})

module.exports = router;
