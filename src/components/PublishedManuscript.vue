<template>
  <div class="mid-content-statistics-table-content" data-desc="已发投稿组件">
    <div class="mid-content-statistics-table-btngroup flexcenter">
      <div></div>
      <div
        class="mid-content-statistics-table-btngroup-search flexcenter"
        data-desc="已发投稿组件-检索区"
      >
        <el-select
          v-model="paperSelectValue"
          placeholder="全部"
          style="width: 140px"
          class="marl10"
        >
          <el-option
            v-for="item in paperOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :title="item.title"
          />
        </el-select>
        <div class="mid-content-statistics-table-btngroup-search-keyword">
          <el-select
            v-model="searchSelectValue"
            placeholder=""
            style="width: 80px"
            class="marl10"
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
            @keydown.enter="getBrokeListAjaxFn"
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
            style="margin-left: 10px; width: 270px"
          />
        </el-config-provider>
        <el-button
          type="primary"
          class="marl10"
          style="width: 78px"
          @click="getBrokeListAjaxFn"
        >
          <el-icon style="margin-right: 5px"><Search /></el-icon>
          搜索
        </el-button>
      </div>
    </div>
    <div
      class="mid-content-statistics-table-tabledata"
      data-desc="已发投稿组件-列表区"
    >
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
          'color': '#727789',
          'font-size': '16px',
        }"
      >
        <el-table-column
          label="序号"
          width="100"
          header-align="center"
          align="center"
          :data-desc="userAuthority"
        >
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="稿件标题"

          :data-title="userAuthority"
          v-if="userAuthority === '国家发改委用户'"
        >
          <template #default="scope">
            <div
              :style="((scope)=>{
                let _styleStr1 = 'cursor: pointer;'
                let _styleStr2 = 'cursor: pointer;direction: rtl;text-align:auto;text-align:-webkit-auto;'
                return (scope.row.languageName==='阿文'||scope.row.languageName==='阿语')?_styleStr2: _styleStr1
              })(scope)"
              @click="getFindByIdAjaxFn(scope)"
            >
              {{ scope.row.articleTitle }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="articleTitle" label="稿件标题" v-else>
          <template #default="scope">
            <span
              style="display: flex; justify-content: left; text-align: left"
            >
              {{ scope.row.articleTitle }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sourceName"
          label="稿件来源"
          width="125"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="languageName"
          label="语种"
          width="120"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="crtimeFormat"
          label="创建日期"
          width="140"
          header-align="center"
          align="center"
        />
      </el-table>
    </div>
    <div class="flexcenter el-pagination-style">
      <el-pagination
        layout="slot"
        :total="pageTotal"
        class="el-pagination-style-leftpagination"
      >
        <span class="el-pagination-style-leftpagination-total">
          共{{ pageTotal }}条
        </span>
        <span class="el-pagination-style-leftpagination-percent flexcenter">
          {{ page1 }}/{{ Math.ceil(pageTotal / limit1) }}
        </span>
      </el-pagination>
      <el-config-provider :locale="locale">
        <el-pagination
          background
          layout="prev, next, sizes, jumper"
          :total="pageTotal"
          :page-sizes="[15, 20, 30, 40, 50]"
          :page-size="limit1"
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          class="el-pagination-style-rightpagination"
        />
      </el-config-provider>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted,computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { ElMessage, ElLoading } from "element-plus";
import { timeFormatFn } from "@/utils/timeFormat.js";
import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";

export default {
  setup() {
    const store = useStore();

    //用户角色名字
    const userAuthority = computed(() => {
      return store.state.StroeLoginO.loginUser.CURRENT_ROLE;
    });
    

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

    //语种select数据
    const langSelectValue = ref("");
    const langOptions = reactive([]);
    store.state.GLOBAL_LANGUAGE_LIST.forEach((o) => {
      langOptions.push({
        value: o.id,
        label: o.desc,
      });
    });
    const paperSelectValue = ref("");
    const paperOptions = reactive([
      { label: "全部", value: 0 },
      { label: "我的投稿", value: 1 },
      { label: "相关稿件", value: 2, title:'中国一带一路网发布与我相关稿件' },
    ]);



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
    const dateDefaultTime = ref('');

    //表格数据
    const tableData = reactive([]);

    //分页器
    let limit1 = ref(15);
    function handleSizeChange1(val) {
      limit1.value = val;
    }
    let page1 = ref(1);
    let pageTotal = ref(0);
    function handleCurrentChange1(val) {
      page1.value = val;
      getBrokeListAjaxFn();
    }

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

    function getBrokeListAjaxFn() {
      const languageNameArr = store.state.GLOBAL_LANGUAGE_LIST.map((o)=>{
        return o.desc
      });

      const articleUseStatusNameArr = ["待处理", "审核中", "已发布", "未采用"];

      const loadingInstance1 = ElLoading.service({ fullscreen: true });

      const paramsO = {
        language:langSelectValue.value||0,//0 可能代表 所有语种，文档里有提示 写 0
        currPage:page1.value,//当前页
        pageSize:limit1.value,//每页条数
      }

      statusSelectValue.value&&(paramsO.articleUseStatus=statusSelectValue.value) //稿件发布状态
      
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
        paramsO.crtime=timeFormatFn(dateDefaultTime.value[0])['YYYY-MM-DD'] //起始时间
        paramsO.endtime=timeFormatFn(dateDefaultTime.value[1])['YYYY-MM-DD'] //结束时间
      }
      


      httpAxiosO({
        method: "get",
        url: "/web/article/brokeList.do",
        params: paramsO,
      })
        .then((D) => {
          console.log("已发稿件 D", D);
          const { data, success } = D.data;
          data;
          if (!success) {
            ElMessage({
              message: "已发稿件数据请求失败",
              type: "error",
              plain: true,
            });
            return;
          }

          //注释于 20240515.1530 jira YDYL-5 建议删除
          // ElMessage({
          //   message: "已发稿件数据请求成功",
          //   type: "success",
          //   plain: true,
          // });

          tableData.splice(0,tableData.length); //清空tableData
          data.ldata.forEach((o) => {
            let _o = o;
            _o.languageName = languageNameArr[o.language]; //语种名称，接口只提供了语种对应的 编号
            _o.articleUseStatusName = articleUseStatusNameArr[o.articleUseStatus]//状态名字，接口只提供了状态对应的 编号
            _o.crtimeFormat = timeFormatFn(o.crtime)["YYYY-MM-DD"]; //时间格式化
            tableData.push(_o);
          });
          pageTotal.value = data.totalResults;

        })
        .catch((error) => {
          console.log("已发稿件 接口请求 error", error);
          ElMessage({
            message: "已发稿件接口请求失败",
            type: "error",
            plain: true,
          });
        })
        .finally(() => {
          loadingInstance1.close();
        });
      return;
    }
    // end of getBrokeListAjaxFn

    onMounted(() => {
      getBrokeListAjaxFn(); //已发稿件
      restaurants.value = loadAll(); //联想输入框赋值
    });
    const router = useRouter();
    /**
     * 跳转到细览页，需要传递 稿件id
     */
     function getFindByIdAjaxFn(scopeP){
      const c = router.resolve({
        path: "/PubDetail",
        query: {
          id: scopeP.row.id,
        },
      });

      window.open(c.href, "_blank");
      return;
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
    return {
      userAuthority,
      searchInput,
      searchSelectValue,
      searchOptions,
      originSelectValue,
      originOptions,

      statusSelectValue,
      statusOptions,

      langSelectValue,
      langOptions,

      paperSelectValue,
      paperOptions,

      dateDefaultTime,
      locale: zhCn, //date-range 语言设置
      tableData,
      limit1,
      pageTotal,
      page1,
      handleSizeChange1,
      handleCurrentChange1,

      getBrokeListAjaxFn,

      getFindByIdAjaxFn,
      originInput,
      querySearch,
    };
  },
};
</script>
<style lang="less" scoped>
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
</style>