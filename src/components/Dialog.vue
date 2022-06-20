<template>
  <div>
    <el-dialog
        :before-close="handleClose"
        :close-on-click-modal="false"
        :title="title"
        :visible.sync="dialogVisible"
        width="50%">
      <slot></slot>
      <span slot="footer" class="dialog-footer">
    <slot name="footer">
       <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button :loading="loading" type="primary" @click="$emit('confirm')">确 定</el-button>
    </slot>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    }
  },
  name: "Dialog",
  data() {
    return {
      dialogVisible: false,
      loading: false
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    start() {
      this.loading = true
    },
    done() {
      this.loading = false
    },
    handleClose(done) {
      this.dialogVisible = false

    }
  }
}
</script>

<style scoped>

</style>