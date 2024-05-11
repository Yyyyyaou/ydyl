<template>
  <div class="mid-style">
    <div>
      <div class="mid-content">
        <div class="mid-content-statistics">
          <div class="mid-content-statistics-left">
            <div class="mid-content-statistics-left-header flexcenter">
              <div class="flexcenter">
                <div class="mid-content-statistics-left-header-i">
                  <img src="../assets/statistics.png" alt="" />
                </div>
                <!-- <i
                  class="iconfont icon-gupiao mid-content-statistics-left-header-i"
                ></i> -->
                <span>稿件统计</span>
              </div>
              <div class="flexcenter hoverpointer">
                <el-icon><DArrowRight /></el-icon>
              </div>
            </div>
            <div class="mid-divider"></div>
            <div class="mid-content-statistics-left-content flexcenter">
              <template v-if="userAuthority == '外部用户'">
                <div
                  v-for="item in statisticsData"
                  :key="item.name"
                  class="flexcenter mid-content-statistics-left-content-div"
                >
                  <div
                    class="flexcenter mid-content-statistics-left-content-img"
                  >
                    <img
                      :src="require('../assets/' + item.src + '.png')"
                      alt=""
                    />
                  </div>
                  <p>{{ item.num }}</p>
                  <p>{{ item.name }}</p>
                </div>
              </template>
              <template v-else-if="userAuthority == '国家信息中心用户'">
                <div
                  class="flexcenter mid-content-statistics-left-content-div mid-content-statistics-left-content-infocenter"
                  data-desc="国家发改委用户 稿件统计"
                >
                  <div
                    class="flexcenter mid-content-statistics-left-content-img"
                  >
                    <img src="../assets/papernum.png" alt="" />
                  </div>
                  <p>{{ statisticsGJXXZXData[0].num }}</p>
                  <p>待审稿件</p>
                  <p></p>
                  <p>{{ statisticsGJXXZXData[2].num }}</p>
                  <p>已审稿件</p>
                </div>
                <div
                  class="flexcenter mid-content-statistics-left-content-div mid-content-statistics-left-content-infocenter"
                >
                  <div
                    class="flexcenter mid-content-statistics-left-content-img"
                  >
                    <img src="../assets/papertitlenum.png" alt="" />
                  </div>
                  <p>{{ statisticsGJXXZXData[1].num }}</p>
                  <p>待审报题</p>
                  <p></p>
                  <p>{{ statisticsGJXXZXData[3].num }}</p>
                  <p>已审报题</p>
                </div>
              </template>
              <!-- end of 国家信息中心用户 -->
              <template v-else-if="userAuthority == '国家发改委用户'">
                <div
                  class="flexcenter mid-content-statistics-left-content-divfgw"
                  data-desc="国家发改委用户 稿件统计"
                >
                  <div
                    class="flexcenter mid-content-statistics-left-content-img"
                  >
                    <img src="../assets/releasenum.png" alt="" />
                  </div>
                  <div>
                    <div
                      class="flexcenter mid-content-statistics-left-content-divfgw-num"
                    >
                      <p>247</p>
                      <p>联络员投稿总数</p>
                    </div>
                    <div
                      class="flexcenter mid-content-statistics-left-content-divfgw-divide"
                    >
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <div
                      class="flexcenter mid-content-statistics-left-content-divfgw-num"
                    >
                      <p>204</p>
                      <p>联络员发布总数</p>
                    </div>
                  </div>
                </div>
                <div
                  class="flexcenter mid-content-statistics-left-content-divfgw"
                >
                  <div
                    class="flexcenter mid-content-statistics-left-content-img"
                  >
                    <img src="../assets/fgwnum2.png" alt="" />
                  </div>
                  <div>
                    <div
                      class="flexcenter mid-content-statistics-left-content-divfgw-num"
                    >
                      <p>154</p>
                      <p>联络员原创稿件</p>
                    </div>
                    <div
                      class="flexcenter mid-content-statistics-left-content-divfgw-divide"
                    >
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <div
                      class="flexcenter mid-content-statistics-left-content-divfgw-num"
                    >
                      <p>50</p>
                      <p>联络员转载稿件</p>
                    </div>
                  </div>
                </div>
                <div class="flexcenter mid-content-statistics-left-content-div">
                  <div
                    class="flexcenter mid-content-statistics-left-content-img"
                  >
                    <img src="../assets/fgwnum3.png" alt="" />
                  </div>
                  <p>82.6%</p>
                  <p>采用率</p>
                  <el-icon><InfoFilled /></el-icon>
                </div>
              </template>
              <!-- end of 国家发改委用户 -->


            </div>
          </div>
          <div class="mid-content-statistics-right">
            <div
              class="flexcenter mid-content-statistics-right-arrow hoverpointer"
              @click="noticeArrowClick"
            >
              <el-icon><DArrowRight /></el-icon>
            </div>
            <el-tabs type="border-card" @tab-click="statisticsTabClick">
              <el-tab-pane>
                <template #label>
                  <span class="custom-tabs-label flexcenter">
                    <el-icon><Bell /></el-icon>
                    <span>通知公告</span>
                  </span>
                </template>
                <div class="mid-divider" style="margin-top: 1px"></div>
                <div class="mid-content-statistics-right-content">
                  <el-timeline>
                    <el-timeline-item
                      v-for="(activity, index) in activities"
                      :key="index"
                      :hollow="true"
                      class="hoverpointer"
                      :class="{ isClicked: isClickedArr.includes(index) }"
                      @click="elTimelineClick(index)"
                    >
                      {{ activity.noticeTitle }}
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </el-tab-pane>
              <el-tab-pane>
                <template #label>
                  <span class="custom-tabs-label flexcenter">
                    <img src="../assets/websiteupdates.png" alt="" />
                    <span>官网动态</span>
                  </span>
                </template>
                <div class="mid-divider" style="margin-top: 1px"></div>
                <div class="mid-content-statistics-right-content">
                  <el-timeline>
                    <el-timeline-item
                      v-for="(activity, index) in activities1"
                      :key="index"
                      :hollow="true"
                      class="hoverpointer"
                      :class="{ isClicked: isClickedArr1.includes(index) }"
                      @click="elTimelineClick1(index)"
                    >
                      {{ activity.content }}
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="mid-content-statistics-table">
          <div
            class="mid-content-statistics-right"
            style="width: 100%; margin-top: 20px"
          >
            <div
              class="flexcenter mid-content-statistics-right-arrow hoverpointer"
              @click="tableArrowClick"
            >
              <el-icon><DArrowRight /></el-icon>
            </div>
            <el-tabs
              type="border-card"
              @tab-click="tableTabClick"
              v-if="
                userAuthority == '外部用户' ||
                userAuthority == '国家发改委用户'
              "
            >
              <el-tab-pane v-if="userAuthority == '外部用户'">
                <template #label>
                  <span class="custom-tabs-label flexcenter">
                    <img src="../assets/mycontribute.png" alt="" />
                    <span>我的投稿</span>
                  </span>
                </template>
                <div class="mid-divider" style="margin-top: 1px"></div>

                <!-- 我的投稿组件 -->
                <MySubmission />
              </el-tab-pane>
              <el-tab-pane>
                <template #label>
                  <span class="custom-tabs-label flexcenter">
                    <img src="../assets/signed.png" alt="" />
                    <span>已发稿件</span>
                  </span>
                </template>
                <div class="mid-divider" style="margin-top: 1px"></div>

                <PublishedManuscript />
              </el-tab-pane>
            </el-tabs>
            <!-- end of 国家发改委用户 -->

            <el-tabs
              type="border-card"
              @tab-click="tableTabClick"
              v-else-if="userAuthority == '国家信息中心用户'"
            >
              <el-tab-pane>
                <template #label>
                  <span class="custom-tabs-label flexcenter">
                    <img src="../assets/paper.png" alt="" />
                    <span>审核稿件</span>
                  </span>
                </template>
                <div class="mid-divider" style="margin-top: 1px"></div>

                <!-- 审核稿件组件 -->
                <ManuscriptAuditing />
              </el-tab-pane>
              <el-tab-pane>
                <template #label>
                  <span class="custom-tabs-label flexcenter">
                    <img src="../assets/papertitle.png" alt="" />
                    <span>审核报题</span>
                  </span>
                </template>
                <div class="mid-divider" style="margin-top: 1px"></div>

                <PaperAuditing />
              </el-tab-pane>
            </el-tabs>
            <!-- end of 国家信息中心用户 -->

          </div>
        </div>
      </div>
    </div>
    <!-- <div class="mid-footer">3</div> -->
  </div>
</template>
<script>
import { ref, reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage, ElLoading } from "element-plus";

import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";
import MySubmission from "@/components/MySubmission.vue";
import PublishedManuscript from "@/components/PublishedManuscript.vue";
import ManuscriptAuditing from "@/components/ManuscriptAuditingComponents/ManuscriptAuditing.vue";
import PaperAuditing from "@/components/PaperAuditingComponents/PaperAuditing.vue";
export default {
  components: {
    MySubmission, //我的投稿组件
    PublishedManuscript, //已发表稿件组件
    ManuscriptAuditing, //审核稿件
    PaperAuditing, //审核报题
  },
  setup() {
    const store = useStore();

    //用户角色名字
    const userAuthority = computed(() => {
      return store.state.StroeLoginO.loginUser.CURRENT_ROLE;
    });

    console.log('HomePage userAuthority',userAuthority);

    //外部用户 稿件统计数据
    const statisticsData = reactive([
      {
        name: "投稿总数",
        num: 0,
        src: "contributenum",
      },
      {
        name: "发布总数",
        num: 0,
        src: "releasenum",
      },
      {
        name: "待处理稿件",
        num: 0,
        src: "pendingnum",
      },
    ]);

    //国家发改委用户 稿件统计数据
    const statisticsGJFGWData = reactive([

    ]);statisticsGJFGWData

    //国家信息中心用户 稿件统计数据
    const statisticsGJXXZXData = reactive([
      {
        name: "待审稿件",
        num: 0,
        src: "unprocessedManuscripts",
      },
      {
        name: "待审报题",
        num: 0,
        src: "unprocessedTopics",
      },
      {
        name: "已审稿件",
        num: 0,
        src: "processedManuscripts",
      },
      {
        name: "已审报题",
        num: 0,
        src: "processedTopics",
      },
    ]);


    //通知公告数据
    const activities = reactive([]);
    //官网动态数据
    const activities1 = reactive([
      {
        content: "中国一带一路网“拉丁熊猫在中国”专题上线",
      },
      {
        content: "中国一带一路网（阿语版）推介会在沙特举行",
      },
      {
        content:
          "中国一带一路网（阿语版）推介会在沙特举行中国一带一路网（阿语版）推介会在沙特举行中国一带一路网（阿语版）推介会在沙特举行中国一带一路网（阿语版）推介会在沙特举行",
      },
    ]);
    //通知公告tabs选中index
    let statisticsTabsSelected = 0;
    function statisticsTabClick(tab) {
      statisticsTabsSelected = tab.index;
    }
    //通知公告点击更多
    function noticeArrowClick() {
      console.log(statisticsTabsSelected);
    }

    //table tabs选中index
    let tableTabsSelected = 0;
    function tableTabClick(tab) {
      tableTabsSelected = tab.index;
    }
    //table 点击更多
    function tableArrowClick() {
      console.log(tableTabsSelected);
    }

    //投稿 -> 跳转到我的投稿页面
    const router = useRouter();
    const toPage = (url) => {
      router.push(url); // 字符串形式跳转
    };

    //通知公告点击置灰
    const isClickedArr = ref([]);
    function elTimelineClick(index) {
      index;
      // if (!isClickedArr.value.includes(index)) {
      //   isClickedArr.value.push(index);
      // }
    }
    //官网动态点击置灰
    const isClickedArr1 = ref([]);
    function elTimelineClick1(index) {
      if (!isClickedArr1.value.includes(index)) {
        isClickedArr1.value.push(index);
      }
    }

    //通知公告接口
    function getSYNoticeListAjaxFn() {
      const loadingInstance1 = ElLoading.service({ fullscreen: true });

      httpAxiosO({
        method: "get",
        url: "/web/notice/noticeList.do",
      })
        .then((D) => {
          console.log("通知公告 D", D);
          const { data, success } = D.data;
          if (!success) {
            ElMessage({
              message: "通知公告数据请求失败",
              type: "error",
              plain: true,
            });
            return;
          }
          ElMessage({
            message: "通知公告数据请求成功",
            type: "success",
            plain: true,
          });

          activities.push(...data.ldata );
        })
        .catch((error) => {
          console.log("通知公告 接口请求 error", error);
          ElMessage({
            message: "通知公告接口请求失败",
            type: "error",
            plain: true,
          });
        })
        .finally(() => {
          loadingInstance1.close();
        });
    }
    // end of getArticleListAjaxFn

    /**
     * 国家信息中心用户 稿件统计 接口请求
     */
    function getNicCountAjaxFn() {
      const loadingInstance1 = ElLoading.service({ fullscreen: true });

      httpAxiosO({
        method: "get",
        url: "/web/externalAuditCount/getNicCount",
        params: {
          searchUser: 0, //	0(个人),1(全部)，这里是投稿平台，和袁冰讨论后暂时传0
        },
      })
        .then((D) => {
          console.log("稿件统计 D", D);
          const { data, success } = D.data;data
          if (!success) {
            ElMessage({
              message: "稿件统计数据请求失败",
              type: "error",
              plain: true,
            });
            return;
          }

          //待审稿件
          statisticsGJXXZXData[0].num = data[0].unprocessedManuscripts;
          //待审报题
          statisticsGJXXZXData[1].num = data[0].unprocessedTopics;
          //已审稿件
          statisticsGJXXZXData[2].num = data[0].processedManuscripts;
          //已审报题
          statisticsGJXXZXData[3].num = data[0].processedTopics;
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
    // end of getNicCountAjaxFn


    /**
     * 外部用户 稿件统计 接口请求
     */
     function getArticleCountAjaxFn() {
      const loadingInstance1 = ElLoading.service({ fullscreen: true });

      httpAxiosO({
        method: "get",
        url: "/web/article/articleCount",
        params: {
          searchUser: 0, //	0(个人),1(全部)，这里是投稿平台，和袁冰讨论后暂时传0
        },
      })
        .then((D) => {
          console.log("稿件统计 D", D);
          const { data, success } = D.data;
          if (!success) {
            ElMessage({
              message: "稿件统计数据请求失败",
              type: "error",
              plain: true,
            });
            return;
          }

          //投稿总数
          statisticsData[0].num = data.articleCount;
          //发布总数
          statisticsData[1].num = data.pubCount;
          //待处理稿件
          statisticsData[2].num = data.waitArticle;
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



    onMounted(() => {
      getArticleCountAjaxFn(); //外部用户 稿件统计
      getNicCountAjaxFn();//国家信息中心用户 稿件统计
      getSYNoticeListAjaxFn(); //首页通知公告
    });

    return {
      userAuthority,
      
      statisticsData,
      statisticsGJXXZXData,

      activities,
      activities1,
      statisticsTabClick,
      noticeArrowClick,
      tableTabClick,
      tableArrowClick,
      toPage,
      isClickedArr,
      elTimelineClick,
      isClickedArr1,
      elTimelineClick1,
    };
  },
};
</script>
<style lang="less" scoped>
.mid-style {
  background-color: #f5f6fa;
  .mid-header {
    padding-top: 15px;
    padding-left: 35px;
    color: #8d92a4;
    .el-icon,
    .el-icon svg {
      height: 1.5em !important;
      width: 1.5em !important;
    }
    span {
      font-size: 14px;
      margin-left: 10px;
    }
  }
  .mid-content {
    // background-color: #fff;
    padding: 15px 34px;
    .mid-content-statistics,
    .mid-content-statistics-table {
      display: flex;
      min-width: 1120px;
      .mid-content-statistics-left {
        width: 65%;
        min-width: 1077px;
        margin-right: 1%;
        background-color: #fff;
        .mid-content-statistics-left-header {
          height: 50px;
          padding: 0 18px;
          justify-content: space-between;
          div {
            .mid-content-statistics-left-header-i {
              display: inline-block;
              height: 36px;
              width: 36px;
              line-height: 36px;
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
        .mid-content-statistics-left-content {
          padding: 20px 18px;
          .mid-content-statistics-left-content-divfgw {
            height: 108px;
            min-width: 330px;
            width: 32%;
            background: #f6f6f7;
            .mid-content-statistics-left-content-img {
              width: 75px;
              height: 75px;
              background-color: #fff;
              border-radius: 50%;
              margin-left: 30px;
              justify-content: center;
            }
            .mid-content-statistics-left-content-divfgw-num {
              justify-content: center;
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
            }
            .mid-content-statistics-left-content-divfgw-divide {
              margin-left: 10px;
              div:nth-child(odd) {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: #e2e3e5;
              }
              div:nth-child(even) {
                width: 193px;
                height: 1px;
                border-bottom: 1px dashed #e2e3e5;
              }
            }
          }
          .mid-content-statistics-left-content-div {
            height: 108px;
            min-width: 330px;
            width: 32%;
            background: #f6f6f7;
            .el-icon {
              color: #ef9712;
              font-size: 20px;
              margin-left: 20px;
            }
            .mid-content-statistics-left-content-img {
              width: 75px;
              height: 75px;
              background-color: #fff;
              border-radius: 50%;
              margin-left: 30px;
              justify-content: center;
            }
            p:nth-child(2),
            p:nth-child(5) {
              margin-left: 20px;
              font-size: 30px;
              color: #555b73;
            }
            p:nth-child(4) {
              width: 1px;
              height: 40px;
              background-color: #dfddec;
              margin: 0 35px;
            }
            p:nth-child(3),
            p:nth-child(6) {
              margin-left: 10px;
              font-size: 16px;
              color: #555b73;
            }
          }
          .mid-content-statistics-left-content-infocenter {
            min-width: 506px;
          }
          div:nth-child(2) {
            margin: 0 2%;
          }
        }
      }
      .mid-content-statistics-right {
        width: 34%;
        background-color: #fff;
        position: relative;
        .el-tabs--border-card {
          height: 100%;
          border: none;
        }
        :deep(.el-tabs__item) {
          height: 50px;
        }
        :deep(.el-tabs--border-card > .el-tabs__header) {
          background-color: #e8f4ff;
          border: none;
        }
        :deep(
            .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active
          ) {
          border: none;
          span {
            color: #0b77cd;
          }
        }
        :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
          transition: none;
          border: none;
        }
        .custom-tabs-label {
          color: #424f63;
          font-size: 18px;
          span {
            margin-left: 15px;
            font-weight: 700;
          }
          .el-icon {
            color: #0b77cd !important;
          }
        }
        :deep(.el-tabs--border-card > .el-tabs__content) {
          padding: 0;
        }
        :deep(.el-timeline-item__node) {
          border-color: #f24a00;
        }
        :deep(.el-timeline-item__content) {
          max-width: 437px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 16px;
          color: #555b73;
          font-weight: 700;
        }
        .isClicked {
          :deep(.el-timeline-item__content) {
            color: #bdbfc5;
          }
        }
        .el-timeline-item {
          padding-bottom: 10px;
        }
        .mid-content-statistics-right-content {
          margin: 28px 23px 0 23px;
          .el-timeline {
            padding: 0;
          }
        }
        .mid-content-statistics-right-arrow {
          position: absolute;
          right: 18px;
          z-index: 1;
          top: 16px;
        }
      }
    }

    .mid-content-statistics-table {
      .mid-content-statistics-table-content {
        padding: 0 20px;
        .mid-content-statistics-table-btngroup {
          margin-top: 15px;
          justify-content: space-between;
          .btn-tougao {
            background-color: #ff8624;
            color: #fff;
            border: none;
            width: 115px;
            font-size: 16px;
          }
          .mid-content-statistics-table-btngroup-search-keyword {
            :deep(.el-select__wrapper) {
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            }
            :deep(.el-input__wrapper) {
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
          }
          :deep(.el-range__icon) {
            position: absolute;
            right: 10px;
            color: #0b77cd;
            font-size: 16px;
          }
          .marl10 {
            margin-left: 10px;
          }
        }
        .mid-content-statistics-table-tabledata {
          margin-top: 15px;
          .isyfb {
            color: #3a8b38;
          }
          .isdcl {
            color: #f47373;
          }
          .isshz {
            color: #4481f8;
          }
          .iswcy {
            color: #fba010;
          }
          .mid-content-statistics-table-tabledata-operate {
            display: flex;
            align-items: center;
            color: #3652d2;
            justify-content: left;
            div {
              cursor: pointer;
              padding: 0 8px;
            }
            span:nth-last-child(1) {
              display: none;
            }
            span {
              width: 1px;
              height: 17px;
              background: #3652d2;
            }
          }
        }
      }
    }
  }
  // .mid-footer {
  //   background-color: yellow;
  //   height: 60px;
  // }
}

//  解决tabs切换table重绘报错问题 ResizeObserver loop completed with undelivered notifications
// :deep(.el-table .cell) {
//   height: 23px;
// }
</style>
