import { createStore } from 'vuex'
import httpAxiosO from 'ROOT_URL/api/http/httpAxios';

//用户登录信息
const StroeLoginO = {
  isLogin: false,//登录状态，false为未登录
  loginUser:'',//用户信息
  appToken:'',
  requestToken:'',
};

//全局语种列表
const GLOBAL_LANGUAGE_LIST = [];

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

/**
 * 获取语种列表
 * @returns 
 */
async function getLanguageListFn(){
  return await httpAxiosO({
    method: 'get',
    url: '/api/web/language/list.do',
  })
}


export default createStore({
  state: {
    StroeLoginO,
    GLOBAL_LANGUAGE_LIST,
    
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

    //记录全局语种列表
    MGlobalLanguageList(state,languageListP){
      state.GLOBAL_LANGUAGE_LIST = languageListP;
    },


  },
  actions: {
    postUserLoginFn,
    getLanguageListFn,
  },
  modules: {

  }
})
