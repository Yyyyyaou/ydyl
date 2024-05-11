<template>
  <div class="create-style">
    <div class="create-content">
      <div class="create-header flexcenter">创建稿件</div>
      <div class="mid-divider"><div></div></div>
      <div class="create-btngroup flexcenter">
        <div
          v-for="(item, index) in btngroupArr"
          :key="index"
          class="create-btngroup-btn hoverpointer"
          :class="{ isSelected: selectIndex == index }"
          @click="btnClick(index)"
        >
          {{ item.name }}
        </div>
        <div class="create-btngroup-i hoverpointer"><i class="iconfont icon-wenhao" /></div>
      </div>
      <div>
        <CreateOrigin v-if="selectIndex == 0" />
        <CreateReproduction v-if="selectIndex == 1" />
        <CreateUpdate v-if="selectIndex == 2" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import CreateOrigin from "../components/CreateOrigin.vue";
import CreateReproduction from "../components/CreateReproduction.vue";
import CreateUpdate from "../components/CreateUpdate.vue";
export default {
  components: {
    CreateOrigin,
    CreateReproduction,
    CreateUpdate,
  },
  setup() {
    const btngroupArr = ref([
      { name: "原创稿件" },
      { name: "转载稿件" },
      // { name: "数据上传" },//数据上传界面搬到了 数据上传 本栏目页上 注释于20240509.1057
    ]);
    const selectIndex = ref(0);
    function btnClick(index) {
      selectIndex.value = index;
    }
    return {
      btngroupArr,
      selectIndex,
      btnClick,
    };
  },
};
</script>
<style scoped lang='less'>
.create-style {
  padding: 15px 34px;
  .create-content {
    min-height: calc(100vh - 190px);
    background: #fff;
    .create-header {
      justify-content: center;
      padding: 35px 0 20px 0;
      font-size: 30px;
      color: #424f63;
    }
    .mid-divider {
      display: flex;
      justify-content: center;
      div {
        width: 67px;
        height: 2px;
        background: #0b6fcd;
      }
    }
    .create-btngroup {
      justify-content: center;
      padding: 30px 0;
      position: relative;
      .create-btngroup-btn {
        width: 115px;
        height: 32px;
        line-height: 32px;
        background: #e8f4ff;
        color: #2c90ff;
        text-align: center;
        border-radius: 8px;
        margin-right: 10px;
        border: 1px solid #d1e9ff;
        font-size: 16px;
      }
      .create-btngroup-btn:nth-last-child(1) {
        margin: 0;
      }
      .isSelected {
        color: #fff;
        background: #1890ff;
      }
      .create-btngroup-i{
        position: absolute;
        right: 193px;
        color: #f2ba6b;
        i{
          font-size: 20px;
        }
      }
    }
  }
}
</style>