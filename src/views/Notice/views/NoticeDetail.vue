<template>
  <div class="mid-content" data-desc="稿件详情">
    <div class="noticedetail-content">
      <div class="noticedetail-content-title flexcenter">
        {{ articleTitle }}
      </div>
      <div class="noticedetail-content-info flexcenter">
        <span v-if="postUser">作者：{{ postUser }}</span>
        <span v-if="articleSource" class="sx"></span>
        <span v-if="articleSource">稿件来源：{{ articleSource }}</span>
        <span v-if="pubTime" class="sx"></span>
        <span v-if="pubTime">发布时间：{{ pubTime }}</span>
      </div>
      <div class="mid-divider"></div>
      <div class="noticedetail-content-word flexcenter">
        <div v-html="articleHtmlCon"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useStore } from "vuex"
import { useRouter } from "vue-router";
import { ElMessage,ElLoading } from "element-plus";
import { timeFormatFn } from "@/utils/timeFormat.js";timeFormatFn

export default {
  setup() {
    const router = useRouter();
    const { id } = router.currentRoute.value.query;//稿件ID，用来请求稿件详情接口

    const store = useStore();

    const articleTitle = ref('');//稿件标题
    const articleSource = ref('');//稿件来源
    const articleHtmlCon = ref('');//稿件HTML正文
    const postUser = ref('');//投稿人
    const pubTime = ref('');//发布时间

    /**
     * 获取稿件详情
     */
    function getFindByIdAjaxFn(){
      const loadingInstance1 = ElLoading.service({ fullscreen: true })
      store.dispatch('getFindByIdFn',id)
      .then((D)=>{
        console.log('我的投稿-查看 D',D);
        const { data,success } = D.data;
        if(!success){
          ElMessage({
            message: '我的投稿-查看数据请求失败',
            type: 'error',
            plain: true,
          })
          return;
        }
        ElMessage({
          message: '我的投稿-查看数据请求成功',
          type: 'success',
          plain: true,
        })

        articleTitle.value = data.articleTitle;
        articleSource.value = data.articleSource;
        articleHtmlCon.value = data.articleHtmlCon;
        postUser.value = data.postUser;
        pubTime.value = data.pubTime;

      })
      .catch((error)=>{
        console.log('我的投稿-查看 接口请求 error',error);
        ElMessage({
          message: '我的投稿-查看接口请求失败',
          type: 'error',
          plain: true,
        })
      })
      .finally(()=>{
        loadingInstance1.close();
      })
      ;
    }
  

    onMounted(()=>{
      getFindByIdAjaxFn();
    })

    return {
      articleTitle,
      articleSource,
      articleHtmlCon,
      postUser,
      pubTime,
    };
  },
};
</script>
<style scoped lang='less'>
.mid-content {
  padding: 15px 34px;
  .noticedetail-content {
    background: #fff;
    min-height: calc(100vh - 190px);
    .noticedetail-content-title {
      color: #000;
      font-size: 30px;
      font-weight: 700;
      justify-content: center;
      padding-top: 52px;
    }
    .noticedetail-content-info {
      color: #757575;
      font-size: 16px;
      justify-content: center;
      padding-top: 30px;
      .sx {
        width: 1px;
        height: 17px;
        background: #757575;
        margin: 0 24px;
      }
    }
    .mid-divider{
      color: #757575 !important;
      height: 2px;
      margin-top: 13px;
    }
    .noticedetail-content-word{
      padding: 0 110px;
      margin-top: 53px;
      color: #000;
      font-size: 18px;
    }
  }
}
</style>