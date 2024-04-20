<template>
  <el-menu
    :default-active="$route.path"
    class="aside-menu"
    @select="menuSelect"
  >
    <el-menu-item index="/HomePage">
      <el-icon><House /></el-icon>
      <span>首页</span>
    </el-menu-item>
    <el-menu-item index="/MyContribute">
      <el-icon><i class="iconfont icon-gaojian" /></el-icon>
      <span>我的投稿</span>
    </el-menu-item>
    <el-menu-item index="/MyUpload">
      <el-icon><i class="iconfont icon-yunshangchuan" /></el-icon>
      <span>我的数据上传</span>
    </el-menu-item>
    <el-menu-item index="/StatisticsManuscript">
      <el-icon
        ><i class="iconfont icon-tongjifenxi-xiangmubiaogetongji"
      /></el-icon>
      <span>稿件统计</span>
    </el-menu-item>
    <el-menu-item index="/ManuscriptAuditing">
      <el-icon><i class="iconfont icon-shenhetongguo" /></el-icon>
      <span>审核稿件</span>
    </el-menu-item>
    <el-menu-item index="/PaperAuditing">
      <el-icon><i class="iconfont icon-huizhong" /></el-icon>
      <span>审核报题</span>
    </el-menu-item>
    <el-menu-item index="/Notice">
      <el-icon><Bell /></el-icon>
      <span>通知公告</span>
    </el-menu-item>
    <el-menu-item index="/Message">
      <el-icon><ChatLineSquare /></el-icon>
      <span>系统消息</span>
    </el-menu-item>
    <el-menu-item index="/Drafts">
      <el-icon><i class="iconfont icon-caogaoxiang" /></el-icon>
      <span>草稿箱</span>
    </el-menu-item>
    <el-menu-item index="/RecycleBin">
      <el-icon><Delete /></el-icon>
      <span>回收站</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  name: "AsideMenu",
  setup() {
    const router = useRouter();
    function menuSelect(key) {
      router.push(key);
    }
    return {
      menuSelect,
    };
  },
};
</script>

<style scoped>
.aside-menu {
  background: url("../assets/asidemenu.png");
  height: 100%;
}
.el-menu-item {
  color: #fff;
  font-size: 16px;
}
.el-menu-item.is-active {
  color: #fff;
  font-size: 16px;
  background-color: #015a9f;
}
.el-menu-item:hover {
  background-color: #015a9f;
}
</style>
