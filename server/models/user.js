var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var userSchema=new Schema({
       "userId":String,
       "userName":String,
       "userPwd":String,
       "orderList":[
         { "orderId":String,
           "orderTotal":Number,
           "goodsList":Array,
           "address":Object,
           "orderStatus":String,
           "createDate":String
         }
       ],
       "cartList":[{
           "productId":String,
           "productName":String,
           "salePrice":String,
           "productImage":String,
           "checked":String,
           "productNum":String
      }],
      "addressList":[{
        "addressId" :String,
        "userName" : String,
        "streetName" : String,
        "postCode" :Number,
        "tel" : Number,
        "isDefault" : Boolean
      }]
})
let user=mongoose.model("User",userSchema,"users");
module.exports=user;
