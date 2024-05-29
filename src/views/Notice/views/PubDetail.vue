<template>
  <div class="mid-content" data-desc="稿件详情"
    :class="(languageName==='阿文'||languageName==='阿语')?'awenLauguageC':''"
  >
    <div class="noticedetail-content">
      <div class="noticedetail-content-title flexcenter">
        {{ articleTitle }}
      </div>
      <div class="noticedetail-content-info flexcenter">
        <span v-if="postUser">作者：{{ postUser }}</span>
        <span v-if="sourceName" class="sx"></span>
        <span v-if="sourceName">稿件来源：{{ sourceName }}</span>
        <span v-if="crTime" class="sx"></span>
        <span v-if="crTime">创建时间：{{ crTime }}</span>
      </div>
      <div class="mid-divider"></div>
      <div class="noticedetail-content-word">
        <div class="htmlContentC" v-html="articleHtmlCon" data-desc="PubDetail"></div>
      </div>
      <!-- 没数据时不显示 -->
      <div>
        <!-- v-if -->
        <div class="mid-dividerdashed"></div>
        <div class="noticedetail-bottom-content">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="110" v-show="fileUnit.length">司局审批单：</td>
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
              <td width="110" v-show="fileAccessory.length">附　　　件：</td>
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
                    <img v-if="o.isPicture" :src="o.fileUrl" alt="" />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td width="110" v-show="remark">备　　　注：</td>
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

import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";httpAxiosO

export default {
  props: {
    propsId: {//稿件ID，用来请求稿件详情接口
      type: Number,
      default: 0,
    },
    propsArticleO:{//用于 弹出层显示详情页，通过它传递
      type: Object,
      default: () => {
        return {};
      },
    }
  },
  setup(props,ctx) {

    const URL_IS_API = process.env.NODE_ENV === 'development'?'/api/tougaoadmin':'/tougaoadmin';

    const { propsArticleO,propsId } = toRefs(props);


    const router = useRouter();
    const { id } = router.currentRoute.value.query; //稿件ID，用来请求稿件详情接口

    const store = useStore();

    const articleType = ref(0);//稿件类型 0 原创稿件 1 转载稿件
    const articleTitle = ref(""); //稿件标题
    const sourceName = ref(""); //稿件来源
    const articleHtmlCon = ref(""); //稿件HTML正文
    const postUser = ref(""); //投稿人
    const crTime = ref(""); //创建时间
    const remark = ref("");//备注
    const fileUnit = reactive([]);//审核单附件
    const fileAccessory = reactive([]);//普通附件
    const languageName = ref("");//语种 汉字名字，∵语种列表是不断变化的，id 编码  和  语种 不是永久关联的，∴要随时用随时和 语种列表 匹配

    /**
     * 当详情信息对象 通过 propsArticleO 传进来时
     */
    function readPropsArticleOFn(){
      console.log('propsArticleO',propsArticleO);

      articleTitle.value = propsArticleO.value.articleTitle||'';
      sourceName.value = propsArticleO.value.sourceName||propsArticleO.value.articleSourceName||'';
      articleHtmlCon.value = propsArticleO.value.articleHtmlCon||'';
      
      //这个字段为投稿人，但‘web/user/getLoginUser.do’接口暂时没返回 postUser，所以暂用 userName 顶替
      postUser.value = store.state.StroeLoginO.loginUser.postUser||store.state.StroeLoginO.loginUser.userName;
      
      
      crTime.value = timeFormatFn(new Date().getTime())['YYYY-MM-DD hh:mm:ss'];
      remark.value = propsArticleO.value.remark||'';

      store.state.GLOBAL_LANGUAGE_LIST.forEach((o)=>{
        if(propsArticleO.value.language === o.id){
          languageName.value = o.desc;
        }
      });


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

      if (
        !id//没有地址栏的id 则退出
        ||propsId.value//如果有父组件传递的详情数据 则退出
      ) {
        return;
      }

      const loadingInstance1 = ElLoading.service({ fullscreen: true });
      store
        .dispatch("getArticleFindByIdFn", id)
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

          //注释于 20240515.1530 jira YDYL-5 建议删除
          // ElMessage({
          //   message: "我的投稿-查看数据请求成功",
          //   type: "success",
          //   plain: true,
          // });

          articleType.value = data.articleType;
          articleTitle.value = data.articleTitle;
          sourceName.value = data.sourceName;
          


          //如果是转载稿件
          if(articleType.value){
            articleHtmlCon.value=`<p><a href="${data.srcUrl}" target="_blank">${data.srcUrl}</p>`
          }else{
            articleHtmlCon.value = data.articleHtmlCon;
          }

          postUser.value = data.postUser;
          crTime.value = timeFormatFn(data.crtime)["YYYY-MM-DD hh:mm:ss"];
          remark.value = data.remark;


          store.state.GLOBAL_LANGUAGE_LIST.forEach((o)=>{
            if(data.language === o.id){
              languageName.value = o.desc;
            }
          });


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
        const isPicture = /.png$|.jpg$|.jpeg$|.gif$|.bmp$/.test(fileNameP);
        if(//如果是图片的话
          isPicture
        ){
          const a = document.createElement('a');
          const id ='aDownloadID'+new Date().getTime();
          a.href = `${URL_IS_API}/web/article/getobj?fileName=${fileNameP}`;
          a.download = fileNameP;
          a.target = '_blank';
          a.setAttribute('id',id);
          document.querySelector('body').appendChild(a);
          a.click();
          document.querySelector('#'+id).remove();
          return;
        }
        window.open(URL_IS_API+'/web/article/getobj?fileName='+fileNameP+'&download=true');
        return;
      }


      let fileUrl = URL_IS_API+'/web/article/getobj?fileName='+fileNameP;
      // await httpAxiosO({
      //   url: '/web/article/getobj',
      //   method: 'get',
      //   responseType:'blob',//响应类型
      //   params: {
      //     fileName:fileNameP,
      //   }
      // })
      // .then((D)=>{
      //   const {data} = D;

      //   return new Promise((resolve, reject) => {  
      //     const fileReader = new FileReader();  
      //     fileReader.onloadend = () => resolve(fileReader.result); // 读取完成，解析结果  
      //     fileReader.onerror = reject;  
      //     fileReader.readAsDataURL(data); // 将Blob对象转换为Data URL 
        
      //   });  

      // })
      // .then((fileReader)=>{
      //   fileUrl = fileReader;
      // });
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
      articleType,
      articleTitle,
      sourceName,
      articleHtmlCon,
      postUser,
      crTime,
      remark,
      fileUnit,
      fileAccessory,
      languageName,

      handleAuditingGetobjFn,
      triggerHandleAuditingGetobjFn,

    };
  },
};
</script>
<style scoped>
ul,ol,li{list-style:auto;}
</style>
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
.htmlContentC{font-size:18px;line-height:1.88em;padding:20px;overflow:hidden;color: #000;
  :deep(&>*){padding:10px 0;word-break: break-all;margin-bottom:1.25em;}
  :deep(ul){display: block; list-style-type: disc; margin-block-start: 1em; margin-block-end: 1em; margin-inline-start: 0px; margin-inline-end: 0px; padding-inline-start: 40px; unicode-bidi: isolate;
    li{list-style: initial;}
  }
  :deep(ol){display: block; list-style-type: decimal; margin-block-start: 1em; margin-block-end: 1em; margin-inline-start: 0px; margin-inline-end: 0px; padding-inline-start: 40px; unicode-bidi: isolate;
    li{list-style-type: decimal;}
  }
  :deep(img){max-width:100%;}
}


.noticedetail-bottom-content {padding: 0 110px; margin-top: 53px; font-size: 18px; color: #000;
  .noticedetail-bottom-content-img {
    display: flex;flex-wrap:wrap;
    >div{
      width:110px;height:145px;flex:0 0 auto;margin:5px;cursor:pointer;word-break: break-all;display:flex;align-items: center;justify-content: center;    box-shadow: 0 0 1px 1px #ccc;
    }
    img{
      max-width:100%;max-height:100%;
    }
  }
}
.noticedetail-content-word{max-width:1400px;padding:20px 50px;margin:0 auto;display:flex;justify-content: center;}

.awenLauguageC .noticedetail-content-title{direction: rtl;}
.awenLauguageC .htmlContentC{direction: rtl;}

</style>