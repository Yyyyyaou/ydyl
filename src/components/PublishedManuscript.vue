<template>
  <div class="mid-content-statistics-table-content" data-desc="已发投稿组件">
    <div class="mid-content-statistics-table-btngroup flexcenter">
      <div></div>
      <div
        class="mid-content-statistics-table-btngroup-search flexcenter" data-desc="已发投稿组件-检索区"
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
          @click="getBrokeListAjaxFn"
        >
          <el-icon style="margin-right: 5px"><Search /></el-icon>
          搜索
        </el-button>
      </div>
    </div>
    <div class="mid-content-statistics-table-tabledata" data-desc="已发投稿组件-列表区">
      <el-table
        :data="
          tableData1.slice((page1 - 1) * limit1, page1 * limit1)
        "
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
        <el-table-column
          prop="crtimeFormat"
          label="创建日期"
          width="140"
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
        <span
          class="el-pagination-style-leftpagination-percent flexcenter"
        >
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
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex"
// import { useRouter } from "vue-router";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { ElMessage,ElLoading } from "element-plus";
import { timeFormatFn } from "@/utils/timeFormat.js";
import httpAxiosO from "ROOT_URL/api/http/httpAxios.js";

export default {
  setup(){
    //vuex实例
    const store = useStore();

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

    const langSelectValue1 = ref("");
    const langOptions1 = reactive([]);
    store.state.GLOBAL_LANGUAGE_LIST.forEach((o)=>{
      langOptions1.push({
        value: o.id,
        label: o.desc,
      })
    });


    //日期选择 数据
    const dateDefaultTime1 = ref([]);

    //表格数据
    const tableData1 = reactive([]);

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

     function getBrokeListAjaxFn(){
      const languageNameArr = ['中文','英文','阿语','俄语','西语','法语'];languageNameArr
      const articleUseStatusNameArr = ['待处理','审核中','已发布','未采用'];articleUseStatusNameArr
      const loadingInstance1 = ElLoading.service({ fullscreen: true })

      httpAxiosO({
        method: 'get',
        url: '/api/web/article/brokeList.do',
        params:{
          language:0,//0 可能代表 所有语种，文档里有提示 写 0

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
        
        tableData1.value = [];//清空tableData1
        data.ldata.forEach((o)=>{
          let _o = o;
          _o.languageName = languageNameArr[o.language]//语种名称，接口只提供了语种对应的 编号
          _o.crtimeFormat = timeFormatFn(o.crtime)['YYYY-MM-DD']//时间格式化
          tableData1.push(_o);
        });

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
    // end of getBrokeListAjaxFn    


    onMounted(()=>{
      getBrokeListAjaxFn();//已发稿件
    });

    return {
      
      searchInput1,
      searchSelectValue1,
      searchOptions1,
      originSelectValue,
      originOptions,

      langSelectValue1,
      langOptions1,


      dateDefaultTime1,
      locale: zhCn, //date-range 语言设置
      tableData1,
      limit1,
      pageTotal,
      page1,
      handleSizeChange1,
      handleCurrentChange1,

      getBrokeListAjaxFn,

    }
  }
}
</script>
