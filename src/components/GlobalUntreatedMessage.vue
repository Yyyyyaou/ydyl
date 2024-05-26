<!-- 
  系统未处理消息提示弹窗
 -->
<template>
  <section class="GlobalPopupsOuter"
    :class = "IsShowSystemUntreatedMessagePopupComputed?'on':''"
  >
    <div class="bell"></div>
    <CircleCloseFilled class="close" @click="closePopupFn" />
    <div class="l">
      <ul>
        <li v-if="WebsocketAboutSystemUntreatedMessageComputed.needArticleAudit" @click="router.push({path:'/ManuscriptAuditing'})">
          您有待审核稿件，请及时处理。
        </li>
        <li v-if="WebsocketAboutSystemUntreatedMessageComputed.needReportAudit" @click="router.push({path:'/PaperAuditing'})">
          您有待审核报题，请及时处理。
        </li>
      </ul>
    </div>
    <!-- end of l -->
  </section>
</template>
<script>
import { onMounted,computed, watch } from 'vue';
import { useRouter } from "vue-router";
import { useStore } from 'vuex';
import CircleCloseFilled from '@element-plus/icons-vue';
export default {
  components:{
    CircleCloseFilled,
  },
  setup() {
    
    const store = useStore();
    const SystemUntreatedMessageListComputed = computed(()=>{
      return store.state.SystemUntreatedMessageList
    });
    const IsShowSystemUntreatedMessagePopupComputed = computed(()=>{
      return store.state.IsShowSystemUntreatedMessagePopup
    });
    const WebsocketAboutSystemUntreatedMessageComputed = computed(()=>{
      return store.state.WebsocketAboutSystemUntreatedMessage
    });

    const router = useRouter();

    watch([IsShowSystemUntreatedMessagePopupComputed],([IsShowSystemUntreatedMessagePopupComputed])=>{
      if(IsShowSystemUntreatedMessagePopupComputed){
        setTimeout(()=>{
          store.commit('MIsShowSystemUntreatedMessagePopup',false);
        },10000)
      }
    })

    //关闭该弹窗
    function closePopupFn(){
      store.commit('MIsShowSystemUntreatedMessagePopup',false);
    }

    onMounted(()=>{
      //to do
    });

    return {
      router,

      SystemUntreatedMessageListComputed,
      IsShowSystemUntreatedMessagePopupComputed,
      WebsocketAboutSystemUntreatedMessageComputed,

      closePopupFn,
    };
  }
}
</script>
<style lang="less" scoped>
.GlobalPopupsOuter{width:332px;height:162px;background:url(@/assets/bell1_1.png) no-repeat center center;background-size:cover;position:fixed;right:34px;bottom:20px;z-index:1000;border-radius:15px;border:2px solid #ccc;transition:1s all;transform:translateX(calc(100vw + 160px));
  .bell{width:65px;height:65px;background:url(@/assets/bell1.png) no-repeat center center;position:absolute;left:50%;margin-left:-32.5px;margin-top:-32.5px;}
  .l {width:294px;height:90px;line-height:35px;background:#daeefd;border-radius:15px;font-family:'微软雅黑';font-size:16px;font-weight:bold;color:#e85502;text-align: center;margin:45px auto 0;cursor:pointer;}
  a{color:#e85502}
  .close{width:25px;height:25px;color:#fff;position:absolute;right:0;top:0;cursor:pointer;z-index:10;}
  &.on{transform: translateX(0);}
  :deep(ul){
    padding-top:10px;
  }
}
</style>