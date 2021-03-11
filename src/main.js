import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueAnalytics from 'vue-analytics';

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import './assets/css/buttons.css'
import './assets/css/guide.css'
import './assets/css/faces.css'
import './assets/css/spinners.css'
import './assets/css/tutorial.css'
import './assets/css/video.css'
import './assets/css/winner.css'

Vue.config.productionTip = false

Vue.use(VueAnalytics, {
  id: 'G-BXXJ4SRG0K',
  router
})

Vue.use(BootstrapVue, IconsPlugin)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
