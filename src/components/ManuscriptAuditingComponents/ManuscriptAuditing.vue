<template>
  <div>
    <div class="mid-content-mycontribute" data-desc="审核稿件组件">

      <div
        class="mid-content-mycontribute-table-content"
        v-if="statusRadio == 1"
        key="待审核1"
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
              @click="dialogBatchProcessingFn"
            >批量审核</el-button>
            <div
              class="mid-content-mycontribute-table-btngroup-search-divide"
            ></div>
            <div class="mid-content-mycontribute-table-btngroup-search-keyword flexcenter">
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
            <el-button type="primary" class="marl10" style="width: 78px"
              @click="getNeedAuditCountAjaxFn"
            >
              <el-icon style="margin-right: 5px"><Search /></el-icon>
              搜索
            </el-button>
          </div>
        </div>
        <div class="mid-content-mycontribute-table-tabledata">
          <el-table
            :data="tableData"
            @selection-change="handleSelectionTableDataFn"
            border
            style="width: 100%"
            :header-cell-style="{
              'text-align': 'center',
              'color': '#6a6d74',
              'font-size': '16px',
            }"
            :cell-style="{
              'text-align': 'center',
              'color': '#727789',
              'font-size': '16px',
            }"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="序号" width="100">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="articleTitle" label="稿件标题">
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
                        :title="scope.row.articleTitle"
                      >
                        {{ scope.row.articleTitle }}
                      </div>
                      <div class="elpopover-content-left-info flexcenter">
                        <span >作者：</span><span>{{ scope.row.trueName }}</span>
                        <div
                          class="mid-content-mycontribute-table-btngroup-search-divide"
                        ></div>
                        <span>稿件来源：</span><span>生态环境部</span>
                        <div
                          class="mid-content-mycontribute-table-btngroup-search-divide"
                        ></div>
                        <span>发布时间：</span><span>{{ scope.row.crtimeFormat }}</span>
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
                        <div v-html="scope.row.articleHtmlCon"></div>
                      </div>
                    </div>
                    <div class="elpopover-content-right">
                      <div class="elpopover-content-title flexcenter">
                        <img src="@/assets/manuscriptauditing.png" alt="" />
                        <span>审核流程记录</span>
                      </div>
                      <el-timeline class="elpopover-content-timeline">
                        <el-timeline-item
                          :timestamp="activity.auditTimeFormat"
                          placement="top"
                          v-for="(activity, index) in timelineData"
                          :key="index"
                        >
                          <div class="elpopover-content-timeline-details">
                            <div class="elpopover-content-timeline-details-fir">
                              {{ activity.auditSignName }}
                            </div>
                            <div class="elpopover-content-timeline-details-sec">
                              {{ activity.auditView }}
                            </div>
                            <div class="elpopover-content-timeline-details-thi">
                              <span>审核人：</span
                              ><span>{{ activity.cRuser }}</span>
                            </div>
                          </div>
                        </el-timeline-item>
                      </el-timeline>
                    </div>
                    <!-- end of elpopover-content-right -->
                    
                  </div>
                  
                  <AuditOpinion 
                    :externalAuditArticleFindByIdOArray="[externalAuditArticleFindByIdO]" 
                    @TriggerGetNeedAuditCountAjaxFn="getNeedAuditCountAjaxFn" 
                    @TriggerGetNeedAuditCountAjaxFn1="getNeedAuditCountAjaxFn1" 
                    @TriggerCloseElpopoverCommentFn = "
                        scope.row.visible = false;
                        popoverShowFlag = false;
                    "
                  />
                  <!-- end of elpopover-comment 审核意见以及提交按钮板块 -->

                  <template #reference>
                    <span
                      :title="scope.row.articleTitle"
                      style="
                        display: flex;
                        justify-content: left;
                        text-align: left;
                        cursor: pointer;
                      "
                      :class="{
                        isClicked: isClickedArr.includes(scope.$index),
                      }"
                      @click="externalAuditArticleFindByIdFn(scope)"
                    >
                      {{ scope.row.articleTitle }}
                    </span>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="origin" label="稿件来源" width="125" />
            <el-table-column prop="languageName" label="语种" width="120" />
            <el-table-column prop="crtimeFormat" label="创建时间" width="200" />
            <el-table-column prop="operate" label="操作" width="80">
              <template #default="scope">
                <div class="mid-content-mycontribute-table-tabledata-operate">
                  <div
                    v-if="scope.row.title != ''"
                    @click="externalAuditArticleFindByIdFn(scope)"
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
              :total="pageTotal"
              class="el-pagination-style-leftpagination"
            >
              <span class="el-pagination-style-leftpagination-total">
                共{{ pageTotal }}条
              </span>
              <span
                class="el-pagination-style-leftpagination-percent flexcenter"
              >
                {{ page }}/{{ Math.ceil(pageTotal / limit) }}
              </span>
            </el-pagination>
            <el-config-provider :locale="locale">
              <el-pagination
                background
                layout="prev, next, sizes, jumper"
                :total="pageTotal"
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
      <div class="mid-content-mycontribute-table-content" v-else key="已处理0">
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
            <div class="mid-content-mycontribute-table-btngroup-search-keyword flexcenter">
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
            <el-button type="primary" class="marl10" style="width: 78px"
              @click="getNeedAuditCountAjaxFn1"
            >
              <el-icon style="margin-right: 5px"><Search /></el-icon>
              搜索
            </el-button>
          </div>
        </div>
        <div class="mid-content-mycontribute-table-tabledata">
          <el-table
            :data="tableData1"
            border
            style="width: 100%"
            :header-cell-style="{
              'text-align': 'center',
              'color': '#6a6d74',
              'font-size': '16px',
            }"
            :cell-style="{
              'text-align': 'center',
              'color': '#727789',
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
                    <img src="@/assets/pass.png" alt="" />
                  </div>
                  <div class="elpopover-content flexcenter">
                    <div class="elpopover-content-left">
                      <div
                        class="elpopover-content-left-title"
                        :title="scope.row.articleTitle"
                      >
                        {{ scope.row.articleTitle }}
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
                        <div v-html="scope.row.articleHtmlCon"></div>
                      </div>
                    </div>
                    <div
                      class="elpopover-content-right elpopover-content-right1"
                    >
                      <div class="elpopover-content-title flexcenter">
                        <img src="@/assets/manuscriptauditing.png" alt="" />
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
                              <span>审核人：</span><span>{{ activity.thi }}</span>
                            </div>
                          </div>
                        </el-timeline-item>
                      </el-timeline>
                    </div>
                    <!-- end of elpopover-content-right -->

                  </div>
                  <template #reference>
                    <span
                      :title="scope.row.articleTitle"
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
                      {{ scope.row.articleTitle }}
                    </span>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="origin" label="稿件来源" width="125" />
            <el-table-column prop="languageName" label="语种" width="120" />
            <el-table-column prop="articleUseStatus" label="状态" width="110">
              <template #default="scope">
                <span
                  :class="{
                    isshz: scope.row.articleStatusName === '审核中', //'审核中',
                    isyfb: scope.row.articleStatusName === '已发布', //'已发布',
                    iswtg: scope.row.articleStatusName === '未通过', //'未通过',
                  }"
                  >{{ scope.row.articleStatusName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="currentNodeName" label="稿件节点" width="120" />
            <el-table-column prop="crtimeFormat" label="创建时间" width="200" />
            <el-table-column prop="operate" label="操作" width="80">
              <template #default="scope">
                <div class="mid-content-mycontribute-table-tabledata-operate">
                  <div :title="scope.row.articleTitle">查看</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="flexcenter el-pagination-style">
            <el-pagination
              layout="slot"
              :total="pageTotal1"
              class="el-pagination-style-leftpagination"
            >
              <span class="el-pagination-style-leftpagination-total">
                共{{ pageTotal1 }}条
              </span>
              <span
                class="el-pagination-style-leftpagination-percent flexcenter"
              >
                {{ page1 }}/{{ Math.ceil(pageTotal1 / limit1) }}
              </span>
            </el-pagination>
            <el-config-provider :locale="locale">
              <el-pagination
                background
                layout="prev, next, sizes, jumper"
                :total="pageTotal1"
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
    <!-- end of mid-content-mycontribute -->
  </div>

<!-- 用于批量审核的弹窗开始 -->
<el-dialog v-model="dialogBatchProcessingVisible" title="批量审核" width="800">
  <AuditOpinion 
    :externalAuditArticleFindByIdOArray="tableSelectedDataArray" 
    @TriggerGetNeedAuditCountAjaxFn="getNeedAuditCountAjaxFn" 
    @TriggerGetNeedAuditCountAjaxFn1="getNeedAuditCountAjaxFn1" 
    @TriggerCloseElpopoverCommentFn = "
      dialogBatchProcessingVisible = false;
    "
  />
  <!-- end of elpopover-comment 审核意见以及提交按钮板块 -->
</el-dialog>
<!-- 用于批量审核的弹窗结束 -->

</template>

<script>
import { onMounted, reactive, ref,computed } from "vue";
import { useStore } from "vuex"
import { useRouter } from "vue-router";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { ElMessage, ElLoading } from "element-plus";
import { timeFormatFn } from "@/utils/timeFormat.js";
import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";

import AuditOpinion from "./AuditOpinion.vue";

export default {
  components: { 
    AuditOpinion,
  },
  setup() {
    //路由实例
    const router = useRouter();
    router;
    //vuex实例
    const store = useStore();

    //用户角色名字
    const userAuthority = computed(() => {
      return store.state.StroeLoginO.loginUser.CURRENT_ROLE;
    });

    // <!-- 待审核部分 -->
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

    const tableSelectedDataArray = reactive([]);//记录选中checkbox的数据
    
    /**
     * 监听 选中table checkbox 变化
     * @param {*} selectedArrP 选中checkbox的数据
     */
    function handleSelectionTableDataFn(
      selectedArrP,
    ){
      tableSelectedDataArray.splice(0,tableSelectedDataArray.length);
      selectedArrP.forEach((o)=>{
        tableSelectedDataArray.push(o);
      });
    }
    //end of handleSelectionTableDataFn
    

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



    //稿件标题点击置灰
    const isClickedArr = ref([]);
    const popoverShowFlag = ref(false);


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

    const statusRadio = ref(1);//切换 待审核 已处理

    const dialogBatchProcessingVisible = ref(false);//用于显示批量审核的弹窗
    /**
     * 批量审核按钮触发
     */
    function dialogBatchProcessingFn(){
      //如果没选中稿件，则退出
      if(tableSelectedDataArray.length === 0){
        ElMessage({
          message: '请先选择稿件',
          type: 'warning',
        });
        return;
      }
      dialogBatchProcessingVisible.value = true;
    }

    

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
    const langOptions1 = reactive([]);
    store.state.GLOBAL_LANGUAGE_LIST.forEach((o)=>{
      langOptions1.push({
        value: o.id,
        label: o.desc,
      })
    });

    //日期选择 数据
    const dateDefaultTime1 = ref('');
    //状态select数据
    const statusSelectValue = ref('全部状态');
    const statusOptions = [
      { value: 0, label: "全部状态" },
      { value: 1, label: "审核中" },
      { value: 2, label: "已发布" },
      { value: 3, label: "未通过" },
    ];
    //稿件节点select数据
    const nodeSelectValue = ref("全部节点");
    const nodeOptions = [//0 编辑 1 国家信息中心  2 国家发改委  4 空 未通过或已发布 显示为空字符
      { value: '', label: "全部节点" },
      { value: 0, label: "编辑" },
      { value: 1, label: "国家信息中心" },
      { value: 2, label: "国家发改委" },
      { value: 4, label: "未通过或已发布" },
    ];

    //表格数据
    const tableData1 = reactive([]);

    //分页器
    let limit1 = ref(15);
    function handleSizeChange1(val) {
      limit1.value = val;
    }
    let page1 = ref(1);
    let pageTotal1 = ref(0);
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
    //当前 详情页弹窗 接口返回信息 和 点击 table 某一列信息
    const externalAuditArticleFindByIdO = reactive({});


    //时间轴数据
    const timelineData = reactive([]);
    
  

    /**
     * 查询 稿件详情
     */
    function externalAuditArticleFindByIdFn(scopeP){

      const loadingInstance1 = ElLoading.service({ fullscreen: true })
      if (popoverShowFlag.value) {
        //有弹窗打开时 跳出方法
        return;
      }

      store.dispatch('externalAuditArticleFindByIdFn',scopeP.row.externalAuditArticleId)
      .then((D)=>{
        console.log('D 稿件详情',D);
        const { data,success } = D.data
        if(!success){
          ElMessage({
            message: '稿件详情请求失败',
            type: 'error',
            plain: true,
          })
          return;
        }
        ElMessage({
          message: '稿件详情请求成功',
          type: 'success',
          plain: true,
        });
      
        popoverShowFlag.value = true;
        scopeP.row.visible = true;
        scopeP.row.articleHtmlCon = data.articleHtmlCon;//在element-ui中，table的列中 赋值 articleHtmlCon
        scopeP.row.trueName = data.trueName;//在element-ui中，table的列中 赋值 trueName

        //把当前打开的详情信息储存起来
        for(let key in data){
          externalAuditArticleFindByIdO[key] = data[key];
        }
        //把点击 table 某列的文章 信息储存起来
        for(let key in scopeP.row){
          externalAuditArticleFindByIdO[key] = scopeP.row[key];
        }

        externalAuditArticleRecordListAjaxFn(scopeP);//文章正文右侧的“审核流程记录”板块

      })
      .catch((error)=>{
        console.log('error 稿件详情',error);
      })
      .finally(()=>{
        loadingInstance1.close();
      })
      ;
    }

    /**
     * 查询“外审”列表页接口（包括左侧导航的“审核稿件”“审核报题” 两个栏目）
     * radio = '待审核'
     */
     function getNeedAuditCountAjaxFn(){
      const loadingInstance1 = ElLoading.service({ fullscreen: true })
      const languageNameArr = store.state.GLOBAL_LANGUAGE_LIST.map((o)=>{
        return o.desc
      });

      const paramsO = {
        // articleStatus:,非必传 //1：审核中 2：已发布 3：未通过
        // currentNode:2,//非必传 0 编辑 1 国家信息中心  2 国家发改委  4 空 未通过或已发布（显示空字符）
        articleKind:0,//0外审稿件  1外审报题   （属于哪个栏目）
        listStatus:0,//必传	0 待处理 2 已处理  国家信息中心/国家发改委
        pageSize:limit.value,
        currPage:page.value,
      }
      
      langSelectValue.value&&(paramsO.language=langSelectValue.value);//这个接口 表现“全部语种” 是 什么都不传

      switch(searchSelectValue.value){
        case 0:
        paramsO.articleTitle = searchInput.value;//按标题搜索
          break;
        case 1:
        paramsO.articleContent = searchInput.value;//按正文搜索
          break;
      }

      //时间段
      if(
        dateDefaultTime.value
      ){
        paramsO.startTime=timeFormatFn(dateDefaultTime.value[0])['YYYY-MM-DD hh:mm:ss'] //起始时间
        paramsO.endTime=timeFormatFn(dateDefaultTime.value[1])['YYYY-MM-DD hh:mm:ss'] //结束时间
      }

      httpAxiosO({
        method:'get',
        url:'/web/externalAuditArticle/list.do',
        params:paramsO,
      })
      .then((D)=>{
        console.log('D 查询审核稿件、报题',D);
        const { data,success } = D.data
        if(!success){
          ElMessage({
            message: '查询请求失败',
            type: 'error',
            plain: true,
          })
          return;
        }
        ElMessage({
          message: '查询请求成功',
          type: 'success',
          plain: true,
        });

        tableData.splice(0,tableData.length);
        data.ldata.forEach((o)=>{
          let _o = o;
          _o.languageName = languageNameArr[o.language]//语种名称，接口只提供了语种对应的 编号
          _o.crtimeFormat = timeFormatFn(o.crtime)['YYYY-MM-DD']//时间格式化
          tableData.push(_o);
        });
        pageTotal.value = data.totalResults;
      })
      .catch((error)=>{
        console.log('error 查询审核稿件、报题',error);
      })
      .finally(()=>{
        loadingInstance1.close();
      })
      ;
    }
    // end of getNeedAuditCountAjaxFn

    /**
     * 查询“外审”列表页接口（包括左侧导航的“审核稿件”“审核报题” 两个栏目）
     * radio = '已处理'
     */
     function getNeedAuditCountAjaxFn1(){
      const loadingInstance1 = ElLoading.service({ fullscreen: true })
      const languageNameArr = store.state.GLOBAL_LANGUAGE_LIST.map((o)=>{
        return o.desc
      });

      const paramsO = {
        // articleStatus:,非必传 //1：审核中 2：已发布 3：未通过
        
        articleKind:0,//0外审稿件  1外审报题   （属于哪个栏目）
        listStatus:2,//必传	0 待处理 2 已处理  国家信息中心/国家发改委
        pageSize:limit1.value,
        currPage:page1.value,
      }

      if(
        nodeSelectValue.value!==''
        &&nodeSelectValue.value !=='全部节点'
      )
      {
        paramsO.currentNode=nodeSelectValue.value;//非必传 0 编辑 1 国家信息中心  2 国家发改委  4 空 未通过或已发布（显示空字符）
      }

      langSelectValue1.value&&(paramsO.language=langSelectValue1.value);//这个接口 表现“全部语种” 是 什么都不传

      switch(searchSelectValue1.value){
        case 0:
        paramsO.articleTitle = searchInput1.value;//按标题搜索
          break;
        case 1:
        paramsO.articleContent = searchInput1.value;//按正文搜索
          break;
      }

      //时间段
      if(
        dateDefaultTime1.value
      ){
        paramsO.startTime=timeFormatFn(dateDefaultTime1.value[0])['YYYY-MM-DD hh:mm:ss'] //起始时间
        paramsO.endTime=timeFormatFn(dateDefaultTime1.value[1])['YYYY-MM-DD hh:mm:ss'] //结束时间
      }

      httpAxiosO({
        method:'get',
        url:'/web/externalAuditArticle/list.do',
        params:paramsO,
      })
      .then((D)=>{
        console.log('D 查询审核稿件、报题 已处理',D);
        const { data,success } = D.data
        if(!success){
          ElMessage({
            message: '查询请求失败',
            type: 'error',
            plain: true,
          })
          return;
        }
        ElMessage({
          message: '查询请求成功',
          type: 'success',
          plain: true,
        });
        tableData1.splice(0,tableData1.length);
        data.ldata.forEach((o)=>{
          let _o = o;
          _o.languageName = languageNameArr[o.language]//语种名称，接口只提供了语种对应的 编号
          _o.crtimeFormat = timeFormatFn(o.crtime)['YYYY-MM-DD hh:mm']

          switch(o.articleStatus){//显示状态名字
            case 1:
              _o.articleStatusName = '审核中'
            break;
            case 2:
              _o.articleStatusName = '已发布'
            break;
            case 3:
              _o.articleStatusName = '未通过'
            break;
          }

          //显示节点名字
          switch(o.currentNode){
            case 0:
              _o.currentNodeName = '编辑'
            break;
            case 1:
              _o.currentNodeName = '国家信息中心'
            break;
            case 2:
              _o.currentNodeName = '国家发改委'
            break;
            case 4:
              _o.currentNodeName = ' '//未通过或已发布
            break;
          }

          
          tableData1.push(_o);
        });
        pageTotal1.value = data.totalResults;
      })
      .catch((error)=>{
        console.log('error 查询审核稿件、报题',error);
      })
      .finally(()=>{
        loadingInstance1.close();
      })
      ;
    }
    // end of getNeedAuditCountAjaxFn1

    /**
     * 审核流程记录 板块
     * 查询外审记录 接口
     */
    function externalAuditArticleRecordListAjaxFn(scopeP){
      
      const { externalAuditArticleId } = scopeP.row;

      const paramsO = {
        externalAuditArticleId,//必传，id为1有假数据
      }
      httpAxiosO({
        method:'get',
        url:'/web/externalAuditArticleRecord/list.do',
        params:paramsO,
      })
      .then((D)=>{
        console.log('D 审核流程记录',D);
        timelineData.splice(0,timelineData.length);
        const { data } = D.data;
        data.ldata.forEach((o)=>{
          let _o = o;
          _o.auditSignName = store.state.ROLESETO[userAuthority.value]['auditSign'][o.auditSign]
          _o.auditTimeFormat = timeFormatFn(o.auditTime)['YYYY-MM-DD hh:mm'];
          timelineData.push(_o);
        });
      })
      .catch((error)=>{
        console.log('error 审核流程记录',error);
      })
      ;
    }
    //end of externalAuditArticleRecordListAjaxFn

    onMounted(() => {
      restaurants.value = loadAll();
      getNeedAuditCountAjaxFn();//待审核
      getNeedAuditCountAjaxFn1();//已处理
    });

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

      popoverShowFlag,
      originInput,
      querySearch,
      
      statusRadio,

      dialogBatchProcessingVisible,
      dialogBatchProcessingFn,
      handleSelectionTableDataFn,

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
      pageTotal1,
      handleSizeChange1,
      handleCurrentChange1,
      isClickedArr1,
      rowTitleClick1,
      popoverShowFlag1,
      originInput1,
      querySearch1,

      fontSelect,
      timelineData,

      getNeedAuditCountAjaxFn,
      getNeedAuditCountAjaxFn1,
      externalAuditArticleFindByIdFn,
      externalAuditArticleRecordListAjaxFn,

      externalAuditArticleFindByIdO,
      tableSelectedDataArray,

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
        background: url(@/assets/timeline.png) no-repeat;
        width: 19px;
        height: 19px;
        left: -4px;
      }
      :deep(.el-timeline-item__timestamp.is-top) {
        background: url(@/assets/timelinebg.png) no-repeat;
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

  .elpopover-content-left-text1 {
    max-height: 575px !important;
  }
  .elpopover-content-right1 {
    max-height: 710px !important;
  }
}
.mid-content-mycontribute-table-btngroup-search{
  overflow: auto;
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