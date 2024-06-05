import store from '@/store';
import axios from 'axios';
import router from '@/router'
import { ElMessage } from "element-plus";
import {
  setPageViewProportionFn
} from "ROOT_URL/initialization/initSomeValue.js"



// 创建 axios 实例  
const httpAxiosO = axios.create({  
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url  
  baseURL: process.env.NODE_ENV === 'development'? '/api/tougaoadmin' : '/tougaoadmin', // 开发环境就加 /api 前缀
  withCredentials:true,
  timeout: (1000*300) // 请求超时时间
});


// 请求拦截器
httpAxiosO.interceptors.request.use(
  config => {

    const { headers } = config;

    if(//如果不是用户登录
      !headers.methodName
    ){
      //to do
    }

    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器  
httpAxiosO.interceptors.response.use(
  response => {

    setPageViewProportionFn();

    // 对响应数据做点什么
    const { data } = response;
    if(
      !data.success
      &&data.noLogin
      &&data.message === '会话超时，请重新登录！'
    ){
      ElMessage({
        message: data.message,
        type: 'warning',
        plain: true,
      })
      store.commit('MStroeLoginOIsLogin',false);//显示登录页
      router.replace({path:'/'});//初始化路由，简单规避切换不同角色登录产生的问题
      
      if(//显示登录页
        document.querySelector('#login_container_bg_ID')
      ){
        document.querySelector('#login_container_bg_ID').classList.add('entrance')
      }

      return;
    }
    return response;
  },
  error => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);  


export default httpAxiosO;