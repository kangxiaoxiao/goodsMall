var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var userSchema=new Schema({
       "userId":String,
       "userName":String,
       "userPwd":String,
       "orderList":Array,
       "cartList":[{
           "productId":String,
           "productName":String,
           "salePrice":String,
           "productImage":String,
           "checked":String,
           "productNum":String
      }],
      "addressList":Array
})
let user=mongoose.model("User",userSchema,"users");
module.exports=user;
