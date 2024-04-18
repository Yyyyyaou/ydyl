/**
 * 为vuex action 提供函数
 */
import httpAxiosO from 'ROOT_URL/api/http/httpAxios';

/**
 * 获取语种列表
 * @returns 
 */
export async function getLanguageListFn(){
  return await httpAxiosO({
    method: 'get',
    url: '/api/web/language/list.do',
  })
}


/**
 * 用户登录接口函数
 * @param ctx store对象
 * @param params 接口所需要的各种字段
 * @returns 
 */
export async function postUserLoginFn(ctx,params){
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
 * 退出登录
 */
export async function getUserLogoutFn(){
  return await httpAxiosO({
    method: 'post',
    url: '/api/web/user/logout.do',
  })
}
// end of getUserLogoutFn
