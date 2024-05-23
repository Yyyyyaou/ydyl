<template>
<router-view></router-view>
  <div class="mid-content">
    <div class="mid-content-mycontribute">
      <div class="mid-content-mycontribute-header flexcenter">
        <div class="flexcenter">
          <div class="mid-content-mycontribute-header-i">
            <img src="@/assets/mycontribute.png" alt="" />
          </div>
          <span>通知公告</span>
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
                clearable
                @keydown.enter="getNoticeListAjaxFn"
              />
            </div>
            <el-config-provider :locale="locale">
              <el-date-picker
            :disabled-date="disabledDate"
                v-model="dateDefaultTime"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :locale="locale"
                style="margin-left: 10px; width: 270px"
              />
            </el-config-provider>
            <el-button type="primary" class="marl10" style="width: 78px"
              @click="getNoticeListAjaxFn"
            >
              <el-icon style="margin-right: 5px"><Search /></el-icon>
              搜索
            </el-button>
          </div>
        </div>
        <div class="mid-content-mycontribute-table-tabledata">
          <el-table
            empty-text="暂无数据"
            :data="tableData"
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
            <el-table-column prop="noticeTitle" label="公告标题">
              <template #default="scope">
                <span
                  style="
                    display: flex;
                    justify-content: left;
                    text-align: left;
                    cursor: pointer;
                  "
                  :class="{ isClicked: scope.row.noticeRead == 1 }"
                  @click="rowTitleClick(scope)"
                  :title="scope.row.noticeTitle"
                >
                  <!-- <a href="https://www.ceis.cn/" target="_blank"></a> -->
                  {{ scope.row.noticeTitle }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="pubTime" label="创建时间" width="240" />
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
import { ref,reactive,onMounted } from "vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { useRouter } from "vue-router";
import { ElMessage,ElLoading } from "element-plus";
import { timeFormatFn } from "@/utils/timeFormat.js";
import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";

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
    const dateDefaultTime = ref('');
    const disabledDate = (time) => {
      return time.getTime() > Date.now();
    };
    //表格数据
    const tableData = reactive([]);
    //分页器
    let limit = ref(15);
    function handleSizeChange(val) {
      limit.value = val;
      getNoticeListAjaxFn()
    }
    let page = ref(1);
    let pageTotal = ref(0);
    function handleCurrentChange(val) {
      page.value = val;
      getNoticeListAjaxFn()
    }
    //稿件标题点击置灰
    const isClickedArr = ref([]);
    const router = useRouter();
    function rowTitleClick(scope) {
      if (!isClickedArr.value.includes(scope.$index)) {
        isClickedArr.value.push(scope.$index);
      }
      const c = router.resolve({
        path: "/NoticeDetail",
        query: {
          id: scope.row.id,
        },
      });
      window.open(c.href, "_blank");
    }

    function getNoticeListAjaxFn(){
      const loadingInstance1 = ElLoading.service({ fullscreen: true })
      loadingInstance1.close();
      const paramsO = {
        // displayNode:0,// 0 我的投稿  1 国家信息信息中心  2 国家发改委
        currPage:page.value,//页码
        pageSize:limit.value,//每页显示条数
      }

      switch(searchSelectValue.value){
        case 0:
        paramsO.noticeTitle = searchInput.value;//检索关键词，模糊检索标题
          break;
        case 1:
        paramsO.noticeContent = searchInput.value;//检索关键词，模糊检索正文
          break;
      }

      //时间段
      if(
        dateDefaultTime.value
      ){
        paramsO.crtime=timeFormatFn(dateDefaultTime.value[0])['YYYY-MM-DD'] //起始时间
        paramsO.endtime=timeFormatFn(dateDefaultTime.value[1])['YYYY-MM-DD'] //结束时间
      }



      httpAxiosO({
        method:'get',
        url:'/web/notice/noticeList.do',
        params:paramsO
      })
      .then((D)=>{
        console.log('通知公告列表数据 D',D);
        const { data,success } = D.data;
        if(!success){
          ElMessage({
            message: '通知公告列表数据失败',
            type: 'error',
            plain: true,
          })
          return;
        }

        //注释于 20240515.1530 jira YDYL-5 建议删除
        // ElMessage({
        //   message: '通知公告列表数据成功',
        //   type: 'success',
        //   plain: true,
        // })

        tableData.splice(0,tableData.length);
        data.ldata.forEach((o)=>{
          let _o = o;
          _o.crtimeFormat = timeFormatFn(o.pubTime)['YYYY-MM-DD hh:mm:ss']//时间格式化
          tableData.push(_o);
        });
        pageTotal.value = data.totalResults;
      })
      .catch((error)=>{
        console.log('通知公告列表数据 error',error)
      })
      .finally(()=>{
        loadingInstance1.close();
      })
      ;
    }
    //end of getNoticeListAjaxFn

    onMounted(()=>{
      getNoticeListAjaxFn();
    });

    return {
      disabledDate,
      searchInput,
      searchSelectValue,
      searchOptions,
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

      getNoticeListAjaxFn,

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
  font-weight: 400;
}
</style>