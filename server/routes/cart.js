var express = require('express');
var router = express.Router();
let mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/goodsMall");
let db=mongoose.connection;
db.on("error",()=>{
  console.log("cart connected error!");
});
db.on("connected",()=>{
  console.log("cart connected success!");
});
db.on("disconnected",()=>{
  console.log("mongodb disconnected!");
});
let cart=require("../models/cart");
let user=require("../models/user");
router.get("/",(req,res,next)=>{
  /* res.send('respond with a resource');*/
  let params={};
  cart.find(params,(err,docs)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      console.log("docs",docs)
      res.json({
        status:"0",
        msg:"",
        result:docs
      })
    }
  })
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
});
router.post("/deleteGoods",function(req,res,next){
  let userId=req.cookies.userId;
  let productId=req.body.productId;
  user.update({userId:userId},{
    $pull:{'cartList':{
        'productId':productId}
    }
  },function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:"",
      })
    }else{
      res.json({
        status:"0",
        msg:"",
        result:"删除成功"
      })
    }
  });
});
//修改商品数量
router.post("/cartEdit",function(req,res,next){
  let userId=req.cookies.userId;
  let productId=req.body.productId;
  let productNum=req.body.productNum;
  let checked=req.body.checked;
  console.log("productId",productId);
  console.log("productNum",productNum);
  //更新子文档
  user.update({userId:userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  },function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
      })
    }else{
      res.json({
        status:"0",
        msg:"",
        result:"更新成功"
      })
    }
  })
});
router.post("/editCheckAll",function(req,res,next){
  let userId=req.cookies.userId;
  let checkAll=req.body.checkAll;
  user.findOne({userId:userId},function(err,userDoc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
      })
    }else{
      if(userDoc){
        userDoc.cartList.forEach(item=>{
          item.checked=checkAll
        })
        userDoc.save(function(err1,doc1){
          if(err1){
            res.json({
              status:"1",
              msg:err1.message,
            })
          }else{
            res.json({
              status:"0",
              msg:"",
              result:"保存成功"
            })
          }
        })
      }
    }
  })
})
module.exports = router;
