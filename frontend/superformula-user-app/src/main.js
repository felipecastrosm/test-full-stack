import Vue from "vue";
import App from "@/App.vue";
import apolloProvider from "@/appsync";
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import VModal from 'vue-js-modal';

Vue.use(VueToast);
Vue.use(VModal);

Vue.config.productionTip = false;

new Vue({
  apolloProvider,
  render: h => h(App)
}).$mount("#app");