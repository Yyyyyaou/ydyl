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
      <span>我的数据</span>
    </el-menu-item>
    <el-menu-item index="/StatisticsManuscript">
      <el-icon
        ><i class="iconfont icon-tongjifenxi-xiangmubiaogetongji"
      /></el-icon>
      <span>稿件统计</span>
    </el-menu-item>
    <el-menu-item index="/ManuscriptAuditing">
      <el-icon><i class="iconfont icon-shenhetongguo" /></el-icon>
      <span>
        审核稿件
        <div class="menuRedMessageCircle" v-show="LeftMenuMessageCount.articleCount"  :title="LeftMenuMessageCount.articleCount">{{ LeftMenuMessageCount.articleCount }}</div>
      </span>
    </el-menu-item>
    <el-menu-item index="/PaperAuditing">
      <el-icon><i class="iconfont icon-huizhong" /></el-icon>
      <span>
        审核报题
        <div class="menuRedMessageCircle" v-show="LeftMenuMessageCount.proposeTopicCount" :title="LeftMenuMessageCount.proposeTopicCount">{{ LeftMenuMessageCount.proposeTopicCount }}</div>
      </span>
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
import { onMounted,computed } from 'vue';
import { useRouter } from "vue-router";
import { useStore } from 'vuex';
export default {
  name: "AsideMenu",
  setup() {

    //创建store实例
    const store = useStore();

    const router = useRouter();
    function menuSelect(key) {
      router.push(key);
    }

    //获取导航栏的小红点
    const LeftMenuMessageCount = computed(()=>{
      return store.state.LeftMenuMessageCount;
    });
    /**
     * 导航栏的小红点 和 右下角的消息弹窗提醒
    */
    async function upDateGetNeedAuditCountFn(){
      let isReturn = false;
      await store.dispatch('getNeedAuditCountFn')
      .catch((error)=>{
        console.log('获取导航栏的小红点 和 右下角的消息弹窗提醒 error',error);
        isReturn = true;
      })

      if(isReturn){//如果接口返回错误，则退出
        return;
      }
      return setTimeout(()=>{
        upDateGetNeedAuditCountFn();
      },1000*60*2);
    }
    // end of getNeedAuditCountFn
    
    
    onMounted(() => {
      upDateGetNeedAuditCountFn();
    });

    return {
      menuSelect,
      LeftMenuMessageCount,
    };
  },
};
</script>

<style lang="less" scoped>
.aside-menu {
  background: url("../assets/asidemenu.png");
  height: 100%;
}
.el-menu-item {
  color: #fff;
  font-size: 16px;
  span{position:relative;}
}
.el-menu-item.is-active {
  color: #fff;
  font-size: 16px;
  background-color: #015a9f;
}
.el-menu-item:hover {
  background-color: #015a9f;
}

/* 左侧导航菜单的小红点消息提示 20240428 */
.menuRedMessageCircle{background:rgb(255, 51, 0);width:20px;height:20px;line-height:20px;text-align: center; border-radius:10px;position:absolute;top:4px;right:-16px;color:#fff;overflow:hidden; white-space:nowrap; text-overflow:ellipsis;}
</style>
