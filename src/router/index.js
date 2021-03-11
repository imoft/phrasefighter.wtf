import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { transitionName: 'slide' },

  },
  {
    path: '/setup',
    name: 'Setup',
    meta: { transitionName: 'slide' },
    // route level code-splitting
    // this generates a separate chunk (game.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Setup.vue')
  },
  {
    path: '/gamecanvas',
    name: 'Demo',
    // route level code-splitting
    // this generates a separate chunk (game.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Demo.vue')
  },
  // {
  //   path: '/gamecanvas',
  //   name: 'Game',
  //   // route level code-splitting
  //   // this generates a separate chunk (game.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Game.vue')
  // }
]

const router = new VueRouter({
  routes,
  mode: 'history',

})

export default router
