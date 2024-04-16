<template>
  <div class="createorigin-content">
    <el-form :model="formData" :rules="rules">
      <el-form-item label="稿件标题" prop="title">
        <el-input v-model="formData.title" clearable />
      </el-form-item>
      <el-row style="justify-content: space-between">
        <el-col :span="11">
          <el-form-item label="稿件来源" prop="origin">
            <el-input v-model="formData.origin" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="语种" prop="lang">
            <el-select v-model="formData.lang" placeholder="">
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
        prop="editor"
        class="createorigin-content-editor"
      >
        <quill-editor :content="formData.desc" />
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
      <el-form-item label="备注" prop="notes">
        <el-input
          v-model="formData.notes"
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
    <el-button class="createorigin-btngroup-save">保存到草稿箱</el-button>
    <el-button class="createorigin-btngroup-submit">提 交</el-button>
    <el-button class="createorigin-btngroup-reset">重 置</el-button>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
export default {
  setup() {
    const formData = ref({ title: "11" });
    const rules = reactive({
      title: [
        {
          required: true,
          message: "必填项",
          trigger: "change",
        },
      ],
      origin: [
        {
          required: true,
          message: "必填项",
          trigger: "change",
        },
      ],
      lang: [
        {
          required: true,
          message: "必填项",
          trigger: "change",
        },
      ],
      editor: [
        {
          required: true,
          message: "必填项",
          trigger: "change",
        },
      ],
      auditing: [
        {
          required: true,
          message: "必填项",
          trigger: "change",
        },
      ],
    });
    const langOptions = [
      {
        value: 0,
        label: "中文",
      },
      {
        value: 1,
        label: "英文",
      },
    ];
    return {
      formData,
      rules,
      langOptions,
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
      width: 80%;
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