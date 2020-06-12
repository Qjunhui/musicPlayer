import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局初始化样式
import './assets/css/index.css'
// 阻止启动生产消息
Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(ElementUI)

// import discovery from './views/01.discovery'
// import playlists from './views/02.playlists'
// import songs from './views/03.songs'
// import mvs from './views/04.mvs'
// import result from './views/05.result'
// import playlist from './views/06.playlist'
// import mv from './views/07.mv'

// 解决ElementUI导航栏重复点菜单报错问题
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

// 创建路由
const router = new VueRouter({
  routes:[
    {
      path: '/',
      redirect: '/discovery' // 重定向
      // component: discovery
      // component: resolve => require(['./views/01.discovery'], resolve) // 懒加载
    },
    {
      path: '/discovery',
      component: resolve => require(['./views/01.discovery'], resolve)
    },
    {
      path: '/playlists',
      component: resolve => require(['./views/02.playlists'], resolve)
    },
    {
      path: '/songs',
      component: resolve => require(['./views/03.songs'], resolve)
    },
    {
      path: '/mvs',
      component: resolve => require(['./views/04.mvs'], resolve)
    },
    {
      path: '/result',
      component: resolve => require(['./views/05.result'], resolve)
    },
    {
      path: '/playlist',
      component: resolve => require(['./views/06.playlist'], resolve)
    },
    {
      path: '/mv',
      component: resolve => require(['./views/07.mv'], resolve)
    }
  ]
})

new Vue({
  render: h => h(App),
  // 挂载到Vue实例上
  router
}).$mount('#app')
