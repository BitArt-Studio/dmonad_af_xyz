import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import p5 from 'p5'

window.p5 = p5

createApp(App).mount('#app')
