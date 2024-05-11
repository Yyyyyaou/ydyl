import store from '@/store';
import httpAxiosO from 'ROOT_URL/api/http/httpAxios';


/**
 * 获取用户角色接口
 * 返回结果中的
 * role ： 0代表 普通投稿 1代表国家信息中心 2代表国家发改委
 * userRoleId：是该用户对应角色的主键id
 * authInfo：具体权限
 */
export async function getUserRoleFn() {
    let result = await httpAxiosO.post('web/user/getCurrUserAuthInfo.do');
    console.log('getUserRoleFn result',result);

    if(
      result.data.success
    ){
      const { message } = result.data;
      const role = JSON.parse(message);

      var roleName = '';
      switch(role.role){
        case 0:
          roleName = '外部用户'
          break;
        case 1:
          roleName = '国家信息中心用户'
          break;
        case 2:
          roleName = '国家发改委用户'
          break;
      }
    }
    return roleName
    //外部用户  国家信息中心用户  国家发改委用户
}



/**
 * 在cookie有效期内，不用账号密码登录，获取用户信息
 * @returns 
 */
export function getUserInfoFn(){

  return httpAxiosO({
    url: '/web/user/getLoginUser.do',
    methods:'get',
  })
  .then(async (D)=>{
    console.log('web/user/getLoginUser.do D',D)
    if(!D){
      return;
    }
    const { success,loginUser } = D.data;

    const userRole = await getUserRoleFn();

    //加入 当前角色
    loginUser.CURRENT_ROLE = userRole;//外部用户  国家信息中心用户  国家发改委用户

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
  return store.dispatch('getLanguageListFn').then((D)=>{

    if(!D){
      return;
    } 
    
    const { success,message } = D.data;
    if(success){
      const _message = eval(message)||[];//_message 应为数组
    
      if(
        !Array.isArray(_message)
        ||_message.length===0
        ){//接口有问题时候，没有语种，先搞点假语种
        ['中文','俄文','英文','德文','法文'].forEach((o,i)=>{
          _message.push({
            id:i+1,
            desc:o,
          });
        });
        
      }
      _message.unshift({
        id:0,
        desc:'全部',
      });
      store.commit('MGlobalLanguageList',_message);//记录语种列表
    
    }
    
  })
  .catch((error)=>{
    console.log('error',error);
  });
}
