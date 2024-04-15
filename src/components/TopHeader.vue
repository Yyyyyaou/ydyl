<template>
  <div class="head-style">
    <div class="head-left flexcenter">
      <div
        class="head-logo"
        style="
          height: 40px;
          width: 40px;
          background: #409eff;
          line-height: 40px;
          text-align: center;
          border-radius: 5px;
          color: #fff;
          font-size: 14px;
          margin: 0 15px 0 15px;
        "
      >
        logo
      </div>
      <div
        class="head-name"
        style="font-size: 20px; color: #4c4d62; font-weight: 700"
      >
        中国一带一路网投稿平台
      </div>
    </div>
    <div class="head-right flexcenter">
      <div class="flexcenter">
        <!-- <el-avatar shape="square" src="../assets/avatar.png" key="0"/> -->
        <img src="../assets/avatar.png" alt="" srcset="" />
        <span>陕西发改委 张某某</span>
        <a href="javascript:;">退出</a>
        <i class="iconfont icon-goit" />
      </div>
    </div>
  </div>
</template>
<script>
import { useStore } from "vuex";

export default {
  name: "TopHeader",
  setup() {
    const store = useStore();store

    return {

    };
  },
};
</script>

<style lang="less" scoped>
.head-style {
  height: 58px;
  .head-left {
    height: 100%;
    border: 1px solid #e9e7f4;
  }
  .head-right {
    position: absolute;
    right: 0;
    top: 0;
    height: 26px;
    border: 1px solid #e9e7f4;
    padding: 16px 30px;
    >div {
      font-size: 14px;
      span{
        color: #293139;
        margin-left: 20px;
      }
      a{
        color:#4c84ff;
        margin-left: 15px;
      }
      i{
        font-size: 20px;
        color:#4c84ff;
        margin-left: 28px;
      }
    }
  }
}
</style>
