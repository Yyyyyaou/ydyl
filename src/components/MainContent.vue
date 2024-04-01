<template>
  <div class="main-style">
    <div class="main-header flexcenter">
      <el-icon><Location /></el-icon>
      <span>您当前的位置：</span>
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
    <router-view></router-view>
    <div class="main-footer flexcenter">
      <span>地址：北京市西城区宣武门外大街甲1号新华社三工作区</span>
      <span>邮编：100052</span>
      <span>电话：4006123115</span>
      <span>版权所有：中国经济信息社</span>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
export default {
  name: "MainContent",
  setup() {
    const route = useRoute();

    const breadList = computed(() => {
      return route.matched.filter((item) => item.meta && item.meta.title);
    });
    // watch(
    //   () => route.path,
    //   () => {
    //     //监听路由路径是否发生变化，之后更改面包屑
    //     breadList.value = route.matched.filter(
    //       (item) => item.meta && item.meta.title
    //     );
    //   }
    // );
    return {
      breadList,
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
