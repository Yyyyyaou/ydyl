<template>
  <div>
    <div class="canvars" ref="myRef"></div>
  </div>
</template>
 
<script>
import { ref, onMounted, getCurrentInstance } from "vue";
export default {
  setup() {
    const { proxy } = getCurrentInstance(); // 获取全局配置项
    const myRef = ref(null); // 获取dom实例

    let ylist = [];
    let x1list = [];
    let x2list = [];
    onMounted(() => {
      //renderChart(); // 生命周期挂载函数渲染图表
    });

    const option = {
      tooltip: {
        trigger: "axis",
        // formatter: '{a0}: {c0}<br/>'+'{a1}: {c1}'
        formatter: function (params) {
          var num1 = params[0]==undefined?0:params[0]?.value;
          var num2 = params[1]==undefined?0:params[1]?.value;
          var num = num1+num2;
          var result =
            '<span style="font-weight:700;text-align:center;">'+params[0].axisValueLabel+' '+'投稿数:'+
            "&nbsp;"+
            num +
            "</span></br>";
          params.forEach(function (item) {
            result +=
              item.marker +
              " " +
              item.seriesName +
              " : " +
              item.value +
              "</br>";
          });
          return result;
        },
      },
      legend: {
        icon: "circle",
      },
      yAxis: {
        type: "value",
      },
      xAxis: {
        type: "category",
        data: ylist,
        axisLabel: {
          interval:0,
          rotate: 15,
        },
      },
      series: [
        {
          name: "原创投稿稿件",
          type: "bar",
          stack: "total",
          emphasis: {
            focus: "series",
          },
          data: x1list,
          barWidth: 15, // 设置柱子粗细
          itemStyle: {
            color: new proxy.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0, //offset范围是0~1，用于表示位置，0是指0%处的颜色
                color: "#3f8e38 ",
              }, //柱图渐变色
              {
                offset: 1, //指100%处的颜色
                color: "#98de94",
              },
            ]), // 改变柱子的颜色
            barBorderRadius: [0, 0, 30, 30], // 柱子的圆角，分别为左上、右上、右下、左下
          },
        },
        {
          name: "转载投稿稿件",
          type: "bar",
          stack: "total",
          emphasis: {
            focus: "series",
          },
          data: x2list,
          barWidth: 15, // 设置柱子粗细
          itemStyle: {
            //前四个参数用于配置渐变色的起止位置，这四个参数依次对应 右下左上 四个方位。也就是从右边开始顺时针方向。
            //通过修改前4个参数，可以实现不同的渐变方向
            /*第五个参数则是一个数组，用于配置颜色的渐变过程。
              每项为一个对象，包含offset和color两个参数
            */
            color: new proxy.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                //代表渐变色从正上方开始
                offset: 0, //offset范围是0~1，用于表示位置，0是指0%处的颜色
                color: "#23abfb ",
              }, //柱图渐变色
              {
                offset: 1, //指100%处的颜色
                color: "#a2dbfb",
              },
            ]), // 改变柱子的颜色
            barBorderRadius: [30, 30, 0, 0], // 柱子的圆角，分别为左上、右上、右下、左下
          },
        },
      ],
    };
    const renderChart = () => {
      const myChart = proxy.$echarts.init(myRef.value);

      option.xAxis.data = ylist;
      option.series[0].data = x1list;
      option.series[1].data = x2list;
      myChart.setOption(option);
      // window.addEventListener("resize", () => {
      //   myChart.resize();
      // });
    };
    const initEcharts = (y, x1, x2) => {
      ylist = y;
      x1list = x1;
      x2list = x2;
      renderChart();
    };
    return {
      myRef,
      initEcharts,
      ylist,
      x1list,
      x2list,
    };
  },
};
</script>
 
<style scoped>
.canvars {
  width: 1620px;
  height: 400px;
}
</style>