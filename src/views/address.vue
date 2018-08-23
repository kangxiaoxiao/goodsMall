<template>
    <div class="addressWrapper">
       <nav-header></nav-header>
       <nav-bread>地址列表</nav-bread>
        <div class="container">
          <el-row>
              <el-col
                :span="6"
                v-for="(item,index) in addressList"
                :key="index"
                :offset="1"
                v-if="index<showAddressNum"
              >
                <el-card
                  :class="{'active':checkIndex==index}"
                >
                  <div class="cardCon"   @click="setCheckIndex(item,index)">
                    <div>地址：{{item.streetName}}</div>
                    <div>联系人：{{item.userName}}</div>
                    <div>电话：{{item.tel}}</div>
                    <div>邮编：{{item.postCode}}</div>
                    <div v-if="item.isDefault">
                      <el-button type="text">默认</el-button>
                    </div>
                    <div v-if="!item.isDefault">
                      <el-button
                        type="text"
                        @click="setDefault(item.addressId)"
                      >设为默认</el-button>
                    </div>
                    <div>
                      <a @click="openDeleteModel(item.addressId)">
                        <i class="el-icon-delete"></i>
                      </a>
                    </div>
                  </div>
                </el-card>
              </el-col>
          </el-row>
          <div class="loadMore">
            <span @click="loadMore" v-if="!showMore">more>></span>
            <span @click="loadLess" v-if="showMore">收起>></span>
          </div>
        </div>

        <div class="addressFooter text-right">
            <router-link :to="{path:'/confirmOrder',query:{addressId:this.delAddressId}}">结算</router-link>
        </div>

        <Model modalTitle="提示" :modelVisible="modelVisible" v-on:closeModel="closeModel('modelVisible')">
          <span slot="boxCon">
                确定删除该地址吗？
          </span>
          <span slot="footerBtn">
           <el-button @click="deleteAddress">确定</el-button>
           <el-button @click="closeModel('modelVisible')">取消</el-button>
         </span>
        </Model>

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
        name: "Address",
        data(){
          return {
            addressList:[],
            showAddressNum:3,
            showMore:false,
            delAddressId:null,
            modelVisible:false,
            checkIndex:0
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
          this.getAddressList();
        },
        methods:{
          getAddressList(){
            let _this=this;
            axios.get("users/addressList").then(response=>{
              let res=response.data;
              if(res.status==0){
                _this.addressList=res.result
                _this.delAddressId=_this.addressList[0].addressId
              }else{
                _this.alertInfo(res.msg,"warning")
              }
            })
          },
          loadMore(){
            this.showAddressNum=this.addressList.length;
            this.showMore=true;
          },
          loadLess(){
            this.showAddressNum=3;
            this.showMore=false;
          },
          //设为默认地址
          setDefault(addressId){
            let _this=this;
             axios.post("/users/setDefaultAddress",{
               "addressId":addressId
             }).then(response=>{
               let res=response.data;
               if(res.status==0){
                 _this.alertInfo(res.result,"success");
                 _this.getAddressList();
               }else{
                 _this.alertInfo(res.msg,"warning");
               }
             })
          },
          deleteAddress(){
            let _this=this;
            axios.post("/users/delAddress",{
              "addressId":_this.delAddressId
            }).then(response=>{
              let res=response.data;
              if(res.status==0){
                 _this.alertInfo(res.result,"success");
                 _this.modelVisible=false;
                 _this.getAddressList();
              }else{
                _this.alertInfo(res.msg,"warning")
              }
            })
          },
          closeModel(modelVisible){
            this[modelVisible]=false;
          },
          openDeleteModel(addressId){
            console.log("点击了删除",addressId);
            this.delAddressId=addressId;
            this.modelVisible=true;
          },
          setCheckIndex(item,index){
            this.checkIndex=index;
            this.delAddressId=item.addressId;

          }
        }
    }
</script>

<style scoped lang="scss">
  .text-right{
    text-align: right;
  }
 .el-card{
   &.active{
     border:1px solid orangered;
   }
 }
  .addressFooter{
    background:#e5e5e5;
    padding:10px;
  }
</style>
