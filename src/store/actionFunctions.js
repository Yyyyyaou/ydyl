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


/**
 * 外审提交
 * 
 * 外审操作-国家发改委 接口
 * 外审操作-国家信息中心 接口
 * 
    @params 注解 
    externalAuditArticleId 详情 外审id
    srcArticleId 详情 我的投稿id
    externalAuditSign 详情 审核意见 正文下方的 审核意见
    externalAuditTime 详情审核 时 点 提交那一刻的 时间 格式为 2019-01-01 00:00
    view 详情 审核意见 文本域的 内容
    wcmId 详情接口是否返回，如果返回了直接传，如果没返回 传 空字符串''
 */
export async function postExternalAuditArticleFn(ctx,params){ctx
  //根据角色 区分 提交审核接口 地址
  const { CURRENT_ROLE } = ctx.state.StroeLoginO.loginUser;//获取当前登录用户角色
  const { auditInterfaceUrl } = ctx.state.ROLESETO[CURRENT_ROLE];//获取接口地址

  return await httpAxiosO({
    method: 'post',
    url: auditInterfaceUrl,
    data: params
  })
}