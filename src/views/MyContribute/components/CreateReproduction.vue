<template>
  <div>
    <div
      class="createreproduction-content flexcenter"
      v-for="(item, index) in dataList"
      :key="index"
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
            <el-form-item label="稿件标题" prop="title">
              <el-input v-model="dataList[index].title" clearable />
            </el-form-item>
          </el-form>
          <el-form :model="dataList[index]" :rules="rules" v-else>
            <el-form-item label="稿件标题" prop="title">
              <el-input v-model="dataList[index].title" clearable />
            </el-form-item>
            <el-row style="justify-content: space-between">
              <el-col :span="11">
                <el-form-item label="稿件来源" prop="origin">
                  <el-input
                    v-model="dataList[index].origin"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="语种" prop="lang">
                  <el-select v-model="dataList[index].lang" placeholder="">
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
            <el-form-item label="上传附件" prop="file">
              <el-input
                v-model="dataList[index].file"
                clearable
                placeholder="附件文件格式doc、pdf、jpg、png"
              />
            </el-form-item>
            <el-form-item label="备注" prop="notes">
              <el-input
                v-model="dataList[index].notes"
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
      <el-button class="createreproduction-btngroup-save">保存到草稿箱</el-button>
      <el-button class="createreproduction-btngroup-submit">提 交</el-button>
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

    const dataList = ref([]);
    const rules = reactive({
      title: [//稿件标题
        {
          required: true,
          message: "必填项",
          trigger: "change",
        },
      ],
      origin: [//稿件来源
        {
          required: true,
          message: "必填项",
          trigger: "change",
        },
      ],
      lang: [//语种
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
    });

    const langOptions = reactive([]);
    store.state.GLOBAL_LANGUAGE_LIST.forEach((o)=>{
      langOptions.push({
        value: o.id,
        label: o.desc,
      })
    });


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



    return {
      dataList,
      rules,
      langOptions,
      foldClick,
      addData,
      deleteData,


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
    height: 446px;
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