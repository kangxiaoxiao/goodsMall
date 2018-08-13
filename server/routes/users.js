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
  user.findOne(params,(err,doc)=>{
    console.log(doc);
    if(err){
      res.json({
        status:"1",
        msg:"登录失败",
      })
    }else{
      if(doc){
        //存cookie
        res.cookie("userId",doc.userId,{
          path:"/",
          maxAge:1000*60*60
        });
        res.cookie("userName",doc.userName,{
          path:"/",
          maxAge:1000*60*60
        });
        //存session
       // req.session.user=doc;
        res.json({
          status:"0",
          msg:"",
          result:doc.userName
        })
      }else{
        res.json({
          status:"1",
          msg:"没找到该用户",
        })
      }
    }
  })
});

router.post("/loginOut",(req,res,next)=>{
    res.cookie("userId","",{
      path:"/",
      maxAge:-1
    });
    res.json({
      status:"0",
      msg:"",
      result:""
    })
});

router.get("/checkLogin",function(req,res,next){
  if(req.cookies.userId){
    res.json({
      status:"0",
      msg:"",
      result:req.cookies.userName
    })
  }else{
    res.json({
      status:"0",
      msg:"未登录",
      result:""
    })
  }
});

router.get("/cartList",function(req,res,next){
  let userId=req.cookies.userId;
  let params={
    userId:userId
  }
  user.findOne(params,(err,docs)=>{
     if(err){
       res.json({
         status:"1",
         msg:err.message,
         result:""
       })
     }else{
       if(docs){
         res.json({
           status:"0",
           msg:"",
           result:docs.cartList
         })
       }
     }
  })
})
module.exports = router;
