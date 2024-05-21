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
              clearable
              style="width:100%;"
              placeholder="请输入来源"
              @select="articleSourceHandleSelectFn"
            />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="语种" prop="language">
            <el-select v-model="formData.language" placeholder="">
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

            directionality: 'ltr rtl',
            toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | link image media | code language',
            branding:false,//底部logo
            menubar:false,//顶部菜单栏
            resize:false,
            placeholder:'请编辑正文',
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
        <el-col :span="11">
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
    <el-button class="createorigin-btngroup-reset"
      @click="resetFormFn"
    >重 置</el-button>
  </div>

  <el-dialog v-model="dialogNoticeDetailVisible" width="80vw" height="80vh">
    <PubDetail ref="NoticeDetailRef" :propsArticleO="formData" :propsId="forPropsGetFindByIdAjaxFnReturnO.id" />
    <div class="createorigin-btngroup flexcenter">
      <el-button class="createorigin-btngroup-submit" @click="postAddEditAjaxFn(1)">提 交</el-button>
    </div>
  </el-dialog>
  </section>
</template>

<script>
// import Quill from 'quill';
// import "quill/dist/quill.core.css";
import Editor from '@tinymce/tinymce-vue';
import PubDetail from '@/views/Notice/views/PubDetail.vue';

import { onMounted, reactive,ref,nextTick, toRefs } from "vue";
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
          trigger: "blur",
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
          required: false,
          // message: "必填项",
          message: "非必填项",
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
      formData['articleSource'] = itemP.id;
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

      await store.dispatch('getSearchFindSourceListFn',sourceNameP)
      .then((D)=>{

        console.log('D',D);
        
        articleSourceQuerySearchResultsArr.splice(0,articleSourceQuerySearchResultsArr.length);

        if(
          Array.isArray(D.data)
          &&D.data.length>0
        ){
          D.data.forEach((o)=>{
            let _o = o;
            _o.value = o.sourceName;
            articleSourceQuerySearchResultsArr.push(_o);

            //如果用户搜索 词搜索到了来源（即，来源列表包含 搜索词），但用户没点击选中 来源搜索词时候，需要formData.articleSource = o.sourceId
            if(formData.articleSourceName === o.sourceName){//检索词 与 来源名称 精准相同时候
              formData.articleSource = o.sourceId;//表示用的已有来源
              formData.sourceName = '';//清空它，表示不是新来源
            }

          });

          console.log('articleSourceQuerySearchResultsArr',articleSourceQuerySearchResultsArr);

        }else{//没查到结果，说明该检索字符串为新字符串
          formData['sourceName'] = sourceNameP.trim();
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

    //附件id集合，袁冰写的代码是不管什么附件类型，都把它的id保存到一个字段里 fileIds
    const auditingUploadFilesFileIds = reactive([]);

    //审核单附件列表
    const auditingUploadFilesArray = ref([]);//fileText=0
    //普通附件列表
    const auditingUploadFilesArray1 = ref([]);//fileText=1
    //正文附件列表
    const auditingUploadFilesArray2 = ref([]);//fileText=2
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
          auditingUploadFilesArray2.value.push(o);
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
      const {id} = uploadFile.response.data[0];

      return httpAxiosO({
        url: '/web/article/delFileObj',
        method: 'delete',
        params: {
          fileIds:String(id),
        }
      })
      .finally(()=>{
        loadingInstance1.close();
      });
    }
    //end of handleAuditingUploadBeforeRemoveFn

    /**
     * 附件下载接口，这里用于图片预览
     */
    function handleAuditingGetobjFn(fileNameP){
      httpAxiosO({
        url: '/web/article/getobj',
        method: 'get',
        params: {
          fileName:fileNameP,
        }
      })
    }handleAuditingGetobjFn
    // end of handleAuditingGetobjRemoveFn


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
     * a、b 两个参数暂时不知道属于什么对象
     */
    function editorChangeFn(a,b){
      a
      editorTEXTContent.value = b.getContent({
        format: 'text'
      });

    }
    // end of editorChangeFn

    /**
     * 图片上传
     */
    function editorImagesUploadHandlerFn(a,b){
      console.log('a',a)
      console.log('b',b)
      return new Promise((resolved)=>{
        setTimeout(()=>{
          resolved('https://www.trs.com.cn/gjlm_zqnr/sygg/202309/W020230908654837080566.jpg')
        },2000)
      });
    }
    // end of editorImagesUploadHandlerFn

    /**
     * 文件上传拦截
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
          callbackP(
            'https://www.trs.com.cn/virtual-video/xybsjb_2022.11.23shijiebeibobao.mp4',
            {
              title:file.name,
            }
          )
      
        };
        input.click();
      }
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
      const { articleTitle,articleSource,language,articleHtmlCon,sourceName } = datasOP;

      // console.log('sourceName',sourceName);
      // console.log('articleSource',articleSource);
      // console.log('articleTitle',articleTitle);

      let checkResult = true;
      if(
        !articleTitle
        ||(articleTitle&&articleTitle.trim() === '')
      ){
        ElMessage({
          message: '请重新填写稿件标题',
          type: 'warning',
          plain: true,
        })
        checkResult = false;
      }
      if(
        (
          !articleSource
          && articleSource === 0
        )
        &&
        (
          !sourceName
          ||(sourceName&&sourceName.trim() === '')
        )
      ){
        ElMessage({
          message: '请重新填写稿件来源',
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
        articleTitle:formData.articleTitle.trim(),//稿件标题
        articleSource:formData.articleSource,//稿件来源
        language:formData.language,//语种
        remark:formData.remark,//备注
        articleType:0,//稿件类型 0原创稿件 1转载稿件
        articleStatus:articleStatusP,//稿件状态 （-1：已删除，0：草稿，1：已投稿）
        sourceName:formData.sourceName,//稿件来源名字，用来储存来源 查询不到的来源名字,即新的来源，Sting类型
      };


      datasO.articleHtmlCon = editorHTMLContent.value||'';//稿件HTML内容

      datasO.articleContent = editorTEXTContent.value||'';//稿件文本内容

      //清空 auditingUploadFilesFileIds 附件id集合
      auditingUploadFilesFileIds.splice(0,auditingUploadFilesFileIds.length);


      //审核附件列表
      const _fileUnit = auditingUploadFilesArray.value.map((o)=>{
        if(o.response){

          //收集附件id
          if(!auditingUploadFilesFileIds.includes(o.response.id)){
            auditingUploadFilesFileIds.push(o.response.id);
          }
          return o.response?.data[0].fileName
        }else{
          return;
        }
      });
      //接口接受字符串
      datasO.fileUnit =  _fileUnit.toString();

      //普通附件列表
      const _fileAccessory = auditingUploadFilesArray1.value.map((o)=>{
        if(o.response){
          //收集附件id
          if(!auditingUploadFilesFileIds.includes(o.response.id)){
            auditingUploadFilesFileIds.push(o.response.id);
          }
          return o.response?.data[0].fileName
        }else{
          return;
        }
      });
      //接口接受字符串
      datasO.fileAccessory =  _fileAccessory.toString();

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


      const loadingInstance1 = ElLoading.service({ fullscreen: true })
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
        
        //articleStatusP 0 跳到草稿箱 articleStatusP 1 跳到 我的投稿 
        router.push({
          path:articleStatusP?'/MyContribute':'/Drafts'
        });

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
        return o.label == '中文';
      })[0]['value'];


      //非要判断 稿件标题是否含有中文，如果不含有中文则  字段 language === 1 时提醒....
      if(
        !/[\u4e00-\u9fa5]/g.test(formData.articleTitle)
        &&typeof formData.articleTitle !== undefined
        &&(formData.articleTitle&&formData.articleTitle.trim() !== '')
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

      for(let key in forPropsGetFindByIdAjaxFnReturnO.value){
        formData[key] = forPropsGetFindByIdAjaxFnReturnO.value[key];
      }
      formData.articleSourceName = formData.sourceName;


      editorHTMLContent.value = forPropsGetFindByIdAjaxFnReturnO.value.articleHtmlCon||'';//稿件HTML内容

      editorTEXTContent.value = forPropsGetFindByIdAjaxFnReturnO.value.articleContent||'';//稿件文本内容


    }

    /**
     * 重置页面表单字段，
     * 如果是新建稿件就全部清空
     * 如果是“继续采用”稿件就回到初始状态
     */
    function resetFormFn(){
      //如果没有id 就是 新建稿件
      if(
        !forPropsGetFindByIdAjaxFnReturnO.value.id
      ){
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
              return o.label == '中文';
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
        return;
      }
      // end of if

      


    }
    // end of resetFormFn


    onMounted(()=>{
      //to do
      getPropsFn();
    })

    return {
      router,

      formData,
      rules,
      langOptions,

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
      handleAuditingUploadChangeFn,
      handleAuditingUploadErrorFn,
      handleAuditingUploadBeforeRemoveFn,
      handleAuditingUploadSuccessFn,

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
    font-size: 16px;
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
  .createorigin-content-editor {
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
  .createorigin-btngroup-reset {
    color: #49455c;
    background-color: #e2e3e4;
  }
}
</style>