<template>
  <div class="mid-content-statistics-table-content" data-desc="我的投稿组件">
    <div class="mid-content-statistics-table-btngroup flexcenter" data-desc="我的投稿组件-检索区">
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
    <!-- end of mid-content-statistics-table-btngroup -->

    <div class="mid-content-statistics-table-tabledata" data-desc="我的投稿组件-列表区">
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
            :page-sizes="[1, 15, 20, 30, 40, 50]"
            :page-size="limit"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            class="el-pagination-style-rightpagination"
          />
        </el-config-provider>
      </div>
    </div>
    <!-- end of mid-content-statistics-table-tabledata -->
  </div>
  <!-- end of mid-content-statistics-table-content -->
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
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
    //表格数据
    const tableData = reactive([]);

    //分页器
    let limit = ref(1);
    function handleSizeChange(val) {
      limit.value = val;
    }
    let page = ref(1);
    let pageTotal = ref(0);
    function handleCurrentChange(val) {
      page.value = val;
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
          language:0,//0 可能代表 所有语种，文档里有提示 写 0
          currPage:page.value,//当前页
          pageSize:1,//每页条数
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
        pageTotal.value = data.totalResults;

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

    onMounted(()=>{
      getArticleListAjaxFn();//我的投稿列表
    });

    return {
      searchInput,
      searchSelectValue,
      searchOptions,
      
      statusSelectValue,
      statusOptions,

      langSelectValue,
      langOptions,
      dateDefaultTime,
      tableData,
      limit,
      page,
      pageTotal,
      handleSizeChange,
      handleCurrentChange,
      locale: zhCn, //date-range 语言设置

      //接口请求
      getFindByIdAjaxFn,
    }

  },
  //end of  setup()
}
</script>

<style lang="less" scoped>
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
</style>