import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import GoodsList from '@/views/goodsList'
import cart from '@/views/cart'

Vue.use(Router)

export default new Router({
  mode:"hash",
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },{
      path: '/goodsList',
      name: 'goodsList',
      component: GoodsList
    },{
      path: '/cart',
      name: 'cart',
      component: cart
    }
  ]
})
