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
module.exports = router;
