<template>
  <div class="mid-content">
    <div class="mid-content-mycontribute">
      <div class="mid-content-mycontribute-header flexcenter">
        <div class="flexcenter">
          <div class="mid-content-mycontribute-header-i">
            <img src="../assets/mycontribute.png" alt="" />
          </div>
          <span>系统消息</span>
        </div>
      </div>
      <div class="mid-divider"></div>
      <div class="mid-content-mycontribute-table-content">
        <div class="mid-content-mycontribute-table-btngroup flexcenter">
          <div></div>
          <div
            class="mid-content-mycontribute-table-btngroup-search flexcenter"
          >
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
              />
            </div>
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
            <el-table-column label="序号" width="100">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="title" label="稿件标题">
              <template #default="scope">
                <el-popover
                  :visible="scope.row.visible ? true : false"
                  placement="bottom"
                  :width="600"
                  popper-class="elpopover-style"
                >
                  <div class="elpopover-header">
                    <span>发送人：{{ scope.row.name }}</span>
                    <span style="margin-left: 18px"
                      >发送时间：{{ scope.row.date }}</span
                    >
                  </div>
                  <p>
                    <span>标题：</span><span>{{ scope.row.title }}</span>
                  </p>
                  <p>
                    <span>正文：</span><span>{{ scope.row.title }}</span>
                  </p>
                  <div class="elpopover-button">
                    <el-button
                      type="primary"
                      @click="
                        scope.row.visible = false;
                        popoverShowFlag = false;
                      "
                      >确定
                    </el-button>
                    <el-button
                      type="info"
                      @click="
                        scope.row.visible = false;
                        popoverShowFlag = false;
                      "
                      >取消
                    </el-button>
                  </div>
                  <template #reference>
                    <span
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
            <el-table-column prop="date" label="时间" width="140" />
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
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
export default {
  setup() {
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
    //日期选择 数据
    const dateDefaultTime = ref([]);
    //表格数据
    const tableData = [
      {
        title:
          "您题为《外交部：中国发展对外关系对各国一视同仁》的投稿正在审核中",
        date: "2016-05-04",
        name: "张三",
        origin: "新华社",
        lang: "阿文",
        status: "审核中",
      },
      {
        title: "您题为《便利外籍人员来华5项措施详解》的投稿未采用",
        date: "2016-05-03",
        origin: "新华社1",
        lang: "中文",
        status: "已发布",
      },
      {
        title:
          "(Musiècle : une histoire d'éveil et de développement (REPORTAGE)(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)(Multimédia) L'évolution des chemins de fer kenyans sur un siècle : une histoire d'éveil et de développement (REPORTAGE)",
        date: "2016-05-02",
        origin: "新华社",
        lang: "法语",
        status: "待处理",
      },
      {
        title:
          "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        name: "张三",
        origin: "新华社",
        lang: "阿文",
        status: "未采用",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        name: "张三",
        origin: "新华社",
        lang: "阿文",
        status: "审核中",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        name: "张三",
        origin: "新华社",
        lang: "阿文",
        status: "未采用",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        name: "张三",
        origin: "新华社",
        lang: "阿文",
        status: "审核中",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        name: "张三",
        origin: "新华社",
        lang: "阿文",
        status: "未采用",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        name: "张三",
        origin: "新华社",
        lang: "阿文",
        status: "审核中",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        name: "张三",
        origin: "新华社",
        lang: "阿文",
        status: "未采用",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        name: "张三",
        origin: "新华社",
        lang: "阿文",
        status: "审核中",
      },
      {
        title: "李强将出席世界经济论坛2024年年会并访问瑞士、爱尔兰",
        date: "2016-05-04",
        name: "张三",
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
    return {
      searchInput,
      searchSelectValue,
      searchOptions,
      dateDefaultTime,
      locale: zhCn, //date-range 语言设置
      tableData,
      limit,
      page,
      handleSizeChange,
      handleCurrentChange,
      isClickedArr,
      rowTitleClick,
      popoverShowFlag,
    };
  },
};
</script>
<style scoped lang='less'>
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
  .mid-content-mycontribute-table-content {
    padding: 0 20px;
    .mid-content-mycontribute-table-btngroup {
      margin-top: 15px;
      justify-content: space-between;
      .clear-recyclebin {
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
    }
    .mid-content-mycontribute-table-tabledata {
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
      .mid-content-mycontribute-table-tabledata-operate {
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
.isClicked {
  color: #a7a9b2;
}
.elpopover-style {
  .elpopover-header {
    height: 30px;
    line-height: 30px;
    padding: 0 18px;
    background: #e5f1fe;
    color: #0171c7;
    font-size: 14px;
    width: 250px;
    margin-top: 13px;
    border-radius: 5px;
  }
  p {
    font-size: 16px;
    color: #555b73;
    margin-left: 10px;
    margin-top: 25px;
    span:nth-last-child(1) {
      color: #a7a9b2;
    }
  }
  .elpopover-button {
    margin-top: 80px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
<style lang="less">
.elpopover-style {
  position: fixed !important;
  top: 50% !important;
  left: 63% !important;
  transform: translate(-50%, -50%);
  }
</style>