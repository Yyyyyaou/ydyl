import store from '@/store';store
import axios from 'axios';



// 创建 axios 实例  
const httpAxiosO = axios.create({  
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url  
  timeout: 10000 // 请求超时时间  
});


// 请求拦截器
httpAxiosO.interceptors.request.use(
  config => {

    const { headers } = config;
    console.log('config',config);
    if(//如果不是用户登录
      !headers.methodName
    ){
      // const { appToken,requestToken } = store.state.StroeLoginO;
      // appToken

      // headers.Authorization = 'Bearer '+requestToken;
      // console.log('headers',headers);
    }
    console.log('config',config);
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
    // 对响应数据做点什么，例如统一处理错误码
    return response;
  },
  error => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);  


export default httpAxiosO;