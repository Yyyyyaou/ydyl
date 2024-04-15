import store from '@/store'


//初始化语种列表
export function initLanguageListFn(){
  store.dispatch('getLanguageListFn').then((D)=>{

    if(!D){
      return;
    } 
    
    const { success,message } = D.data;
    if(success){
      const _message = eval(message);
      store.commit('MGlobalLanguageList',_message);//记录语种列表
      store.commit('MStroeLoginOIsLogin',true);//改变登录状态
    }
    
  })
  .catch((error)=>{
    console.log('error',error);
  });
  return ;
}