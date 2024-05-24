<template>
  <el-menu
    :default-active="defaultActive"
    class="aside-menu"
    @select="menuSelect"
  >
    <!-- 普通投稿用户开始 -->
    <template  v-if="CURRENT_ROLE_Computed  === '外部用户'">
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

    </template>

    <!-- 国家信息中心用户开始 -->
    <template  v-if="CURRENT_ROLE_Computed  === '国家信息中心用户'">
      <el-menu-item index="/HomePage">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/ManuscriptAuditing">
        <el-icon><i class="iconfont icon-shenhetongguo" /></el-icon>
        <span>
          审核稿件
          <div class="menuRedMessageCircle" v-show="LeftMenuMessageCountComputed.articleCount"  :title="LeftMenuMessageCountComputed.articleCount">{{ LeftMenuMessageCountComputed.articleCount }}</div>
        </span>
      </el-menu-item>
      <el-menu-item index="/PaperAuditing">
        <el-icon><i class="iconfont icon-huizhong" /></el-icon>
        <span>
          审核报题
          <div class="menuRedMessageCircle" v-show="LeftMenuMessageCountComputed.proposeTopicCount" :title="LeftMenuMessageCountComputed.proposeTopicCount">{{ LeftMenuMessageCountComputed.proposeTopicCount }}</div>
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

    </template>
    <!-- 国家信息中心用户结束 -->

    <!-- 国家发改委用户开始 -->
    <template  v-if="CURRENT_ROLE_Computed  === '国家发改委用户'">
      <el-menu-item index="/HomePage">
        <el-icon><House /></el-icon>
        <span>首页</span>
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
          <div class="menuRedMessageCircle" v-show="LeftMenuMessageCountComputed.articleCount"  :title="LeftMenuMessageCountComputed.articleCount">{{ LeftMenuMessageCountComputed.articleCount }}</div>
        </span>
      </el-menu-item>
      <el-menu-item index="/PaperAuditing">
        <el-icon><i class="iconfont icon-huizhong" /></el-icon>
        <span>
          审核报题
          <div class="menuRedMessageCircle" v-show="LeftMenuMessageCountComputed.proposeTopicCount" :title="LeftMenuMessageCountComputed.proposeTopicCount">{{ LeftMenuMessageCountComputed.proposeTopicCount }}</div>
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

    </template>
    <!-- 国家发改委用户结束 -->


  </el-menu>
</template>

<script>
import { onMounted,computed, watch } from 'vue';
import { useRouter } from "vue-router";
import { useStore } from 'vuex';

export default {
  name: "AsideMenu",
  setup() {

    //创建store实例
    const store = useStore();

    const router = useRouter();
    function menuSelect(key) {
      router.push({ path: key, query: { random:Date.parse(new Date()) } })

      //router.push(key);
    }

    // 获取用户角色
    const CURRENT_ROLE_Computed = computed(()=>{
      return store.state.StroeLoginO.loginUser.CURRENT_ROLE;
    });


    //获取导航栏的小红点
    const LeftMenuMessageCountComputed = computed(()=>{
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

    let defaultActive
    // 监听当前路由
    watch(
      () => router.currentRoute.value,
      (newValue) => {
        let arr = newValue.path.split('/')
        defaultActive = '/'+arr[1]
      },
      { immediate: true }
    );

    return {
      defaultActive,
      menuSelect,
      LeftMenuMessageCountComputed,
      CURRENT_ROLE_Computed,
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
