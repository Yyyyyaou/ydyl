<template>
  <div data-desc="转载稿件组件">
    <div
      class="createreproduction-content flexcenter"
      v-for="(item, index) in dataList"
      :key="item+index"
    >                                 
      <div
        class="createreproduction-content-list"
        :class="{ listfold: dataList[index].fold }"
      >
        <div style="padding: 0 68px">
          <div class="createreproduction-content-list-index">
            {{ index + 1 }}
          </div>
          <div
            class="createreproduction-content-list-foldbtn hoverpointer"
            @click="foldClick(dataList[index])"
          >
            <span v-if="dataList[index].fold"
              ><el-icon><ArrowDown /></el-icon>展开</span
            >
            <span v-else
              ><el-icon><ArrowUp /></el-icon>收起</span
            >
          </div>
          <el-form
            :model="dataList[index]"
            :rules="rules"
            v-if="dataList[index].fold"
          >
            <el-form-item label="稿件标题" prop="articleTitle">
              <el-input v-model="dataList[index].articleTitle" clearable />
            </el-form-item>
          </el-form>
          <el-form :model="dataList[index]" :rules="rules" v-else>
            <el-form-item label="稿件标题" prop="articleTitle">
              <el-input v-model="dataList[index].articleTitle" clearable />
            </el-form-item>
            <el-row style="justify-content: space-between">
              <el-col :span="11">
                <el-form-item label="稿件来源" prop="articleSource">
                  <el-input
                    v-model="dataList[index].articleSource"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="语种" prop="lang">
                  <el-select v-model="dataList[index].language" placeholder="">
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
            <el-form-item label="稿件原地址" prop="url">
              <el-input v-model="dataList[index].url" clearable />
            </el-form-item>
            <el-form-item label="上传附件" prop="fileAccessory" class="auditingUploadFilesArraysOuterC"
            >
              <el-input
                v-model="dataList[index].fileAccessory"
                clearable
                disabled
                placeholder="附件文件格式doc、pdf、jpg、png"
              />
              <el-upload
                class="auditingUploadC"
                :id="'auditingUploadID_'+index"
                action="/api/web/article/upload"
                multiple
                show-file-list
                disabled
                :on-change="handleAuditingUploadChangeFn.bind(this,index)"
                :on-error="handleAuditingUploadErrorFn.bind(this,index)"
                :before-remove="handleAuditingUploadBeforeRemoveFn.bind(this,index)"
                :on-success="handleAuditingUploadSuccessFn"
                name="files"
                :data="{
                  fileText:1,//	0审核单,1附件,2正文
                }"
              >
                <el-button class="u">上传</el-button>
              </el-upload>

            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="dataList[index].remark"
                clearable
                type="textarea"
                :rows="6"
                placeholder="请输入备注信息"
                height
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="createreproduction-btn flexcenter">
        <el-button
          @click="addData()"
          v-if="index == dataList.length - 1"
          class="createreproduction-btn-add"
        >
          <el-icon><Plus /></el-icon>增加
        </el-button>
        <el-button
          @click="deleteData(index)"
          v-if="dataList.length > 1"
          class="createreproduction-btn-delete"
        >
          <el-icon><Minus /></el-icon>删除
        </el-button>
      </div>
    </div>
    <div class="createreproduction-btngroup flexcenter">
      <el-button class="createreproduction-btngroup-save" @click="postAddEditReprintAjaxFn(0)">保存到草稿箱</el-button>
      <el-button class="createreproduction-btngroup-submit" @click="postAddEditReprintAjaxFn(1)">提 交</el-button>
      <el-button class="createreproduction-btngroup-reset">重 置</el-button>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { ElMessage,ElLoading } from "element-plus";
import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";

export default {
  setup() {
    //vuex实例
    const store = useStore();

    const dataList = ref([{}]);
    const rules = reactive({
      articleTitle: [//稿件标题
        {
          required: true,
          message: "必填项",
          trigger: "change",
        },
      ],
      articleSource: [//稿件来源
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
      url: [//稿件原地址
        {
          required: true,
          message: "必填项",
          trigger: "change",
        },
      ],
      fileAccessory:[
        {
          required:false,
          message:'非必填项',
          trigger:'change',
        }
      ],
      remark:[
        {
          required:false,
          message:'非必填项',
          trigger:'change',
        }
      ],
    });

    const langOptions = reactive([]);
    store.state.GLOBAL_LANGUAGE_LIST.forEach((o)=>{
      //∵ 这个界面不需要全部
      if(o.desc === '全部'){
        return;
      }
      langOptions.push({
        value: o.id,
        label: o.desc,
      })
    });

    //普通附件列表

    /**
     * 转载稿件的附件上传 element plus 有问题，
     * 如果 附件列表 变量 为 嵌套复杂对象 
     * 如：reactive([[]])/ref([[]])
     * reactive({[]})/ref({[]})
     * 
     * 用于监听 change 函数 里为 auditingUploadFilesArrays[index] 赋值时 会条目错乱
     * 
     * 如：上传一个文件，会显示两个，上传两个会显示8个，上传3个文件会显示24个
     * 
     * 所以暂时搁置 上传附件开发
     */
    const auditingUploadFilesArrays = reactive([]);
    function handleAuditingUploadChangeFn(indexP,file,files){indexP,file,files;
      if(
        !Array.isArray(auditingUploadFilesArrays[indexP])
      ){
        auditingUploadFilesArrays[indexP] = [];
      }

      console.count();
      console.log('files',files);
      files.forEach((o,i)=>{
        console.log('o,i===========',o,i);
        console.log(document.querySelector('#auditingUploadID_'+indexP+' input[type=file]'));
        // auditingUploadFilesArrays[indexP].push(o);
      });

    }
    // end of handleAuditingUploadChange

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
      // auditingUploadFilesArray.value.forEach((o)=>{
      //   console.log('o',o);
      // });

    }
    /**
     * 删除附件文件之前
     */
     function handleAuditingUploadBeforeRemoveFn(uploadFile, uploadFiles){uploadFiles
      // const loadingInstance1 = ElLoading.service({ fullscreen: true });
      // const {fileName} = uploadFile.response.data[0];

      // return httpAxiosO({
      //   url: '/api/web/article/delFileObj',
      //   method: 'delete',
      //   params: {
      //     fileName
      //   }
      // })
      // .finally(()=>{
      //   loadingInstance1.close();
      // });
    }
    //end of handleAuditingUploadBeforeRemoveFn
    /**
     * 附件上传成功
     */
    function handleAuditingUploadSuccessFn(response, uploadFile, uploadFiles){uploadFile, uploadFiles

      if(response.success){
        ElMessage({
          message: '附件上传成功',
          type: 'success',
          plain: true,
        })
      }

    }
    // end of handleAuditingUploadSuccessFn

    //控制折叠的
    function foldClick(formData) {
      formData.fold = !formData.fold;
    }
    function addData() {
      dataList.value.forEach((element) => {
        element.fold = true;
      });
      dataList.value.push({ fold: false });
    }
    function deleteData(index) {
      dataList.value.splice(index, 1);
      dataList.value.forEach((element) => {
        element.fold = true;
      });
      dataList.value[dataList.value.length - 1].fold = false;
    }


    /**
     * 校验 转载稿件 用户所填表单 各个字段 合法性
     * @param {*} datasOP 
     */
     function checkFieldValueFn(datasOP){
      const { 
        articleTitle,//稿件标题
        articleSource,//稿件来源
        url, //稿件原地址
      } = datasOP;

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
        !url
      ){
        ElMessage({
          message: '请输入稿件原地址',
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
     * 提交稿件到 “我的投稿”列表里
     * 
     */
    function postAddEditReprintAjaxFn(articleStatusP){

      const loadingInstance1 = ElLoading.service({ fullscreen: true })
        // articleTitle 稿件标题
        // articleSource 稿件来源
        // language 语种
        // remark 备注

        // articleStatus 稿件状态 （-1：已删除，0：草稿，1：已投稿）

      let checkFieldValueFnResult = true;//true为校验通过

      console.log('auditingUploadFilesArrays',auditingUploadFilesArrays);


      dataList.value.forEach((o)=>{
        // o.fileAccessory = auditingUploadFilesArrays[i].fileAccessory.reduce((old,next)=>{
        //   if(!next.response){
        //     return '';
        //   }
        //   let _str = old===''?next.response?.data[0].fileName:old+','+next.response?.data[0].fileName;
        //   return _str
        // },'');
        o.articleStatus = articleStatusP;
        checkFieldValueFnResult = checkFieldValueFn(o);
      });

      //接口传参需要去掉datasO.articleContent 结尾的 \n
      // const _regExp1 = /\n$/;
      // datasO.articleContent = datasO.articleContent.replace(_regExp1, '');

      if(!checkFieldValueFnResult){//验证各个字段
        return;
      }
      console.log('dataList',dataList);

      httpAxiosO({
        url:'/api/web/article/addEditReprint.do',
        method:'post',
        data:dataList.value
      })
      .then((D)=>{
        console.log('转载稿件提交 D',D);
        const { data,success } = D.data;data
        if(!success){
          ElMessage({
            message: '转载稿件提交 接口传参可能有误',
            type: 'error',
            plain: true,
          })
          return;
        }
        ElMessage({
          message: '转载稿件提交成功',
          type: 'success',
          plain: true,
        });

      })
      .catch((error)=>{
        console.log('转载稿件提交 error',error);
        
      })
      .finally(()=>{
        loadingInstance1.close();
      })
    }
    // end of postAddEditReprintAjaxFn


    return {
      dataList,
      rules,
      langOptions,
      foldClick,
      addData,
      deleteData,

      auditingUploadFilesArrays,
      handleAuditingUploadChangeFn,
      handleAuditingUploadErrorFn,
      handleAuditingUploadBeforeRemoveFn,
      handleAuditingUploadSuccessFn,

      postAddEditReprintAjaxFn,

    };
  },
};
</script>
<style scoped lang='less'>
.createreproduction-content {
  flex-direction: column;
  .createreproduction-content-list {
    position: relative;
    width: 1364px;
    // height: 446px;
    background-color: #f8fbfe;
    border: 1px dashed #b4d3f6;
    margin-bottom: 25px;
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
    .el-form {
      margin-top: 20px;
    }
    .createreproduction-content-list-index {
      position: absolute;
      top: 0;
      left: 0;
      width: 35px;
      height: 35px;
      line-height: 35px;
      background-color: #72bb58;
      color: #fff;
      font-size: 20px;
      text-align: center;
      border-bottom-right-radius: 5px;
    }
    .createreproduction-content-list-foldbtn {
      position: absolute;
      top: -1px;
      right: -30px;
      width: 30px;
      height: 94px;
      background-color: #92b0fc;
      color: #fff;
      text-align: center;
      font-size: 18px;
      border-bottom-right-radius: 5px;
      border-top-right-radius: 5px;
    }
  }
  .listfold {
    height: 92px;
  }
  .createreproduction-btn {
    justify-content: center;
    margin-bottom: 40px;
    .el-button {
      width: 120px;
      height: 40px;
      border-radius: 40px;
      color: #fff;
      background-color: #799df7;
      font-size: 18px;
      i {
        margin-right: 8px;
      }
    }
    .createreproduction-btn-delete {
      color: #6c89d1;
      background-color: #f3f6ff;
    }
  }
}

.auditingUploadFilesArraysOuterC{position:relative; }
.auditingUploadC{position:relative;z-index:5;margin-top:-46px;width:100%;cursor:pointer;
  .u{position:absolute;left:0;right:0;top:0;height:46px;width:100%;opacity: 0;}
  
}

.createreproduction-btngroup {
  justify-content: center;
  padding-bottom: 45px;
  .el-button {
    height: 45px;
    width: 160px;
    border-radius: 5px;
    font-size: 20px;
  }
  .createreproduction-btngroup-save{
    color: #2c90ff;
    background-color: #e8f4ff;
  }
  .createreproduction-btngroup-submit{
    color: #fff;
    background-color: #1890ff;
  }
  .createreproduction-btngroup-reset{
    color: #49455c;
    background-color: #e2e3e4;
  }
}
</style>