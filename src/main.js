// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueLazyload from 'vue-lazyload' //图片懒加载
import infiniteScroll from 'vue-infinite-scroll'  //滚动加载更多
import {currency} from "@/util/currency" //过滤器（货币）
import Vuex from "vuex"


Vue.use(ElementUI);
Vue.use(infiniteScroll);
Vue.use(Vuex);
/*Vue.use(VueLazyload);*/
Vue.use(VueLazyload, {
  loading: '/static/svg-loaders/audio.svg',
  error: '/static/svg-loaders/oval.svg',
  attempt: 1
});
Vue.filter("currency",currency)

Vue.config.productionTip = false


const store=new Vuex.Store({
    state:{
      nickName:"",
      cartCount:0
    },
    mutations:{
      updateUserInfo(state,nickName){
        state.nickName=nickName
      },
      updateCartCount(state,cartCount){
          state.cartCount += cartCount;
      },
      getCartCount(state,cartCount){
         state.cartCount = cartCount;
      }
    }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
