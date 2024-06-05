<template>
  <div class="mid-content">
    <div class="mid-content-mycontribute">
      <div class="mid-content-mycontribute-header flexcenter">
        <div class="flexcenter">
          <div class="mid-content-mycontribute-header-i">
            <img src="@/assets/mycontribute.png" alt="" />
          </div>
          <span>我的数据</span>
        </div>
      </div>
      <div class="mid-divider"></div>
      <div class="mid-content-mycontribute-table-content">
        <div class="mid-content-mycontribute-table-btngroup flexcenter">
          <div>
            <el-button class="clear-recyclebin" @click="dataUpdataFn()">
              数据上传
            </el-button>
          </div>
          <div
            class="mid-content-mycontribute-table-btngroup-search flexcenter"
          >
            <div class="mid-content-mycontribute-table-btngroup-search-keyword">
              <el-input
                v-model="searchInput"
                style="width: 190px"
                placeholder="请输入关键词"
                clearable
              />
            </div>

            <div
              class="mid-content-mycontribute-table-btngroup-search-keyword marl10"
            >
              <el-select
                v-model="searchExcelTyepValue"
                placeholder=""
                style="width: 200px"
                @change="getExcelListAjaxFn"
              >
                <el-option
                  v-for="item in searchExcelTyepOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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
                @change="getExcelListAjaxFn"
              />
            </el-config-provider>
            <el-button
              type="primary"
              class="marl10"
              style="width: 78px"
              @click="getExcelListAjaxFn"
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
            @selection-change="tableSelectionChange"
          >
            <!-- <el-table-column type="selection" width="55" /> -->
            <el-table-column
              label="序号"
              width="100"
              header-align="center"
              align="center"
            >
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="excelTitle" label="稿件标题">
              <template #default="scope">
                <span
                  style="display: flex; justify-content: left; text-align: left"
                >
                  {{ scope.row.excelTitle }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              prop="crtimeFormat"
              label="创建日期"
              width="140"
              header-align="center"
              align="center"
            />
            <el-table-column prop="articleUseStatus" label="操作" width="180">
              <template #default="scope">
                <div class="mid-content-mycontribute-table-tabledata-operate">
                  <div
                    @click="dataCheckFn(scope.row)"
                    v-if="scope.row.auditLabel == 0"
                  >
                    审核
                  </div>
                  <span v-if="scope.row.auditLabel == 0"></span>
                  <div @click="dataDownloadFn(scope.row)">下载</div>
                  <span></span>
                  <div @click="dataDeleteFn(scope.row)">删除</div>
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

  <el-dialog
    v-model="dialogVisible"
    title="数据上传"
    width="1450"
    v-if="dialogVisible"
  >
    <CreateUpdate 
      @closeDialog="closeDialog"
      @refreshList="getExcelListAjaxFn"
    />
  </el-dialog>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
//import { useStore } from "vuex";
import { useRouter } from "vue-router";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";
import { timeFormatFn } from "@/utils/timeFormat.js";
import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";
import CreateUpdate from "@/views/MyContribute/components/CreateUpdate.vue";
export default {
  components: {
    CreateUpdate,
  },
  setup() {
    //路由实例
    const router = useRouter();
    //vuex实例
    //const store = useStore();

    //关键词
    const searchInput = ref("");

    //搜索条件 数据指数 选项
    const searchExcelTyepValue = ref(0);
    const searchExcelTyepOptions = [
      {
        value: 0,
        label: "数据指数全部", //贸易指数
      },
      {
        value: 1,
        label: "航贸指数",
      },
      {
        value: 2,
        label: "其他指数",
      },
    ];
    //日期选择 数据
    const dateDefaultTime = ref("");
    const disabledDate = (time) => {
      return time.getTime() > Date.now();
    };
    //表格数据
    const tableData = reactive([]);

    //分页器
    let limit = ref(15);
    function handleSizeChange(val) {
      limit.value = val;
      getExcelListAjaxFn();
    }
    let page = ref(1);
    let pageTotal = ref(0);
    function handleCurrentChange(val) {
      page.value = val;
      getExcelListAjaxFn();
    }

    /**
     * 我的数据  接口
     * excelTyep 非必填  0贸易指数、1航贸指数、2其他指数
     * excelTitle 非必填 关键字搜索
     * crtime 非必填 起始时间
     * endtime 非必填 结束时间
     * currPage 非必填 开始页数
     * pageSize 非必填 页面条数
     *
     * 接口返回数据字段，线上文档有写，很详细
     */
    function getExcelListAjaxFn() {
      const loadingInstance1 = ElLoading.service({ fullscreen: true });
      const paramsO = {
        excelTitle: searchInput.value, //标题
        exceType: searchExcelTyepValue.value, //0贸易指数、1航贸指数、2其他指数
        currPage: page.value, //当前页
        pageSize: limit.value, //每页条数
      };

      //时间段
      if (dateDefaultTime.value) {
        paramsO.crTime = timeFormatFn(dateDefaultTime.value[0])[
          "YYYY-MM-DD hh:mm:ss"
        ]; //起始时间
        paramsO.endTime = timeFormatFn(dateDefaultTime.value[1])[
          "YYYY-MM-DD hh:mm:ss"
        ]; //结束时间
      }

      httpAxiosO({
        method: "get",
        url: "/web/excel/getExcelList",
        params: paramsO,
      })
        .then((D) => {
          console.log("我的数据 D", D);
          // eslint-disable-next-line
          const { data, success } = D?.data;

          if (!success) {
            ElMessage({
              message: "我的数据数据请求失败",
              type: "error",
              plain: true,
            });
            return;
          }

          //注释于 20240515.1530 jira YDYL-5 建议删除
          // ElMessage({
          //   message: "我的数据数据请求成功",
          //   type: "success",
          //   plain: true,
          // });

          tableData.splice(0, tableData.length); //清空tableData
          data.ldata.forEach((o) => {
            let _o = o;
            _o.crtimeFormat = timeFormatFn(o.crtime)["YYYY-MM-DD"]; //时间格式化
            tableData.push(_o);
          });
          pageTotal.value = data.totalResults;
        })
        .catch((error) => {
          console.log("我的数据 接口请求 error", error);
          ElMessage({
            message: "我的数据接口请求失败",
            type: "error",
            plain: true,
          });
        })
        .finally(() => {
          loadingInstance1.close();
        });
      return;
    }
    // end of getExcelListAjaxFn

    //由“数据上传” 按钮触发
    const dialogVisible = ref(false);
    const dataUpdataFn = () => {
      //store
      console.log("dataUpdataFn");
      dialogVisible.value = true;
      // store.dispatch('deleteDelAllFn')
      // .then(()=>{
      //   ElMessage({
      //     message: '清空回收站成功',
      //     type: 'success',
      //     plain: true,
      //   })
      // })
      // .catch(()=>{
      //   ElMessage({
      //     message: '清空回收站失败',
      //     type: 'error',
      //     plain: true,
      //   })
      // });
    };

    /**
     * 继续采用 ，实际上是“查看稿件”即跳转到 “创建稿件/原创稿件”界面
     * @param {*} scopeP
     */
    // eslint-disable-next-line
    const continueUsingFn = (scopeP) => {

      // const {
      //   id,excelTitle,articleHtmlCon,articleContent,language,remark,articleStatus,aritleSource
      // } = scopeP.row;
      // store.dispatch('',{
      //   params:{
      //     // id,excelTitle,articleHtmlCon,articleContent,language,remark,
      //     // articleStatus:1,aritleSource
      //   },
      // }).then((D)=>{
      //   if(
      //     D.data.success === false
      //   ){
      //     ElMessage({
      //       message: '接口请求成功 但采用失败',
      //       type: 'error',
      //       plain: true,
      //     })
      //     return;
      //   }
      //   ElMessage({
      //     message: '采用成功',
      //     type: 'success',
      //     plain: true,
      //   })
      // })
      // .catch(()=>{
      //   ElMessage({
      //     message: '采用失败',
      //     type: 'error',
      //     plain: true,
      //   })
      // });
    };
    //审核 先弹窗再调接口（传参：通过2 未通过1）
    function dataCheckFn(scopeP) {
      ElMessageBox.confirm("数据审核是否通过？", "数据审核", {
        confirmButtonText: "通过",
        cancelButtonText: "不通过",
        customClass: "selfElMessageBox",
      })
        .then(() => {
          dataCheckAjaxFn(scopeP, 2); //通过
        })
        .catch(() => {
          dataCheckAjaxFn(scopeP, 1);
        });
    }
    //审核接口
    function dataCheckAjaxFn(scopeP, flag) {
      httpAxiosO({
        method: "get",
        url: "/web/excel/update",
        params: {
          id: scopeP.id,
          auditLabel: flag,
        },
      })
        .then((D) => {
          console.log("审核 D", D);
          // eslint-disable-next-line
          const { data, success } = D?.data;

          if (!success) {
            ElMessage({
              message: "审核接口请求失败",
              type: "error",
              plain: true,
            });
            return;
          } else {
            ElMessage({
              message: "审核接口请求成功",
              type: "success",
              plain: true,
            });
            getExcelListAjaxFn();
          }
        })
        .catch((error) => {
          console.log("审核接口请求 error", error);
          ElMessage({
            message: "审核接口请求失败",
            type: "error",
            plain: true,
          });
        })
        .finally(() => {});
    }
    //删除
    function dataDeleteFn(scopeP) {
      httpAxiosO({
        method: "get",
        url: "/web/excel/del",
        params: {
          id: scopeP.id,
        },
      })
        .then((D) => {
          console.log("数据删除 D", D);
          // eslint-disable-next-line
          const { data, success } = D?.data;

          if (!success) {
            ElMessage({
              message: "数据删除接口请求失败",
              type: "error",
              plain: true,
            });
            return;
          } else {
            ElMessage({
              message: "数据删除接口请求成功",
              type: "success",
              plain: true,
            });
            getExcelListAjaxFn();
          }
        })
        .catch(() => {
          ElMessage({
            message: "数据删除接口请求失败",
            type: "error",
            plain: true,
          });
        })
        .finally(() => {});
    }
    //下载
    function dataDownloadFn(scopeP) {
      httpAxiosO({
        method: "get",
        url: "/web/excel/download",
        params: {
          id: scopeP.id,
          path: "C://Users//Admin//Desktop",
        },
      })
        .then((D) => {
          console.log("数据下载 D", D);
          // eslint-disable-next-line
          const { data, success } = D?.data;

          if (!success) {
            ElMessage({
              message: "数据下载接口请求失败",
              type: "error",
              plain: true,
            });
            return;
          } else {
            ElMessage({
              message: "数据下载接口请求成功",
              type: "success",
              plain: true,
            });
          }
        })
        .catch(() => {
          ElMessage({
            message: "数据下载接口请求失败",
            type: "error",
            plain: true,
          });
        })
        .finally(() => {});
    }
    onMounted(() => {
      getExcelListAjaxFn();
    });

    function tableSelectionChange(val) {
      console.log(val);
    }
    function closeDialog() {
      dialogVisible.value = false;
    }
    return {
      disabledDate,
      router,

      searchInput,

      searchExcelTyepValue,
      searchExcelTyepOptions,

      dateDefaultTime,
      locale: zhCn, //date-range 语言设置
      tableData,
      limit,
      page,
      pageTotal,
      handleSizeChange,
      handleCurrentChange,
      tableSelectionChange,

      getExcelListAjaxFn,
      dataUpdataFn,
      dataCheckFn,
      continueUsingFn,

      dialogVisible,
      closeDialog,

      dataDeleteFn,
      dataDownloadFn,
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
        span {width: 1px;height: 17px;background: #3652d2;}
        span:nth-last-child(1) {display: none;}

      }
    }
  }
}
</style>