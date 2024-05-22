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
                <el-form-item label="稿件来源" prop="articleSourceName">

                  <el-autocomplete
                    v-model="dataList[index].articleSourceName"
                    :fetch-suggestions="articleSourceQuerySearchFn.bind(this,index)"
                    clearable
                    style="width:100%;"
                    placeholder="请输入来源"
                    @select="articleSourceHandleSelectFn.bind(this,index)"
                  />

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
            <el-form-item label="稿件原地址" prop="srcUrl">
              <el-input v-model="dataList[index].srcUrl" clearable />
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
                :action="auditingUploadFilesPostUrl"
                multiple
                show-file-list
                :file-list="auditingUploadFilesArrays[index]"

                :on-change="handleAuditingUploadChangeFn.bind(this,index)"
                :on-error="handleAuditingUploadErrorFn.bind(this,index)"
                :before-remove="handleAuditingUploadBeforeRemoveFn.bind(this,index)"
                :on-success="handleAuditingUploadSuccessFn.bind(this,index)"
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
import { reactive, ref,toRefs,onMounted, } from "vue";
import { useRouter } from 'vue-router';
import { useStore } from "vuex";
import { ElMessage,ElLoading } from "element-plus";
import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";

export default {
  props:{
    forPropsGetFindByIdAjaxFnReturnO:Object,
  },
  setup(props,ctx) {ctx;
    //vuex实例
    const store = useStore();

    //创建路由实例
    const router = useRouter();

    const { forPropsGetFindByIdAjaxFnReturnO } = toRefs(props);

    const dataList = ref([{
      articleSource:0,
      articleSourceName:'',
      sourceName:'',
      fileAccessory:'',
    }]);
    const rules = reactive({
      articleTitle: [//稿件标题
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
      srcUrl: [//稿件原地址
        {
          required: true,
          trigger: "blur",
          validator:(rule, value, callback)=>{rule
            if(!value){
              return callback(new Error('请输入稿件原地址 例：https://www.yidaiyilu.gov.cn/'))
            }
            const regExp = /^https?:\/\/[a-zA-Z0-9]+\.*/
            if(!regExp.test(value)){
              return callback(new Error('请输入稿件原地址 例：https://www.yidaiyilu.gov.cn/'))
            }
          }
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
      fileIds:[
        {
          required:false,
          message:'非必填项',
          trigger:'blur',
        }
      ],
    });


    /**
     * 选中已有来源
     * @param {*} indexP dataList 数组索引
     * @param {*} itemP 在来源列表中选中的对象
     */
    function articleSourceHandleSelectFn(indexP,itemP){
      dataList.value[indexP]['articleSource'] = itemP.id;
      dataList.value[indexP]['sourceName'] = '';
    }
    // end of articleSourceHandleSelectFn

    //保存来源搜索后的结果
    const articleSourceQuerySearchResultsArr = reactive([]);
  
    /**
     * 已有来源查询
     * @param {*} indexP dataList 数组索引
     * @param {*} sourceNameP 来源检索词
     */
    async function articleSourceQuerySearchFn(indexP,sourceNameP){

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
            if(dataList.value[indexP].articleSourceName === o.sourceName){//检索词 与 来源名称 精准相同时候
              dataList.value[indexP].articleSource = o.sourceId;//表示用的已有来源
              dataList.value[indexP].sourceName = '';//清空它，表示不是新来源
            }

          });
          console.log('articleSourceQuerySearchResultsArr',articleSourceQuerySearchResultsArr);

        }else{//没查到结果，说明该检索字符串为新字符串
          dataList.value[indexP]['sourceName'] = sourceNameP.trim();
          dataList.value[indexP]['articleSource'] = 0;//把来源id字段设成0，与袁冰 协商后 传0代表没有id

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
        dataList.value[0].language = o.id;
      }
      langOptions.push({
        value: o.id,
        label: o.desc,
      })
    });

    //附件上传接口地址
    const auditingUploadFilesPostUrl = ref('');    
    process.env.NODE_ENV === 'development' ?auditingUploadFilesPostUrl.value ='api/tougaoadmin/web/article/upload':auditingUploadFilesPostUrl.value ='/web/article/upload'

    //普通附件列表
    const auditingUploadFilesArrays = reactive([]);

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
    function handleAuditingUploadChangeFn(indexP,file,files){indexP,file,files;
      // if(
      //   !Array.isArray(auditingUploadFilesArrays[indexP])
      // ){
      //   auditingUploadFilesArrays[indexP] = [];
      // }

      // console.log('files',files);
      // files.forEach((o,i)=>{
      //   console.log('o,i===========',o,i);
      //   console.log(document.querySelector('#auditingUploadID_'+indexP+' input[type=file]'));
      //   // auditingUploadFilesArrays[indexP].push(o);
      // });

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
     function handleAuditingUploadBeforeRemoveFn(indexP,uploadFile, uploadFiles){indexP,uploadFiles
      const loadingInstance1 = ElLoading.service({ fullscreen: true });
      console.log('uploadFile',uploadFile)
      const {fileName} = uploadFile.response.data[0];

      return httpAxiosO({
        url: '/web/article/delFileObj',
        method: 'delete',
        params: {
          fileName
        }
      })
      .then((D)=>{

        const { data } = D;
        if(!data.success){
          ElMessage({
            message: '附件删除失败，接口提示：'+data.message,
            type: 'error',
            plain: true,
          })
        }
      })
      .finally(()=>{
        loadingInstance1.close();
      });
    }
    //end of handleAuditingUploadBeforeRemoveFn
    /**
     * 附件上传成功
     */
    function handleAuditingUploadSuccessFn(indexP,responseP, uploadFile, uploadFiles){uploadFile, uploadFiles

      if(responseP.success){
        ElMessage({
          message: '附件上传成功',
          type: 'success',
          plain: true,
        })
      }
      
      if(
        !Array.isArray(auditingUploadFilesArrays[indexP])
      ){
        auditingUploadFilesArrays[indexP] = [];
      }

      console.log('uploadFiles',uploadFiles);
      console.log('responseP',responseP);

      auditingUploadFilesArrays[indexP] = uploadFiles;

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
      dataList.value.push({ 
        fold: false,
        language: 1,
        articleSource:0,
        articleSourceName:'',
        sourceName:'',
      });
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
        articleSource,//稿件来源id
        sourceName,//稿件来源 名字（来源模糊查询不到的，新的 来源）
        srcUrl, //稿件原地址
      } = datasOP;

      let checkResult = true;
      if(
        !articleTitle
        ||(articleTitle&&articleTitle.trim() === '')
      ){
        ElMessage({
          message: '请填写稿件标题',
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
          message: '请填写稿件来源',
          type: 'warning',
          plain: true,
        })
        checkResult = false;
      }

      if(
        !srcUrl
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

        // articleTitle 稿件标题
        // articleSource 稿件来源
        // language 语种
        // remark 备注

        // articleStatus 稿件状态 （-1：已删除，0：草稿，1：已投稿）

      let checkFieldValueFnResult = true;//true为校验通过

      // console.log('auditingUploadFilesArrays',auditingUploadFilesArrays);


      dataList.value.forEach((o,i)=>{

        if(
          auditingUploadFilesArrays[i]
          &&auditingUploadFilesArrays[i].length
        ){
          o.fileAccessory = auditingUploadFilesArrays[i].reduce((old,next)=>{
            const { fileName } = next.response.data[0];
            let _str = old===''?fileName:old+','+fileName;
            return _str;
          },'');
          o.fileIds = auditingUploadFilesArrays[i].reduce((old,next)=>{
            const { id } = next.response.data[0];
            let _str = old===''?id:old+','+id;
            return _str;
          },'');

          console.log('o.fileAccessory',o.fileAccessory);
          console.log('o.fileIds',o.fileIds);
        }


        o.articleTitle = o.articleTitle.trim();

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

      const loadingInstance1 = ElLoading.service({ fullscreen: true })


      // 如果有 父组件传来的id 说明是 “继续采用”，需要对接口链接 和 请求判断一下，这俩接口应该只有 差 稿件id参数
      const httpAxiosOUrl = (()=>{
        let _url = '';
        if(forPropsGetFindByIdAjaxFnReturnO.value.id){
          _url = '/web/article/update.do';
          dataList.value.forEach((o)=>{
            o.id = forPropsGetFindByIdAjaxFnReturnO.value.id;//父组件传下来的id
          });
        }else{
          _url = '/web/article/addEditReprint.do';
        }
        return _url
      })();

      httpAxiosO({
        url:httpAxiosOUrl,
        method:'post',
        headers:{
          //这个接口不写 这行会报错
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data:JSON.stringify(dataList.value),
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
        
        //articleStatusP 0 跳到草稿箱 articleStatusP 1 跳到 我的投稿 
        router.push({
          path:articleStatusP?'/MyContribute':'/Drafts'
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

    //获取来自父组件的 稿件详情的数据
    function getPropsFn(){

      //没有id就退出
      if(!forPropsGetFindByIdAjaxFnReturnO.value.id){
        return;
      }

      const o = {
        articleTitle : forPropsGetFindByIdAjaxFnReturnO.value.articleTitle,//稿件标题
        articleSource : forPropsGetFindByIdAjaxFnReturnO.value.articleSource||'',//稿件来源
        articleSourceName:forPropsGetFindByIdAjaxFnReturnO.value.sourceName,//用来显示在页面上的来源名字
        language : forPropsGetFindByIdAjaxFnReturnO.value.language||'',//语种
        remark : forPropsGetFindByIdAjaxFnReturnO.value.remark||'',//备注
        srcUrl:forPropsGetFindByIdAjaxFnReturnO.value.srcUrl||'',//稿件原地址
        articleType:1,//稿件类型 0原创稿件 1转载稿件
      }
      
      //回显附件列表，因为附件列表是单独的变量
      console.log('forPropsGetFindByIdAjaxFnReturnO.value.fileAccessory',forPropsGetFindByIdAjaxFnReturnO.value.fileAccessory);
      
      if(!Array.isArray(auditingUploadFilesArrays[0])){
        auditingUploadFilesArrays[0] = [];
      }

      forPropsGetFindByIdAjaxFnReturnO.value.fileAccessory.split(',').forEach((o)=>{
        auditingUploadFilesArrays[0].push({
          name: o,
          url: '',
          id: '',
          response: {
            data: [
              {
                fileName: o,
              },
            ]
          },
        });
      });


      dataList.value.splice(0,dataList.value.length);
      dataList.value.push(o);//回显详情各个字段

    }
    // end of getPropsFn
    
    onMounted(()=>{
      getPropsFn();
    });

    return {
      dataList,
      rules,
      langOptions,
      foldClick,
      addData,
      deleteData,

      articleSourceHandleSelectFn,
      articleSourceQuerySearchFn,


      //为了迁就 element-ui 附件上传组件bug（所以，一个el-upload组件对应一个数组）
      auditingUploadFilesArrays,

      auditingUploadFilesPostUrl,
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
    width: 80%;
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
.auditingUploadC{position:relative;z-index:5;margin-top:-46px;width:100%;cursor:pointer;width:100%;
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