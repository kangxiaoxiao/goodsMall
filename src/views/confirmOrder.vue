<template>
    <div class="confirmOrderWrapper">
       <nav-header></nav-header>
       <nav-bread>确认订单</nav-bread>
        <div class="container">
           <ul>
             <li v-for="(item,index) in goodsList" :key="index" v-if="item.checked==1">
               <div class="item">{{item.productName}}</div>
               <div class="item">{{item.salePrice|currency("$",2)}}</div>
               <div class="item">
                 <img  v-lazy="'/static/'+item.productImage" :alt="item.productName">
               </div>
               <div class="item">{{item.productNum}}</div>
               <div class="item">{{(item.productNum*item.salePrice) |currency("$",2)}}</div>
             </li>
           </ul>
          <div class="totalWrapper text-right">
            <div class="item">数量：{{totalObj.num}}</div><br/>
            <div class="item">总计：{{totalObj.price |currency("$",2)}}</div>
          </div>
          <div class="btnWrapper text-right">
            <el-button
              type="primary"
              @click="pay"
            >
              支付
            </el-button>
          </div>
        </div>
        <nav-footer class="footer">底部</nav-footer>
    </div>
</template>

<script>
  import "@/assets/css/base.css";
  import commom from "@/assets/js/common";
  import NavHeader from  "@/components/header";
  import NavFooter from  "@/components/footer";
  import NavBread from  "@/components/bread";
  import Model from "@/components/modal"
  import axios from "axios";
    export default {
        name: "confirmOrder",
        data(){
          return {
            goodsList:[],
            addressId:""
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
          this.init();
        },
        computed:{
          totalObj:function(){
            let totalObj={
              num:0,
              price:0
            };
            this.goodsList.forEach(item=>{
              if(item.checked==1){
                totalObj.num+=parseInt(item.productNum);
                totalObj.price+=item.productNum*item.salePrice;
              }
            })
            return totalObj;
          }
        },
        methods:{
           init(){
             let _this=this;
             _this.addressId=this.$route.query.addressId||"";
             axios.get("/cart/cartList").then(response=>{
               let res=response.data;
               if(res.status==0){
                 this.goodsList=res.result;
               }else{
                 _this.alertInfo(res.msg);
               }
             })
           },
          pay(){

            let _this=this;
            let params={
              "orderTotal":_this.totalObj.price,
              "addressId":_this.addressId
            };
            axios.post("/users/payment",params).then(response=>{
              let res=response.data;
              if(res.status==0){
                console.log(res.result);
                this.$router.push({path:"/paySuccess",query:{"orderId":res.result.orderId}});
              }else{
                _this.alertInfo(res.msg,"warning");
              }
            })
          }
        }
    }
</script>

<style scoped lang="scss">
    .confirmOrderWrapper{
      ul{
        li{
          border-bottom:1px solid #e5e5e5;
          display: flex;
          justify-content:center;
          align-items:center;
          padding:10px;
          .item{
            display:inline-block;
            min-width: 180px;
            text-align: center;
          }
          img{
            width:180px;
            height:auto;
          }
        }
      }
      .totalWrapper{
        padding:10px;
        .item{
          display:inline-block;
          width:100px;
          text-align: left;
        }
      }
      .btnWrapper{
        background:#e5e5e5;
        padding:10px;
      }
      .text-right{
        text-align: right;
      }
    }
</style>
