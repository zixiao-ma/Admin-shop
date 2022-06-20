<template>
  <div style="margin-bottom: 15px">
    <el-input v-model="value" class="input-with-select" placeholder="请输入搜索内容">
      <el-button slot="append" :loading="loading" icon="el-icon-search"
                 @click="searchbtn"></el-button>
    </el-input>
    <el-button type="primary" @click="addbtn">{{ title }}</el-button>
  </div>
</template>

<script>
export default {
  name: "Search",
  props: {
    value: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: String
  },
  watch: {
    value(v) {
      this.$emit('input', v)
    }
  },
  methods: {
    searchbtn() {

      this.$emit('search')
    },
    addbtn() {
      this.$emit('click')
    }
  }

}
</script>

<style scoped>
.el-input {
  width: 420px;
  margin-right: 10px;
}
</style>