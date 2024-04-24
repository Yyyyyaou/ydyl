<template>
  <div class="createorigin-content">
    <el-form :model="formData" :rules="rules">
      <el-form-item label="稿件标题" prop="articleTitle">
        <el-input v-model="formData.articleTitle" clearable />
      </el-form-item>
      <el-row style="justify-content: space-between">
        <el-col :span="11">
          <el-form-item label="稿件来源" prop="articleSource">
            <el-input v-model="formData.articleSource" clearable></el-input>
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
        <section id="QuillEditorEleID"></section>
      </el-form-item>
      <el-row style="justify-content: space-between">
        <el-col :span="11">
          <el-form-item
            label="司局级审核单"
            prop="auditing"
            class="createorigin-content-upload"
          >
            <el-input
              v-model="formData.auditing"
              clearable
              placeholder="司局级审核单格式doc、pdf、jpg、png"
            ></el-input>
            <el-upload
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            >
              <el-button type="primary" class="createorigin-content-upload-auditing">上传</el-button>
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
              placeholder="附件文件格式doc、pdf、jpg、png"
            ></el-input>
            <el-upload
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            >
              <el-button type="primary">上传</el-button>
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
    <el-button class="createorigin-btngroup-submit" @click="previewAddEditFn">预 览</el-button>
    <el-button class="createorigin-btngroup-reset">重 置</el-button>
  </div>
</template>

<script>
import Quill from 'quill';
import "quill/dist/quill.core.css";

import { onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage,ElLoading,ElMessageBox, } from "element-plus";
// import { timeFormatFn } from "@/utils/timeFormat.js";
import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";

export default {
  setup() {
    //路由实例
    const router = useRouter();
    const { id } = router.currentRoute.value.query;//稿件ID，用来请求稿件详情接口
    
    //vuex实例
    const store = useStore();

    const formData = reactive({});//表单数据
    const rules = reactive({
      articleTitle: [//文章标题
        {
          required: true,
          message: "必填项",
          trigger: "change",
        },
      ],
      articleSource: [//文章来源
        {
          required: true,
          message: "必填项",
          trigger: "change",
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
          trigger: "change",
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
          trigger: "change",
        },
      ]
    });

    const langOptions = reactive([]);
    store.state.GLOBAL_LANGUAGE_LIST.forEach((o)=>{
      langOptions.push({
        value: o.id,
        label: o.desc,
      })
    });


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

        formData.articleTitle = data.articleTitle;//稿件标题
        formData.articleSource = data.articleSource||'';//稿件来源
        formData.articleHtmlCon = data.articleHtmlCon||'';//稿件HTML内容
        formData.articleContent = data.articleContent||'';//稿件文本内容
        QuillEditorInitFn.setText(formData.articleContent);
        formData.language = data.language||'';//语种
        formData.remark = data.remark||'';//备注

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
  

    /**
     * 校验 原创稿件 用户所填表单 各个字段 合法性
     * @param {*} datasOP 
     */
    function checkFieldValueFn(datasOP){
      const { articleTitle,articleSource,language,articleContent } = datasOP;

      let checkResult = true;
      if(
        !articleTitle
      ){
        ElMessage({
          message: '请重新填写稿件标题',
          type: 'warning',
          plain: true,
        })
        checkResult = false;
      }
      if(
        !articleSource
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
        !articleContent
        ||articleContent==='\n'
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
     * articleStatus:0 时
     * 提交稿件到 “草稿箱”列表里
     * articleStatus:1 时
     * 提交稿件到 “我的投稿”列表里     * 
     */
    function postAddEditAjaxFn(articleStatusP){
      const datasO = {
        articleTitle:formData.articleTitle,//稿件标题
        articleSource:formData.articleSource,//稿件来源
        language:formData.language,//语种
        remark:formData.remark,//备注

        articleStatus:articleStatusP,//稿件状态 （-1：已删除，0：草稿，1：已投稿）
      };
      
      datasO.articleHtmlCon = QuillEditorInitFn.getSemanticHTML()//文章HTML内容
      datasO.articleContent = QuillEditorInitFn.getText();//文章文本内容

      //接口传参需要去掉datasO.articleContent 结尾的 \n
      const _regExp1 = /\n$/;
      datasO.articleContent = datasO.articleContent.replace(_regExp1, '');

      if(!checkFieldValueFn(datasO)){//验证各个字段
        return;
      }

      const loadingInstance1 = ElLoading.service({ fullscreen: true })
      httpAxiosO({
        url:'/api/web/article/addEdit.do',
        method:'post',
        data:datasO
      })
      .then((D)=>{
        console.log('原创稿件提交 D',D);
        const { data,success } = D.data;data
        if(!success){
          ElMessage({
            message: '原创稿件提交 接口传参可能有误',
            type: 'error',
            plain: true,
          })
          return;
        }
        ElMessage({
          message: '原创稿件提交成功',
          type: 'success',
          plain: true,
        });

      })
      .catch((error)=>{
        console.log('原创稿件提交 error',error);
        
      })
      .finally(()=>{
        loadingInstance1.close();
      })
    }

    /**
     * 预览稿件
     */
    function previewAddEditFn(){
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
alert(2)
      })
      .catch(() => {
        alert(3)

      })
    }
    // end of previewAddEditFn


    /**
     * 富文本编辑器初始化
     */
    let quillO = null;//富文本编辑器实例
    function QuillEditorInitFn(){

      id&&getFindByIdAjaxFn();//获取稿件详情，以便在当前表单里回显 各个字段值

      const options = {
        debug: 'info',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            [{ 'align': [] }],
            [{ 'size': ['small', 'large', 'huge'] }],
          ],
          history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
          },
        },
        placeholder: '编辑正文内容',
        theme: 'snow'
      };
      quillO = new Quill('#QuillEditorEleID', options);
    }
    QuillEditorInitFn.getText = function(){
      return quillO.getText();
    }
    QuillEditorInitFn.getSemanticHTML = function(){
      return quillO.getSemanticHTML();
    }
    QuillEditorInitFn.setText = function(textP){
      return quillO.setText(textP);
    }
    

    onMounted(()=>{
      QuillEditorInitFn();
    })

    return {
      router,

      formData,
      rules,
      langOptions,

      postAddEditAjaxFn,
      previewAddEditFn,
      QuillEditorInitFn,

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
  :deep(.el-upload-list) {
    display: none;
  }
  .createorigin-content-upload {
    .el-input {
      width: 90%;
    }
    .el-button{
      width: 43px;
      height: 44px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .createorigin-content-upload-auditing{
      background-color: #ff4949;
      border: none;
    }
  }
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