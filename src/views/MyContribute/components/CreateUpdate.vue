<template>
  <div class="createupdate flexcenter">
    <div class="createupdate-content">
      <div>11111</div>
      <el-radio-group v-model="radio">
        <el-radio :value="3">Option A</el-radio>
        <el-radio :value="6">Option B</el-radio>
      </el-radio-group>
      <div>2</div>
      <el-radio-group v-model="radio">
        <el-radio :value="9">Option C</el-radio>
      </el-radio-group>
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
    const radio = ref(3);
    function submitclick() {
      console.log(radio.value)
    }
    return {
      radio,
      submitclick,
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
    height: 376px;
    border: 1px dashed #b4d3f6;
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