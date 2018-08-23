var express = require('express');
var router = express.Router();
let mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/goodsMall");
let db=mongoose.connection;
let util=require("../util/util");
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

router.get("/addressList",function(req,res,next){
  let userId=req.cookies.userId;
  let params={
    userId:userId
  }
  user.findOne(params,function(err,doc){
     if(err){
       res.json({
         status:"1",
         msg:err.message,
         result:""
       })
     }else{
       console.log(doc.addressList);
       if(doc){
         res.json({
           status:"0",
           msg:"",
           result:doc.addressList
         })
       }else{
         res.json({
           status:"1",
           msg:"查询失败",
         })
       }
     }
  })
});
//设置默认地址
router.post("/setDefaultAddress",function(req,res,next){
  let addressId=req.body.addressId;
  let userId=req.cookies.userId;
  if(!addressId){
    res.json({
      status:"10003",
      msg:"addressId is null",
      result:""
    })
  }else{
    user.findOne({userId:userId},function(err,doc){
      if(err){
        res.json({
          status:"0",
          msg:err.message,
          result:""
        })
      }else{
        let addressList=doc.addressList;
        addressList.forEach(item=>{
          if(item.addressId==addressId){
            item.isDefault=true;
          }else{
            item.isDefault=false;
          }
        });
        doc.save(function(err1,doc1){
          if(err1){
            res.json({
              status:"1",
              msg:err1.message,
              result:""
            })
          }else{
            res.json({
              status:"0",
              msg:"",
              result:"设置成功"
            })
          }
        })
      }
    })
  }
});
//删除地址
router.post("/delAddress",function(req,res,next){
  let addressId=req.body.addressId;
  let userId=req.cookies.userId;
  if(!addressId){
    res.json({
      status:"10003",
      msg:"addressId is null",
      result:""
    })
  }else{
    user.update({userId:userId},{
      $pull:{'addressList':{
          'addressId':addressId}
      }
    },function(err,doc){
      if(err){
        res.json({
          status:"1",
          msg:err.message,
          result:""
        })
      }else{
        res.json({
          status:"0",
          msg:"",
          result:"删除成功"
        })
      }
    });
  }
});
//生成订单
router.post("/payment",function(req,res,next){
  let userId=req.cookies.userId;
  let orderTotal=req.body.orderTotal;
  let addressId=req.body.addressId;
  user.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      let address="";
      let goodsList=[];
      //获取当前用户的地址信息
      doc.addressList.forEach(item=>{
        if(item.addressId==addressId){
          address=item;
        }
      });
      //获取用户的购物车的商品
      doc.cartList.filter(item=>{
        if(item.checked==1){
          goodsList.push(item);
        }
      });
      //生成orderId
      var platform="622"; //假设622代表平台
      let r1=Math.floor(Math.random()*10);
      let r2=Math.floor(Math.random()*10);
      var sysDate=new Date().format("yyyyMMddhhmmss");
      var createDate=new Date().format("yyyy-MM-dd hh:mm:ss");
      var orderId=platform+r1+sysDate+r2;  //3+2+14=19位
      //创建订单
      var order={
        orderId:orderId,
        orderTotal:orderTotal,
        goodsList:goodsList,
        address:address,
        orderStatus:"1",
        createDate:createDate
      };
      doc.orderList.push(order);
      doc.save(function(err1,doc1){
        if(err1){
          res.json({
            status:"1",
            msg:err1.message,
            result:""
          })
        }else{
          res.json({
            status:"0",
            msg:"",
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          })
        }
      })
    }
  })
});

 router.get("/getOrderDetail",function(req,res,next){
   console.log("params",req.query);
   let userId=req.cookies.userId;
   let orderId=req.query.orderId;
   user.findOne({userId:userId},function(err,doc) {
     if (err) {
       res.json({
         status: "1",
         msg: err.message,
         result: ""
       })
     }else{
       let orderList=doc.orderList;

       if(orderList.length>0){
         let orderTotal=0;
         orderList.forEach(item=>{
           if(item.orderId==orderId){
             orderTotal=item.orderTotal;
           }
         });
         if(orderTotal>0){
           res.json({
             status: "0",
             msg: "",
             result: {
               orderId:orderId,
               orderTotal:orderTotal
             }
           })
         }else{
           res.json({
             status: "120002",
             msg: "无此订单",
             result: ""
           })
         }
       }else{
         res.json({
           status: "120001",
           msg: "用户未创建此订单",
           result: ""
         })
       }


     }
   })

});



module.exports = router;
