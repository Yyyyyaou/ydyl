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
              <div
                v-for="item in statisticsData"
                :key="item.name"
                class="flexcenter mid-content-statistics-left-content-div"
              >
                <div class="flexcenter">
                  <img
                    :src="require('../assets/' + item.src + '.png')"
                    alt=""
                  />
                </div>
                <p>{{ item.num }}</p>
                <p>{{ item.name }}</p>
              </div>
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
                      {{ activity.content }}
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
            <el-tabs type="border-card" @tab-click="tableTabClick">
              <el-tab-pane>
                <template #label>
                  <span class="custom-tabs-label flexcenter">
                    <img src="../assets/mycontribute.png" alt="" />
                    <span>我的投稿</span>
                  </span>
                </template>
                <div class="mid-divider" style="margin-top: 1px"></div>
                <div class="mid-content-statistics-table-content">
                  <div class="mid-content-statistics-table-btngroup flexcenter">
                    <div>
                      <el-button
                        class="btn-tougao"
                        @click="toPage('/MyContribute/CreateContribute')"
                      >
                        <el-icon><Plus /></el-icon>
                        &nbsp;&nbsp;&nbsp;投稿
                      </el-button>
                    </div>
                    <div
                      class="mid-content-statistics-table-btngroup-search flexcenter"
                    >
                      <div
                        class="mid-content-statistics-table-btngroup-search-keyword"
                      >
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
                      <el-button
                        type="primary"
                        class="marl10"
                        style="width: 78px"
                      >
                        <el-icon style="margin-right: 5px"><Search /></el-icon>
                        搜索
                      </el-button>
                    </div>
                  </div>
                  <div class="mid-content-statistics-table-tabledata">
                    <el-table
                      :data="tableData.slice((page - 1) * limit, page * limit)"
                      border
                      style="width: 100%"
                      :header-cell-style="{
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
                      <el-table-column prop="articleTitle" label="稿件标题">
                        <template #default="scope">
                          <span
                            style="
                              display: flex;
                              justify-content: left;
                              text-align: left;
                            "
                          >
                            {{ scope.row.articleTitle }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="articleSource"
                        label="稿件来源"
                        width="125"
                      />
                      <el-table-column prop="languageName" label="语种" width="120" />
                      <el-table-column prop="articleUseStatus" label="状态" width="110">
                        <template #default="scope">
                          <span
                            :class="{
                              isdcl: scope.row.articleUseStatus === 0, //'待处理',
                              isshz: scope.row.articleUseStatus === 1, //'审核中',
                              isyfb: scope.row.articleUseStatus === 2, //'已发布',
                              iswcy: scope.row.articleUseStatus === 3, //'未采用',
                            }"
                            >{{ scope.row.articleUseStatusName }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="crtimeFormat"
                        label="创建日期"
                        width="140"
                      />
                      <el-table-column prop="articleUseStatus" label="操作" width="200">
                        <template #default="scope">
                          <div
                            class="mid-content-statistics-table-tabledata-operate"
                          >
                            <div @click="getFindByIdAjaxFn(scope.row.id)">查看</div>
                            <span></span>
                            <div v-if="scope.row.articleUseStatus === 3" data-desc="已发布">链接</div>
                            <span v-if="scope.row.articleUseStatus === 3" data-desc="已发布"></span>
                            <div v-if="scope.row.articleUseStatus === 0" data-desc="待处理">编辑</div>
                            <span v-if="scope.row.articleUseStatus === 0" data-desc="待处理"></span>
                            <div v-if="scope.row.articleUseStatus === 0" data-desc="待处理">删除</div>
                            <span v-if="scope.row.articleUseStatus === 0" data-desc="待处理"></span>
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
              </el-tab-pane>
              <el-tab-pane>
                <template #label>
                  <span class="custom-tabs-label flexcenter">
                    <img src="../assets/signed.png" alt="" />
                    <span>已发稿件</span>
                  </span>
                </template>
                <div class="mid-divider" style="margin-top: 1px"></div>
                <div class="mid-content-statistics-table-content">
                  <div class="mid-content-statistics-table-btngroup flexcenter">
                    <div></div>
                    <div
                      class="mid-content-statistics-table-btngroup-search flexcenter"
                    >
                      <div
                        class="mid-content-statistics-table-btngroup-search-keyword"
                      >
                        <el-select
                          v-model="originSelectValue"
                          placeholder="来源"
                          style="width: 140px"
                        >
                          <el-option
                            v-for="item in originOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                        <el-select
                          v-model="searchSelectValue1"
                          placeholder=""
                          style="width: 80px"
                          class="marl10"
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
                      <el-button
                        type="primary"
                        class="marl10"
                        style="width: 78px"
                      >
                        <el-icon style="margin-right: 5px"><Search /></el-icon>
                        搜索
                      </el-button>
                    </div>
                  </div>
                  <div class="mid-content-statistics-table-tabledata">
                    <el-table
                      :data="
                        tableData1.slice((page1 - 1) * limit1, page1 * limit1)
                      "
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
                          <span
                            style="
                              display: flex;
                              justify-content: left;
                              text-align: left;
                            "
                          >
                            {{ scope.row.title }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="origin"
                        label="稿件来源"
                        width="125"
                      />
                      <el-table-column prop="lang" label="语种" width="120" />
                      <el-table-column
                        prop="date"
                        label="创建日期"
                        width="140"
                      />
                    </el-table>
                  </div>
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
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="mid-footer">3</div> -->
  </div>
</template>
<script>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { ElMessage,ElLoading } from "element-plus";
import { timeFormatFn } from "@/utils/timeFormat.js";
import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";
export default {
  setup() {
    //稿件统计数据
    const statisticsData = reactive([
      {
        name: "投稿总数",
        num: 0,
        src:'contributenum',
      },
      {
        name: "发布总数",
        num: 0,
        src:'releasenum'
      },
      {
        name: "待处理稿件",
        num: 0,
        src:'pendingnum'
      },
    ]);

    //通知公告数据
    const activities = reactive([
      {
        content: "中国一带一路网“拉丁熊猫在中国”西班牙语专题上线",
      },
      {
        content: "中国一带一路网（阿语版）推介会在沙特举行",
      },
      {
        content:
          "中国一带一路网（阿语版）推介会在沙特举行中国一带一路网（阿语版）推介会在沙特举行中国一带一路网（阿语版）推介会在沙特举行中国一带一路网（阿语版）推介会在沙特举行",
      },
    ]);
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
      if (!isClickedArr.value.includes(index)) {
        isClickedArr.value.push(index);
      }
    }
    //官网动态点击置灰
    const isClickedArr1 = ref([]);
    function elTimelineClick1(index) {
      if (!isClickedArr1.value.includes(index)) {
        isClickedArr1.value.push(index);
      }
    }

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
    //来源select数据
    const originSelectValue = ref("");
    const originOptions = [
      {
        value: 0,
        label: "我的投稿",
      },
      {
        value: 1,
        label: "新华社",
      },
    ];
    //语法select数据
    const langSelectValue = ref("");
    const langOptions = [
      {
        value: 1,
        label: "中文",
      },
      {
        value: 2,
        label: "英文",
      },
      {
        value: 3,
        label: "阿语",
      },
      {
        value: 4,
        label: "俄语",
      },
      {
        value: 5,
        label: "西语",
      },
      {
        value: 6,
        label: "法语",
      },
    ];
    const langSelectValue1 = ref("");
    const langOptions1 = [
    {
        value: 1,
        label: "中文",
      },
      {
        value: 2,
        label: "英文",
      },
      {
        value: 3,
        label: "阿语",
      },
      {
        value: 4,
        label: "俄语",
      },
      {
        value: 5,
        label: "西语",
      },
      {
        value: 6,
        label: "法语",
      },
    ];
    //状态select数据
    const statusSelectValue = ref("");
    const statusOptions = [
      {
        value: 0,
        label: "待处理",
      },
      {
        value: 1,
        label: "审核中",
      },
      {
        value: 2,
        label: "已发布",
      },
      {
        value: 3,
        label: "未采用",
      },
    ];
    //日期选择 数据
    const dateDefaultTime = ref([]);
    const dateDefaultTime1 = ref([]);
    //表格数据
    const tableData = reactive([]);
    const tableData1 = [
      {
        title:
          "شي يقول إنه مستعد لتعزيز العلاقات بين الصين ونيكاراغوا لتحقيق إنجازات جديدة مع اتخاذ الشراكة الاستراتيجية نقطة انطلاق جديدةشي يقول إنه مستعد لتعزيز العلاقات بين الصين ونيكاراغوا لتحقيق إنجازات جديدة مع اتخاذ الشراكة الاستراتيجية نقطة انطلاق جديدةشي يقول إنه مستعد لتعزيز العلاقات بين الصين ونيكاراغوا لتحقيق إنجازات جديدة مع اتخاذ الشراكة الاستراتيجية نقطة انطلاق جديدة",
        date: "2016-05-03",
        origin: "新华社",
        lang: "中文",
        status: "已发布",
      },
      {
        title:
          "(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)",
        date: "2016-05-02",
        origin: "新华社",
        lang: "法语",
        status: "待处理",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        origin: "新华社",
        lang: "阿文",
        status: "审核中",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        origin: "新华社",
        lang: "阿文",
        status: "未采用",
      },
      {
        title:
          "(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)",
        date: "2016-05-02",
        origin: "新华社",
        lang: "法语",
        status: "待处理",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        origin: "新华社",
        lang: "阿文",
        status: "审核中",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        origin: "新华社",
        lang: "阿文",
        status: "未采用",
      },
      {
        title:
          "(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)",
        date: "2016-05-02",
        origin: "新华社",
        lang: "法语",
        status: "待处理",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        origin: "新华社",
        lang: "阿文",
        status: "审核中",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        origin: "新华社",
        lang: "阿文",
        status: "未采用",
      },
      {
        title:
          "(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)",
        date: "2016-05-02",
        origin: "新华社",
        lang: "法语",
        status: "待处理",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        origin: "新华社",
        lang: "阿文",
        status: "审核中",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        origin: "新华社",
        lang: "阿文",
        status: "未采用",
      },
      {
        title:
          "(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)",
        date: "2016-05-02",
        origin: "新华社",
        lang: "法语",
        status: "待处理",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        origin: "新华社",
        lang: "阿文",
        status: "审核中",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        origin: "新华社",
        lang: "阿文",
        status: "未采用",
      },
    ];

    //分页器
    let limit = ref(15);
    function handleSizeChange(val) {
      limit.value = val;
    }
    let page = ref(1);
    function handleCurrentChange(val) {
      page.value = val;
    }
    let limit1 = ref(15);
    function handleSizeChange1(val) {
      limit1.value = val;
    }
    let page1 = ref(1);
    function handleCurrentChange1(val) {
      page1.value = val;
    }

    /**
     * 我的投稿 接口请求
     * 以下注释摘抄至接口文档（20240409.0912）
     * language 必填 中文1、英文2、阿语3、俄语4、西语5、法语6 
     * articleUseStatus 非必填 稿件发布状态（0：待处理 1：审核中 2：已发布 3：未采用 ）
     * articleTitle 非必填 关键字搜索
     * crtime 非必填 创建时间搜索
     * currPage 非必填 开始页数
     * pageSize 非必填 页面条数
     * 
     * 接口返回数据字段，线上文档有写，很详细
     */

    function getArticleListAjaxFn(){
      const languageNameArr = ['中文','英文','阿语','俄语','西语','法语']
      const articleUseStatusNameArr = ['待处理','审核中','已发布','未采用'];
      const loadingInstance1 = ElLoading.service({ fullscreen: true })

      httpAxiosO({
        method: 'get',
        url: '/api/web/article/articleList.do',
        params:{
          language:0//0 可能代表 所有语种，文档里有提示 写 0
        }
      })
      .then((D)=>{
        console.log('我的投稿 D',D);
        const { data,success } = D.data
        if(!success){
          ElMessage({
            message: '我的投稿数据请求失败',
            type: 'error',
            plain: true,
          })
          return;
        }
        ElMessage({
          message: '我的投稿数据请求成功',
          type: 'success',
          plain: true,
        })
        
        tableData.value = [];//清空tableData
        data.ldata.forEach((o)=>{
          let _o = o;
          _o.languageName = languageNameArr[o.language]//语种名称，接口只提供了语种对应的 编号
          _o.articleUseStatusName = articleUseStatusNameArr[o.articleUseStatus]//状态名字，接口只提供了状态对应的 编号
          _o.crtimeFormat = timeFormatFn(o.crtime)['YYYY-MM-DD']//时间格式化
          tableData.push(_o);
        });

      })
      .catch((error)=>{
        console.log('我的投稿 接口请求 error',error);
        ElMessage({
          message: '我的投稿接口请求失败',
          type: 'error',
          plain: true,
        })
      })
      .finally(()=>{
        loadingInstance1.close();
      })
      ;
      return;
    }
    // end of getArticleListAjaxFn


    /**
     * 已发稿件 接口请求
     * 以下注释摘抄至接口文档（20240409.0912）
     * language 必填 中文1、英文2、阿语3、俄语4、西语5、法语6 
     * articleUseStatus 非必填 稿件发布状态（0：待处理 1：审核中 2：已发布 3：未采用 ）
     * articleTitle 非必填 关键字搜索
     * crtime 非必填 创建时间搜索
     * currPage 非必填 开始页数
     * pageSize 非必填 页面条数
     * 
     * 接口返回数据字段，线上文档有写，很详细
     */

     function getBrokeListAjaxFn(){
      const languageNameArr = ['中文','英文','阿语','俄语','西语','法语'];languageNameArr
      const articleUseStatusNameArr = ['待处理','审核中','已发布','未采用'];articleUseStatusNameArr
      const loadingInstance1 = ElLoading.service({ fullscreen: true })

      httpAxiosO({
        method: 'get',
        url: '/api/web/article/brokeList.do',
        params:{
          language:0//0 可能代表 所有语种，文档里有提示 写 0
        }
      })
      .then((D)=>{
        console.log('已发稿件 D',D);
        const { data,success } = D.data;data
        if(!success){
          ElMessage({
            message: '已发稿件数据请求失败',
            type: 'error',
            plain: true,
          })
          return;
        }
        ElMessage({
          message: '已发稿件数据请求成功',
          type: 'success',
          plain: true,
        })
        
        // tableData.value = [];//清空tableData
        // data.ldata.forEach((o,i)=>{
        //   let _o = o;
        //   _o.languageName = languageNameArr[o.language]//语种名称，接口只提供了语种对应的 编号
        //   _o.articleUseStatusName = articleUseStatusNameArr[o.articleUseStatus]//状态名字，接口只提供了状态对应的 编号
        //   _o.crtimeFormat = timeFormatFn(o.crtime)['YYYY-MM-DD']//时间格式化
        //   tableData.push(_o);
        // });

      })
      .catch((error)=>{
        console.log('已发稿件 接口请求 error',error);
        ElMessage({
          message: '已发稿件接口请求失败',
          type: 'error',
          plain: true,
        })
      })
      .finally(()=>{
        loadingInstance1.close();
      })
      ;
      return;
    }
    // end of getArticleListAjaxFn    
    
    /**
     * 我的投稿-查看
     * 
     */
    function getFindByIdAjaxFn(docIDP){

      const loadingInstance1 = ElLoading.service({ fullscreen: true })

      httpAxiosO({
        method: 'get',
        url: '/api/web/article/findById.do',
        params:{
          id:docIDP
        }
      })
      .then((D)=>{
        console.log('我的投稿-查看 D',D);
        const { data,success } = D.data;data
        if(!success){
          ElMessage({
            message: '我的投稿-查看数据请求失败',
            type: 'error',
            plain: true,
          })
          return;
        }
        ElMessage({
          message: '我的投稿-查看数据请求成功',
          type: 'success',
          plain: true,
        })
        
        // tableData.value = [];//清空tableData
        // data.ldata.forEach((o,i)=>{
        //   let _o = o;
        //   _o.languageName = languageNameArr[o.language]//语种名称，接口只提供了语种对应的 编号
        //   _o.articleUseStatusName = articleUseStatusNameArr[o.articleUseStatus]//状态名字，接口只提供了状态对应的 编号
        //   _o.crtimeFormat = timeFormatFn(o.crtime)['YYYY-MM-DD']//时间格式化
        //   tableData.push(_o);
        // });

      })
      .catch((error)=>{
        console.log('我的投稿-查看 接口请求 error',error);
        ElMessage({
          message: '我的投稿-查看接口请求失败',
          type: 'error',
          plain: true,
        })
      })
      .finally(()=>{
        loadingInstance1.close();
      })
      ;
      return;
    }


    //首页公告接口
    function getSYNoticeListAjaxFn(){
      const loadingInstance1 = ElLoading.service({ fullscreen: true })

      httpAxiosO({
        method: 'get',
        url: '/api/web/notice/list.do',
      })
      .then((D)=>{
        console.log('首页公告 D',D);
        const { data,success } = D.data
        if(!success){
          ElMessage({
            message: '首页公告数据请求失败',
            type: 'error',
            plain: true,
          })
          return;
        }
        ElMessage({
          message: '首页公告数据请求成功',
          type: 'success',
          plain: true,
        })
        data 
        activities
      })
      .catch((error)=>{
        console.log('首页公告 接口请求 error',error);
        ElMessage({
          message: '首页公告接口请求失败',
          type: 'error',
          plain: true,
        })
      })
      .finally(()=>{
        loadingInstance1.close();
      })
      ;
    }
    // end of getArticleListAjaxFn

    /**
     * 稿件统计 接口请求
     */
    function getArticleCountAjaxFn(){
      const loadingInstance1 = ElLoading.service({ fullscreen: true })

      httpAxiosO({
        method: 'get',
        url: '/api/web/article/articleCount',
      })
      .then((D)=>{
        console.log('稿件统计 D',D);
        const { data,success } = D.data
        if(!success){
          ElMessage({
            message: '稿件统计数据请求失败',
            type: 'error',
            plain: true,
          })
          return;
        }
        ElMessage({
          message: '稿件统计数据请求成功',
          type: 'success',
          plain: true,
        })
        
        //投稿总数
        statisticsData[0].num = data.articleCount;
        //发布总数
        statisticsData[1].num = data.pubCount;
        //待处理稿件
        statisticsData[2].num = data.waitArticle;

      })
      .catch((error)=>{
        console.log('稿件统计 接口请求 error',error);
        ElMessage({
          message: '稿件统计接口请求失败',
          type: 'error',
          plain: true,
        })
      })
      .finally(()=>{
        loadingInstance1.close();
      })
      ;
    }
    // end of getArticleListAjaxFn


    onMounted(() => {
      getArticleListAjaxFn();//我的投稿列表
      getArticleCountAjaxFn();//稿件统计
      getSYNoticeListAjaxFn();//首页通知公告
      getBrokeListAjaxFn();//已发稿件
    });

    return {
      statisticsData,
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
      searchInput,
      searchSelectValue,
      searchOptions,
      searchInput1,
      searchSelectValue1,
      searchOptions1,
      originSelectValue,
      originOptions,
      langSelectValue,
      langOptions,
      langSelectValue1,
      langOptions1,
      statusSelectValue,
      statusOptions,
      dateDefaultTime,
      dateDefaultTime1,
      locale: zhCn, //date-range 语言设置
      tableData,
      tableData1,
      limit,
      page,
      handleSizeChange,
      handleCurrentChange,
      limit1,
      page1,
      handleSizeChange1,
      handleCurrentChange1,

      //接口请求
      getFindByIdAjaxFn,

    };
  },
  // mounted() {
  //   this.$nextTick(()=>{
  //     console.log('mounted TEST2',this.TEST2);
  //     // this.getArticleListAjaxFn();
  //   });
  // },
  // methods:{

  // },
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
          .mid-content-statistics-left-content-div {
            height: 108px;
            min-width: 330px;
            width: 32%;
            background: #f6f6f7;
            > div {
              width: 75px;
              height: 75px;
              background-color: #fff;
              border-radius: 50%;
              margin-left: 30px;
              justify-content: center;
            }
            p:nth-child(2) {
              margin-left: 20px;
              font-size: 30px;
              color: #555b73;
            }
            p:nth-child(3) {
              margin-left: 10px;
              font-size: 16px;
              color: #555b73;
            }
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