<template>
  <div class="create-style">
    <div class="create-content">

      <!-- 如果有id，说明是要“继续采用” 则不显示“创建稿件” -->
      <div class="create-header flexcenter"
        v-show="!id"
      >创建稿件</div>
      <div class="mid-divider" v-show="!id"><div></div></div>

      <!-- 如果有id，说明是要“继续采用” 则不显示切换按钮 -->
      <div class="create-btngroup flexcenter"
        :style = "id?'visibility: hidden;':''"
      >
        <div
          v-for="(item, index) in btngroupArr"
          :key="index"
          class="create-btngroup-btn hoverpointer"
          :class="{ isSelected: selectIndex == index }"
          @click="btnClick(index)"
        >
          {{ item.name }}
        </div>
        <div class="create-btngroup-i hoverpointer"><i class="iconfont icon-wenhao" /></div>
      </div>
      <div>
        <CreateOrigin v-if="selectIndex === 0"
        :forPropsGetFindByIdAjaxFnReturnO="propsGetFindByIdAjaxFnReturnO"
        />
        <CreateReproduction v-if="selectIndex === 1"
        :forPropsGetFindByIdAjaxFnReturnO="propsGetFindByIdAjaxFnReturnO"
        />
        <CreateUpdate v-if="selectIndex === 2" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref,onMounted, reactive,nextTick, } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import CreateOrigin from "../components/CreateOrigin.vue";
import CreateReproduction from "../components/CreateReproduction.vue";
import CreateUpdate from "../components/CreateUpdate.vue";

import { ElMessage,ElLoading, } from "element-plus";

export default {
  components: {
    CreateOrigin,//原创稿件
    CreateReproduction,//转载稿件
    CreateUpdate,
  },
  setup() {

    //路由实例
    const router = useRouter();
    const { id } = router.currentRoute.value.query;//稿件ID，用来请求稿件详情接口

    //创建stroe实例
    const store = useStore();

    const btngroupArr = ref([
      { name: "原创稿件" },
      { name: "转载稿件" },
      // { name: "数据上传" },//数据上传界面搬到了 数据上传 本栏目页上 注释于20240509.1057
    ]);
    const selectIndex = ref(null);
    function btnClick(index) {
      selectIndex.value = index;
    }


    const propsGetFindByIdAjaxFnReturnO = reactive({
      id,
    });

    /**
    * 获取稿件详情
    */
    async function getFindByIdAjaxFn(){

      //没有id就退出
      if(!id){
        selectIndex.value = 0
        return;
      }

      const loadingInstance1 = ElLoading.service({ fullscreen: true })
      await store.dispatch('getArticleFindByIdFn',id)
      .then(async (D)=>{
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

        //注释于 20240515.1530 jira YDYL-5 建议删除
        // ElMessage({
        //   message: '我的投稿-查看数据请求成功',
        //   type: 'success',
        //   plain: true,
        // })

        for(let key in data){
          if(
            data[key]
            &&data[key] !== 'undefined'
          ){
            propsGetFindByIdAjaxFnReturnO[key] = data[key];
          }else{
            propsGetFindByIdAjaxFnReturnO[key] = '';
          }
        }

        // propsGetFindByIdAjaxFnReturnO.articleTitle = data.articleTitle;//稿件标题
        // propsGetFindByIdAjaxFnReturnO.articleSource = data.articleSource||'';//稿件来源
        
        // propsGetFindByIdAjaxFnReturnO.articleHtmlCon = data.articleHtmlCon||'';//稿件HTML内容

        // propsGetFindByIdAjaxFnReturnO.articleContent = data.articleContent||'';//稿件文本内容

        // propsGetFindByIdAjaxFnReturnO.language = data.language||'';//语种
        // propsGetFindByIdAjaxFnReturnO.remark = data.remark||'';//备注

        console.log('propsGetFindByIdAjaxFnReturnO',propsGetFindByIdAjaxFnReturnO);

        //data.articleType = 0  “原创稿件”
        //data.articleType = 1  “转载稿件”
        selectIndex.value = data.articleType;

        await nextTick();

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
    //end of getFindByIdAjaxFn

    onMounted(async ()=>{
      await getFindByIdAjaxFn();//为了给编辑界面 回显各个字段内容，放在父组件上，是为了减少请求次数，符合 请求顺序
    });

    return {
      btngroupArr,
      selectIndex,
      btnClick,

      id,
      propsGetFindByIdAjaxFnReturnO,
      getFindByIdAjaxFn,
    };
  },
};
</script>
<style scoped lang='less'>
.create-style {
  padding: 15px 34px;
  .create-content {
    min-height: calc(100vh - 190px);
    background: #fff;
    .create-header {
      justify-content: center;
      padding: 35px 0 20px 0;
      font-size: 30px;
      color: #424f63;
    }
    .mid-divider {
      display: flex;
      justify-content: center;
      div {
        width: 67px;
        height: 2px;
        background: #0b6fcd;
      }
    }
    .create-btngroup {
      justify-content: center;
      padding: 30px 0;
      position: relative;
      .create-btngroup-btn {
        width: 115px;
        height: 32px;
        line-height: 32px;
        background: #e8f4ff;
        color: #2c90ff;
        text-align: center;
        border-radius: 8px;
        margin-right: 10px;
        border: 1px solid #d1e9ff;
        font-size: 16px;
      }
      .create-btngroup-btn:nth-last-child(1) {
        margin: 0;
      }
      .isSelected {
        color: #fff;
        background: #1890ff;
      }
      .create-btngroup-i{
        position: absolute;
        right: 193px;
        color: #f2ba6b;
        i{
          font-size: 20px;
        }
      }
    }
  }
}
</style>