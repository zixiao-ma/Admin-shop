<template>
  <div>
    <div id="main" style="width: 800px; height: 400px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from 'axios'
import lodash from 'lodash'

export default {
  data() {
    return {
      option: {
        title: {
          text: "",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
      },
    };
  },
  mounted() {

    var myChart = echarts.init(document.getElementById("main"));
    axios.get("reports/type/1").then((res) => {
      let options = lodash.merge(res, this.option);
      myChart.setOption(options);
    });
  },
};
</script>

<style lang="scss" scoped>
</style>
