import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (token && to.path === "/") {
    next("/dashboard");
  } else if (!token && to.path !== "/") {
    next("/");
  } else {
    next();
  }
});
