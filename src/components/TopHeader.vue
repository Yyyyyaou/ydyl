<template>
  <div class="head-style">
    <div class="head-left flexcenter"
      @click="router.replace({ path: '/' })"
    >
      <div
        class="head-logo"
      >
        logo
      </div>
      <div
        class="head-name"
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
        <i class="iconfont icon-goit" />
      </div>
    </div>
  </div>
</template>
<script>
import router from '@/router';
import { useStore } from "vuex";
import { ref, watch,onUnmounted } from 'vue';

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
        ) {
          showNoticeDetail.value = true;
        }else{
          showNoticeDetail.value = false;
        }
      },
      { immediate: true }
    );


    //websocket 开始
    // const SOCKET = new WebSocket("/webSocket/tougaoadmin/web/websocket/"+loginUser.id);
    // SOCKET.addEventListener("open", function (event) {
    //   console.log("连接成功 event",event);
    //   SOCKET.send("Hello Server!");
    // });
    // // Listen for messages
    // SOCKET.addEventListener("message", function (event) {
    //   console.log("Message from server +++++++++++++++++++++++++++++++", event.data);
    // });

    onUnmounted(()=>{
      //关闭 SOCKET
      // SOCKET.close();
    })


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
  .head-left {cursor: pointer;
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
