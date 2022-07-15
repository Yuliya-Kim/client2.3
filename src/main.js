import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import countryFlag from 'vue-country-flag'
import "vuetify/dist/vuetify.min.css"
import './plugins/apexCharts'

Vue.config.productionTip = false

Vue.component('countryFlag', countryFlag)

new Vue({
  router,
  store,
  vuetify,
  countryFlag,
  // apexChart,
  render: h => h(App)
}).$mount('#app')
