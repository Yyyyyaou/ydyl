<template>
  <div class="mid-content-statistics-table-content" data-desc="我的投稿组件">
    <div class="mid-content-statistics-table-btngroup flexcenter" data-desc="我的投稿组件-检索区">
      <div>
        <el-button
          class="btn-tougao"
          @click="router.push('/MyContribute/CreateContribute')"
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
            clearable
            @keydown.enter="getArticleListAjaxFn"
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
            :disabled-date="disabledDate"
            v-model="dateDefaultTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="margin-left: 10px; width: 270px"
          />
        </el-config-provider>
        <el-button
          type="primary"
          class="marl10"
          style="width: 78px"
          @click="getArticleListAjaxFn"
        >
          <el-icon style="margin-right: 5px"><Search /></el-icon>
          搜索
        </el-button>
      </div>
    </div>
    <!-- end of mid-content-statistics-table-btngroup -->

    <div class="mid-content-statistics-table-tabledata" data-desc="我的投稿组件-列表区">
      <el-table
        empty-text="暂无数据"
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="{
          'color': '#6a6d74',
          'font-size': '16px',
        }"
        :cell-style="{
          'color': '#727789',
          'font-size': '16px',
        }"
      >
        <el-table-column label="序号" width="100"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="articleTitle" label="稿件标题"
          header-align="center"
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
        <el-table-column
          prop="sourceName"
          label="稿件来源"
          header-align="center"
          align="center"
          width="125"
        />
        <el-table-column prop="languageName" label="语种" 
        header-align="center"
        align="center"
        width="120" />
        <el-table-column prop="articleUseStatus" label="状态"
        header-align="center"
        align="center"
        width="110">
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
          header-align="center"
          align="center"
          width="140"
        />
        <el-table-column prop="articleUseStatus" label="操作"
        header-align="center"
        align="center" 
        width="130" 
        >
          <template #default="scope">
            <div
              class="mid-content-statistics-table-tabledata-operate"
            >
              <div @click="getFindByIdAjaxFn(scope)">查看</div>
              <span></span>
              <div v-if="scope.row.articleUseStatus === 3" data-desc="已发布">链接</div>
              <span v-if="scope.row.articleUseStatus === 3" data-desc="已发布"></span>
              <!-- 
                注释于20240419.1657 许慧敏姐说这块不要编辑
                <div v-if="scope.row.articleUseStatus === 0" data-desc="待处理"
                @click="router.push('/MyContribute/CreateContribute?id='+scope.row.id)"
              >编辑</div>
              <span v-if="scope.row.articleUseStatus === 0" data-desc="待处理"></span> -->
              
              <!-- 注释于20240519.1613 jira YDYL-4 我的投稿、草稿箱、回收站 删除稿件需要增加确认
                <div v-if="scope.row.articleUseStatus === 0" data-desc="待处理" @click="triggerDeleteLogicDeleteFn(scope)">删除</div> 
              -->
              <el-popconfirm
                v-if="scope.row.articleUseStatus === 0"
                data-desc="待处理"
                title="确定删除吗？"
                confirm-button-text="删除"
                cancel-button-text="取消"
                @confirm="triggerDeleteLogicDeleteFn(scope)"
              >
                <template #reference>
                  <div>删除</div>
                </template>
              </el-popconfirm>


              <span v-if="scope.row.articleUseStatus === 0" data-desc="待处理"></span>
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
            popper-class="D_DD"
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
import { useStore } from "vuex"
import { useRouter } from "vue-router";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { ElMessage,ElLoading } from "element-plus";
import { timeFormatFn } from "@/utils/timeFormat.js";
import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";
export default {
  setup() {
    //路由实例
    const router = useRouter();
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
    store.state.GLOBAL_LANGUAGE_LIST.forEach((o)=>{
      langOptions.push({
        value: o.id,
        label: o.desc,
      })
    });


    //状态select数据
    const statusSelectValue = ref("");
    const statusOptions = [
      {
        value: 4,
        label: "全部",
      },
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
    const disabledDate = (time) => {
      return time.getTime() > Date.now();
    };
    //表格数据
    const tableData = reactive([]);

    //分页器
    let limit = ref(15);
    function handleSizeChange(val) {
      limit.value = val;
      getArticleListAjaxFn();
    }
    let page = ref(1);
    let pageTotal = ref(0);
    function handleCurrentChange(val) {
      page.value = val;
      getArticleListAjaxFn();
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

      const languageNameArr = store.state.GLOBAL_LANGUAGE_LIST.map((o)=>{
        return o.desc
      });

      const articleUseStatusNameArr = ['待处理','审核中','已发布','未采用'];
      const loadingInstance1 = ElLoading.service({ fullscreen: true })
      const paramsO = {
        language:langSelectValue.value||0,//0 可能代表 所有语种，文档里有提示 写 0
        currPage:page.value,//当前页
        pageSize:limit.value,//每页条数
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
        method: 'get',
        url: '/web/article/articleList.do',
        params:paramsO,
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

        //注释于 20240515.1530 jira YDYL-5 建议删除
        // ElMessage({
        //   message: '我的投稿数据请求成功',
        //   type: 'success',
        //   plain: true,
        // })
        
        tableData.splice(0,tableData.length);   //清空tableData
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

    /**
     *删除稿件到回收站 
     */
    function triggerDeleteLogicDeleteFn(scopeP){
      const { id } = scopeP.row;
      store.dispatch('deleteLogicDeleteFn',{
        ids:String(id),
      })
      .then((D)=>{
        if(
          D === undefined
        ){
          ElMessage({
            message: '接口请求成功 但删除失败',
            type: 'error',
            plain: true,
          })
          return;
        }
        ElMessage({
          message: '删除到回收站',
          type: 'success',
          plain: true,
        });

        getArticleListAjaxFn();//更新我的投稿列表

      })
      .catch(()=>{
        ElMessage({
          message: '删除失败',
          type: 'error',
          plain: true,
        })
      })
      ;
    }

    onMounted(()=>{
      getArticleListAjaxFn();//我的投稿列表
    });

    return {
      disabledDate,
      router,

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
      getArticleListAjaxFn,
      triggerDeleteLogicDeleteFn,

    }

  },
  //end of  setup()
}
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