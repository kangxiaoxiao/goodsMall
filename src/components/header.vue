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
      <el-col :span="18">
        <img src="@/assets/imoocLogo.png" alt="">
      </el-col>
      <el-col :span="6">
        <div class="headerNavRight">
          <div class="item" v-if="!hasLogin"><a href="javascript:;" @click="openLogin">login</a></div>
          <div class="item" v-if="hasLogin">{{nickName}}</div>
          <div class="item" v-if="hasLogin"><a href="javascript:;" @click="openLoginOut">login out</a></div>
          <div class="item">
            <div class="cartBtnWrapper">
              <span >购物车</span>
              <span class="countIcon" v-if="cartCount">{{cartCount}}</span>
            </div>
          </div>
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
        <el-form
          label-width="80px"
          :rules="rules"
          :model="loginForm"
          ref="loginForm"
        >
            <el-form-item prop="userName">
              <span slot="label">账号：</span>
              <el-input placeholder="请输入账号" v-model="loginForm.userName"></el-input>
            </el-form-item>
          <el-form-item prop="userPwd">
            <span slot="label">密码：</span>
            <el-input placeholder="请输入密码" v-model="loginForm.userPwd" type="password"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary loginBtn" @click="login('loginForm')">登录</el-button>
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
      userName:"",
      loginForm:{
        userName:"kangxiaoxiao",
        userPwd:"123456"
      },
      rules:{
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        userPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
      hasLogin:false
    }
  },
  mixins:[commom],
  mounted:function(){
    this.checkLogin();
  },
  components:{

  },
  computed:{
    nickName(){
      return this.$store.state.nickName
    },
    cartCount(){
      return this.$store.state.cartCount
    }
  },
  methods: {
   /* handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }*/
    checkLogin(){
      let _this=this;
       axios.get("/users/checkLogin").then(response=>{
         let res=response.data;
         if(res.status==0){
           _this.hasLogin=true;
           //_this.$store.state.nickName=res.result;
           _this.$store.commit("updateUserInfo",res.result);
           _this.getCartCount();
         }
       })
    },
    openLogin(){
      this.centerDialogVisible=true;
    },
    login(formName){
      console.log("登录");
      let _this=this;
      let params=Object.assign({},_this.loginForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post("users/login",params).then(response=>{
            let res=response.data;
            if(res.status==0){
              _this.alertInfo("登录成功","success");
              _this.hasLogin=true;
              _this.centerDialogVisible=false;
              //_this.$store.state.nickName=res.result;
              _this.$store.commit("updateUserInfo",res.result);
              _this.getCartCount();
            }else{
              console.log(res.msg)
              _this.alertInfo(res.msg,"error");
              _this.hasLogin=false;
              _this.centerDialogVisible=true;
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //openLoginOut
    openLoginOut(){
      let _this=this;
      axios.post("users/loginOut").then(response=>{
         let res=response.data;
         if(res.status==0){
           _this.hasLogin=false;
           _this.alertInfo("退出登录成功","success");
           _this.getCartCount();
         }
      })
    },
    getCartCount(){
      let _this=this;
      axios.get("users/getCartCount").then(response=>{
        let res=response.data;
        if(res.status==0){
          let cartCount=res.result.count;
          _this.$store.commit("getCartCount",cartCount)
        }else{
          _this.$store.commit("getCartCount","")
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
        .cartBtnWrapper{
          font-size:0;
          span{
            font-size:14px;
          }
          .countIcon{
            background:red;
            padding:0 3px;
            border-radius:20px;
            color:#fff;
            line-height:10px;
            font-size:13px;
          }
        }
      }
    }
    .loginBtn{
      width:100%;
    }


</style>
