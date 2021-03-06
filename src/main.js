import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'

import locale from 'element-ui/lib/locale/lang/es'

import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './utils/error-log' // error log
import * as filters from './filters' // global filters
import Vuesax from 'vuesax'

import 'vuesax/dist/vuesax.css' //Vuesax styles


Vue.use(Vuesax)


Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size,
  locale
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  mounted() {
    //for electron build uncomment next line
    //this.$router.push("/login");
  },
  render: h => h(App)
})
