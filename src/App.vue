<template>
  <!-- 如果登录了，它才显示开始 -->
  <template v-if="computedStroeLoginIsLoginO">

  <el-container>
    <el-header>
      <div class="headerTitle">
        <TopHeader />
      </div>
    </el-header>
  </el-container>
  <el-container class="container-style" v-if="showNoticeDetail">
    <el-main><MainContent /></el-main>
  </el-container>
  <el-container class="container-style" v-else>
    <el-aside class="ele-scrollbar-hide">
      <AsideMenu />
    </el-aside>
    <el-main><MainContent /></el-main>
  </el-container>

  </template>
  <!-- 如果登录了，它才显示结束 -->
  
  <!-- 显示登录页 -->
  <Login v-if="!computedStroeLoginIsLoginO" />

  <!-- 系统未处理消息提示弹窗 -->
  <GlobalUntreatedMessage />

</template>

<script>
import { useStore } from "vuex"
import AsideMenu from "@/components/AsideMenu.vue";
import TopHeader from "@/components/TopHeader.vue";
import MainContent from "@/components/MainContent.vue";
import Login from "@/views/Login/Login.vue";
import GlobalUntreatedMessage from "@/components/GlobalUntreatedMessage.vue";
import { useRouter } from "vue-router";
import { ref, watch,computed,onUnmounted, } from "vue";

export default {
  components: {
    AsideMenu,
    TopHeader,
    MainContent,
    Login,
    GlobalUntreatedMessage,
  },
  setup() {
    //获取store
    const store = useStore();
    const computedStroeLoginIsLoginO = computed(()=>{
      return store.state.StroeLoginO.isLogin;
    });


    const router = useRouter();
    // 是否显示通知公告详情页面
    const showNoticeDetail = ref(false);
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
    // const SOCKET = new WebSocket("/webSocket/tougaoadmin/web/websocket/1");
    // console.log('SOCKET',SOCKET);
    // SOCKET.addEventListener("open", function (event) {
    //   console.log("连接成功 event",event);
    //   SOCKET.send("Hello Server!");
    // });
    // // Listen for messages
    // SOCKET.addEventListener("message", function (event) {
    //   console.log("Message from server ", event.data);
    // });


    onUnmounted(()=>{
      //关闭 SOCKET
      // SOCKET.close();
    })



    return {
      showNoticeDetail,
      computedStroeLoginIsLoginO,
    };
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: "Source Han Sans CN";
  /* font-family: "MicrosoftYaHei"; */
}
.el-aside {
  width: 247px !important;
}
.el-header {
  padding: 0 !important;
}
.el-main {
  min-height: calc(100vh - 60px);
  padding: 0 !important;
}
.container-style {
  display: flex;
}
</style>
