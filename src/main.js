import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//执行一下axios
// eslint-disable-next-line
import httpAxiosO from 'ROOT_URL/api/http/httpAxios.js'

//初始化一些值
import { initLanguageListFn }  from 'ROOT_URL/initialization/initSomeValue.js'
initLanguageListFn();




//引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//引入iconfont
import "@/assets/iconfont/iconfont.css";
import "@/assets/style.less";

//引入富文本编辑器Quill
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const app = createApp(App)

//注册element-plus icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.component('QuillEditor', QuillEditor)
app.use(store).use(router).use(ElementPlus).mount('#app')

/* 解决tabs切换table重绘报错问题 ResizeObserver loop completed with undelivered notifications */
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 1);
    super(callback);
  }
}



