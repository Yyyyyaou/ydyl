<template>
  <div class="mid-content">
    <div class="mid-content-divs flexcenter">
      <div class="mid-content-divs-searchgroup">
        <el-select
          v-model="companySelectValue"
          placeholder="投稿单位"
          style="width: 140px"
        >
          <el-option
            v-for="item in companyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="timeSelectValue"
          placeholder="时间范围"
          style="width: 140px"
          class="marl10"
        >
          <el-option
            v-for="item in timeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-config-provider :locale="locale">
          <el-date-picker
            v-model="dateDefaultTime"
            type="daterange"
            start-placeholder="起始日期"
            end-placeholder="结束日期"
            :locale="locale"
            style="margin-left: 10px; width: 270px"
          />
        </el-config-provider>
      </div>
      <div class="flexcenter mid-content-statistics-left-content-div">
        <div class="flexcenter mid-content-statistics-left-content-img">
          <img src="../assets/contributenum.png" alt="" />
        </div>
        <div class="mid-content-statistics-left-content-num">
          <p>247</p>
          <p>联络员投稿总数</p>
        </div>
      </div>
      <div
        class="flexcenter mid-content-statistics-left-content-divmid"
        style="margin-left: 10px"
      >
        <div class="divmid-bg flexcenter">
          <div class="flexcenter mid-content-statistics-left-content-div">
            <div class="flexcenter mid-content-statistics-left-content-img">
              <img src="../assets/contributenum.png" alt="" />
            </div>
            <div class="mid-content-statistics-left-content-num">
              <p>247</p>
              <p>联络员投稿总数</p>
            </div>
          </div>
          <div class="divmid-divide"></div>
          <div class="flexcenter mid-content-statistics-left-content-div">
            <div class="flexcenter mid-content-statistics-left-content-img">
              <img src="../assets/papernum.png" alt="" />
            </div>
            <div class="mid-content-statistics-left-content-num">
              <p>154</p>
              <p>联络员原创稿件</p>
            </div>
          </div>
          <div class="divmid-divide"></div>
          <div class="flexcenter mid-content-statistics-left-content-div">
            <div class="flexcenter mid-content-statistics-left-content-img">
              <img src="../assets/statisticsnum3.png" alt="" />
            </div>
            <div class="mid-content-statistics-left-content-num">
              <p>50</p>
              <p>联络员转载稿件</p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flexcenter mid-content-statistics-left-content-div"
        style="margin-left: 10px"
      >
        <div class="flexcenter mid-content-statistics-left-content-img">
          <img src="../assets/fgwnum3.png" alt="" />
        </div>
        <div class="mid-content-statistics-left-content-num">
          <p>82.6%</p>
          <p>采用率</p>
        </div>
        <el-icon><InfoFilled /></el-icon>
      </div>
    </div>
    <div class="mid-content-mycontribute" style="margin-top: 20px">
      <div class="mid-content-mycontribute-header flexcenter">
        <div class="flexcenter">
          <div class="mid-content-mycontribute-header-i">
            <img src="../assets/trend.png" alt="" />
          </div>
          <span>投稿趋势图</span>
        </div>
      </div>
      <div
        class="mid-divider mid-divider-display"
        style="margin-bottom: 20px"
      ></div>
      <TrendEcharts />
    </div>
    <div class="mid-content-mycontribute" style="margin-top: 20px">
      <div class="mid-content-mycontribute-header flexcenter">
        <div class="flexcenter">
          <div class="mid-content-mycontribute-header-i">
            <img src="../assets/mycontribute.png" alt="" />
          </div>
          <span>已发稿件</span>
        </div>
      </div>
      <div class="mid-divider mid-divider-display"></div>
      <!-- 已发稿件组件 -->
      <PublishedManuscript />
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import PublishedManuscript from "@/components/PublishedManuscript.vue";
import TrendEcharts from "@/components/TrendEcharts.vue";
export default {
  components: {
    PublishedManuscript, //审核稿件
    TrendEcharts, //投稿趋势图
  },
  setup() {
    const companySelectValue = ref("");
    const companyOptions = reactive([{ label: "中经社", value: 0 }]);
    const timeSelectValue = ref("");
    const timeOptions = reactive([
      { label: "近7天", value: 0 },
      { label: "近30天", value: 1 },
    ]);
    //日期选择 数据
    const dateDefaultTime = ref([]);
    return {
      companySelectValue,
      companyOptions,
      timeSelectValue,
      timeOptions,
      dateDefaultTime,
      locale: zhCn, //date-range 语言设置
    };
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

  .mid-content-statistics-left-content-div {
    height: 110px;
    width: 313px;
    background: #fff;
    .mid-content-statistics-left-content-img {
      width: 75px;
      height: 75px;
      background-color: #f6f6f7;
      border-radius: 50%;
      margin-left: 30px;
      justify-content: center;
    }
    .mid-content-statistics-left-content-num {
      display: flex;
      flex-direction: column;
      align-items: baseline;
    }
    p:nth-child(1) {
      margin-left: 20px;
      font-size: 30px;
      color: #555b73;
    }
    p:nth-child(2) {
      margin-left: 10px;
      font-size: 16px;
      color: #555b73;
    }
    .el-icon {
      color: #ef9712;
      font-size: 20px;
      margin-left: 40px;
    }
  }
  .mid-content-statistics-left-content-divmid {
    width: 949px;
    height: 106px;
    background-color: #fff;
    padding: 2px;
    .divmid-bg {
      width: 949px;
      height: 106px;
      background-color: #ebf6f6;
    }
    .mid-content-statistics-left-content-div {
      background-color: unset;
      .mid-content-statistics-left-content-img {
        background-color: #fff;
      }
    }
    .divmid-divide {
      width: 2px;
      height: 70px;
      background-color: #fff;
      margin-right: 25px;
    }
  }
}
.mid-content-divs {
  position: relative;
  .mid-content-divs-searchgroup {
    position: absolute;
    right: 0;
    top: -40px;
    /* select input全局样式 */
    :deep(.el-select__wrapper),
    :deep(.el-input__wrapper),
    :deep(.el-date-editor),
    :deep(.el-range-input) {
      background-color: #1890ff;
    }

    :deep(.el-select__placeholder),
    :deep(.el-select__caret),
    :deep(.el-date-editor .el-range__icon),
    :deep(.el-range-input) {
      color: #fff;
      &::placeholder {
        color: #fff;
      }
    }
  }
}
.marl10 {
  margin-left: 10px;
}
</style>