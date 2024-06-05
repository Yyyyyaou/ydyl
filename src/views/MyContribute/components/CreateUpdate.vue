<template>
  <div class="createupdate flexcenter">
    <div class="createupdate-content">
      <div style="padding-left: 147px">
        <div class="createupdate-content-title">请选择您要上传的数据文件</div>
        <div class="createupdate-content-radio-title">
          支持EXCEL文件格式上传
        </div>
        <el-radio-group v-model="radio">
          <el-radio :value="0">海上丝路贸易指数</el-radio>
          <el-radio :value="1">“一带一路”航贸指数</el-radio>
        </el-radio-group>
        <div class="createupdate-content-radio-title" style="margin-top: 35px">
          支持EXCEL、CSV文件格式上传
        </div>
        <el-radio-group v-model="radio">
          <el-radio :value="2">其他</el-radio>
        </el-radio-group>
        <div
          class="createupdate-content-upload flexcenter"
          style="margin-top: 40px"
        >
          <el-upload
            ref="upload"
            v-model:file-list="fileList"
            :action="auditingUploadFilesPostUrl"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
            accept=".xls, .xlsx, .csv"
          >
            <el-button type="primary">上传文件</el-button>
            <p v-if="fileList.length == 0">（未选择任何文件）</p>
            <template #tip>
              <div class="el-upload__tip">
                （ 如有需要，请点击下载EXCEL文件的
                <a href="" download>海上丝路贸易指数模版</a>、<a
                  href=""
                  download
                  >“一带一路”航贸指数模版</a
                >）
              </div>
            </template>
          </el-upload>
        </div>
      </div>
    </div>

    <div class="createupdate-btn">
      <el-button @click="submitFn">提&nbsp;&nbsp;&nbsp;&nbsp;交</el-button>
      <el-button @click="reSetFn">重&nbsp;&nbsp;&nbsp;&nbsp;置</el-button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { genFileId, ElMessage } from "element-plus";
import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";
export default {
  emits: ["closeDialog"],
  // eslint-disable-next-line
  setup(props, context) {
    const radio = ref(0);

    const fileList = ref([]);
    //附件上传接口地址
    const auditingUploadFilesPostUrl = ref("");
    // process.env.NODE_ENV === "development"
    //   ? (auditingUploadFilesPostUrl.value = "api/tougaoadmin/web/excel/upload")
    //   : (auditingUploadFilesPostUrl.value = "/tougaoadmin/web/excel/upload");

    const upload = ref();

    //文件数大于1触发钩子函数
    const handleExceed = (files) => {
      upload.value.clearFiles();
      const file = files[0];
      file.uid = genFileId();
      upload.value.handleStart(file);
    };
    //提交
    function submitFn() {
      if (fileList.value.length == 0) {
        ElMessage({
          message: "请选择您要上传的数据文件",
          type: "error",
          plain: true,
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", fileList.value[0].raw);
      formData.append("format", radio.value);
      httpAxiosO({
        url: "/web/excel/upload",
        method: "post",
        headers: {
          //这个接口不写 这行会报错
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: formData,
      })
        .then((D) => {
          console.log("我的数据提交 D", D);
          // eslint-disable-next-line
          const { data, success } = D.data;
          if (!success) {
            let msg = "";
            if (D.data.message == "格式不对") {
              msg = "格式不对，请下载相应的模板";
            } else {
              msg = D.data.message;
            }
            ElMessage({
              message: msg,
              type: "error",
              plain: true,
            });
            return;
          } else {
            ElMessage({
              message: "我的数据提交成功",
              type: "success",
              plain: true,
            });
            context.emit("closeDialog");
          }
        })
        .catch((error) => {
          console.log("我的数据提交 error", error);
        })
        .finally(() => {});
    }
    //重置
    function reSetFn() {
      fileList.value.length = 0;
    }
    return {
      radio,
      fileList,
      auditingUploadFilesPostUrl,
      handleExceed,

      submitFn,
      reSetFn,
      upload, //ref长传文件对象
    };
  },
};
</script>
<style scoped lang='less'>
.createupdate {
  justify-content: center;
  flex-direction: column;
  .createupdate-content {
    width: 1363px;
    height: 416px;
    border: 1px dashed #b4d3f6;
    background-color: #f8fbfe;
    .createupdate-content-title {
      margin: 33px 0;
      color: #000000;
      font-weight: 700;
      font-size: 20px;
    }
    .createupdate-content-radio-title {
      color: #9d9898;
      font-size: 16px;
    }
    :deep(.el-radio__label) {
      font-size: 16px;
    }
    .createupdate-content-upload {
      .el-upload {
        .el-button {
          width: 170px;
          height: 48px;
        }
      }
      p {
        color: #9d9898;
        font-size: 16px;
        margin-left: 30px;
      }
      .el-upload__tip {
        color: #9d9898;
        font-size: 16px;
        margin-top: 20px;
        a {
          color: #015a9f;
        }
      }
    }
  }
  .createupdate-btn {
    margin-top: 25px;
    .el-button {
      background-color: #1890ff;
      color: #fff;
      width: 160px;
      height: 45px;
      border-radius: 5px;
      font-size: 20px;
    }
    .el-button:nth-last-child(1) {
      background-color: #e2e3e4;
      color: #49455c;
    }
  }
}
</style>