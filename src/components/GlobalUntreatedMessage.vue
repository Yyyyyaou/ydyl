<!-- 
  系统未处理消息提示弹窗
 -->
<template>
  <section class="GlobalPopupsOuter"
    :class = "IsShowSystemUntreatedMessagePopupComputed?'on':''"
  >
    <div class="bell"></div>
    <CircleCloseFilled class="close" @click="closePopupFn" />
    <div class="l">您有待审核稿件，请及时处理。</div>
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
    
    const store = useStore();store
    const SystemUntreatedMessageListComputed = computed(()=>{
      return store.state.SystemUntreatedMessageList
    });
    const IsShowSystemUntreatedMessagePopupComputed = computed(()=>{
      return store.state.IsShowSystemUntreatedMessagePopup
    });


    const router = useRouter();router

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

    });

    return {
      SystemUntreatedMessageListComputed,
      IsShowSystemUntreatedMessagePopupComputed,

      closePopupFn,
    };
  }
}
</script>
<style lang="less" scoped>
.GlobalPopupsOuter{width:332px;height:110px;background:url(@/assets/bell1_1.png) no-repeat center center;background-size:cover;position:fixed;right:34px;bottom:20px;z-index:1000;border-radius:15px;border:2px solid #ccc;transition:1s all;transform:translateY(160px);
  .bell{width:65px;height:65px;background:url(@/assets/bell1.png) no-repeat center center;position:absolute;left:50%;margin-left:-32.5px;margin-top:-32.5px;}
  .l {width:294px;height:50px;line-height:50px;background:#daeefd;border-radius:15px;font-family:'微软雅黑';font-size:16px;font-weight:bold;color:#e85502;text-align: center;margin:45px auto 0;cursor:pointer;}
  a{color:#e85502}
  .close{width:25px;height:25px;color:#fff;position:absolute;right:0;top:0;cursor:pointer;z-index:10;}
  &.on{transform: translateY(0);}
}
</style>