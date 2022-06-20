<template>
  <div>
    <el-form v-if="formData" ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm" label-width="100px">

      <el-form-item v-for="(item,key) in formData" :key="key" :label="item.label+':'" :prop="item.prop">
        <el-input v-model="ruleForm[key]" :disabled="item.disabled"></el-input>
      </el-form-item>
      <el-form-item>
        <slot></slot>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "From",
  data() {
    return {
      ruleForm: {},
      rules: {}
    }
  },
  watch: {
    formData: {
      handler(fmdata) {
        if (!fmdata) return
        let data = JSON.parse(JSON.stringify(fmdata))
        for (const dataKey in data) {

          this.rules[dataKey] = [
            {required: true, message: `请输入${data[dataKey].label}`, trigger: 'blur'},
            {
              min: data[dataKey].rules.min,
              max: data[dataKey].rules.max,
              message: `长度在 ${data[dataKey].rules.min} 到 ${data[dataKey].rules.max} 个字符`,
              trigger: 'blur'
            }
          ]
        }
        console.log(this.ruleForm)
        console.log(this.rules)
      },
      deep: true,
      immediate: true
    },
    value: {
      handler(value) {
        for (const valueKey in value) {
          this.$set(this.ruleForm, valueKey, value[valueKey])

        }
        this.$emit('input', value)
      },
      deep: true
    }
  },
  props: {
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          this.$emit('fromSubmit', this.ruleForm)
        } else {
          console.log('error submit!!');

          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>

</style>