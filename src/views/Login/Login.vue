<template>
  <!-- 获取到用户角色 CURRENT_ROLE_Computed 后 再显示 entrance -->
  <section class="login_container_bg" id="login_container_bg_ID"
    :class="CURRENT_ROLE_Computed?'entrance':''"
  >
    <div class="login_container">
      <div class="login_container_1">
        <div class="chnldescA">
          欢迎登录<div class="hengxian"></div>
        </div>
        <!-- end of chnldescA -->
        <ul>
          <li>账号密码登录</li>
          <li>
            <el-input
              v-model="inputValueO.loginName"
              placeholder="请输入用户名"
              :prefix-icon="HomeFilled"
            />
          </li>

          <li>
            <el-input
              v-model="inputValueO.password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              type="password"
            />
          </li>

          <li>
            <el-input
              v-model="inputValueO.phoneTel"
              placeholder="请输入手机号"
              :prefix-icon="Iphone"
              
            />
          </li>  

          <li>
            <el-input
              class="_width1 flBox"
              v-model="inputValueO.loginCaptcha"
              placeholder="请输入短信验证码"
              :prefix-icon="Lock"
            />
            <div class="yzm_btn" @click="getSmsFn">获取验证码</div>
          </li>  

          <li class="warning"><el-icon><WarningFilled /></el-icon>&nbsp;用户名或密码不正确</li>

          <li>
            <div class="submin_btn" @click="postUserLoginConstFn">登&nbsp;&nbsp;录</div>
          </li>

          <li class="fontsizesmall1"><a href="https://www.yidaiyilu.gov.cn/">其它登录方式:&nbsp;<span class="_color1">统一认证登录</span></a></li>

        </ul>

      </div>
      <!-- end of login_container_1 -->
    </div>
    <!-- end of login_container -->
  </section>
</template>


<script>
import "@/assets/PcBaseStyle.css";
import "@/assets/login.less";
import { onMounted, ref,computed, } from "vue";
import { useStore } from "vuex";
import { ElMessage,ElLoading } from "element-plus";
import { HomeFilled,Lock,Iphone } from "@element-plus/icons-vue";
import { 
  getUserInfoFn,
  initLanguageListFn,
}  from 'ROOT_URL/initialization/initSomeValue.js'

import {
  encryptedString,
  setMaxDigits,
  RSAKeyPair,
} from './rsa/RSA.js';


import httpAxiosO from 'ROOT_URL/api/http/httpAxios';


export default {
  name: "LoginPage",
  components: {

  },
  setup() {
    
    //创建store实例
    const store = useStore();
    const inputValueO = ref({
      loginName:'',
      password:'',
      phoneTel:'',
      loginCaptcha:''
    });

    // 获取用户角色
    const CURRENT_ROLE_Computed = computed(()=>{
      return store.state.StroeLoginO.loginUser.CURRENT_ROLE;
    });


// 普通投稿用户 / Trsadmin@123
// 国家发改委 / Trsadmin@123



    const postUserLoginConstFn = async () => {
      const loadingInstance1 = ElLoading.service({ fullscreen: true })

      
      const userPassword = (()=>{
        if(typeof bodyRSA === 'function'){
          // eslint-disable-next-line
          return encryptedString(bodyRSA(setMaxDigits,RSAKeyPair),inputValueO.value.password);
        }else{
          return inputValueO.value.password;
        }
      })()



      console.log('userPassword',userPassword);

      store.dispatch("postUserLoginFn",{
        loginName:inputValueO.value.loginName||'国家信息中心',
        password:inputValueO.value.password?userPassword:'7f95e858409fa87fab2db7718cdcb3c9245e4a77a1be9759b79e0a7ab0d46cf80acb0f1ae64aa208cd3300638d9f5f53b73e37dc33f52008146ca5d567b47034ed7e230572eaf7aa988281370fff30ddaf086e842b3f079a2a6a87806976b164475fbbe8e5aea82f5e29d7c81ec4c6edd634184b3bf7b8b3757fe090ef4e3f67',
        loginCaptcha:inputValueO.value.loginCaptcha||'004241',
      })
      .then((D)=>{
        const { data } = D;
        console.log('用户登录 D',D);
        if(
          !data.success
        ){
          ElMessage({
            message: '登录失败 '+data.message,
            type: 'warning',
            plain: true,
          })
          return;
        }
        ElMessage({
          message: '登录成功',
          type: 'success',
          plain: true,
        })
        
        if(document.querySelector('#login_container_bg_ID')){
          document.querySelector('#login_container_bg_ID').classList.add('exit')
        }

        const { loginUser,appToken,requestToken } = D.data;
        store.commit('MStroeLoginORequestToken',requestToken);//记录 requestToken
        store.commit('MStroeLoginOAppToken',appToken);//记录 appToken
        store.commit('MStroeLoginOLoginUser',JSON.stringify(loginUser));//记录 loginUser


        /* 截止到20240408 这两个sessionStorage 先存上，还不知道用来做什么 */
        sessionStorage.setItem('requestToken',requestToken);
        sessionStorage.setItem('loginUser',JSON.stringify(loginUser));

        Promise.all(
          [
            getUserInfoFn(),//初始化用户信息
            initLanguageListFn(),//初始化语言列表
          ]
        ).then(()=>{
          store.commit('MStroeLoginOIsLogin',true);//改变登录状态 为 登录
        });
        
      })
      .catch((error)=>{
        ElMessage({
          message: '登录失败',
          type: 'error',
          plain: true,
        })
        console.log('error',error);
      })
      .finally(()=>{
        loadingInstance1.close();
      })
      ;
    };

    /**
     * 获取短信验证码
     */
    const getSmsFn = ()=>{
      httpAxiosO({
        method: 'post',
        url: '/web/code/tg/sms.do',
      })
      .then((D)=>{
        console.log('登录短信发送 D',D);
      })
      .catch((error)=>{
        console.log('登录短信发送 error',error);
      })
    };

    /**
     * 获取加密方法 bodyRSA()
    */
    async function encryptionMethods() {

      await httpAxiosO({
          method: "get",
          url: "/web/user/publicKey.do",
          // dataType: "text",
      })
      .then((D)=>{
          console.log('D',D)

          const regExp =  /(?<=function bodyRSA\()/
          const str = D.data.replace(regExp,'setMaxDigits,RSAKeyPair')

          document.querySelector('#encryption')&&document.querySelector('#encryption').remove();
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.id = 'encryption'
          script.text = str;
          document.body.appendChild(script);

      })
      ;
    }
    // end of encryptionMethods


    onMounted(()=>{
      encryptionMethods();
    })


    return {
      inputValueO,
      postUserLoginConstFn,
      getSmsFn,

      HomeFilled,Lock,Iphone,

      CURRENT_ROLE_Computed,

    };
  },
};
</script>
