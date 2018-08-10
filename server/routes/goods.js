var express = require('express');
var router = express.Router();
var mongoose=require("mongoose");
var Goods=require("../models/goods");
var util=require("util");
//连接数据库
mongoose.connect("mongodb://127.0.0.1:27017/goodsMall");
mongoose.connection.on("connected",()=>{
  console.log("mongodb connected success!");
})
mongoose.connection.on("error",()=>{
  console.log("mongodb connected fail!");
})
mongoose.connection.on("disconnected",()=>{
  console.log("mongodb disconnected!");
})

/* GET home page. */
//查询商品列表
router.get('/', function(req, res, next) {
 // res.render('goods', { title: 'Express' });
 // res.end("goods loading...");
  let page=parseInt(req.param("page"));
  let pageSize=parseInt(req.param("pageSize"));
  let skip= (page-1)*pageSize;
  let sort=req.param("sort");
  let checkLevel=req.param("checkLevel");
  console.log("checkLevel",checkLevel);
  let priceGt="";
  let priceLte="";
  let  params={};
  if(checkLevel!="All"){
    switch(checkLevel){
      case "0":
        priceGt=0;priceLte=500;
        break;
      case "1":
        priceGt=500;priceLte=1000;
        break;
      case "2":
        priceGt=1000;priceLte=1500;
        break;
      case "3":
        priceGt=1500;priceLte=2000;
        break;
    }
    params={
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    };
  }

  console.log("priceGt",priceGt);
  console.log("priceLte",priceLte);
  console.log(`page:${page},pageSize:${pageSize},sort:${sort}`);
  let goodsModel=Goods.find(params).skip(skip).limit(pageSize); //返回的是一个modal(模型)
  goodsModel.sort({"salePrice":sort});
  goodsModel.exec((err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message

      })
    }else{
      res.json({
        status:"0",
        msg:"",
        result:{
          cont:doc.length,
          list:doc
        }
      })
    }
  })
});

//加入到购物车
router.post("/addCart",(req,res)=>{
   console.log("已经发起了一个post请求");
  //假设已经登录
    var userId="007";
    var produceId=req.body.productId;
    var User=require("../models/user");
    let params={
      userId:userId
    }
    User.findOne(params,(err,userDoc)=>{
      if(err){
        console.log("查询userId为007的失败");
         res.json({
           status:"1",
           msg:err.message
         })
      }else{
        console.log("userDoc",userDoc)
        /*res.json({
          status:"0",
          msg:"",
        })*/
        let goodsItem="";
        userDoc.cartList.forEach((item)=>{
          if(item.productId==produceId){
            goodsItem=item;
            item.productNum++;
          }
        });
        if(goodsItem){
            //购物车中已经有了，只需要数量增加即可
          userDoc.save((err2,doc2)=>{
            if(err2){
              res.json({
                status:"1",
                msg:err2.message
              })
            }else{
              res.json({
                status:"0",
                msg:"",
                result:"success"
              })
            }
          })
        }else{
          //购物车中没有
          if(userDoc){
            console.log("产品ID",produceId);
            console.log(typeof(produceId));
            Goods.findOne({"productId":produceId},(err1,doc)=>{
              if(err1){
                res.json({
                  status:"1",
                  msg:err1.message
                })
              }else{
                if(doc){
                  doc.productNum = 1;
                  doc.checked = 1;
                  console.log("查询到产品doc*********",doc);
                  console.log("查询到产品doc.productNum",doc.productNum);
                  userDoc.cartList.push(doc);
                  userDoc.save((err2,doc2)=>{
                    if(err2){
                      res.json({
                        status:"1",
                        msg:err2.message
                      })
                    }else{
                      res.json({
                        status:"0",
                        msg:"",
                        result:"success"
                      })
                    }
                  })
                }
              }
            })
          }
        }
      }
    })
})

module.exports = router;
