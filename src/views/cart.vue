<template>
   <div class="cart">
     <nav-header></nav-header>
     <nav-bread>购物车</nav-bread>
     <div class="container">
        <ul v-show="cartList && cartList.length" class="cartListWrapper">
          <li v-for="(item,index) in cartList" :key="index">
            <el-checkbox
              v-model="item.checked"
              @change="changeNum(item,'check')"
              :true-label=trueLabelValue
              :false-label=falseLabelValue
            ></el-checkbox>
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
                 <el-col :span="5" class="item"  ><a   @click="changeNum(item,'reduce')">-</a></el-col>
                 <el-col :span="14" class="item"><el-input v-model="item.productNum"></el-input></el-col>
                 <el-col :span="5" class="item"><a @click="changeNum(item,'add')">+</a></el-col>
              </el-col>
            </span>
            <span class="item txt">总计：{{(item.productNum)*(item.salePrice)}}</span>
            <span class="item txt"><a  @click="sureDeleteGoods(item.productId)"><i class="el-icon-delete"></i></a></span>
          </li>
        </ul>
        <div class="totalWrapper">
          <span class="item">
            <el-checkbox
              v-model="selectAll"
              @change="toggleCheckAll(selectAll)"
              :true-label="trueLabelValue"
              :false-label="falseLabelValue"
            >全选</el-checkbox></span>
          <span class="item">总计：{{totalPrice | currency("$",2)}}</span>
          <span class="btnWrapper">
            <el-button
              class="text-right"
              type="primary"
              :disabled="checkNum==0"
              @click="account"
            >
              结算
            </el-button>
          </span>
        </div>
     </div>

     <Model modalTitle="提示" :modelVisible="modelVisible" v-on:closeModel="closeModel('modelVisible')">
        <span slot="boxCon">
              您未登陆，请先登陆！
        </span>
       <span slot="footerBtn">
         <el-button @click="closeModel(false)">关闭</el-button>
       </span>
     </Model>

     <Model modalTitle="提示" :modelVisible="deleteModel" v-on:closeModel="closeModel('deleteModel')">
        <span slot="boxCon">
             确定要删除该商品吗？
        </span>
       <span slot="footerBtn">
         <el-button @click="deleteGoods()">确认</el-button>
         <el-button @click="closeModel('deleteModel')">关闭</el-button>
       </span>
     </Model>

     <nav-footer class="footer">底部</nav-footer>
   </div>
</template>

<script>
  import "@/assets/css/base.css";
  import NavHeader from  "@/components/header";
  import NavFooter from  "@/components/footer";
  import NavBread from  "@/components/bread";
  import axios from "axios";
  import Model from "@/components/modal";
  import commom from "@/assets/js/common";
  export default {
      name: "cart",
      data(){
        return{
           cartList:[],
           totalPrice:0, //总价
           selectAll:0,
           modelVisible:false,
           deleteModel:false,
           deleteProductId:null,
           trueLabelValue:"1",
           falseLabelValue:"0",
        }
      },
      mixins:[commom],
      components:{
        NavHeader,
        NavFooter,
        NavBread,
        Model
      },
      mounted:function(){
         this.getCartList();
      },
      computed:{
        checkNum:function(){
          let _this=this;
          let i=0;
          _this.cartList.forEach(item=>{
             if(item.checked==1){
               i++
             }
          });
          return i;
        }
      },
      methods:{
         getCartList(){
           let _this=this;
           axios.get("/cart/cartList").then(response=>{
              let res=response.data;
              if(res.status==0){
                _this.cartList=res.result;
                console.log("获取购物车列表成功",res);
                _this.getTotalPrice();
              }else{
                _this.modelVisible=true;
              }

           })
         },
        closeModel(modelName){
          this[modelName]=false;
        },
        changeNum(item,type){
           let _this=this;
            if(type=="add"){
              item.productNum++;
            }else if(type=="reduce"){
              if(item.productNum>=1){
                item.productNum--;
              }else{
                return ;
              }
            }
            let params={
              "productId":item.productId,
              "productNum":item.productNum,
              "checked":item.checked
            };
            axios.post("/cart/cartEdit",params).then(response=>{
              let res=response.data;
              console.log(res);
              if(res.status==0){
                _this.getCartList();
              }else{
                _this.alertInfo(res.msg,"warning");
              }
            })
        },
         getTotalPrice(){
           let _this=this;
           _this.totalPrice=0;
           _this.selectAll="1";
           _this.cartList.forEach((item)=>{
             if(item.checked==1){
               _this.totalPrice+=(parseFloat(item.salePrice)*parseInt(item.productNum))
             }
             if(item.checked==0){
               _this.selectAll="0";
             }
           })
         },
        sureDeleteGoods(productId){
          this.deleteModel=true;
          this.deleteProductId=productId;
        },
        deleteGoods(){
           let _this=this;
           console.log(_this.deleteProductId)
           let params={
             "productId":_this.deleteProductId
           }
           axios.post("/cart/deleteGoods",params).then(response=>{
             let res=response.data;
             _this.deleteModel=false;
             if(res.status==0){
               _this.alertInfo("删除成功","success");
               _this.getCartList();
             }else{
               _this.alertInfo(res.msg,"warning");
             }
           })
        },
        toggleCheckAll(val){
           let _this=this;
          val=(val==0)?"0":"1";
          this.cartList.forEach((item)=>{
            item.checked=val;
          })
          axios.post("/cart/editCheckAll",{"checkAll":val}).then(response=>{
            let res=response.data;
            console.log("全选保存成功",res);
          })
          _this.getTotalPrice();
        },
        account(){
           this.$router.push({path:"/address"});
        }
      },
    watch:{
       /* "cartList":{
          handler:function(val,old){
            console.log(`watch cartList:${val}`);
            if(val){
              this.getTotalPrice();
            }
          },
          deep:true
        },*/
        /*"selectAll":function(val,old){
            this.cartList.forEach((item)=>{
              item.checked=val;
            })
        }*/

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
