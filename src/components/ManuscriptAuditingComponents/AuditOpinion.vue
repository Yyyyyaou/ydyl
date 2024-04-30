<template>
  <div class="elpopover-comment" data-desc="审核意见以及提交按钮板块">
    <div class="elpopover-comment-header flexcenter">
      <div class="elpopover-comment-header-divide"></div>
      <span>审核意见</span>
    </div>
    <div class="elpopover-comment-header-textarea">
      <el-input
        v-model="commentTextarea"
        :rows="4"
        type="textarea"
        placeholder="审核通过"
      />
    </div>
    <div class="elpopover-comment-header-radio">
      <el-radio-group v-model="commentRadio">
        <el-radio
          :value="item.value"
          v-for="item in commentRadioData"
          :key="item.value"
          >{{ item.label }}
        </el-radio>
      </el-radio-group>
    </div>
    <div class="elpopover-comment-header-btn flexcenter">
      <el-button @click="postExternalAuditArticleAjaxFn">提交</el-button>
    </div>
  </div>
</template>


<script>
import { reactive, ref, computed, watch,toRefs } from "vue";
import { useStore } from "vuex"
import { ElMessage, ElLoading } from "element-plus";
import { timeFormatFn } from "@/utils/timeFormat.js";

export default {
  props:{
    externalAuditArticleFindByIdOArray:Array,//父组件传过来的对象，储存稿件 各种字段信息，数组的每一项包含一个稿件信息
  },
  setup(props,ctx){

    const { externalAuditArticleFindByIdOArray } = toRefs(props);

    //vuex实例
    const store = useStore();

    //用户角色名字
    const userAuthority = computed(() => {
      return store.state.StroeLoginO.loginUser.CURRENT_ROLE;
    });

    //审核意见
    const commentTextarea = ref('');
    //审核意见Radio
    const commentRadio = ref('');
    const commentRadioData = reactive([]);
    //根据角色把 相应的 审核意见Radio 选项 赋值到commentRadioData
    for(let key in store.state.ROLESETO[userAuthority.value]['auditSign']){
      if(//为审核意见Radio 确定 默认选项
        store.state.ROLESETO[userAuthority.value]['auditSign'][key] === '审核通过'
      ){
        commentRadio.value = key;
        commentTextarea.value = '审核通过'
      }

      commentRadioData.push({
        label:store.state.ROLESETO[userAuthority.value]['auditSign'][key],
        value:key
      });
      
    }
    // end of for...in...

    //详情页提交审核
    function postExternalAuditArticleAjaxFn(){
      const loadingInstance1 = ElLoading.service({ fullscreen: true })
      //接口参数 是个数组，为了批量审核用
      const paramsArr = [];
      
      externalAuditArticleFindByIdOArray.value.forEach((o)=>{

        let _o = {
          externalAuditArticleId:o.externalAuditArticleId,
          srcArticleId:o.srcArticleId,
          externalAuditSign:commentRadio.value,//审核意见 下面的选项 选择了哪个
          externalAuditTime:timeFormatFn(new Date())['YYYY-MM-DD hh:mm:ss'],
          view:commentTextarea.value,
          wcmId:o.wcmId,
        }
        paramsArr.push(_o);
      });


      store.dispatch('postExternalAuditArticleFn',paramsArr)
      .then((D)=>{
        console.log('D 详情页提交审核',D);
        const { data,success } = D.data;data;
        if(!success){
          ElMessage({
            message: '详情页提交审核失败',
            type: 'error',
            plain: true,
          })
          return;
        }
        ElMessage({
          message: '详情页提交审核成功',
          type: 'success',
          plain: true,
        });

        //更新待审核列表
        ctx.emit('TriggerGetNeedAuditCountAjaxFn');
        //更新已处理列表
        ctx.emit('TriggerGetNeedAuditCountAjaxFn1');
        //关闭弹出层
        ctx.emit('TriggerCloseElpopoverCommentFn');
        //更新 导航栏的小红点 和 右下角的消息弹窗提醒
        store.dispatch('getNeedAuditCountFn');
      })
      .catch((error)=>{
        console.log('error 详情页提交审核',error);
      })
      .finally(()=>{
        loadingInstance1.close();
      })
      ;
    }
    // end of postExternalAuditArticleAjaxFn

    watch([commentRadio],([commentRadio])=>{
      switch(commentRadio){
        case '1_2'://审核通过
          commentTextarea.value = '审核通过';
        break;
        case '2_2'://审核通过
          commentTextarea.value = '审核通过';
        break;
        case '1_1'://审核未通过
          commentTextarea.value = '审核未通过';
        break;
        case '2_1'://审核未通过
          commentTextarea.value = '审核未通过';
        break;
      }
    })

    
    return {
      commentTextarea,
      commentRadio,
      commentRadioData,

      postExternalAuditArticleAjaxFn,
    }
  }
}
</script>

<style lang="less" scoped>
  .elpopover-comment {
    height: 300px;
    background-color: #f5f6fa;
    padding: 0 47px;
    .elpopover-comment-header {
      padding-top: 30px;
      .elpopover-comment-header-divide {
        width: 5px;
        height: 20px;
        border-radius: 5px;
        background-color: #1890ff;
      }
      span {
        font-size: 20px;
        font-weight: 700;
        color: #000;
        margin-left: 20px;
      }
    }
    .elpopover-comment-header-textarea {
      margin-top: 15px;
    }
    .elpopover-comment-header-radio {
      margin-top: 15px;
    }
    .elpopover-comment-header-btn {
      margin-top: 15px;
      justify-content: center;
      .el-button {
        width: 240px;
        height: 45px;
        border-radius: 5px;
        background-color: #1890ff;
        color: #fff;
      }
    }
  }
</style>