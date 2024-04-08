<template>
  <section class="login_container_bg">
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
              placeholder="输入"
              :prefix-icon="HomeFilled"
            />
          </li>

          <li>
            <el-input
              v-model="inputValueO.password"
              placeholder="输入"
              :prefix-icon="Lock"
            />
          </li>

          <li>
            <el-input
              v-model="inputValueO.phoneTel"
              placeholder="输入"
              :prefix-icon="Iphone"
            />
          </li>  

          <li>
            <el-input
              class="_width1 flBox"
              v-model="inputValueO.loginCaptcha"
              placeholder="输入短信验证码"
              :prefix-icon="Lock"
            />
            <div class="yzm_btn">获取验证码</div>
          </li>  

          <li class="warning"><el-icon><WarningFilled /></el-icon>&nbsp;用户名或密码不正确</li>

          <li>
            <div class="submin_btn" @click="postUserLoginConstFn">登&nbsp;&nbsp;录</div>
          </li>

          <li class="fontsizesmall1"><a href="https://www.trs.com.cn">其它登录方式:&nbsp;<span class="_color1">统一认证登录</span></a></li>

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
import { ref } from "vue";
import { useStore } from "vuex";
import { ElMessage,ElLoading } from "element-plus";
import { HomeFilled,Lock,Iphone } from "@element-plus/icons-vue";

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

    const postUserLoginConstFn = () => {
      const loadingInstance1 = ElLoading.service({ fullscreen: true })
      store.dispatch("postUserLoginFn",{
        loginName:inputValueO.value.loginName||'chengxuefei',
        password:inputValueO.value.password||'7f95e858409fa87fab2db7718cdcb3c9245e4a77a1be9759b79e0a7ab0d46cf80acb0f1ae64aa208cd3300638d9f5f53b73e37dc33f52008146ca5d567b47034ed7e230572eaf7aa988281370fff30ddaf086e842b3f079a2a6a87806976b164475fbbe8e5aea82f5e29d7c81ec4c6edd634184b3bf7b8b3757fe090ef4e3f67',
        loginCaptcha:inputValueO.value.loginCaptcha||'004241',
      })
      .then((D)=>{
        console.log('D',D);
        ElMessage({
          message: '登录成功',
          type: 'success',
          plain: true,
        })
        const { loginUser,appToken,requestToken } = D.data;
        store.commit('MStroeLoginORequestToken',requestToken);//记录 requestToken
        store.commit('MStroeLoginOAppToken',appToken);//记录 appToken
        store.commit('MStroeLoginOLoginUser',JSON.stringify(loginUser));//记录 loginUser

        /* 截止到20240408 这两个sessionStorage 先存上，还不知道用来做什么 */
        sessionStorage.setItem('requestToken',requestToken);
        sessionStorage.setItem('loginUser',JSON.stringify(loginUser));

        store.commit('MStroeLoginOIsLogin',true);//改变登录状态
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
    }


    return {
      inputValueO,
      postUserLoginConstFn,

      HomeFilled,Lock,Iphone,

    };
  },
};
</script>
