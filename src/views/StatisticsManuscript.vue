<template>
  <div class="mid-content">
    <div class="mid-content-divs flexcenter">
      <div class="mid-content-divs-searchgroup">
        <!-- <el-select
          v-model="companySelectValue"
          placeholder="投稿单位"
          style="width: 140px"
          v-if="userAuthority == '国家发改委用户'"
        >
          <el-option
            v-for="item in companyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
        <el-autocomplete
          v-if="userAuthority == '国家发改委用户'"
          v-model="companySelectValue"
          style="width: 140px"
          :fetch-suggestions="querySearch"
          :value-key="'sourceName'"
          clearable
          placeholder="投稿单位"
          @select="autocompleteSelect"
          @clear="autocompleteClear"
        />
        <el-select
          v-model="timeSelectValue"
          placeholder="时间范围"
          style="width: 140px"
          class="marl10"
          @change="timeSelectChange"
        >
          <el-option
            v-for="item in timeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-config-provider :locale="locale" v-if="timeSelectValue == 3">
          <el-date-picker
            v-model="dateDefaultTime"
            type="daterange"
            start-placeholder="起始日期"
            end-placeholder="结束日期"
            :locale="locale"
            style="margin-left: 10px; width: 270px"
            @change="handleChange"
            :disabled-date="disabledDate"
          />
        </el-config-provider>
      </div>
      <div style="overflow: auto" class="flexcenter">
        <!-- 国家发改委用户 -->
        <div
          class="flexcenter mid-content-statistics-left-content-div"
          v-if="userAuthority == '国家发改委用户'"
          style="min-width: 300px"
        >
          <!-- //new -->
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
          v-if="userAuthority == '国家发改委用户'"
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
          v-if="userAuthority == '国家发改委用户'"
        >
          <div class="flexcenter mid-content-statistics-left-content-img">
            <img src="../assets/fgwnum3.png" alt="" />
          </div>
          <div class="mid-content-statistics-left-content-num">
            <p>82.6%</p>
            <p>采用率</p>
          </div>
          <el-icon title="采用率=发布总数+投稿总数x100%"
            ><InfoFilled
          /></el-icon>
        </div>

        <!-- 国家信息中心用户 -->
        <div
          class="flexcenter mid-content-statistics-left-content-div1"
          v-if="
            userAuthority == '国家信息中心用户' || userAuthority == '外部用户'
          "
          style="min-width: 240px"
        >
          <div class="flexcenter mid-content-statistics-left-content-img">
            <img src="../assets/contributenum.png" alt="" />
          </div>
          <div class="mid-content-statistics-left-content-num">
            <p>{{ num1 }}</p>
            <p>投稿总数</p>
          </div>
        </div>
        <div
          class="flexcenter mid-content-statistics-left-content-divmid1"
          style="margin-left: 10px"
          v-if="
            userAuthority == '国家信息中心用户' || userAuthority == '外部用户'
          "
        >
          <div class="divmid-bg flexcenter">
            <div class="flexcenter mid-content-statistics-left-content-div">
              <div class="flexcenter mid-content-statistics-left-content-img">
                <img src="../assets/releasenum.png" alt="" />
              </div>
              <div class="mid-content-statistics-left-content-num">
                <p>{{ num2 }}</p>
                <p>发布总数</p>
              </div>
            </div>
            <div class="divmid-divide"></div>
            <div class="flexcenter mid-content-statistics-left-content-div">
              <div class="flexcenter mid-content-statistics-left-content-img">
                <img src="../assets/fgwnum2.png" alt="" />
              </div>
              <div class="mid-content-statistics-left-content-num">
                <p>{{ num3 }}</p>
                <p>原创稿件</p>
              </div>
            </div>
            <div class="divmid-divide"></div>
            <div class="flexcenter mid-content-statistics-left-content-div">
              <div class="flexcenter mid-content-statistics-left-content-img">
                <img src="../assets/statisticsnum3.png" alt="" />
              </div>
              <div class="mid-content-statistics-left-content-num">
                <p>{{ num4 }}</p>
                <p>转载稿件</p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="flexcenter mid-content-statistics-left-content-div1"
          style="margin-left: 10px; min-width: 240px"
          v-if="
            userAuthority == '国家信息中心用户' || userAuthority == '外部用户'
          "
        >
          <div class="flexcenter mid-content-statistics-left-content-img">
            <img src="../assets/pendingnum.png" alt="" />
          </div>
          <div class="mid-content-statistics-left-content-num">
            <p>{{ num5 }}</p>
            <p>待处理稿件</p>
          </div>
        </div>
        <div
          class="flexcenter mid-content-statistics-left-content-div1"
          style="margin-left: 10px"
          v-if="
            userAuthority == '国家信息中心用户' || userAuthority == '外部用户'
          "
        >
          <div class="flexcenter mid-content-statistics-left-content-img">
            <img src="../assets/fgwnum3.png" alt="" />
          </div>
          <div class="mid-content-statistics-left-content-num">
            <p>{{ num6 }}</p>
            <p>采用率</p>
          </div>
          <el-icon title="采用率=发布总数+投稿总数x100%"
            ><InfoFilled
          /></el-icon>
        </div>
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
      <TrendEcharts ref="trendEcharts" />
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
import { computed, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import PublishedManuscript from "@/components/PublishedManuscript.vue";
import TrendEcharts from "@/components/TrendEcharts.vue";
import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";
import { ElMessage, ElLoading } from "element-plus";
import { timeFormatFn } from "@/utils/timeFormat.js";
export default {
  components: {
    PublishedManuscript, //审核稿件
    TrendEcharts, //投稿趋势图
  },
  setup() {
    // 获取子组件的引用
    const trendEcharts = ref();
    const store = useStore();
    //用户角色名字
    const userAuthority = computed(() => {
      console.log(store.state.StroeLoginO.loginUser.CURRENT_ROLE);
      return store.state.StroeLoginO.loginUser.CURRENT_ROLE;
    });

    // console.log("HomePage userAuthority", userAuthority);
    const companySelectValue = ref("");
    // const companyOptions = reactive([{ label: "中经社", value: 0 }]);
    //联想输入框
    const restaurants = ref([]);
    const querySearch = (queryString, cb) => {
      const results = queryString
        ? restaurants.value.filter(createFilter(queryString))
        : restaurants.value;
      // call callback function to return suggestions
      cb(results);
    };
    // const loadAll = () => {
    //   return [
    //     { value: "a单位", link: "https://github.com/vuejs/vue",id:456 },
    //     { value: "b单位", link: "https://github.com/ElemeFE/element" },
    //     { value: "c单位", link: "https://github.com/ElemeFE/cooking" },
    //     { value: "db单位", link: "https://github.com/ElemeFE/mint-ui" },
    //   ];
    // };
    const createFilter = (queryString) => {
      return (restaurant) => {
        return (
          restaurant.sourceName.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    };
    const timeSelectValue = ref(1);
    const timeOptions = reactive([
      { label: "近7天", value: 0 },
      { label: "近30天", value: 1 },
      { label: "近3个月", value: 2 },
      { label: "自定义时间段", value: 3 },
    ]);
    //日期选择 数据
    const dateDefaultTime = ref([]);
    const disabledDate = (time) => {
      return time.getTime() > Date.now();
    };

    /**
     * 外部用户 稿件统计 接口请求
     */
    const num1 = ref(0); //投稿总数
    const num2 = ref(0); //发布总数
    const num3 = ref(0); //原创稿件
    const num4 = ref(0); //转载稿件
    const num5 = ref(0); //待处理稿件
    const num6 = ref(0); //采用率

    function getArticleCountAjaxFn(fromTimeSelect = false) {
      const loadingInstance1 = ElLoading.service({ fullscreen: true });
      let param = {};
      if (fromTimeSelect) {
        param = {
          searchUser: userAuthority.value == "国家发改委用户" ? 1 : 0, //	0(个人),1(全部)，这里是投稿平台，和袁冰讨论后暂时传0
          startTime: timeFormatFn(startTime)["YYYY-MM-DD"],
          endTime: timeFormatFn(endTime)["YYYY-MM-DD"],
          dateType: timeSelectValue.value,
          articleSource:userAuthority.value == "国家发改委用户" ? articleSource: 0
        };
      } else {
        param = {
          searchUser: userAuthority.value == "国家发改委用户" ? 1 : 0, //	0(个人),1(全部)，这里是投稿平台，和袁冰讨论后暂时传0
          startTime: timeFormatFn(dateDefaultTime.value[0])["YYYY-MM-DD"],
          endTime: timeFormatFn(dateDefaultTime.value[1])["YYYY-MM-DD"],
          dateType: timeSelectValue.value,
          articleSource:userAuthority.value == "国家发改委用户" ? articleSource: 0
        };
      }
      httpAxiosO({
        method: "get",
        url: "/web/article/articleCount",
        params: param,
      })
        .then((D) => {
          console.log("稿件统计 D", D);
          if (D.status != 200) {
            ElMessage({
              message: "稿件统计数据请求失败",
              type: "error",
              plain: true,
            });
            return;
          } else {
            let data = D.data
            if (trendEcharts.value) {
              trendEcharts.value.initEcharts(
                data.dateList,
                data.typeOriginalList,
                data.typeReprintList
              );
            }
            num1.value = data.articleCount;
            num2.value = data.pubCount;
            num3.value = data.normalArticle;
            num4.value = data.reprArticle;
            num5.value = data.waitArticle;
            num6.value = data.useRate;
          }
        })
        .catch((error) => {
          console.log("稿件统计 接口请求 error", error);
          ElMessage({
            message: "稿件统计接口请求失败",
            type: "error",
            plain: true,
          });
        })
        .finally(() => {
          loadingInstance1.close();
        });
    }
    // end of getArticleCountAjaxFn
    //日期选择器change
    function handleChange() {
      if (dateDefaultTime.value == null) {
        return;
      }
      getArticleCountAjaxFn();
    }
    //时间范围选择器change（7天 30天）
    let endTime = new Date();
    let startTime = timeForMat(29);
    function timeSelectChange(val) {
      if (val == 0) {
        startTime = timeForMat(6);
      } else if (val == 1) {
        startTime = timeForMat(29);
      } else if (val == 2) {
        startTime = timeForMat(90);
      }
      dateDefaultTime.value = [startTime, new Date()]; //日期范围选择初始化
      getArticleCountAjaxFn(true);
    }
    function timeForMat(count) {
      return new Date().setTime(
        endTime.getTime() - 24 * 60 * 60 * 1000 * count
      );
    }
    let articleSource = 0
    //稿件单位选择后调用接口
    function autocompleteSelect(item){
      console.log(item)
      articleSource = item.id?item.id:0
      getArticleCountAjaxFn();
    }
    //清除稿件单位
    function autocompleteClear(){
      articleSource = 0
      getArticleCountAjaxFn();
    }
    //获取稿件单位list
    function findSourceNameAjaxFn() {
      httpAxiosO({
        method: "get",
        url: "/web/source/findSourceName",
      })
        .then((D) => {
          console.log("投稿单位", D);
          if (D.status != 200) {
            ElMessage({
              message: "投稿单位数据请求失败",
              type: "error",
              plain: true,
            });
            return;
          } else {
            restaurants.value = D.data
          }
        })
        .catch(() => {
          ElMessage({
            message: "投稿单位接口请求失败",
            type: "error",
            plain: true,
          });
        })
        .finally(() => {
        });
    }
    onMounted(() => {
      //restaurants.value = loadAll(); //联想输入框赋值
      findSourceNameAjaxFn()
      dateDefaultTime.value = [timeForMat(29), new Date()]; //日期范围选择初始化
      getArticleCountAjaxFn(); //外部用户 稿件统计
    });
    return {
      userAuthority,
      companySelectValue,
      querySearch,
      autocompleteSelect,
      autocompleteClear,
      // companyOptions,
      timeSelectValue,
      timeOptions,
      dateDefaultTime,
      disabledDate,
      locale: zhCn, //date-range 语言设置
      num1,
      num2,
      num3,
      num4,
      num5,
      num6,
      handleChange,
      timeSelectChange,
      startTime,
      endTime,
      trendEcharts,
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
  .mid-content-statistics-left-content-div1 {
    height: 110px;
    width: 250px;
    background: #fff;
    .mid-content-statistics-left-content-img {
      width: 75px;
      height: 75px;
      background-color: #f6f6f7;
      border-radius: 50%;
      margin-left: 25px;
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
      margin-left: 10px;
    }
  }
  .mid-content-statistics-left-content-divmid1 {
    width: 804px;
    height: 106px;
    background-color: #fff;
    padding: 2px;
    .divmid-bg {
      width: 804px;
      height: 106px;
      background-color: #ebf6f6;
    }
    .mid-content-statistics-left-content-div {
      background-color: unset;
      .mid-content-statistics-left-content-img {
        background-color: #fff;
        margin-left: 25px;
      }
    }
    .divmid-divide {
      width: 2px;
      height: 70px;
      background-color: #fff;
      margin-right: 15px;
    }
  }
}
.mid-content-divs {
  position: relative;
  //overflow: auto;//new
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
    :deep(.el-range-input),
    :deep(.el-range-separator),
    :deep(.el-input__inner) {
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