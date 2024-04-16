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
            v-model:file-list="fileList"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          >
            <el-button type="primary">上传文件</el-button>
            <p v-if="fileList.length == 0">（未选择任何文件）</p>
            <template #tip>
              <div class="el-upload__tip">
                （ 如有需要，请点击下载EXCEL文件的
                <a href="" download>海上丝路贸易指数模版</a>、<a href="" download>“一带一路”航贸指数模版</a>）
              </div>
            </template>
          </el-upload>
        </div>
      </div>
    </div>

    <div class="createupdate-btn">
      <el-button @click="submitclick">提&nbsp;&nbsp;&nbsp;&nbsp;交</el-button>
      <el-button>重&nbsp;&nbsp;&nbsp;&nbsp;置</el-button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const radio = ref(0);
    function submitclick() {
      console.log(radio.value);
    }
    const fileList = ref([]);
    return {
      radio,
      submitclick,
      fileList,
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
      .el-upload__tip{
        color: #9d9898;
        font-size: 16px;
        margin-top: 20px;
        a{
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