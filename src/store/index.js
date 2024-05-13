import { createStore } from 'vuex'
// import httpAxiosO from 'ROOT_URL/api/http/httpAxios';

import {
  ROLESETO,
} from './stateRoleManagement.js';

import {
  getLanguageListFn,
  postUserLoginFn,
  getUserLogoutFn,
  postExternalAuditArticleFn,
  getNeedAuditCountFn,
} from './actionFunctions.js';

import { 
  deleteLogicDeleteFn,
  deletePhysicsDeleteFn,
  deleteDelAllFn,
  getUpdateFn,
  getArticleFindByIdFn,
  getNoticeFindByIdFn,
} from './actionSubmission.js';

import {
  externalAuditArticleFindByIdFn
} from './actionExternal.js';



//用户登录信息
const StroeLoginO = {
  isLogin: false,//登录状态，false为未登录
  loginUser:'',//用户信息
  appToken:'',
  requestToken:'',
};

//全局语种列表
const GLOBAL_LANGUAGE_LIST = [];


//左侧导航小红点
const LeftMenuMessageCount = {};
//系统右下角提示未审核稿件弹窗列表
const SystemUntreatedMessageList = [];
//是否显示提示未审核稿件弹窗
const IsShowSystemUntreatedMessagePopup = false;

export default createStore({
  state: {
    ROLESETO,
    StroeLoginO,
    GLOBAL_LANGUAGE_LIST,

    LeftMenuMessageCount,
    SystemUntreatedMessageList,
    IsShowSystemUntreatedMessagePopup,
    
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
      state.StroeLoginO.loginUser = JSON.parse(loginUserStrP);
    },

    //记录全局语种列表
    MGlobalLanguageList(state,languageListP){
      state.GLOBAL_LANGUAGE_LIST = languageListP;
    },

    //更新为处理消息列表
    MSystemUntreatedMessageList(state,listP){
      state.SystemUntreatedMessageList = listP;
    },
    //更新左侧导航小红点
    MLeftMenuMessageCount(state,paramsP){
      state.LeftMenuMessageCount = paramsP;
    },
    MIsShowSystemUntreatedMessagePopup(state,paramsP){
      state.IsShowSystemUntreatedMessagePopup = paramsP;
    },

  },
  actions: {
    postUserLoginFn,
    getLanguageListFn,
    getUserLogoutFn,
    postExternalAuditArticleFn,
    getNeedAuditCountFn,
    
    deleteLogicDeleteFn,
    deletePhysicsDeleteFn,
    deleteDelAllFn,
    getUpdateFn,
    getArticleFindByIdFn,
    getNoticeFindByIdFn,

    externalAuditArticleFindByIdFn,

  },
  modules: {

  }
})
