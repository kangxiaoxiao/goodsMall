let mongoose=require("mongoose");
let Schema=mongoose.Schema;
let cartSchema=new Schema({
  "productName":String,
  "productPrice":Number
})
let cart=mongoose.model("Cart",cartSchema,"carts");
module.exports=cart;
