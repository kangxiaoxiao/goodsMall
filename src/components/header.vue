<template>
  <div class="headerWrapper">
    <!--<div class="NavHeader">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#333"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1">处理中心</el-menu-item>
        <el-menu-item index="3" >消息中心</el-menu-item>
        <el-menu-item index="4">订单管理</el-menu-item>
        <el-menu-item index="5" class="text-right">login</el-menu-item>
        <el-menu-item index="6" class="text-right">购物车</el-menu-item>
      </el-menu>
    </div>-->
    <el-row>
      <el-col :span="20">
        <img src="@/assets/imoocLogo.png" alt="">
      </el-col>
      <el-col :span="4">
        <div class="headerNavRight">
          <div class="item" v-if="!hasLogin"><a href="javascript:;" @click="openLogin">login</a></div>
          <div class="item" v-if="hasLogin">{{userName}}</div>
          <div class="item"><a href="javascript:;">购物车</a></div>
        </div>

      </el-col>
    </el-row>

    <!--登录的弹框-->
    <el-dialog
      title="登录"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <div class="loginBoxCon">
        <el-form label-width="80px" >
            <el-form-item>
              <span slot="label">账号：</span>
              <el-input placeholder="请输入账号" v-model="userName"></el-input>
            </el-form-item>
          <el-form-item>
            <span slot="label">密码：</span>
            <el-input placeholder="请输入密码" v-model="userPwd" type="password"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary loginBtn" @click="login">登录</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import axios from "axios";
  import commom from "@/assets/js/common";
export default {
  name: 'NavHeader',
  data () {
    return {
      activeIndex: '1',
      centerDialogVisible:false,
      userName:"kangxiaoxiao",
      userPwd:"123456",
      hasLogin:false
    }
  },
  mixins:[commom],
  mounted:function(){

  },
  methods: {
   /* handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }*/
    openLogin(){
      this.centerDialogVisible=true;
    },
    login(){
      console.log("登录");
      let _this=this;
      let params={
         "userName":this.userName,
         "userPwd":this.userPwd
      };
      axios.post("users/login",params).then(response=>{
        let res=response.data;
        if(res.status==0){
           _this.alertInfo("登录成功","success");
           _this.hasLogin=true;
           _this.centerDialogVisible=false;
        }else{
          console.log(res.msg)
          _this.alertInfo(res.msg,"error");
          _this.hasLogin=false;
          _this.centerDialogVisible=true;
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .headerNavRight{
      .item{
        height:80px;
        line-height:80px;
        display:inline-block;
        margin-right:15px;
      }
    }
  .loginBtn{
    width:100%;
  }
</style>
