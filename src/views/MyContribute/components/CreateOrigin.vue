<template>
  <section>
  <div class="createorigin-content">
    <el-form :model="formData" :rules="rules">
      <el-form-item label="稿件标题" prop="articleTitle">
        <el-input v-model="formData.articleTitle" clearable />
      </el-form-item>
      <el-row style="justify-content: space-between">
        <el-col :span="11">
          <el-form-item label="稿件来源" prop="articleSourceName">
            <el-autocomplete
              v-model="formData.articleSourceName"
              :fetch-suggestions="articleSourceQuerySearchFn"
              :trigger-on-focus="true"
              clearable
              style="width:100%;"
              placeholder="请输入来源"
              @select="articleSourceHandleSelectFn"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="语种" prop="language">
            <el-select v-model="formData.language" placeholder="" @change="langSelectChange">
              <el-option
                v-for="item in langOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
<!-- 
让正文区内容 居右的 代码 有问题 先注释掉 20240524.1020
        :class="{ 
          langAyu: (()=>{
            let _boolean = false;
            let _curLanguage =  langOptions.filter((o)=>{
              return formData.language === o.value
            })[0];
            if(
              _curLanguage.label === '阿语'
              || _curLanguage.label === '阿文'
            ){
              _boolean = true;
            }
            return _boolean;
          })()
        }"
 -->
      <el-form-item
        label="稿件正文"
        prop="articleHtmlCon"
        class="createorigin-content-editor"
      >
        <!-- <section id="QuillEditorEleID"></section> -->
        <!-- <textarea id="tinymceEditorEleID" placeholder="编辑正文"></textarea> -->
        <Editor 
          :init="{
            language:'zh_CN',
            plugins: 'lists link image code media',
            file_picker_types: 'image media',
            images_file_types: 'jpg,png,svg,webp',
            video_file_types: 'mp4',
            images_upload_handler:editorImagesUploadHandlerFn,
            video_template_callback: editorVideoTemplateCallbackFn,
            file_picker_callback:editorFilePickerCallbackFn,

            directionality: 'ltr',
            toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | link image media | code language',
            branding:false,//底部logo
            menubar:false,//顶部菜单栏
            resize:false,
            statusbar: false,
            
          }" 
          v-model="editorHTMLContent"
          model-events="change keydown blur focus paste"
          @change="editorChangeFn"
        />

      </el-form-item>
      <el-row style="justify-content: space-between">
        <el-col :span="11">
          <el-form-item
            label="司局级审核单"
            prop="auditing"
            class="createorigin-content-upload"
            data-desc="司局级审核单盒子"
          >

            <el-input
              v-model="formData.auditing"
              clearable
              disabled
              placeholder="司局级审核单格式doc、pdf、jpg、png"
            ></el-input>
            <el-button type="primary" class="createorigin-content-upload-auditing">上传</el-button>
            <!-- 
before-remove 在附件列表删除文件钩子
             -->
            <el-upload
              class="auditingUploadC"
              :action="auditingUploadFilesPostUrl"
              v-model:file-list="auditingUploadFilesArray"
              multiple
              show-file-list
              :on-change="handleAuditingUploadChangeFn"
              :on-error="handleAuditingUploadErrorFn"
              :before-remove="handleAuditingUploadBeforeRemoveFn"
              :on-success="handleAuditingUploadSuccessFn"
              name="files"
              :data="{
                fileText:0,//	0审核单,1附件,2正文
              }"
            >
            </el-upload>

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="附件上传"
            prop="file"
            class="createorigin-content-upload"
          >
            <el-input
              v-model="formData.file"
              clearable
              disabled
              placeholder="附件文件格式doc、pdf、jpg、png"
            ></el-input>
            <el-button type="primary" class="createorigin-content-upload-auditing1">上传</el-button>
            <el-upload
            class="auditingUploadC"
              :action="auditingUploadFilesPostUrl"
              v-model:file-list="auditingUploadFilesArray1"
              multiple
              show-file-list
              :on-change="handleAuditingUploadChangeFn"
              :on-error="handleAuditingUploadErrorFn"
              :before-remove="handleAuditingUploadBeforeRemoveFn"
              :on-success="handleAuditingUploadSuccessFn"
              name="files"
              :data="{
                fileText:1,//	0审核单,1附件,2正文
              }"
            >
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          clearable
          type="textarea"
          :rows="6"
          placeholder="请输入备注信息"
          height
        />
      </el-form-item>
    </el-form>
  </div>
  <div class="createorigin-btngroup flexcenter">
    <el-button class="createorigin-btngroup-save" @click="postAddEditAjaxFn(0)">保存到草稿箱</el-button>
    <el-button class="createorigin-btngroup-submit" @click="previewAddEditFn" data-desc="预 览">提 交</el-button>
    <el-button
      @click="router.go(-1)"
    >返 回</el-button>
    <el-button class="createorigin-btngroup-reset"
      @click="resetFormFn"
    >重 置</el-button>
  </div>

  <el-dialog v-model="dialogNoticeDetailVisible" width="100%" height="80vh">
    <PubDetail ref="NoticeDetailRef" :propsArticleO="formData" :propsId="forPropsGetFindByIdAjaxFnReturnO.id" />
    <div class="createorigin-btngroup flexcenter">
      <el-button class="createorigin-btngroup-submit" @click="postAddEditAjaxFn(1)">提 交</el-button>
      <el-button class="createorigin-btngroup-close" @click="dialogNoticeDetailVisible=false">关 闭</el-button>
    </div>
  </el-dialog>

  <!-- 视频上传进度条dom -->
  <div class="videoUploadProgressC" 
    v-show="videoUploadProgressValue"
  >
    <el-progress :text-inside="true" :stroke-width="26"
    :percentage="videoUploadProgressValue" />
  </div>
  <!-- end of videoUploadProgressC -->

  </section>
</template>

<script>
// import Quill from 'quill';
// import "quill/dist/quill.core.css";
import Editor from '@tinymce/tinymce-vue';
import PubDetail from '@/views/Notice/views/PubDetail.vue';

import { onMounted, reactive,ref,nextTick, toRefs, onBeforeUnmount,watch, } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage,ElLoading,ElMessageBox, } from "element-plus";

// import { timeFormatFn } from "@/utils/timeFormat.js";
import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";


export default {
  components:{
    Editor,
    PubDetail,
  },
  props:{
    forPropsGetFindByIdAjaxFnReturnO:Object,
  },
  setup(props,ctx) {ctx;
    //路由实例
    const router = useRouter();
    
    //vuex实例
    const store = useStore();

    const { forPropsGetFindByIdAjaxFnReturnO } = toRefs(props);

    function langSelectChange(val){val
      // let domtext =document.getElementsByClassName("tox-edit-area__iframe")[0].contentWindow.document.getElementById('tinymce')
      // if(domtext == undefined || domtext == null){
      //   return
      // }
      // if(val == 3){
      //   domtext.style.textAlign = 'right'
      // }
      // else{
      //   domtext.style.textAlign = 'left'
      // }

    }
    // end of langSelectChange

    const formData = reactive({
      articleSource:0,//保存 已有来源（即来源列表接口能查到），则把列表里该来源的 sourceId 赋值给它
      sourceName:'',//如有新增来源（即来源列表接口查不到），则把articleSourceName 赋值给它
      articleSourceName:'',//记录用户输入、显示来源名字的字段
    });//表单数据
    const rules = reactive({
      articleTitle: [//文章标题
        {
          required: true,
          message: "必填项",
          trigger: "blur",
        },
      ],
      articleSourceName:[//稿件来源名字，用来显示
        {
          required: true,
          message: "必填项",
          trigger:'blur',
          // validate:{
          //   callback: (rule, value, callback) => {
          //     if(value === ''){
          //       return new Error('必填项');
          //     }
          //   }
          // },
        },
      ],
      articleSource: [//稿件来源id，用来储存来源id，Number类型
        {
          required: false,
          message: "必填项",
          trigger: "blur",
        },
      ],
      sourceName: [//稿件来源名字，用来储存来源 查询不到的来源名字,即新的来源，Sting类型
        {
          required: false,
          message: "必填项",
          trigger: "blur",
        },
      ],
      language: [//语种
        {
          required: true,
          message: "必填项",
          trigger: "change",
        },
      ],
      articleHtmlCon: [//文章内容
        {
          required: true,
          message: "必填项",
          trigger: "blur",
        },
      ],
      auditing: [//司局级审核单
        {
          required: true,
          message: "必填项",
          //message: "非必填项",
          trigger: "change",
        },
      ],
      remark:[//备注
        {
          required: false,
          message: "非必填项",
        },
      ]
    });


    /**
     * 选中已有来源
     * @param {*} itemP 在来源列表中选中的对象
     */
    function articleSourceHandleSelectFn(itemP){
      formData['articleSource'] = itemP.sourceId;
      formData['sourceName'] = '';
    }
    // end of articleSourceHandleSelectFn

    //保存来源搜索后的结果
    const articleSourceQuerySearchResultsArr = reactive([]);
  
    /**
     * 已有来源查询
     * @param {*} sourceNameP 来源检索词
     */
    async function articleSourceQuerySearchFn(sourceNameP){
      //清空来源搜索结果
      articleSourceQuerySearchResultsArr.splice(
        0,articleSourceQuerySearchResultsArr.length
      );

      await store.dispatch('getSearchFindSourceListFn',sourceNameP||'')
      .then((D)=>{
        
        if(
          Array.isArray(D.data)
          &&D.data.length>0
        ){

          //如果没有 sourceNameP === o.sourceName ，sourceNameP 为 新来源
          let isNewSourceName = false;//false 为 非新来源

          D.data.forEach((o)=>{
            let _o = o;
            _o.value = o.sourceName;
            articleSourceQuerySearchResultsArr.push(_o);

            if( !(sourceNameP === o.sourceName) ){
              isNewSourceName = true;
            }


            //如果用户搜索 词搜索到了来源（即，来源列表包含 搜索词），但用户没点击选中 来源搜索词时候，需要formData.articleSource = o.sourceId
            if(formData.articleSourceName === o.sourceName){//检索词 与 来源名称 精准相同时候
              formData.articleSource = o.sourceId;//表示用的已有来源
              formData.sourceName = '';//清空它，表示不是新来源
            }

          });

          if(
            isNewSourceName
          ){
            formData["sourceName"] = sourceNameP.trim();
            formData["articleSource"] = 0; //把来源id字段设成0，与袁冰 协商后 传0代表没有id
          }

        }else{//没查到结果，说明该检索字符串为新字符串
          formData['sourceName'] = sourceNameP?.trim();
          formData['articleSource'] = 0;//把来源id字段设成0，与袁冰 协商后 传0代表没有id

        }

      })
      .catch((error)=>{
        console.log('error',error);
      })
      ;
      return articleSourceQuerySearchResultsArr
    }
    // end of articleSourceQuerySearchFn


    const langOptions = reactive([]);
    store.state.GLOBAL_LANGUAGE_LIST.forEach((o,i)=>{
      //∵ 这个界面不需要全部
      if(o.desc === '全部'){
        return;
      }
      if(i===1){
        formData.language = o.id;
      }
      langOptions.push({
        value: o.id,
        label: o.desc,
      })
    });


    //附件上传接口地址
    const auditingUploadFilesPostUrl = ref('');
    process.env.NODE_ENV === 'development' ?auditingUploadFilesPostUrl.value ='api/tougaoadmin/web/article/upload':auditingUploadFilesPostUrl.value ='/web/article/upload'

    //附件id集合，袁冰写的代码是不管什么附件类型，都把它的id保存到一个字段里 fileIds，提交使用
    const auditingUploadFilesFileIds = reactive([]);

    //审核单附件列表
    const auditingUploadFilesArray = ref([]);//fileText=0
    //普通附件列表
    const auditingUploadFilesArray1 = ref([]);//fileText=1
    //正文附件列表
    const auditingUploadFilesArray2 = ref([]);//fileText=2
    //正文视频上传进度条相关
    const videoUploadProgressValue = ref(0);


    //审核资质附件
    // const postAddEditAjaxFormData = new FormData();
    function handleAuditingUploadChangeFn(file,files){file,files


    }
    // end of handleAuditingUploadChange

    /**
     * 附件上传成功
     */
    function handleAuditingUploadSuccessFn(response, uploadFile, files){uploadFile, files

      if(response.success){
        ElMessage({
          message: '附件上传成功',
          type: 'success',
          plain: true,
        })
      }
      
      files.forEach((o)=>{

        switch(o.fileText){
          case 0://审核单附件
          auditingUploadFilesArray.value.push(o);
          break;
          case 1://普通附件
          auditingUploadFilesArray1.value.push(o);
          break;
          case 2://正文附件
          // auditingUploadFilesArray2.value.push(o);
          break;
        }

      });

    }
    // end of handleAuditingUploadSuccessFn

    /**
     * 上传文件报错
     * @param {*} error 
     * @param {*} uploadFile 
     * @param {*} uploadFiles 
     */
    function handleAuditingUploadErrorFn(error, uploadFile, uploadFiles){
      console.log('handleAuditingUploadErrorFn error',error);
      console.log('handleAuditingUploadErrorFn uploadFile',uploadFile);
      console.log('handleAuditingUploadErrorFn uploadFiles',uploadFiles);

    }

    /**
     * 删除附件文件之前
     */
    function handleAuditingUploadBeforeRemoveFn(uploadFile, uploadFiles){uploadFiles
      const loadingInstance1 = ElLoading.service({ fullscreen: true });
      const {fileName} = uploadFile.response.data[0];

      return deleteArticleDelFileObjFn(fileName)
      .finally(()=>{
        loadingInstance1.close();
      });
    }
    //end of handleAuditingUploadBeforeRemoveFn



    /**
     * 删除附件接口
     */
    function deleteArticleDelFileObjFn(fileNamep){
      return httpAxiosO({
        url: '/web/article/delFileObj',
        method: 'delete',
        params: {
          fileName:fileNamep,
        }
      })
    }
    // end of deleteArticleDelFileObjFn

    /**
     * 针对非新稿 删除未提交的稿件附件
     */
    function deleteUncommittedArticleDelFileObjFn(){
      //没有id就退出
      if(!forPropsGetFindByIdAjaxFnReturnO.value.id){
        return;
      }

      const fileUnitArr = forPropsGetFindByIdAjaxFnReturnO.value.fileUnit !==''?forPropsGetFindByIdAjaxFnReturnO.value.fileUnit.split(',')
      :
      [];

      const fileAccessoryArr = forPropsGetFindByIdAjaxFnReturnO.value.fileAccessory !==''?forPropsGetFindByIdAjaxFnReturnO.value.fileAccessory.split(',')
      :
      [];

      //审核附件开始
      if(
        auditingUploadFilesArray.value.length
      ){
        if(fileUnitArr.length === 0){//旧稿件中无附件

          auditingUploadFilesArray.value.forEach((o)=>{
            const { response } = o;
            const fileName = response.data[0].fileName
            deleteArticleDelFileObjFn(fileName);
          });

        }else{// 附件列表中 旧稿件中有附件，要排除原有附件，删除新加的附件

          auditingUploadFilesArray.value.forEach((o)=>{
            const { response } = o;
            const fileName = response.data[0].fileName
            if(fileUnitArr.includes(fileName)){
              return false;
            }
            deleteArticleDelFileObjFn(fileName);
          });

        }
        //end of else
      }
      //end of if
      
      //审核附件结束

      //普通附件开始
      if(
        auditingUploadFilesArray1.value.length
      ){
        if(fileAccessoryArr.length === 0){//旧稿件中无附件

          auditingUploadFilesArray1.value.forEach((o)=>{
            const { response } = o;
            const fileName = response.data[0].fileName
            deleteArticleDelFileObjFn(fileName);
          });

        }else{// 附件列表中 旧稿件中有附件，要排除原有附件，删除新加的附件

          auditingUploadFilesArray1.value.forEach((o)=>{
            const { response } = o;
            const fileName = response.data[0].fileName
            if(fileAccessoryArr.includes(fileName)){
              return false;
            }
            deleteArticleDelFileObjFn(fileName);
          });

        }
        //end of else
      }
      //end of if
      //普通附件结束

      //正文附件开始

      //正文附件结束

    }

    /**
     * 资质附件上传
     */
    // function articleFilesUploadFn(){
    //   httpAxiosO({
    //     url: '/web/article/upload',
    //     method: 'post',
    //     data: postAddEditAjaxFormData,
    //   }).then((D)=>{
    //     console.log('D 资质附件上传',D)
    //   }).catch((error)=>{
    //     console.log('资质附件上传 error',error)
    //   })
    // }
    // articleFilesUploadFn
    // end of articleFilesUploadFn


    //富文本编辑器 html正文内容
    const editorHTMLContent = ref('');
    //富文本编辑器 文本正文内容
    const editorTEXTContent = ref('');
    /**
     * 监听编辑器输入
     * a、b 两个参数暂时不知道是什么
     */
    function editorChangeFn(a,b){a;

      //收集正文 TEXT 格式
      editorTEXTContent.value = b.getContent({
        format: 'text'
      });

    }
    // end of editorChangeFn

    /**
     * 正文图片插入（正文图片上传）
     * blobInfo 图片信息
     * succFun 成功回调
     * failFun 失败回调
     */
    function editorImagesUploadHandlerFn(blobInfo, succFun, failFun){
      console.log('editorImagesUploadHandlerFn succFun failFun',blobInfo,succFun,failFun);
      const httpAxiosFormData = new FormData();
      httpAxiosFormData.append('files', blobInfo.blob());
      httpAxiosFormData.append("fileText", 2);//0审核单,1附件,2正文
      return httpAxiosO({
        url: "/web/article/upload",
        method: "post",
        data: httpAxiosFormData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          console.log(progressEvent);
          console.log(progressEvent.loaded);
          console.log(progressEvent.total);
          videoUploadProgressValue.value = Math.floor(progressEvent.loaded/progressEvent.total) * 100;
        },
      })
      .then((D)=>{
        console.log('正文图片上传 D',D);
        const { data,success } = D.data;
        if(!success){
          ElMessage({
            message: "正文图片上传失败",
            type: "error",
            duration: 2000,
          });
          return;
        }

        //该附件id是否已经保存
        let idIsExists = false;
        auditingUploadFilesArray2.value.forEach((o)=>{
          if(o.id === data[0].id){
            idIsExists = true;
          }
        });
        if(!idIsExists){//把正文图片附件收集起来
          auditingUploadFilesArray2.value.push(data[0]);
        }

      
        const { fileName } =  data[0];
        // succFun(`/tougaoadmin/web/article/getobj?fileName=${fileName}`);
        return `/tougaoadmin/web/article/getobj?fileName=${fileName}`
      })
      .finally(()=>{
        videoUploadProgressValue.value = 0;
      })
      ;
    }
    // end of editorImagesUploadHandlerFn

    /**
     * 正文文件插入（正文文件上传）
     * 这里指插入的视频文件
     */
    function editorFilePickerCallbackFn(callbackP,valueP,metaP){
      if(metaP.filetype==='media'){
        console.log('callbackP',callbackP)
        console.log('valueP',valueP)
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.onchange = async function(){
          const file = this.files[0];
          console.log('file',file);
          if(
            !file.name.match(/.mp4$/)
          ){
            ElMessage({
              message: "请上传MP4文件",
              type: "error",
              plain: true,
            });
            return;
          }
          videoUploadProgressValue.value = 1;
          const httpAxiosFormData = new FormData();
          httpAxiosFormData.append("files", file);
          httpAxiosFormData.append("fileText", 2);//0审核单,1附件,2正文
          
          httpAxiosO({
            url: "/web/article/upload",
            method: "post",
            data: httpAxiosFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              console.log(progressEvent);
              console.log(progressEvent.loaded);
              console.log(progressEvent.total);
              videoUploadProgressValue.value = Math.floor(progressEvent.loaded/progressEvent.total) * 100;
            },
          })
          .then((D)=>{
            console.log('正文视频上传 D',D);
            const { data,success } = D.data;
            const {fileName} = data[0];

            if(!success){
              return;
            }

            //该附件id是否已经保存
            let idIsExists = false;
            auditingUploadFilesArray2.value.forEach((o)=>{
              if(o.id === data[0].id){
                idIsExists = true;
              }
            });
            if(!idIsExists){//把正文图片附件收集起来
              auditingUploadFilesArray2.value.push(data[0]);
            }

            callbackP(
              `/tougaoadmin/web/article/getobj?fileName=${fileName}`,
              {
                title:fileName,
              }
            )

          })
          .finally(()=>{
            videoUploadProgressValue.value = 0;
          })
          ;
      
        };
        input.click();
      }
      // end of metaP.filetype==='media'
    }
    //end of editorFilePickerCallbackFn

    /**
     * 视频上传返回格式
     */
    function editorVideoTemplateCallbackFn(data,b){
      console.log('data',data)
      console.log('b',b)
      return `<video width="${data.width}" height="${data.height}"${data.poster ? ` poster="${data.poster}"` : ''} controls="controls">
        <source src="${data.source}"${data.sourcemime ? ` type="${data.sourcemime}"` : ''} />
      </video>
      `
    }
    // end of editorVideoTemplateCallbackFn


    /**
     * 校验 原创稿件 用户所填表单 各个字段 合法性
     * @param {*} datasOP 
     */
    function checkFieldValueFn(datasOP){
      const { articleTitle,articleSource,language,articleHtmlCon,sourceName,articleSourceName,auditing } = datasOP;

      // console.log('sourceName',sourceName);
      // console.log('articleSource',articleSource);
      // console.log('articleTitle',articleTitle);
      // console.log('articleSourceName',articleSourceName);
      

      let checkResult = true;
      if(
        !articleTitle
        ||(articleTitle&&articleTitle?.trim() === '')
      ){
        ElMessage({
          message: '请填写稿件标题',
          type: 'warning',
          plain: true,
        })
        checkResult = false;
      }
      if(
        articleSourceName === ''
        ||
        (
          !articleSource
          && articleSource === 0
        )
        &&
        (
          !sourceName
          ||(sourceName&&sourceName?.trim() === '')
        )
      ){
        ElMessage({
          message: '请填写稿件来源',
          type: 'warning',
          plain: true,
        })
        checkResult = false;
      }
      if(
        !language
      ){
        ElMessage({
          message: '请选择语种',
          type: 'warning',
          plain: true,
        })
        checkResult = false;
      }
      if(
        !articleHtmlCon
        ||articleHtmlCon==='　'
        ||articleHtmlCon==='<p> </p>'
        ||articleHtmlCon==='<p>　</p>'
        ||articleHtmlCon==='<p></p>'
        ||articleHtmlCon===''
        ||articleHtmlCon==='\n'
      ){
        ElMessage({
          message: '请编辑正文内容',
          type: 'warning',
          plain: true,
        })
        checkResult = false;
      }      
      //上传失败 先注释
       console.log(auditing)
      // if(auditing == undefined){
      //   ElMessage({
      //     message: '请上传司局级审核单',
      //     type: 'warning',
      //     plain: true,
      //   })
      //   checkResult = false;
      // }
      return checkResult
    }

    /**
     * articleStatusP:0 时
     * 提交稿件到 “草稿箱”列表里
     * articleStatusP:1 时
     * 提交稿件到 “我的投稿”列表里
     *  
     */
    function postAddEditAjaxFn(articleStatusP){

      //为原创稿件继续采用单独写的
      const datasOArr = []
      const datasO = {
        articleTitle:formData.articleTitle?.trim(),//稿件标题
        articleSource:formData.articleSource||0,//稿件来源
        language:formData.language,//语种
        remark:formData.remark||'',//备注
        articleType:0,//稿件类型 0原创稿件 1转载稿件
        articleStatus:articleStatusP,//稿件状态 （-1：已删除，0：草稿，1：已投稿）
        sourceName:formData.sourceName,//稿件来源名字，用来储存来源 查询不到的来源名字,即新的来源，Sting类型
        articleSourceName:formData.articleSourceName?.trim(),//稿件来源用来显示的字段,String类型
      };


      datasO.articleHtmlCon = editorHTMLContent.value||'';//稿件HTML内容

      datasO.articleContent = editorTEXTContent.value||'';//稿件文本内容


      //审核附件列表
      const _fileUnit = auditingUploadFilesArray.value.map((o)=>{
        if(o.response){

          //收集附件id，只管保存id就好（即便是对附件做了删除操作，也不用删除附件id），不用做清空id操作
          if(
            !auditingUploadFilesFileIds.includes(o.response.data[0].id)
            && o.response.data[0].id !== ''  
          ){
            auditingUploadFilesFileIds.push(o.response.data[0].id);
          }
          return o.response?.data[0].fileName
        }else{
          return;
        }
      });
      //接口 接受附件 字符串 'x1,x2,x3'
      datasO.fileUnit =  _fileUnit.toString();

      //普通附件列表
      const _fileAccessory = auditingUploadFilesArray1.value.map((o)=>{
        if(o.response){
          //收集附件id
          if(
            !auditingUploadFilesFileIds.includes(o.response.data[0].id)
            && o.response.data[0].id !== '' 
          ){
            auditingUploadFilesFileIds.push(o.response.data[0].id);
          }
          return o.response?.data[0].fileName
        }else{
          return;
        }
      });
      //接口 接受附件 字符串 'x1,x2,x3'
      datasO.fileAccessory =  _fileAccessory.toString();

      //正文附件列表
      const _fileHtmlCon = auditingUploadFilesArray2.value.map((o)=>{
          //收集附件id
          if(
            !auditingUploadFilesFileIds.includes(o.id)
            && o.id !== '' 
          ){
            auditingUploadFilesFileIds.push(o.id);
          }
          return o.fileName
      });
      //接口 接受附件 字符串 'x1,x2,x3'
      datasO.fileHtmlCon = _fileHtmlCon.toString();
      //正文附件 特殊，∵用户可以随时 用退格键删除正文区附件  ∴要和 articleHtmlCon 对比 一下
      // eslint-disable-next-line no-useless-escape
      const articleHtmlConRegExp = new RegExp('(?<=api/tougaoadmin/web/article/getobj\?fileName=).+?(\.jpg|\.jpeg|\.png|\.gif|\.svg|\.webp|\.avif|\.ico|\.bmp|\.tiff|\.tif|\.raw|\.cr2|\.nef)','img');
      auditingUploadFilesArray2.value
      editorHTMLContent.value.match(articleHtmlConRegExp)


      //附件id 接口 接收字符串
      datasO.fileIds = auditingUploadFilesFileIds.toString();

      //接口传参需要去掉datasO.articleContent 结尾的 \n
      const _regExp1 = /\n$/;
      datasO.articleContent = datasO.articleContent.replace(_regExp1, '');

      if(!checkFieldValueFn(datasO)){//验证各个字段
        return;
      }

      //接口代码接收流
      // const datasOFormData = new FormData();
      // for(let key in datasO){
      //   datasOFormData.append(key,datasO[key]); 
      // }


      // 如果有 父组件传来的id 说明是 “继续采用”，需要对接口链接 和 请求判断一下，这俩接口应该只有 差 稿件id参数
      const httpAxiosOUrl = (()=>{
        let _url = '';
        if(forPropsGetFindByIdAjaxFnReturnO.value.id){
          _url = '/web/article/update.do';
          // datasOFormData.append('id',forPropsGetFindByIdAjaxFnReturnO.value.id);//父组件传下来的id
          datasO.id = forPropsGetFindByIdAjaxFnReturnO.value.id;
          datasOArr.push(datasO) //
        }else{
          _url = '/web/article/addEdit.do';
        }
        return _url
      })();


      const loadingInstance1 = ElLoading.service({ fullscreen: true });

      httpAxiosO({
        url:httpAxiosOUrl,
        method:'post',
        headers:{
          //这个接口不写 这行会报错
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data:forPropsGetFindByIdAjaxFnReturnO.value.id?datasOArr:JSON.stringify(datasO),
      })
      .then((D)=>{
        console.log('原创稿件提交 D',D);
        const { data,success } = D.data;data
        if(!success){
          ElMessage({
            message: '操作失败 接口传参可能有误',
            type: 'error',
            plain: true,
          })
          return;
        }

        //注释于 20240515.1530 jira YDYL-5 建议删除
        // ElMessage({
        //   message: '原创稿件提交成功',
        //   type: 'success',
        //   plain: true,
        // });

        dialogNoticeDetailVisible.value = false;//关闭详情预览弹窗
        
        //操作完后返回上一级页面
        router.go(-1);

      })
      .catch((error)=>{
        console.log('原创稿件提交 error',error);
      })
      .finally(()=>{
        loadingInstance1.close();
      })
    }

    //是否显示详情预览弹窗
    const dialogNoticeDetailVisible = ref(false);
    //详情组件实例
    const NoticeDetailRef = ref(null);

    /**
     * 预览稿件
     */
    function previewAddEditFn(){

      //为 formData 赋值
      const forFormDataValue = async ()=>{

        formData.articleHtmlCon = editorHTMLContent.value||'';//稿件HTML内容

        formData.articleContent = editorTEXTContent.value||'';//稿件文本内容

        
        //审核附件列表
        formData.fileUnit = auditingUploadFilesArray.value.map((o)=>{
          return o.response?.data[0].fileName || ''
        });

        //普通附件列表
        formData.fileAccessory = auditingUploadFilesArray1.value.map((o)=>{
          return o.response?.data[0].fileName || ''
        });

        if(!checkFieldValueFn(formData)){//验证各个字段
          return;
        }

        dialogNoticeDetailVisible.value = true;//打开详情预览弹窗

        await nextTick();

        NoticeDetailRef.value.readPropsArticleOFn();//执行子组件方法，以便为详情页各个字段赋值

      };

      //查看 中文 字段值 是多少，∵语种列表是不断变化的，中文字段值不一定是 1
      const zhCNValue =  langOptions.filter((o)=>{
        return o.label === '中文';
      })[0]['value'];


      //非要判断 稿件标题是否含有中文，如果不含有中文则  字段 language === 1 时提醒....
      if(
        !/[\u4e00-\u9fa5]/g.test(formData.articleTitle)
        &&typeof formData.articleTitle !== undefined
        &&(formData.articleTitle&&formData.articleTitle?.trim() !== '')
        &&formData.language === zhCNValue
      ){
        //预览前要先 检测一下 标题语种，非中文要给提示
        ElMessageBox.confirm(
          '您输入的“稿件标题”语种不是中文，请修改语种',
          '提示',
          {
            confirmButtonText: '继续预览',
            cancelButtonText: '取消，去修改',
            type: 'warning',
            customClass:'selfElMessageBox'
          }
        )
        .then(() => {
          forFormDataValue();
        })
        .catch(() => {

        })
        return;
      }

      forFormDataValue();

    }
    // end of previewAddEditFn

    //获取来自父组件的 稿件详情的数据
    function getPropsFn(){

      //没有id就退出
      if(!forPropsGetFindByIdAjaxFnReturnO.value.id){
        return;
      }

      console.log('forPropsGetFindByIdAjaxFnReturnO',forPropsGetFindByIdAjaxFnReturnO);
      
      for(let key in forPropsGetFindByIdAjaxFnReturnO.value){
        formData[key] = forPropsGetFindByIdAjaxFnReturnO.value[key];
      }
      //回显来源名字
      formData.articleSourceName = formData.sourceName;
      //保存附件ids 集合
      formData.fileIds.split(',').forEach((o)=>{
        auditingUploadFilesFileIds.push(o);
      });

      console.log('getPropsFn formData',formData);

      editorHTMLContent.value = forPropsGetFindByIdAjaxFnReturnO.value.articleHtmlCon||'';//稿件HTML内容

      editorTEXTContent.value = forPropsGetFindByIdAjaxFnReturnO.value.articleContent||'';//稿件文本内容

      //回显附件列表，因为附件列表是单独的变量 开始
      
      if(!Array.isArray(auditingUploadFilesArray)){
        auditingUploadFilesArray.value = [];
      }
      if(!Array.isArray(auditingUploadFilesArray1)){
        auditingUploadFilesArray1.value = [];
      }
      if(!Array.isArray(auditingUploadFilesArray2)){
        auditingUploadFilesArray2.value = [];
      }

      forPropsGetFindByIdAjaxFnReturnO.value.fileUnit&&forPropsGetFindByIdAjaxFnReturnO.value.fileUnit.split(',').forEach((o)=>{
        auditingUploadFilesArray.value.push({
          name: o,
          url: '',
          id: '',
          response: {
            data: [
              {
                fileName: o,
              }
            ],
          },
        });
      });

      forPropsGetFindByIdAjaxFnReturnO.value.fileAccessory&&forPropsGetFindByIdAjaxFnReturnO.value.fileAccessory.split(',').forEach((o)=>{
        auditingUploadFilesArray1.value.push({
          name: o,
          url: '',
          id: '',
          response: {
            data: [
              {
                fileName: o,
              }
            ],
          },
        });
      });

      forPropsGetFindByIdAjaxFnReturnO.value.fileHtmlCon&&forPropsGetFindByIdAjaxFnReturnO.value.fileHtmlCon.split(',').forEach((o)=>{
        auditingUploadFilesArray2.value.push({
          fileName: o,
        });
      });
      //回显附件列表，因为附件列表是单独的变量 结束

    }
    //end of getPropsFn

    /**
     * 重置页面表单字段，
     * 如果是新建稿件就全部清空
     * 如果是 “继续采用”“编辑” 稿件就回到初始状态
     */
    function resetFormFn(){

    if(//清空正文
        editorHTMLContent.value !== ''
        ||editorHTMLContent.value === '<p></p>'
        ||editorHTMLContent.value === '<br/>'
        ||editorHTMLContent.value === '<br />'
      ){
        editorHTMLContent.value = '';
      }

      for(let key in formData){
        if(//初始化 语种
          key === 'language'
        ){
          formData[key] = langOptions.filter((o)=>{
            return o.label === '中文';
          })[0]['value'];
        }else if(
          key === 'articleHtmlCon'
          ||key === 'articleContent'
        ){
          editorHTMLContent.value = '';
          editorTEXTContent.value = '';
          formData[key] = '';
        }else{
          formData[key] = '';//清空其它字段
        }
      }
      // end of for

      //有id 就是 “继续采用”、“编辑”
      if(
        forPropsGetFindByIdAjaxFnReturnO.value.id
      ){
        getPropsFn();
      }
      // end of if

    }
    // end of resetFormFn

    watch(()=>{

    });

    onMounted(()=>{
      //to do
      getPropsFn();
    })

    onBeforeUnmount(()=>{
      deleteUncommittedArticleDelFileObjFn();
    });

    return {
      router,

      formData,
      rules,
      langOptions,
      langSelectChange,

      articleSourceQuerySearchResultsArr,
      articleSourceHandleSelectFn,
      articleSourceQuerySearchFn,

      dialogNoticeDetailVisible,
      NoticeDetailRef,

      editorHTMLContent,
      editorChangeFn,
      editorImagesUploadHandlerFn,
      editorVideoTemplateCallbackFn,
      editorFilePickerCallbackFn,

      auditingUploadFilesPostUrl,
      auditingUploadFilesArray,
      auditingUploadFilesArray1,
      auditingUploadFilesArray2,
      videoUploadProgressValue,

      handleAuditingUploadChangeFn,
      handleAuditingUploadErrorFn,
      handleAuditingUploadBeforeRemoveFn,
      handleAuditingUploadSuccessFn,
      deleteArticleDelFileObjFn,
      deleteUncommittedArticleDelFileObjFn,

      postAddEditAjaxFn,
      previewAddEditFn,
      resetFormFn,


    };
  },
};
</script>
<style scoped lang='less'>
.createorigin-content {
  padding: 0 185px;
  .el-form-item {
    align-items: center;
  }
  :deep(.el-form-item__label) {
    font-size: 16px;width:120px;
  }
  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    height: 44px;
    background-color: #fff;
  }
  :deep(.el-textarea__inner) {
    font-weight: 300;
    font-size: 16px;
  }
  .createorigin-content-editor {align-items: flex-start;
    :deep(.el-form-item__content) {
      display: block;
    }
    :deep(.ql-editor) {
      min-height: 300px;
    }
  }
  :deep(.auditingUploadC){
    width:100%;
  }
  :deep(.el-upload--text) {position:absolute;left:0;right:0;top:0;height:46px;z-index:2;
  }
  .createorigin-content-upload {position:relative;
    .el-input {
      width: 90%;
    }

  }
}

.createorigin-content-upload-auditing{
  background-color: #ff4949;
  border: none;
  width: 43px;
  height: 44px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.createorigin-content-upload-auditing1{
  background-color: #2c90ff;
  border: none;
  width: 43px;
  height: 44px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.createorigin-btngroup {
  justify-content: center;
  padding-bottom: 45px;
  .el-button {
    height: 45px;
    width: 160px;
    border-radius: 5px;
    font-size: 20px;
  }
  .createorigin-btngroup-save {
    color: #2c90ff;
    background-color: #e8f4ff;
  }
  .createorigin-btngroup-submit {
    color: #fff;
    background-color: #1890ff;
  }
  .createorigin-btngroup-reset, .createorigin-btngroup-close {
    color: #49455c;
    background-color: #e2e3e4;
  }
}
.langAyu{
  :deep(input){
    text-align: right;
    direction: rtl;
  }
}

.videoUploadProgressC{position:fixed;background:rgba(0,0,0,.3);top:0;bottom:0;left:0;right:0;z-index:2000;display:flex;justify-content:center;align-items:center;
  .el-progress{width:80%;}
}

</style>