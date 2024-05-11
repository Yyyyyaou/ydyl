import store from '@/store';
import axios from 'axios';
import { ElMessage } from "element-plus";


// 创建 axios 实例  
const httpAxiosO = axios.create({  
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url  
  baseURL: process.env.NODE_ENV === 'development'? '/api' : process.env.VUE_APP_BASE_API, //开发环境就加 /api 前缀
  timeout: 50000 // 请求超时时间  
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
      store.commit('MStroeLoginOIsLogin',false);
      // location.reload();
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