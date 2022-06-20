<template>
  <div>
    <div class="box_empty">
      <el-empty description="Error 404 您访问的页面不存在！">
        <el-button @click="$router.push({name:'welcome'})">返回首页</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound"
}
</script>

<style scoped>


</style>