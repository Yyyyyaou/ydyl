import store from '@/store';
import httpAxiosO from 'ROOT_URL/api/http/httpAxios';


/**
 * 在cookie有效期内，不用账号密码登录，获取用户信息
 * @returns 
 */
export function getUserInfoFn(){
  httpAxiosO({
    url: '/api/web/user/getLoginUser.do',
    methods:'get',
  })
  .then((D)=>{
    console.log('web/user/getLoginUser.do D',D)
    if(!D){
      return;
    }
    const { success,loginUser } = D.data;
    if(success){
      store.commit('MStroeLoginOLoginUser',JSON.stringify(loginUser));//记录语种列表
      store.commit('MStroeLoginOIsLogin',true);//改变登录状态为“登录”
    }


  })
  .catch((error)=>{
    console.log('web/user/getLoginUser.do error',error);
  })
  ;
}


/**
 * 初始化 语种 列表
 * @returns 
 */
export function initLanguageListFn(){
  store.dispatch('getLanguageListFn').then((D)=>{

    if(!D){
      return;
    } 
    
    const { success,message } = D.data;
    if(success){
      const _message = eval(message);
      store.commit('MGlobalLanguageList',_message);//记录语种列表
    
    }
    
  })
  .catch((error)=>{
    console.log('error',error);
  });
  return ;
}