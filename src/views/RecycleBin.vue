<template>
  <div class="mid-content">
    <div class="mid-content-mycontribute">
      <div class="mid-content-mycontribute-header flexcenter">
        <div class="flexcenter">
          <div class="mid-content-mycontribute-header-i">
            <img src="../assets/recyclebin.png" alt="" />
          </div>
          <span>回收站</span>
        </div>
      </div>
      <div class="mid-divider"></div>
      <div class="mid-content-mycontribute-table-content">
        <div class="mid-content-mycontribute-table-btngroup flexcenter">
          <div>
            <!-- 注释于20240519.1613 jira YDYL-4 我的投稿、草稿箱、回收站 删除稿件需要增加确认
            <el-button class="clear-recyclebin" @click="clearRecyclebinFn()">
              清除回收站
            </el-button> 
            -->
            <el-popconfirm
              title="确定删除吗？"
              confirm-button-text="删除"
              cancel-button-text="取消"
              @confirm="clearRecyclebinFn()"
            >
              <template #reference>
                <el-button class="clear-recyclebin">
                  清除回收站
                </el-button> 
              </template>
            </el-popconfirm>

          </div>
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
                @keydown.enter="getArticleDraftListAjaxFn"
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
            <el-button type="primary" class="marl10" style="width: 78px"
              @click="getArticleDraftListAjaxFn"
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
              'color': '#727789',
              'font-size': '16px',
            }"
            @selection-change="tableSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="序号" width="100"
              header-align="center"
              align="center" 
            >
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="articleTitle" label="稿件标题">
              <template #default="scope">
                <span
                  style="cursor: pointer;"
                  @click="getFindByIdAjaxFn(scope)"
                >
                  {{ scope.row.articleTitle }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="sourceName" label="稿件来源" width="125" 
              header-align="center"
              align="center" 
            />
            <el-table-column prop="languageName" label="语种" width="120" 
              header-align="center"
              align="center" 
            />
            <el-table-column prop="crtimeFormat" label="创建日期" width="140" 
              header-align="center"
              align="center" 
            />
            <el-table-column prop="articleUseStatus" label="操作" width="200"
              header-align="center"
              align="center" 
            >
              <template #default="scope">
                <div class="mid-content-mycontribute-table-tabledata-operate">
                  <div :title="scope.row.articleTitle" @click="router.push('/MyContribute/CreateContribute?id='+scope.row.id)">继续采用</div>
                  <span></span>
                  
                  <!-- 注释于20240519.1613 jira YDYL-4 我的投稿、草稿箱、回收站 删除稿件需要增加确认
                  <div @click="deleteArticleAjaxFn(scope.row.id)">删除</div>
                  -->
                  <el-popconfirm
                    title="确定删除吗？"
                    confirm-button-text="删除"
                    cancel-button-text="取消"
                    @confirm="deleteArticleAjaxFn(scope.row.id)"
                  >
                    <template #reference>
                      <div>删除</div>
                    </template>
                  </el-popconfirm>

                  <span></span>
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
    </div>
  </div>
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
    //日期选择 数据
    const dateDefaultTime = ref('');
    //表格数据
    const tableData = reactive([]);

    //分页器
    let limit = ref(15);
    function handleSizeChange(val) {
      limit.value = val;
      getArticleDraftListAjaxFn();
    }
    let page = ref(1);
    let pageTotal = ref(0);
    function handleCurrentChange(val) {
      page.value = val;
      getArticleDraftListAjaxFn();
    }


    /**
     * 草稿箱/回收站 共用 接口
     * 以下注释摘抄至接口文档（20240412.1733）
     * articleType 非必填 稿件类别（0：普通稿件 1：转载稿件）
     * articleStatus 非必填 稿件状态 （-1：已删除，0：草稿，1：已投稿）
     * articleTitle 非必填 关键字搜索
     * articleContent 非必填 正文搜索
     * crtime 非必填 起始时间
     * endtime 非必填 结束时间
     * currPage 非必填 开始页数
     * pageSize 非必填 页面条数
     * 
     * 接口返回数据字段，线上文档有写，很详细
    */
    function getArticleDraftListAjaxFn(){

      const languageNameArr = store.state.GLOBAL_LANGUAGE_LIST.map((o)=>{
        return o.desc
      });
      languageNameArr.unshift('全部');

      const loadingInstance1 = ElLoading.service({ fullscreen: true })
      const paramsO = {
        articleStatus:-1,//-1 代表已删除
        currPage:page.value,//当前页
        pageSize:limit.value,//每页条数
      }

      // statusSelectValue.value&&(paramsO.articleUseStatus=statusSelectValue.value) //稿件发布状态

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
        url: '/web/article/draftList.do',
        params:paramsO,
      })
      .then((D)=>{
        console.log('回收站 D',D);
        const { data,success } = D?.data
        data
        if(!success){
          ElMessage({
            message: '回收站数据请求失败',
            type: 'error',
            plain: true,
          })
          return;
        }

        //注释于 20240515.1530 jira YDYL-5 建议删除
        // ElMessage({
        //   message: '回收站数据请求成功',
        //   type: 'success',
        //   plain: true,
        // })
        
        tableData.splice(0,tableData.length);   //清空tableData
        data.ldata.forEach((o)=>{
          let _o = o;
          _o.languageName = languageNameArr[o.language]//语种名称，接口只提供了语种对应的 编号
          _o.crtimeFormat = timeFormatFn(o.crtime)['YYYY-MM-DD']//时间格式化
          tableData.push(_o);
        });
        pageTotal.value = data.totalResults;

      })
      .catch((error)=>{
        console.log('回收站 接口请求 error',error);
        ElMessage({
          message: '回收站接口请求失败',
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
    // end of getArticleDraftListAjaxFn

    //清除回收站
    const clearRecyclebinFn = () => {
      const loadingInstance1 = ElLoading.service({ fullscreen: true })
      store.dispatch('deleteDelAllFn').then(()=>{
        // ElMessage({
        //   message: '清空回收站成功',
        //   type: 'success',
        //   plain: true,
        // })
      })
      .catch(()=>{
        ElMessage({
          message: '清空回收站失败',
          type: 'error',
          plain: true,
        })
      })
      .finally(()=>{
        loadingInstance1.close();
      })
    };



    /**
     * 回收站列表删除接口，真正的删除
     */
     function deleteArticleAjaxFn(idP){
      httpAxiosO({
        url:'/web/article/del.do',
        method:'delete',
        params:{
          ids:idP
        }
      })
      .then((D)=>{D
        ElMessage({
          message: '删除成功',
          type: 'success',
          plain: true,
        })

        getArticleDraftListAjaxFn();//更新回收站列表

      })
      .catch((error)=>{error
        ElMessage({
          message: '删除失败',
          type: 'error',
          plain: true,
        })
      });
    }
    // end of deleteArticleAjaxFn

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


    onMounted(() => {
      getArticleDraftListAjaxFn();
    });

    function tableSelectionChange(val){
        console.log(val)
    }
    return {
      router,

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
      tableSelectionChange,

      getArticleDraftListAjaxFn,
      clearRecyclebinFn,

      deleteArticleAjaxFn,
      getFindByIdAjaxFn,
      
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
</style>