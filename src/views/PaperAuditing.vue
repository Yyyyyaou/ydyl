<template>
  <div class="mid-content">
    <div class="mid-content-mycontribute">
      <div class="mid-content-mycontribute-header flexcenter">
        <div class="flexcenter">
          <div class="mid-content-mycontribute-header-i">
            <img src="../assets/mycontribute.png" alt="" />
          </div>
          <span>审核报题</span>
        </div>
      </div>
      <div class="mid-divider mid-divider-display"></div>
      <PaperAuditing />
    </div>
  </div>
</template>

<script>
// import { onMounted, reactive, ref } from "vue";
// import zhCn from "element-plus/es/locale/lang/zh-cn";
import PaperAuditing from "@/components/PaperAuditing.vue";
export default {
  components: {
    PaperAuditing, //审核稿件
  },
};
</script>
<style lang="less" scoped>
.mid-content {
  padding: 15px 34px;
  .mid-content-mycontribute {
    background-color: #fff;
    .mid-content-mycontribute-header {
      height: 50px;
      padding: 0 18px;
      div {
        .mid-content-mycontribute-header-i {
          display: inline-block;
          height: 36px;
          width: 36px;
          line-height: 44px;
          text-align: center;
          border-radius: 50%;
          font-size: 19px;
          color: #086dbd;
          background-image: linear-gradient(130deg, #eaf0ff, #ffffff);
        }
      }
      span {
        margin-left: 10px;
        font-size: 18px;
        font-weight: 700;
        color: #424f63;
      }
    }
  }
}
</style>