<template>
  <div class="main-style">
    <div class="main-header flexcenter">
      <el-icon><Location /></el-icon>
      <span v-if="!showNoticeDetail">您当前的位置：</span>
      <!-- 面包屑（放到你想要放的template中的位置） -->
      <el-breadcrumb separator="/">
        <!-- <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item> -->
        <template v-for="(item, index) in breadList">
          <el-breadcrumb-item v-if="item.name" :key="index" :to="item.path">{{
            item.meta.title
          }}</el-breadcrumb-item>
        </template>
      </el-breadcrumb>
    </div>
    <router-view :key="$router.currentRoute.value.fullPath"></router-view>
    <div class="main-footer flexcenter">
      <span>地址：北京市西城区宣武门外大街甲1号新华社三工作区</span>
      <span>邮编：100052</span>
      <span>电话：4006123115</span>
      <span>版权所有：中国经济信息社</span>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import router from '@/router';
export default {
  name: "MainContent",
  setup() {
    const route = useRoute();

    const breadList = computed(() => {
      return route.matched.filter((item) => item.meta && item.meta.title);
    });

    const showNoticeDetail  = ref(false)
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
    return {
      breadList,
      showNoticeDetail
    };
  },
};
</script>

<style lang="less" scoped>
.main-style {
  background-color: #f5f6fa;
  .main-header {
    padding-top: 15px;
    padding-left: 35px;
    color: #8d92a4;
    .el-icon,
    .el-icon svg {
      height: 1.5em !important;
      width: 1.5em !important;
    }
    span {
      font-size: 14px;
      margin-left: 10px;
    }
  }
  .main-footer {
    font-size: 14px;
    justify-content: center;
    background-color: #fff;
    height: 60px;
    span{
      margin-right: 30px;
    }
    span:nth-last-child(1){
      margin-right: 0;
    }
  }
}
</style>
