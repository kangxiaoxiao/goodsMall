<template>
   <div class="goodsList">
     <nav-header></nav-header>
     <nav-bread>购物车</nav-bread>
     <div class="nav-breadcrumb-wrap">侧边栏</div>
     <el-col :span="24" class="sortBy text-right">
           <div class="item cur">Default</div>
           <div class="item">
             <span>price:</span>
             <i :class="priceUp?'el-icon-sort-up':'el-icon-sort-down'"
                @click="sortGoods"></i>
           </div>
     </el-col>
     <div class="container">
       <el-col :span="6"  class="filterList">
         <ul>
           <div>filterIndex:{{filterIndex}}</div>
           <div :class="{'cur':filterIndex=='All'}" @click="getActiveIndex('All')">all</div>
           <li v-for="(item,index) in priceFilter" :key="index">
             <span>
               <a
                 href="javascript:void(0)"
                 :class="{'cur':filterIndex==index}"
                 @click="getActiveIndex(index)"
               >{{item.startPrice}}-{{item.endPrice}}
               </a>
             </span>
           </li>
         </ul>
       </el-col>
       <el-col :span="18" class="goodsCon">
         <el-row>
           <el-col
             :span="6"
             :xs="12"
             v-if="goodsList&&(goodsList.length)"
             v-for="(item,index) in goodsList" :key="item.id"
           >
             <el-card :body-style="{ padding: '0px' }" >
               <img v-lazy="'/static/'+item.productImage" alt="">
               <div class="goodsTextWrapper">
                 <div class="productName">{{item.productName}}</div>
                 <div class="salePrice">{{item.salePrice}}</div>
                 <div class="addCartBtn">
                   <el-button size="small" style="width:100%" @click="addCart(item.productId)">加入购物车</el-button>
                 </div>
               </div>
             </el-card >
           </el-col>
         </el-row>
         <div v-infinite-scroll="loadMore"
              infinite-scroll-disabled="busy"
              infinite-scroll-distance="30"
              class="loadMore"
         >
           <img src="/static/svg-loaders/audio.svg" v-show="loading">
         </div>
       </el-col>
     </div>
     <!--<el-col :span="24" class="pageWrapper">
       <div class="block">
         <el-pagination
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
           :current-page="pageInfo.currentPage"
           :page-sizes="pageInfo.pageSizes"
           :page-size="pageInfo.pageSize"
           layout="total, sizes, prev, pager, next, jumper"
           :total="pageInfo.total">
         </el-pagination>
       </div>
     </el-col>-->
     <Model modalTitle="提示" :modelVisible="modelVisible" v-on:closeModel="closeModel">
        <span slot="boxCon">
              请先登陆,否则无法加入购物车！
        </span>
       <span slot="footerBtn">
         <el-button @click="closeModel(false)">关闭</el-button>
       </span>
     </Model>

     <Model modalTitle="提示" :modelVisible="modelVisible_cart" v-on:closeModel="closeCartModel">
        <span slot="boxCon">
              加入购物车成功！
        </span>
       <span slot="footerBtn">
         <el-button @click="closeCartModel(false)">继续购物</el-button>
         <el-button><router-link to="/cart">查看购物车</router-link></el-button>
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
      name: "goodsList",
      data(){
          let pageSizes=[8,18,28];
          return {
             goodsList:[],
             filterIndex:"All",
             priceUp:true, //默认按价格的升序排列
             busy:true, //允许滚动
             checkLevel:null, //选中的价格区间
             loading:false,
             modelVisible:false,
            modelVisible_cart:false, //加入购物车成功modal状态
             pageInfo:{
               currentPage:1, //当前页
               pageSizes:pageSizes,
               pageSize:pageSizes[0],
               total:null
             },
             priceFilter:[
               {
                 "startPrice": "0.00",
                 "endPrice":"500.00",
               },
               {
                 "startPrice": "500.00",
                 "endPrice":"1000.00",
               },
               {
                 "startPrice": "1000.00",
                 "endPrice":"1500.00",
               },
               {
                 "startPrice": "1500.00",
                 "endPrice":"2000.00",
               }
             ],
              filterBy:false,
              overLayFlag:false, //遮罩
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
         this.getGoodsList();
         console.log("currentPage",this.pageInfo.currentPage);
      },
      methods:{
        getGoodsList:function(flag){
          let _this=this;
          let params={
            "sort":_this.priceUp?1:-1,
            "page":_this.pageInfo.currentPage,
            "pageSize":_this.pageInfo.pageSize,
            "checkLevel":_this.filterIndex
          }
          console.log("params",params);
          _this.loading=true;
          axios.get("/goods",{params:params}).then(result=>{
            var res=result.data;
            _this.loading=false;
            if(res.status==0){
              if(flag){
                _this.goodsList=_this.goodsList.concat(res.result.list);
                if(res.result.cont==0 || res.result.cont<_this.pageInfo.pageSize){
                   //没有数据了
                  this.busy = true;
                }else{
                  this.busy = false;
                }
              }else{
                _this.goodsList=res.result.list;
                _this.busy = false;
              }
            }else{
              _this.goodsList=[]
            }

          }).catch(res=>{
            console.log(res);
            _this.loading=false;
          })
        },
        sortGoods(){
          let _this=this;
          _this.priceUp=!_this.priceUp;
          _this.pageInfo.currentPage=1;
          _this.goodsList=[];
          _this.getGoodsList();
        },
        //加载更多的函数
        loadMore(){
          this.busy = true;
          setTimeout(() => {
            this.pageInfo.currentPage++;
            this.getGoodsList(true);
          }, 500);
        },
        //加入购物车
        addCart:function(productId){
          let _this=this;
           axios.post("/goods/addCart",{"productId":productId}).then((response)=>{
             let res=response.data;
             if(res.status==0){
               console.log("添加成功");
               /*_this.alertInfo("添加成功","success")*/
               _this.modelVisible_cart=true;
             }else{
               console.log("添加失败");
               /*_this.alertInfo(res.msg,"warning");*/
               _this.modelVisible=true;
             }
           })
        },
        closeModel(modelVisible){
           this.modelVisible=modelVisible;
        },
        closeCartModel(modelVisible){
          this.modelVisible_cart=modelVisible||false
        },
        getActiveIndex:function(index){
          this.filterIndex=index;
          this.pageInfo.currentPage=1;
          this.goodsList=[];
          this.getGoodsList();
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
        }
      }
  };
</script>

<style  lang="scss">
   .goodsList {
     .filterList{
       .cur{
         color:red;
       }
     }
     .goodsCon{
       .el-card{
         margin:15px;
         img{
           display:block;
           max-width:100%;
           height:150px;
         }
         .goodsTextWrapper{
           padding:7px;
           .productName,.salePrice{
             font-size:14px;
             line-height:25px;
           }
         }
       }
       .loadMore{
         height:100px;
         line-height:100px;
         text-align: center;
       }
     }

   }
  .sortBy{
    padding:0 15px;
    &.text-right{
      text-align:right;
    }
    .item{
      display:inline-block;
      width:100px;
      &.cur{
        color:red;
      }
      i{
        color:red;
      }
    }
  }
</style>
