<template>
  <div>
    <Dialog ref="dialog" :title="title" @confirm="$refs.from.submitForm('ruleForm')">
      <From ref="from" v-model="model" :formData="formData" @fromSubmit="$emit('fromSubmit')"></From>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: "DialogForm",
  props: {
    title: {
      type: String
    },
    formData: {
      type: Object,
      default: {}
    },
    value: {
      type: Object,
      default: {}
    }
  },
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
    start() {
      this.$refs.dialog.start()
    },
    done() {
      this.$refs.dialog.done()
    }
  }

}
</script>

<style scoped>

</style>