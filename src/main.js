// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

Vue.use(ElementUI);
Vue.use(infiniteScroll);
/*Vue.use(VueLazyload);*/
Vue.use(VueLazyload, {
  loading: '/static/svg-loaders/audio.svg',
  error: '/static/svg-loaders/oval.svg',
  attempt: 1
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})