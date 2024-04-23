<template>
  <div>
    <div class="mid-content-mycontribute">
      <!-- <div class="mid-content-mycontribute-header flexcenter">
        <div class="flexcenter">
          <div class="mid-content-mycontribute-header-i">
            <img src="../assets/mycontribute.png" alt="" />
          </div>
          <span>审核稿件</span>
        </div>
      </div> -->
      <!-- <div class="mid-divider mid-divider-display"></div> -->
      <div
        class="mid-content-mycontribute-table-content"
        v-if="statusRadio == 1"
      >
        <div class="mid-content-mycontribute-table-btngroup flexcenter">
          <div>
            <el-radio-group
              v-model="statusRadio"
              class="mid-content-mycontribute-table-btngroup-radio"
            >
              <el-radio :value="1">待审核</el-radio>
              <el-radio :value="2">已处理</el-radio>
            </el-radio-group>
          </div>
          <div
            class="mid-content-mycontribute-table-btngroup-search flexcenter"
          >
            <el-button
              class="mid-content-mycontribute-table-btngroup-search-btn"
              >批量审核</el-button
            >
            <div
              class="mid-content-mycontribute-table-btngroup-search-divide"
            ></div>
            <div class="mid-content-mycontribute-table-btngroup-search-keyword">
              <el-select
                v-model="searchSelectValue"
                placeholder=""
                style="width: 80px"
              >
                <el-option
                  v-for="item in searchOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-input
                v-model="searchInput"
                style="width: 190px"
                placeholder="请输入关键词"
                clearable
              />
            </div>
            <div class="marl10">
              <el-autocomplete
                v-model="originInput"
                style="width: 190px"
                :fetch-suggestions="querySearch"
                clearable
                placeholder="稿件来源"
              />
            </div>

            <el-select
              v-model="langSelectValue"
              placeholder="语种"
              style="width: 140px"
              class="marl10"
            >
              <el-option
                v-for="item in langOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-config-provider :locale="locale">
              <el-date-picker
                v-model="dateDefaultTime"
                type="daterange"
                start-placeholder="创建起始日期"
                end-placeholder="创建结束日期"
                :locale="locale"
                style="margin-left: 10px; width: 270px"
              />
            </el-config-provider>
            <el-button type="primary" class="marl10" style="width: 78px">
              <el-icon style="margin-right: 5px"><Search /></el-icon>
              搜索
            </el-button>
          </div>
        </div>
        <div class="mid-content-mycontribute-table-tabledata">
          <el-table
            :data="tableData.slice((page - 1) * limit, page * limit)"
            border
            style="width: 100%"
            :header-cell-style="{
              'text-align': 'center',
              color: '#6a6d74',
              'font-size': '16px',
            }"
            :cell-style="{
              'text-align': 'center',
              color: '#727789',
              'font-size': '16px',
            }"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="序号" width="100">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="title" label="稿件标题">
              <template #default="scope">
                <el-popover
                  :visible="scope.row.visible ? true : false"
                  placement="right"
                  :width="1350"
                  popper-class="elpopover-style"
                >
                  <div class="elpopover-close">
                    <el-icon
                      class="hoverpointer"
                      @click="
                        scope.row.visible = false;
                        popoverShowFlag = false;
                      "
                      ><CircleClose
                    /></el-icon>
                  </div>
                  <div class="elpopover-content flexcenter">
                    <div class="elpopover-content-left">
                      <div
                        class="elpopover-content-left-title"
                        :title="scope.row.title"
                      >
                        {{ scope.row.title }}
                      </div>
                      <div class="elpopover-content-left-info flexcenter">
                        <span>作者：</span><span>李某某</span>
                        <div
                          class="mid-content-mycontribute-table-btngroup-search-divide"
                        ></div>
                        <span>稿件来源：</span><span>生态环境部</span>
                        <div
                          class="mid-content-mycontribute-table-btngroup-search-divide"
                        ></div>
                        <span>发布时间：</span><span>{{ scope.row.date }}</span>
                        <div
                          class="mid-content-mycontribute-table-btngroup-search-divide"
                        ></div>
                        <span>字体：</span>
                        <span
                          class="elpopover-content-left-font hoverpointer"
                          :class="{ fontSelected: fontSelect == '小' }"
                          @click="fontSelect = '小'"
                          >小</span
                        >
                        <span
                          class="elpopover-content-left-font hoverpointer"
                          :class="{ fontSelected: fontSelect == '中' }"
                          @click="fontSelect = '中'"
                          >中</span
                        >
                        <span
                          class="elpopover-content-left-font hoverpointer"
                          :class="{ fontSelected: fontSelect == '大' }"
                          @click="fontSelect = '大'"
                          >大</span
                        >
                      </div>
                      <div
                        class="elpopover-content-left-text"
                        :class="{
                          fontSmall: fontSelect == '小',
                          fontMid: fontSelect == '中',
                          fontBig: fontSelect == '大',
                        }"
                      >
                        <div v-html="articleHtmlCon"></div>
                      </div>
                    </div>
                    <div class="elpopover-content-right">
                      <div class="elpopover-content-title flexcenter">
                        <img src="../assets/manuscriptauditing.png" alt="" />
                        <span>审核流程记录</span>
                      </div>
                      <el-timeline class="elpopover-content-timeline">
                        <el-timeline-item
                          :timestamp="activity.timestamp"
                          placement="top"
                          v-for="(activity, index) in timelineData"
                          :key="index"
                        >
                          <div class="elpopover-content-timeline-details">
                            <div class="elpopover-content-timeline-details-fir">
                              {{ activity.fir }}
                            </div>
                            <div class="elpopover-content-timeline-details-sec">
                              {{ activity.sec }}
                            </div>
                            <div class="elpopover-content-timeline-details-thi">
                              <span>审核人：</span
                              ><span>{{ activity.thi }}</span>
                            </div>
                          </div>
                        </el-timeline-item>
                      </el-timeline>
                    </div>
                  </div>
                  <div class="elpopover-comment">
                    <div class="elpopover-comment-header flexcenter">
                      <div class="elpopover-comment-header-divide"></div>
                      <span>审核意见</span>
                    </div>
                    <div class="elpopover-comment-header-textarea">
                      <el-input
                        v-model="commentTextarea"
                        :rows="4"
                        type="textarea"
                        placeholder="审核通过"
                      />
                    </div>
                    <div class="elpopover-comment-header-radio">
                      <el-radio-group v-model="commentRadio">
                        <el-radio
                          :value="item.value"
                          v-for="item in commentRadioData"
                          :key="item.value"
                          >{{ item.label }}</el-radio
                        >
                      </el-radio-group>
                    </div>
                    <div class="elpopover-comment-header-btn flexcenter">
                      <el-button>提交</el-button>
                    </div>
                  </div>
                  <template #reference>
                    <span
                      :title="scope.row.title"
                      style="
                        display: flex;
                        justify-content: left;
                        text-align: left;
                        cursor: pointer;
                      "
                      :class="{
                        isClicked: isClickedArr.includes(scope.$index),
                      }"
                      @click="rowTitleClick(scope)"
                    >
                      {{ scope.row.title }}
                    </span>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="origin" label="稿件来源" width="125" />
            <el-table-column prop="lang" label="语种" width="120" />
            <el-table-column prop="date" label="创建时间" width="200" />
            <el-table-column prop="operate" label="操作" width="80">
              <template #default="scope">
                <div class="mid-content-mycontribute-table-tabledata-operate">
                  <div
                    v-if="scope.row.title != ''"
                    @click="rowTitleClick(scope)"
                  >
                    审核
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="flexcenter el-pagination-style">
            <el-pagination
              layout="slot"
              :total="tableData.length"
              class="el-pagination-style-leftpagination"
            >
              <span class="el-pagination-style-leftpagination-total">
                共{{ tableData.length }}条
              </span>
              <span
                class="el-pagination-style-leftpagination-percent flexcenter"
              >
                {{ page }}/{{ Math.ceil(tableData.length / limit) }}
              </span>
            </el-pagination>
            <el-config-provider :locale="locale">
              <el-pagination
                background
                layout="prev, next, sizes, jumper"
                :total="tableData.length"
                :page-sizes="[15, 20, 30, 40, 50]"
                :page-size="limit"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                class="el-pagination-style-rightpagination"
              />
            </el-config-provider>
          </div>
        </div>
      </div>

      <!-- 已处理部分 -->
      <div class="mid-content-mycontribute-table-content" v-else>
        <div class="mid-content-mycontribute-table-btngroup flexcenter">
          <div>
            <el-radio-group
              v-model="statusRadio"
              class="mid-content-mycontribute-table-btngroup-radio"
            >
              <el-radio :value="1">待审核</el-radio>
              <el-radio :value="2">已处理</el-radio>
            </el-radio-group>
          </div>
          <div
            class="mid-content-mycontribute-table-btngroup-search flexcenter"
          >
            <div class="mid-content-mycontribute-table-btngroup-search-keyword">
              <el-select
                v-model="searchSelectValue1"
                placeholder=""
                style="width: 80px"
              >
                <el-option
                  v-for="item in searchOptions1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-input
                v-model="searchInput1"
                style="width: 190px"
                placeholder="请输入关键词"
                clearable
              />
            </div>
            <div class="marl10">
              <el-autocomplete
                v-model="originInput1"
                style="width: 190px"
                :fetch-suggestions="querySearch1"
                clearable
                placeholder="稿件来源"
              />
            </div>

            <el-select
              v-model="langSelectValue1"
              placeholder="语种"
              style="width: 140px"
              class="marl10"
            >
              <el-option
                v-for="item in langOptions1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-model="statusSelectValue"
              placeholder="状态"
              style="width: 140px"
              class="marl10"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-model="nodeSelectValue"
              placeholder="稿件节点"
              style="width: 140px"
              class="marl10"
            >
              <el-option
                v-for="item in nodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-config-provider :locale="locale">
              <el-date-picker
                v-model="dateDefaultTime1"
                type="daterange"
                start-placeholder="创建起始日期"
                end-placeholder="创建结束日期"
                :locale="locale"
                style="margin-left: 10px; width: 270px"
              />
            </el-config-provider>
            <el-button type="primary" class="marl10" style="width: 78px">
              <el-icon style="margin-right: 5px"><Search /></el-icon>
              搜索
            </el-button>
          </div>
        </div>
        <div class="mid-content-mycontribute-table-tabledata">
          <el-table
            :data="tableData1.slice((page1 - 1) * limit1, page1 * limit1)"
            border
            style="width: 100%"
            :header-cell-style="{
              'text-align': 'center',
              color: '#6a6d74',
              'font-size': '16px',
            }"
            :cell-style="{
              'text-align': 'center',
              color: '#727789',
              'font-size': '16px',
            }"
          >
            <el-table-column label="序号" width="100">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="title" label="稿件标题">
              <template #default="scope">
                <el-popover
                  :visible="scope.row.visible ? true : false"
                  placement="right"
                  :width="1350"
                  popper-class="elpopover-style"
                >
                  <div class="elpopover-close">
                    <el-icon
                      class="hoverpointer"
                      @click="
                        scope.row.visible = false;
                        popoverShowFlag1 = false;
                      "
                      ><CircleClose
                    /></el-icon>
                  </div>
                  <div class="elpopover-passpic">
                    <img src="../assets/pass.png" alt="" />
                  </div>
                  <div class="elpopover-content flexcenter">
                    <div class="elpopover-content-left">
                      <div
                        class="elpopover-content-left-title"
                        :title="scope.row.title"
                      >
                        {{ scope.row.title }}
                      </div>
                      <div class="elpopover-content-left-info flexcenter">
                        <span>作者：</span><span>啊啊啊啊啊某某</span>
                        <div
                          class="mid-content-mycontribute-table-btngroup-search-divide"
                        ></div>
                        <span>稿件来源：</span><span>生态环境部</span>
                        <div
                          class="mid-content-mycontribute-table-btngroup-search-divide"
                        ></div>
                        <span>发布时间：</span><span>{{ scope.row.date }}</span>
                        <div
                          class="mid-content-mycontribute-table-btngroup-search-divide"
                        ></div>
                        <span>字体：</span>
                        <span
                          class="elpopover-content-left-font hoverpointer"
                          :class="{ fontSelected: fontSelect == '小' }"
                          @click="fontSelect = '小'"
                          >小</span
                        >
                        <span
                          class="elpopover-content-left-font hoverpointer"
                          :class="{ fontSelected: fontSelect == '中' }"
                          @click="fontSelect = '中'"
                          >中</span
                        >
                        <span
                          class="elpopover-content-left-font hoverpointer"
                          :class="{ fontSelected: fontSelect == '大' }"
                          @click="fontSelect = '大'"
                          >大</span
                        >
                      </div>
                      <div
                        class="elpopover-content-left-text elpopover-content-left-text1"
                        :class="{
                          fontSmall: fontSelect == '小',
                          fontMid: fontSelect == '中',
                          fontBig: fontSelect == '大',
                        }"
                      >
                        <div v-html="articleHtmlCon"></div>
                      </div>
                    </div>
                    <div
                      class="elpopover-content-right elpopover-content-right1"
                    >
                      <div class="elpopover-content-title flexcenter">
                        <img src="../assets/manuscriptauditing.png" alt="" />
                        <span>审核流程记录</span>
                      </div>
                      <el-timeline class="elpopover-content-timeline">
                        <el-timeline-item
                          :timestamp="activity.timestamp"
                          placement="top"
                          v-for="(activity, index) in timelineData"
                          :key="index"
                        >
                          <div class="elpopover-content-timeline-details">
                            <div
                              class="elpopover-content-timeline-details-fir"
                              :class="{ isPass: activity.fir == '审核通过' }"
                            >
                              {{ activity.fir }}
                            </div>
                            <div class="elpopover-content-timeline-details-sec">
                              {{ activity.sec }}
                            </div>
                            <div class="elpopover-content-timeline-details-thi">
                              <span>审核人：</span
                              ><span>{{ activity.thi }}</span>
                            </div>
                          </div>
                        </el-timeline-item>
                      </el-timeline>
                    </div>
                  </div>
                  <template #reference>
                    <span
                      :title="scope.row.title"
                      style="
                        display: flex;
                        justify-content: left;
                        text-align: left;
                        cursor: pointer;
                      "
                      :class="{
                        isClicked: isClickedArr.includes(scope.$index),
                      }"
                      @click="rowTitleClick1(scope)"
                    >
                      {{ scope.row.title }}
                    </span>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="origin" label="稿件来源" width="125" />
            <el-table-column prop="lang" label="语种" width="120" />
            <el-table-column prop="articleUseStatus" label="状态" width="110">
              <template #default="scope">
                <span
                  :class="{
                    iswtg: scope.row.articleUseStatus === '未通过', //'未通过',
                    isshz: scope.row.articleUseStatus === '审核中', //'审核中',
                    isyfb: scope.row.articleUseStatus === '已发布', //'已发布',
                  }"
                  >{{ scope.row.articleUseStatus }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="node" label="稿件节点" width="120" />
            <el-table-column prop="date" label="创建时间" width="200" />
            <el-table-column prop="operate" label="操作" width="80">
              <template #default="scope">
                <div class="mid-content-mycontribute-table-tabledata-operate">
                  <div v-if="scope.row.title != ''">查看</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="flexcenter el-pagination-style">
            <el-pagination
              layout="slot"
              :total="tableData1.length"
              class="el-pagination-style-leftpagination"
            >
              <span class="el-pagination-style-leftpagination-total">
                共{{ tableData1.length }}条
              </span>
              <span
                class="el-pagination-style-leftpagination-percent flexcenter"
              >
                {{ page1 }}/{{ Math.ceil(tableData1.length / limit1) }}
              </span>
            </el-pagination>
            <el-config-provider :locale="locale">
              <el-pagination
                background
                layout="prev, next, sizes, jumper"
                :total="tableData1.length"
                :page-sizes="[15, 20, 30, 40, 50]"
                :page-size="limit1"
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
                class="el-pagination-style-rightpagination"
              />
            </el-config-provider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { ElMessage, ElLoading } from "element-plus";
import { timeFormatFn } from "@/utils/timeFormat.js";
import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";
export default {
  setup() {
    //路由实例
    const router = useRouter();
    router;
    //vuex实例
    const store = useStore();

    //关键词
    const searchInput = ref("");
    const searchSelectValue = ref(0);
    const searchOptions = [
      {
        value: 0,
        label: "标题",
      },
      {
        value: 1,
        label: "正文",
      },
    ];

    //语种select数据
    const langSelectValue = ref("");
    const langOptions = reactive([]);
    store.state.GLOBAL_LANGUAGE_LIST.forEach((o) => {
      langOptions.push({
        value: o.id,
        label: o.desc,
      });
    });

    //日期选择 数据
    const dateDefaultTime = ref("");
    //表格数据
    const tableData = reactive([]);

    //分页器
    let limit = ref(15);
    function handleSizeChange(val) {
      limit.value = val;
    }
    let page = ref(1);
    let pageTotal = ref(0);
    function handleCurrentChange(val) {
      page.value = val;
    }

    /**
     * 查询未审核稿件
     */
    function getNeedAuditCountAjaxFn() {
      const loadingInstance1 = ElLoading.service({ fullscreen: true });

      httpAxiosO({
        method: "get",
        url: "/api/web/articleRecord/getNeedAuditCount.do",
        params: {
          displayNode: 1, //	1国家信息中心 2 国家发改委
        },
      })
        .then((D) => {
          console.log("D 查询未审核稿件", D);
          const { data, success } = D.data;
          if (!success) {
            ElMessage({
              message: "查询未审核稿件请求失败",
              type: "error",
              plain: true,
            });
            return;
          }
          ElMessage({
            message: "查询未审核稿件请求成功",
            type: "success",
            plain: true,
          });
          data;
          timeFormatFn;
        })
        .catch((error) => {
          console.log("error 查询未审核稿件", error);
        })
        .finally(() => {
          loadingInstance1.close();
        });
    }
    // end of getNeedAuditCountAjaxFn

    //稿件标题点击置灰
    const isClickedArr = ref([]);
    const popoverShowFlag = ref(false);
    function rowTitleClick(scope) {
      if (popoverShowFlag.value) {
        //有弹窗打开时 跳出方法
        return;
      }
      popoverShowFlag.value = true;
      scope.row.visible = true;
      if (!isClickedArr.value.includes(scope.$index)) {
        isClickedArr.value.push(scope.$index);
      }
    }

    //联想输入框
    const originInput = ref("");
    const restaurants = ref([]);
    const querySearch = (queryString, cb) => {
      const results = queryString
        ? restaurants.value.filter(createFilter(queryString))
        : restaurants.value;
      // call callback function to return suggestions
      cb(results);
    };
    const loadAll = () => {
      return [
        { value: "vue", link: "https://github.com/vuejs/vue" },
        { value: "element", link: "https://github.com/ElemeFE/element" },
        { value: "cooking", link: "https://github.com/ElemeFE/cooking" },
        { value: "mint-ui", link: "https://github.com/ElemeFE/mint-ui" },
        { value: "vuex", link: "https://github.com/vuejs/vuex" },
        { value: "vue-router", link: "https://github.com/vuejs/vue-router" },
        { value: "babel", link: "https://github.com/babel/babel" },
      ];
    };
    const createFilter = (queryString) => {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    };
    onMounted(() => {
      restaurants.value = loadAll();
      getNeedAuditCountAjaxFn();
    });

    const statusRadio = ref(1);

    // <!-- 已处理部分 -->
    //关键词
    const searchInput1 = ref("");
    const searchSelectValue1 = ref(0);
    const searchOptions1 = [
      {
        value: 0,
        label: "标题",
      },
      {
        value: 1,
        label: "正文",
      },
    ];
    //语种select数据
    const langSelectValue1 = ref("");
    const langOptions1 = [{ value: 0, label: "中文" }];
    //日期选择 数据
    const dateDefaultTime1 = ref([]);
    //状态select数据
    const statusSelectValue = ref("");
    const statusOptions = [
      { value: 0, label: "审核中" },
      { value: 1, label: "未通过" },
    ];
    //稿件节点select数据
    const nodeSelectValue = ref("");
    const nodeOptions = [
      { value: 0, label: "审核中" },
      { value: 1, label: "未通过" },
    ];
    //表格数据
    const tableData1 = [
      {
        title:
          "您题为《外交部：中国发展对外关系对各国一视同仁》的投稿正在审核中",
        date: "2016-05-04",
        name: "张三",
        origin: "新华社222",
        lang: "阿文",
        articleUseStatus: "审核中",
        node: "编辑部",
      },
      {
        title: "您题为《便利外籍人员来华5项措施详解》的投稿未采用",
        date: "2016-05-03",
        origin: "新华社",
        lang: "中文",
        articleUseStatus: "已发布",
        node: "编辑部1",
      },
      {
        title:
          "(Musiècle : une histoire d'éveil et de développement (REPORTAGE)(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)",
        date: "2016-05-02",
        origin: "新华社",
        lang: "法语",
        articleUseStatus: "已发布",
        node: "编辑部",
      },
      {
        title:
          "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        name: "张三",
        origin: "新华社",
        lang: "阿文",
        articleUseStatus: "未通过",
        node: "编辑部",
      },
    ];
    //分页器
    let limit1 = ref(15);
    function handleSizeChange1(val) {
      limit1.value = val;
    }
    let page1 = ref(1);
    function handleCurrentChange1(val) {
      page1.value = val;
    }
    //稿件标题点击置灰
    const isClickedArr1 = ref([]);
    const popoverShowFlag1 = ref(false);
    function rowTitleClick1(scope) {
      if (popoverShowFlag1.value) {
        //有弹窗打开时 跳出方法
        return;
      }
      popoverShowFlag1.value = true;
      scope.row.visible = true;
      if (!isClickedArr1.value.includes(scope.$index)) {
        isClickedArr1.value.push(scope.$index);
      }
    }
    //联想输入框
    const originInput1 = ref("");
    const querySearch1 = (queryString, cb) => {
      const results = queryString
        ? restaurants.value.filter(createFilter(queryString))
        : restaurants.value;
      // call callback function to return suggestions
      cb(results);
    };

    //字体选择
    const fontSelect = ref("中");
    //待审核弹窗html内容
    const articleHtmlCon = `<p style="text-align: justify; white-space: pre-wrap; text-indent: 2em;">“一企一档”模块聚焦政府安商稳商、银行贷后管理等场景，整合全国6100多万家存续企业工商、司法、投融资、舆情等数据，通过标签化处理赋予企业行业、资质、产品、动态等标签，形成企业全景画像。此外，还支持与用户联合建模，引入公共数据、私域数据，进一步完善企业档案。基于电子档案信息和企业行为动态，为用户推送展示目标企业动态信息，利用数字化手段助力企业服务精准化、规范化和高效化，助力“稳存量”。</p><p style="text-align: justify; white-space: pre-wrap; text-indent: 2em;">“一企一档”模块聚焦政府安商稳商、银行贷后管理等场景，整合全国6100多万家存续企业工商、司法、投融资、舆情等数据，通过标签化处理赋予企业行业、资质、产品、动态等标签，形成企业全景画像。此外，还支持与用户联合建模，引入公共数据、私域数据，进一步完善企业档案。基于电子档案信息和企业行为动态，为用户推送展示目标企业动态信息，利用数字化手段助力企业服务精准化、规范化和高效化，助力“稳存量”。</p><p style="text-align: justify; white-space: pre-wrap; text-indent: 2em;">“一企一档”模块聚焦政府安商稳商、银行贷后管理等场景，整合全国6100多万家存续企业工商、司法、投融资、舆情等数据，通过标签化处理赋予企业行业、资质、产品、动态等标签，形成企业全景画像。此外，还支持与用户联合建模，引入公共数据、私域数据，进一步完善企业档案。基于电子档案信息和企业行为动态，为用户推送展示目标企业动态信息，利用数字化手段助力企业服务精准化、规范化和高效化，助力“稳存量”。</p><p style="text-align: justify; white-space: pre-wrap; text-indent: 2em;">“一企一档”模块聚焦政府安商稳商、银行贷后管理等场景，整合全国6100多万家存续企业工商、司法、投融资、舆情等数据，通过标签化处理赋予企业行业、资质、产品、动态等标签，形成企业全景画像。此外，还支持与用户联合建模，引入公共数据、私域数据，进一步完善企业档案。基于电子档案信息和企业行为动态，为用户推送展示目标企业动态信息，利用数字化手段助力企业服务精准化、规范化和高效化，助力“稳存量”。</p><p style="text-align: justify; white-space: pre-wrap; text-indent: 2em;">“一企一档”模块聚焦政府安商稳商、银行贷后管理等场景，整合全国6100多万家存续企业工商、司法、投融资、舆情等数据，通过标签化处理赋予企业行业、资质、产品、动态等标签，形成企业全景画像。此外，还支持与用户联合建模，引入公共数据、私域数据，进一步完善企业档案。基于电子档案信息和企业行为动态，为用户推送展示目标企业动态信息，利用数字化手段助力企业服务精准化、规范化和高效化，助力“稳存量”。</p><p style="text-align: justify; white-space: pre-wrap; text-indent: 2em;">“一企一档”模块聚焦政府安商稳商、银行贷后管理等场景，整合全国6100多万家存续企业工商、司法、投融资、舆情等数据，通过标签化处理赋予企业行业、资质、产品、动态等标签，形成企业全景画像。此外，还支持与用户联合建模，引入公共数据、私域数据，进一步完善企业档案。基于电子档案信息和企业行为动态，为用户推送展示目标企业动态信息，利用数字化手段助力企业服务精准化、规范化和高效化，助力“稳存量”。</p><p style="text-align: justify; white-space: pre-wrap; text-indent: 2em;">“一企一档”模块聚焦政府安商稳商、银行贷后管理等场景，整合全国6100多万家存续企业工商、司法、投融资、舆情等数据，通过标签化处理赋予企业行业、资质、产品、动态等标签，形成企业全景画像。此外，还支持与用户联合建模，引入公共数据、私域数据，进一步完善企业档案。基于电子档案信息和企业行为动态，为用户推送展示目标企业动态信息，利用数字化手段助力企业服务精准化、规范化和高效化，助力“稳存量”。</p><p style="text-align: justify; white-space: pre-wrap; text-indent: 2em;">行业洞察系统以产业链图谱为核心，结合中国经济信息社传统的数据平台优势、新华社国家高端智库优势，为政府推动产业高质量发展提供一套从“产业规划-政策供给-运行监测-持续优化”的闭环管理体系和运行指挥体系，助力区域产业数字化转型，提升政府数字化治理能力。</p><p style="text-align: justify; white-space: pre-wrap; text-indent: 2em;">行业洞察系统以产业链图谱为核心，结合中国经济信息社传统的数据平台优势、新华社国家高端智库优势，为政府推动产业高质量发展提供一套从“产业规划-政策供给-运行监测-持续优化”的闭环管理体系和运行指挥体系，助力区域产业数字化转型，提升政府数字化治理能力。</p><p style="text-align: justify; white-space: pre-wrap; text-indent: 2em;">行业洞察系统以产业链图谱为核心，结合中国经济信息社传统的数据平台优势、新华社国家高端智库优势，为政府推动产业高质量发展提供一套从“产业规划-政策供给-运行监测-持续优化”的闭环管理体系和运行指挥体系，助力区域产业数字化转型，提升政府数字化治理能力。</p><p style="text-align: justify; white-space: pre-wrap; text-indent: 2em;">行业洞察系统以产业链图谱为核心，结合中国经济信息社传统的数据平台优势、新华社国家高端智库优势，为政府推动产业高质量发展提供一套从“产业规划-政策供给-运行监测-持续优化”的闭环管理体系和运行指挥体系，助力区域产业数字化转型，提升政府数字化治理能力。</p><p style="text-align: justify; white-space: pre-wrap; text-indent: 2em;">行业洞察系统以产业链图谱为核心，结合中国经济信息社传统的数据平台优势、新华社国家高端智库优势，为政府推动产业高质量发展提供一套从“产业规划-政策供给-运行监测-持续优化”的闭环管理体系和运行指挥体系，助力区域产业数字化转型，提升政府数字化治理能力。</p><p style="text-align: justify; white-space: pre-wrap; text-indent: 2em;">行业洞察系统以产业链图谱为核心，结合中国经济信息社传统的数据平台优势、新华社国家高端智库优势，为政府推动产业高质量发展提供一套从“产业规划-政策供给-运行监测-持续优化”的闭环管理体系和运行指挥体系，助力区域产业数字化转型，提升政府数字化治理能力。</p>`;
    //时间轴数据
    const timelineData = [
      {
        timestamp: "2018-04-12 20:46",
        fir: "修改后送审国家改革发展委员会",
        sec: "显示审核意见显示审核意见显示审核意见显示审核意见显示审核意见显示审核意见",
        thi: "国家改革发展委员会",
      },
      {
        timestamp: "2018-04-03 20:46",
        fir: "审核通过",
        sec: "显示审核意见显示审核意见显示审核意见显示审核意见显示审核意见显示审核意见",
        thi: "国家改革发展委员会",
      },
      {
        timestamp: "2018-04-03 20:46",
        fir: "送审国家改革发展委员会",
        sec: "显示审核意见显示审核意见显示审核意见显示审核意见显示审核意见显示审核意见",
        thi: "国家改革发展委员会",
      },
      {
        timestamp: "2018-04-03 20:46",
        fir: "送审国家改革发展委员会",
        sec: "显示审核意见显示审核意见显示审核意见显示审核意见显示审核意见显示审核意见",
        thi: "国家改革发展委员会",
      },
    ];
    //审核意见
    const commentTextarea = ref("");
    //审核意见Radio
    const commentRadio = ref(0);
    const commentRadioData = reactive([
      {
        value: 0,
        label: "审核通过",
      },
      {
        value: 1,
        label: "修改后直接签发",
      },
      {
        value: 2,
        label: "修改后送审国家发展和改革委员会",
      },
      {
        value: 3,
        label: "修改后送审国家信息中心",
      },
      {
        value: 4,
        label: "送审国家发展和改革委员会",
      },
      {
        value: 5,
        label: "审核未通过",
      },
    ]);

    return {
      searchInput,
      searchSelectValue,
      searchOptions,
      langSelectValue,
      langOptions,
      dateDefaultTime,
      locale: zhCn, //date-range 语言设置
      tableData,
      limit,
      page,
      pageTotal,
      handleSizeChange,
      handleCurrentChange,
      isClickedArr,
      rowTitleClick,
      popoverShowFlag,
      originInput,
      querySearch,
      statusRadio,

      //已处理部分
      searchInput1,
      searchSelectValue1,
      searchOptions1,
      langSelectValue1,
      langOptions1,
      dateDefaultTime1,
      statusSelectValue,
      statusOptions,
      nodeSelectValue,
      nodeOptions,
      tableData1,
      limit1,
      page1,
      handleSizeChange1,
      handleCurrentChange1,
      isClickedArr1,
      rowTitleClick1,
      popoverShowFlag1,
      originInput1,
      querySearch1,

      fontSelect,
      articleHtmlCon,
      timelineData,
      commentTextarea,
      commentRadio,
      commentRadioData,

      getNeedAuditCountAjaxFn,
    };
  },
};
</script>
<style scoped lang='less'>
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
.mid-content-mycontribute-table-content {
  padding: 0 20px;
  .mid-content-mycontribute-table-btngroup {
    margin-top: 15px;
    justify-content: space-between;
    .clear-recyclebin {
      background: #1890ff;
      color: #fff;
    }
    .mid-content-mycontribute-table-btngroup-search-btn {
      background: #1890ff;
      color: #fff;
    }

    .mid-content-mycontribute-table-btngroup-search-keyword {
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
    .mid-content-mycontribute-table-btngroup-radio {
      :deep(.el-radio__label) {
        font-size: 16px;
      }
    }
  }
  .mid-content-mycontribute-table-tabledata {
    margin-top: 15px;
    .isyfb {
      color: #fba010;
    }
    .iswtg {
      color: #999;
    }
    .isshz {
      color: #4481f8;
    }
    .mid-content-mycontribute-table-tabledata-operate {
      color: #3652d2;
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

.isClicked {
  color: #a7a9b2;
}
.mid-content-mycontribute-table-btngroup-search-divide {
  width: 2px;
  height: 25px;
  background-color: #dfdee4;
  margin: 0 15px;
}
.elpopover-style {
  .elpopover-close {
    text-align: right;
    font-size: 24px;
  }
  .elpopover-passpic {
    position: absolute;
    right: 300px;
    top: 50px;
  }
  .elpopover-content {
    justify-content: space-between;
    align-items: unset;
    .elpopover-content-left {
      padding: 0 47px;
      width: 1005px;
      .elpopover-content-left-title {
        font-size: 28px;
        font-weight: 700;
        color: #000;
        text-align: center;
        white-space: nowrap; /* 确保文本不会换行 */
        overflow: hidden; /* 隐藏溢出的内容 */
        text-overflow: ellipsis;
      }
      .elpopover-content-left-info {
        margin-top: 20px;
        justify-content: center;
        font-size: 16px;
        color: #757575;
        .elpopover-content-left-font {
          margin-right: 10px;
        }
        .fontSelected {
          display: inline-block;
          width: 26px;
          height: 26px;
          line-height: 26px;
          border-radius: 50%;
          background-color: #0b77cd;
          color: #fff;
          text-align: center;
        }
      }
      .elpopover-content-left-text {
        margin-top: 40px;
        color: #000000;
        max-height: 275px;
        overflow-y: auto;
      }
      .fontSmall {
        font-size: 16px;
      }
      .fontMid {
        font-size: 18px;
      }
      .fontBig {
        font-size: 20px;
      }
    }
    .elpopover-content-right {
      width: 290px;
      max-height: 410px;
      overflow-y: auto;
      .elpopover-content-title {
        span {
          font-size: 24px;
          color: #000;
          margin-left: 25px;
          font-weight: 700;
        }
      }
      .el-timeline {
        padding-left: 5px;
        margin-top: 20px;
      }
      :deep(.el-timeline-item__node--normal) {
        background: url(../assets/timeline.png) no-repeat;
        width: 19px;
        height: 19px;
        left: -4px;
      }
      :deep(.el-timeline-item__timestamp.is-top) {
        background: url(../assets/timelinebg.png) no-repeat;
        height: 42px;
        line-height: 25px;
        padding-left: 15px;
        font-size: 14px;
        color: #0b77cd;
      }
      .elpopover-content-timeline-details {
        font-size: 16px;
        .elpopover-content-timeline-details-fir {
          height: 30px;
          background-color: #0b77cd;
          color: #fff;
          line-height: 30px;
          border-radius: 5px;
          padding-left: 4px;
        }
        .isPass {
          background-color: #2b9626;
        }
        .elpopover-content-timeline-details-sec {
          margin-top: 10px;
        }
        .elpopover-content-timeline-details-thi {
          color: #999999;
          margin-top: 10px;
        }
      }
    }
  }
  .elpopover-comment {
    height: 300px;
    background-color: #f5f6fa;
    padding: 0 47px;
    .elpopover-comment-header {
      padding-top: 30px;
      .elpopover-comment-header-divide {
        width: 5px;
        height: 20px;
        border-radius: 5px;
        background-color: #1890ff;
      }
      span {
        font-size: 20px;
        font-weight: 700;
        color: #000;
        margin-left: 20px;
      }
    }
    .elpopover-comment-header-textarea {
      margin-top: 15px;
    }
    .elpopover-comment-header-radio {
      margin-top: 15px;
    }
    .elpopover-comment-header-btn {
      margin-top: 15px;
      justify-content: center;
      .el-button {
        width: 240px;
        height: 45px;
        border-radius: 5px;
        background-color: #1890ff;
        color: #fff;
      }
    }
  }
  .elpopover-content-left-text1 {
    max-height: 575px !important;
  }
  .elpopover-content-right1 {
    max-height: 710px !important;
  }
}
///* 滚动条 */
::-webkit-scrollbar {
  width: 10px;
  height: 5px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #1890ff;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: transparent;
}
</style>
<style lang="less">
.elpopover-style {
  position: fixed !important;
  top: 50% !important;
  left: 63% !important;
  transform: translate(-50%, -50%);
  padding: 0 !important;
}
</style>