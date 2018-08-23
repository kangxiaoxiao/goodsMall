import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import GoodsList from '@/views/goodsList'
import cart from '@/views/cart'
import address from '@/views/address'
import confirmOrder from '@/views/confirmOrder'
import paySuccess from '@/views/paySuccess'

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
    },
    {
      path: '/address',
      name: 'Address',
      component: address
    },{
      path:"/confirmOrder",
      name:"confirmOrder",
      component:confirmOrder
    },{
      path:"/paySuccess",
      name:"paySuccess",
      component:paySuccess
    }

  ]
})
