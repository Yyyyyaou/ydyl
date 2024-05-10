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
        <div class="htmlContentC" v-html="articleHtmlCon"></div>
      </div>
      <!-- 没数据时不显示 -->
      <div>
        <!-- v-if -->
        <div class="mid-dividerdashed"></div>
        <div class="noticedetail-bottom-content">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="110">司局审批单：</td>
              <td>
                <div class="noticedetail-bottom-content-img">
                  <div 
                    v-for="(o,i) in fileUnit"
                    :key="o+i"
                    :data-url="o.fileUrl"
                    :data-name="o.fileName"
                    @click="triggerHandleAuditingGetobjFn(o.fileName)"
                    title="点击下载"
                  >
                    <span v-if="!o.isPicture">{{ o.fileName }}</span>
                    <img v-if="o.isPicture" :src="o.fileUrl" alt="" />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td width="110">附　　　件：</td>
              <td>
                <div class="noticedetail-bottom-content-img">
                  <div 
                    v-for="(o,i) in fileAccessory"
                    :key="o+i"
                    :data-url="o.fileUrl"
                    :data-name="o.fileName"
                    @click="triggerHandleAuditingGetobjFn(o.fileName)"
                    title="点击下载"
                  >
                    <span v-if="!o.isPicture" data-desc="文件">{{ o.fileName }}</span>
                    <div v-if="o.isPicture" data-desc="图片"><img :src="o.fileUrl" alt="" /></div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td width="110">备　　　注：</td>
              <td>
                {{ remark }}
              </td>
            </tr>
          </table>
          
        </div>
        <!-- end of noticedetail-bottom-content -->


      </div>
      <!-- 没数据时不显示 -->
      <div class="mid-divider" style="margin-top:53px;"></div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs, } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage, ElLoading } from "element-plus";
import { timeFormatFn } from "@/utils/timeFormat.js";


import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";


export default {
  props: {
    propsId: {//稿件ID，用来请求稿件详情接口
      type: String,
      default: "",
    },
    propsArticleO:{//用于 弹出层显示详情页，通过它传递
      type: Object,
      default: () => {
        return {};
      },
    }
  },
  setup(props,ctx) {

    const { propsArticleO } = toRefs(props);

    const router = useRouter();
    const { id } = router.currentRoute.value.query; //稿件ID，用来请求稿件详情接口

    const store = useStore();

    const articleTitle = ref(""); //稿件标题
    const articleSource = ref(""); //稿件来源
    const articleHtmlCon = ref(""); //稿件HTML正文
    const postUser = ref(""); //投稿人
    const pubTime = ref(""); //发布时间
    const remark = ref("");//备注
    const fileUnit = reactive([]);//审核单附件
    const fileAccessory = reactive([]);//普通附件

    /**
     * 当详情信息对象 通过 propsArticleO 传进来时
     */
    function readPropsArticleOFn(){
      console.log('propsArticleO',propsArticleO);

      articleTitle.value = propsArticleO.value.articleTitle||'';
      articleSource.value = propsArticleO.value.articleSource||'';
      articleHtmlCon.value = propsArticleO.value.articleHtmlCon||'';
      
      //这个字段为投稿人，但‘web/user/getLoginUser.do’接口暂时没返回 postUser，所以暂用 userName 顶替
      postUser.value = store.state.StroeLoginO.loginUser.postUser||store.state.StroeLoginO.loginUser.userName;
      
      
      pubTime.value = timeFormatFn(new Date().getTime())['YYYY-MM-DD'];
      remark.value = propsArticleO.value.remark||'';


      //审核附件列表
      fileUnit.splice(0,fileUnit.length);
      propsArticleO.value.fileUnit.forEach(async (o)=>{

        //如果没有附件名字
        if(!o){
          return;
        }

        const isPicture = /.png$|.jpg$|.jpeg$|.gif$|.bmp$/.test(o);
        let fileUrl
        if(isPicture){//有图片时候
          fileUrl = await handleAuditingGetobjFn(o);
        }

        const _o = {
          isPicture,
          fileUrl,
          fileName: o,
        }

        fileUnit.push(_o);
      });
      //普通附件列表
      fileAccessory.splice(0,fileAccessory.length);
      propsArticleO.value.fileAccessory.forEach(async (o)=>{

        //如果没有附件名字
        if(!o){
          return;
        }
        
        const isPicture = /.png$|.jpg$|.jpeg$|.gif$|.bmp$/.test(o);
        let fileUrl
        if(isPicture){//有图片时候
          fileUrl = await handleAuditingGetobjFn(o);
        }

        const _o = {
          isPicture,
          fileUrl,
          fileName: o,
        }

        fileAccessory.push(_o);
      });

      console.log('propsArticleO.value',propsArticleO.value);

    }
    // end of readPropsArticleOFn
    
    ctx.expose({
      readPropsArticleOFn,
    });

    /**
     * 获取稿件详情
     */
    async function getFindByIdAjaxFn() {

      if (!id) {
        return;
      }

      const loadingInstance1 = ElLoading.service({ fullscreen: true });
      store
        .dispatch("getFindByIdFn", id)
        .then((D) => {
          console.log("我的投稿-查看 D", D);
          const { data, success } = D.data;
          if (!success) {
            ElMessage({
              message: "我的投稿-查看数据请求失败",
              type: "error",
              plain: true,
            });
            return;
          }
          ElMessage({
            message: "我的投稿-查看数据请求成功",
            type: "success",
            plain: true,
          });

          articleTitle.value = data.articleTitle;
          articleSource.value = data.articleSource;
          articleHtmlCon.value = data.articleHtmlCon;
          postUser.value = data.postUser;
          pubTime.value = data.pubTime;
          remark.value = data.remark;

          //为 fileUnit 赋值
          (() => {
            if(!data.fileUnit){
              return;
            }

            data.fileUnit.split(',').forEach(async (o)=>{
              const isPicture = /.png$|.jpg$|.jpeg$|.gif$|.bmp$/.test(o);
              let fileUrl
              if(isPicture){//有图片时候
                fileUrl = await handleAuditingGetobjFn(o);
              }

              const _o = {
                isPicture,
                fileUrl,
                fileName: o,
              }

              fileUnit.push(_o);
            });
          })();

          //为 fileAccessory 赋值
          (() => {
            if(!data.fileAccessory){
              return;
            }

            data.fileAccessory.split(',').forEach(async (o)=>{
              const isPicture = /.png$|.jpg$|.jpeg$|.gif$|.bmp$/.test(o);
              let fileUrl
              if(isPicture){//有图片时候
                fileUrl = await handleAuditingGetobjFn(o);
              }

              const _o = {
                isPicture,
                fileUrl,
                fileName: o,
              }

              fileAccessory.push(_o);
            });
          })();


        })
        .catch((error) => {
          console.log("我的投稿-查看 接口请求 error", error);
          ElMessage({
            message: "我的投稿-查看接口请求失败",
            type: "error",
            plain: true,
          });
        })
        .finally(() => {
          loadingInstance1.close();
        });
    }

    /**
    * 附件下载接口，这里用于图片预览
    * fileNameP 文件名 xxx.jpg xxx.pdf
    * downloadP 是否下载
    */
    async function handleAuditingGetobjFn(fileNameP,downloadP){

      if(downloadP){//下载
        window.open('/api/web/article/getobj?fileName='+fileNameP+'&download=true');
        return;
      }


      let fileUrl = '';
      await httpAxiosO({
        url: '/api/web/article/getobj',
        method: 'get',
        responseType:'blob',//响应类型
        params: {
          fileName:fileNameP,
        }
      })
      .then((D)=>{
        const {data} = D;

        return new Promise((resolve, reject) => {  
          const fileReader = new FileReader();  
          fileReader.onloadend = () => resolve(fileReader.result); // 读取完成，解析结果  
          fileReader.onerror = reject;  
          fileReader.readAsDataURL(data); // 将Blob对象转换为Data URL 
        
        });  

      })
      .then((fileReader)=>{
        fileUrl = fileReader;
      });
      return fileUrl;
    }
    // end of handleAuditingGetobjFn

    async function triggerHandleAuditingGetobjFn(fileNameP){
      await handleAuditingGetobjFn(fileNameP,'download');
    }

    onMounted(() => {
      // readPropsArticleOFn();
      getFindByIdAjaxFn();
    });

    return {
      articleTitle,
      articleSource,
      articleHtmlCon,
      postUser,
      pubTime,
      remark,
      fileUnit,
      fileAccessory,

      handleAuditingGetobjFn,
      triggerHandleAuditingGetobjFn,

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
    .mid-divider {
      color: #757575 !important;
      height: 2px;
      margin-top: 13px;
    }
    .mid-dividerdashed {
      border-bottom: 1px #757575 dashed;
      margin: 0 1%;
      margin-top: 53px;
    }
  }
}
.htmlContentC{font-size:18px;line-height:2.6em;padding:20px;overflow:hidden;
  &>*{padding:10px 0;}
}

.noticedetail-bottom-content {padding: 0 110px; margin-top: 53px; font-size: 18px; color: #000;
  .noticedetail-bottom-content-img {
    display: flex;flex-wrap:wrap;
    >div{width:110px;height:145px;flex:0 0 auto;margin:5px;cursor:pointer;word-break: break-all;display:flex;align-items: center;}
    img{width:100%;height:100%;}
  }
}

</style>