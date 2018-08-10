<template>
   <div class="cart">
     <nav-header></nav-header>
     <nav-bread>购物车</nav-bread>
     <div class="container">

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
      name: "goodsList",
      data(){
        return{
          
        }
      },
      components:{
        NavHeader,
        NavFooter,
        NavBread
      },
      mounted:function(){

      },
      methods:{

      }
  };
</script>

<style  lang="scss">

</style>
