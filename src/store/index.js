import { createStore } from 'vuex'
import httpAxiosO from 'ROOT_URL/api/http/httpAxios';

//用户登录信息
const StroeLoginO = {
  isLogin: false,//登录状态，false为未登录
  loginUser:'',//用户信息
  appToken:'',
  requestToken:'',
};
/**
 * 用户登录接口函数
 * @param ctx store对象
 * @param params 接口所需要的各种字段
 * @returns 
 */
async function postUserLoginFn(ctx,params){
  ctx
  const { loginName,password,loginCaptcha } = params;
  console.log('params',params);
  const formData = new FormData();
  formData.append('loginName', loginName);
  formData.append('password', password);
  formData.append('isCode', false);
  formData.append('loginCaptcha', loginCaptcha);

  return await httpAxiosO({
    method: 'post',
    url: '/api/web/user/tg/login.do',
    headers:{
      'methodName': 'postUserLoginFn',
    },
    data:formData,
  })

}
//end of postUserLoginFn()




export default createStore({
  state: {
    StroeLoginO,

    
  },
  getters: {

  },
  mutations: {
    //记录是否登录
    MStroeLoginOIsLogin(state,booleanValueP){
      state.StroeLoginO.isLogin = booleanValueP;
    },
    //记录 requestToken
    MStroeLoginORequestToken(state,tokenStrP){
      state.StroeLoginO.requestToken = tokenStrP;
    },
    //记录 appToken
    MStroeLoginOAppToken(state,tokenStrP){
      state.StroeLoginO.appToken = tokenStrP;
    },
    //记录 loginUser
    MStroeLoginOLoginUser(state,loginUserStrP){
      state.StroeLoginO.loginUser = loginUserStrP;
    },




  },
  actions: {
    postUserLoginFn,
  },
  modules: {

  }
})
