<template>
  <div class="wrapper">

    <div class="box">
      <div class="img_box">
        <img alt="" src="../../assets/logo.png"/>
      </div>
      <div class="from">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm" label-width="100px">
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock"
                      type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">登录</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {getMenus, login} from '@/api/api'
import {Message} from "element-ui";

export default {
  data() {
    return {
      loading: false,
      /**
       * 表单数据
       */
      ruleForm: {
        username: 'admin',
        password: "123456"
      },
      /**
       * 表单验证规则
       */
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    /**
     * 提交按钮
     */
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            const res = await login(this.ruleForm)
            Message.success('登录成功')
            this.$store.commit('setUserInfo', res)
            const menus = await getMenus()
            await this.$store.commit('saveMenus', menus)
            console.log(menus)
            await this.$router.push({name: 'HomeLayout'})
          } catch (error) {
            console.log(error)
       
          }
          this.loading = false
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    /**
     * 重置按钮
     */
    resetForm(formName) {
      this.ruleForm = {
        username: '',
        password: '',
      }
      this.$refs[formName].resetFields();
    }
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  text-align: center;
}

.wrapper {
  background-color: #2b4b6b;
  height: 100%;
  position: relative;

  .from {
    position: absolute;
    top: 33%;
    left: -10%;
  }

  .el-input {
    width: 350px;

  }

  .box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .img_box {
      width: 152px;
      height: 152px;
      border: 10px solid #fff;
      border-radius: 50%;
      position: absolute;
      box-sizing: border-box;
      top: -76px;
      left: 50%;
      transform: translateX(-50%);
      overflow: hidden;
      box-shadow: 0px 0px 10px #ddd;
      background-color: #ddd;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 130px;
        height: 130px;

      }
    }
  }

}
</style>
