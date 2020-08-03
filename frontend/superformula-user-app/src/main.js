import Vue from "vue";
import App from "@/App.vue";
import apolloProvider from "@/appsync";
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import VModal from 'vue-js-modal';
import VueRouter from 'vue-router'

Vue.use(VueRouter)
Vue.use(VueToast);
Vue.use(VModal);

Vue.config.productionTip = false;

const router = new VueRouter({
  routes: []
})

new Vue({
  apolloProvider,
  router,
  render: h => h(App)
}).$mount("#app");