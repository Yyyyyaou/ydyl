<template>
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

<script>
import AsideMenu from "@/components/AsideMenu.vue";
import TopHeader from "@/components/TopHeader.vue";
import MainContent from "@/components/MainContent.vue";
// import NoticeDetail from "./views/Notice/views/NoticeDetail.vue";
import { useRouter } from "vue-router";
import { ref, watch } from "vue";
export default {
  components: {
    AsideMenu,
    TopHeader,
    MainContent,
    // NoticeDetail,
  },
  setup() {
    const router = useRouter();
    // 是否显示通知公告详情页面
    const showNoticeDetail = ref(false);
    // 监听当前路由
    watch(
      () => router.currentRoute.value,
      (newValue) => {
        //console.log("newValue", newValue);
        if (newValue.fullPath.indexOf("/Notice/NoticeDetail") != -1) {
          showNoticeDetail.value = true;
        }
      },
      { immediate: true }
    );
    return {
      showNoticeDetail,
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
