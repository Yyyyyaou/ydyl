import { createStore } from 'vuex'
// import httpAxiosO from 'ROOT_URL/api/http/httpAxios';
import {
  getLanguageListFn,
  postUserLoginFn,
  getUserLogoutFn,
} from './actionFunctions.js';

import { 
  deleteLogicDeleteFn,
  deletePhysicsDeleteFn,
  deleteDelAllFn,
  getUpdateFn,
  getFindByIdFn,
} from './actionSubmission.js';


//用户登录信息
const StroeLoginO = {
  isLogin: false,//登录状态，false为未登录
  loginUser:'',//用户信息
  appToken:'',
  requestToken:'',
};

//全局语种列表
const GLOBAL_LANGUAGE_LIST = [];



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
    getUserLogoutFn,
    
    deleteLogicDeleteFn,
    deletePhysicsDeleteFn,
    deleteDelAllFn,
    getUpdateFn,
    getFindByIdFn,
  },
  modules: {

  }
})
