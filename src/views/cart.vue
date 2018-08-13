<template>
   <div class="cart">
     <nav-header></nav-header>
     <nav-bread>购物车</nav-bread>
     <div class="container">
        <ul v-show="cartList && cartList.length" class="cartListWrapper">
          <li v-for="(item,index) in cartList" :key="index">
            <el-checkbox v-model="item.checked"></el-checkbox>
            <span class="item txt">{{item.productName}}</span>
            <span class="item txt">￥{{item.salePrice}}</span>
            <span class="item imgWrapper">
                <img v-lazy="'/static/'+item.productImage" alt="">
            </span>
            <span class="item">
              <el-col  :span="6">
                 <span class="txt">数量：</span>
              </el-col>
              <el-col :span="18" class="itemNumWrapper">
                 <el-col :span="5" class="item"  ><a   @click="changeNum(index,'reduce')">-</a></el-col>
                 <el-col :span="14" class="item"><el-input v-model="item.productNum"></el-input></el-col>
                 <el-col :span="5" class="item"><a @click="changeNum(index,'add')">+</a></el-col>
              </el-col>
            </span>
          </li>
        </ul>
        <div class="totalWrapper">
          <span class="item"><el-checkbox v-model="selectAll">全选</el-checkbox></span>
          <span class="item">总计：{{totalPrice}}</span>
          <span class="btnWrapper"><el-button class="text-right">结算</el-button></span>
        </div>
     </div>

     <nav-footer class="footer">底部</nav-footer>
   </div>
</template>

<script>
  import "@/assets/css/base.css";
  import NavHeader from  "@/components/header";
  import NavFooter from  "@/components/footer";
  import NavBread from  "@/components/bread";
  import axios from "axios";
  export default {
      name: "cart",
      data(){
        return{
           cartList:[],
           totalPrice:0, //总价
           selectAll:false
        }
      },
      components:{
        NavHeader,
        NavFooter,
        NavBread
      },
      mounted:function(){
         this.getCartList();
      },
      methods:{
         getCartList(){
           let _this=this;
           axios.get("/users/cartList").then(response=>{
              let res=response.data;
              _this.cartList=res.result;
              console.log("获取购物车列表成功",res);
           })
         },
        changeNum(itemIndex,type){
           console.log(123456);
           let _this=this;
          _this.cartList.forEach((cur,index,arr)=>{
                if(itemIndex==index){
                  if(type=="add"){
                    cur.productNum++;
                  }else if(type=="reduce"){
                    cur.productNum--;
                  }else{
                    console.log(123);
                  }
                }
          })
        },
         getTotalPrice(){
           let _this=this;
           _this.totalPrice=0;
           _this.cartList.forEach((item)=>{
             item.checked=!!item.checked
             if(item.checked){
               console.log("salePrice",item.salePrice);
               console.log("productNum",item.productNum)
               _this.totalPrice+=(parseFloat(item.salePrice)*parseInt(item.productNum))
             }
           })
         }
      },
    watch:{
        "cartList":{
          handler:function(val,old){
            console.log(`watch cartList:${val}`);
            if(val){
              this.getTotalPrice();
            }
          },
          deep:true
        },
        "selectAll":function(val,old){
            this.cartList.forEach((item)=>{
              item.checked=val;
            })
        }

    }
  };
</script>

<style  lang="scss">
  .cartListWrapper{
    li{
      border-bottom:1px solid #e5e5e5;
      padding:0 15px;
      span.item{
        display:inline-block;
        vertical-align: middle;
        min-width: 100px;
        &.item.txt{
          line-height:40px;
        }
        .txt{
          line-height:40px;
        }
        .itemNumWrapper{
           .item{
             text-align: center;
             cursor: default;
            a{
              display:block;
              line-height:40px;
            }
           }
        }
      }
      img{
        display:block;
        max-width:100px;
        height:100px;
        width:auto;
      }
    }
  }
  .totalWrapper{
    padding:7px 15px;
    background:#e5e5e5;
    overflow: hidden;
    .item{
      display:inline-block;
      line-height:40px;
    }
    .btnWrapper{
      display:block;
      float:right;
    }
  }
</style>
