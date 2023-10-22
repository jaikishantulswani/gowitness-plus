import { createApp } from 'vue'
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import './style.css'
import App from './App.vue'
import router from './plugins/router'

createApp(App).use(router).use(Toast, {
    position: POSITION.TOP_RIGHT,
    transitionDuration: 100
}).mount('#app')
