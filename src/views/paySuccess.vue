<template>
    <div class="paySuccessWrapper">
       <nav-header></nav-header>
       <nav-bread>支付成功</nav-bread>
        <div class="container orderDetailCon">
          <div>订单创建成功</div>
          <div>
            <span>订单Id:{{orderDetail.orderId}}</span>
            <span>订单总金额：{{orderDetail.orderTotal}}</span>
          </div>
        </div>
        <div class="btnsWrapper">
          <router-link class="item" to="/goodsList">商品列表</router-link>
          <router-link class="item" to="/cart">购物车</router-link>
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
        name: "paySuccess",
        data(){
          return {
            orderId:"",
            orderDetail:{}
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

        },
        methods:{
           init(){
             let _this=this;
             this.orderId=this.$route.query.orderId;
             if(!this.orderId){
               return ;
             }
             let params={
               params:{
                 orderId:_this.orderId
               }
             }
             axios.get("/users/getOrderDetail",params).then(response=>{
               let res=response.data;
               if(res.status==0){
                 console.log(res.result);
                 _this.orderDetail=res.result;
               }else{
                 _this.alertInfo(res.msg,"warning");
               }
             })
           }
        }
    }
</script>

<style scoped lang="scss">
  .paySuccessWrapper{
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
    .orderDetailCon{
      text-align: center;
    }
    .btnsWrapper{
      display:flex;
      justify-content:center;
      .item{
        display:inline-block;
        padding:7px 10px;
        border:1px solid orangered;
        width:100px;
        text-align: center;
        &:first-child{
          margin-right:10px;
        }
      }
    }
  }
</style>
