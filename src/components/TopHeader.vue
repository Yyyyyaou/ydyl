<template>
  <div class="head-style">
    <div class="head-left flexcenter"
    >
      <div
        class="head-logo hoverpointer"
        @click="router.replace({ path: '/' })"
      >
        logo
      </div>
      <div
        class="head-name hoverpointer"
        @click="router.replace({ path: '/' })"
      >
        中国一带一路网投稿平台
      </div>
    </div>
    <div class="head-right flexcenter">
      <div class="flexcenter">
        <!-- <el-avatar shape="square" src="../assets/avatar.png" key="0"/> -->
        <img src="../assets/avatar.png" alt="" srcset="" />
        <span>{{ loginUser.userName }}</span>
        <a href="javascript:;" @click="logoutFn" v-if="!showNoticeDetail">退出</a>
        <i class="iconfont icon-goit" v-show="false"/>
      </div>
    </div>
  </div>
</template>
<script>
import router from '@/router';
import { useStore } from "vuex";
import { ref, watch, } from 'vue';

export default {
  name: "TopHeader",
  setup() {
    const store = useStore();
    const { loginUser } = store.state.StroeLoginO;


    // 退出登录
    function logoutFn(){
      store.dispatch('getUserLogoutFn')
      .then((D)=>{
        console.log('D',D);
        store.commit('MStroeLoginOIsLogin',false);//改变登录状态为“登出”
        router.push({ path: '/' })
      })
    }
    const showNoticeDetail = ref(false)
    // 监听当前路由
    watch(
      () => router.currentRoute.value,
      (newValue) => {
        
        if (
          newValue.path  === '/NoticeDetail'
          || newValue.path === '/PubDetail'
          || newValue.path ==='/OriginDetail'
          || newValue.path ==='/ReproductionDetail'
        ) {
          showNoticeDetail.value = true;
        }else{
          showNoticeDetail.value = false;
        }
      },
      { immediate: true }
    );



    return {
      router,

      loginUser,
      logoutFn,

      showNoticeDetail
    };
  },
};
</script>

<style lang="less" scoped>
.head-logo{
  height: 40px; width: 40px; background: #409eff; line-height: 40px; text-align: center; border-radius: 5px; color: #fff; font-size: 14px; margin: 0 15px 0 15px;
}
.head-name{font-size: 20px; color: #4c4d62; font-weight: 700;}
.head-style {
  height: 58px;
  .head-left {
    //cursor: pointer;
    height: 100%;
    border: 1px solid #e9e7f4;
  }
  .head-right {
    position: absolute;
    right: 0;
    top: 0;
    height: 26px;
    border: 1px solid #e9e7f4;
    padding: 16px 30px;
    >div {
      font-size: 14px;
      span{
        color: #293139;
        margin-left: 20px;
      }
      a{
        color:#4c84ff;
        margin-left: 15px;
      }
      i{
        font-size: 20px;
        color:#4c84ff;
        margin-left: 28px;
      }
    }
  }
}
</style>
