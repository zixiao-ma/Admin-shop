<template>
  <div>
    <Search
        v-model="queryModel.query"
        :loading="loading"
        @click="dialogVisible=true"
        @search="getData();queryModel.pagenum=1"
    ></Search>

    <div class="bottom">

      <Table v-model="queryModel" :cols="cols" :data="list" :total="total" @change="getData()">
        <!--        状态-->
        <template v-slot:state="{row}">
          <el-switch v-model="row.mg_state" @change="changeStatus(row.id,row.mg_state)"></el-switch>
        </template>
        <!--        操作-->
        <template v-slot:action="{row}">
          <el-button class="el-icon-edit" size="mini" type="primary"
                     @click="ruleForm ={...row};dialogVisible=true"
          ></el-button>
          <el-button class="el-icon-delete" size="mini" type="danger"
                     @click="del(row)"
          >
          </el-button>
          <el-tooltip class="item" content="分配角色" effect="dark" placement="top">
            <el-button class="el-icon-setting" size="mini" type="warning"
                       @click="ruleForm ={...row};getRoles();rolesdialogVisible=true;"
            ></el-button>
          </el-tooltip>
        </template>
      </Table>

    </div>

    <div class="other">
      <el-dialog
          :close-on-click-modal="false"
          :title="(isAdd?'添加':'编辑')+'用户'"
          :visible.sync="dialogVisible"
          width="50%"
          @close="closeDialog()"
      >
        <span>
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm" label-width="100px">
           <el-form-item label="用户名:" prop="username">
               <el-input v-model="ruleForm.username" :disabled="!isAdd"></el-input>
            </el-form-item>
             <el-form-item v-if="isAdd" label="密码:" prop="password">
               <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>
             <el-form-item label="邮箱:" prop="email">
               <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
             <el-form-item label="手机号:" prop="mobile">
               <el-input v-model="ruleForm.mobile"></el-input>
            </el-form-item>
          </el-form>


        </span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button :loading="dialogLoading" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
  </span>
      </el-dialog>
      <el-dialog

          :visible.sync="rolesdialogVisible"
          title="分配角色"
          width="50%">
        <div>
          <p>当前的用户：{{ ruleForm.username }}</p>
          <p>当前的角色：{{ ruleForm.role_name }}</p>
          <p>分配新角色：
            <el-select v-model="selectValue" placeholder="请选择">
              <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.roleName">
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="rolesdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitRoles()">确 定</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {addUser, deleteUser, editUser, editUserRoles, getUserData, getUserRoles, switchUser} from '@/api/api'
import {Message} from "element-ui";
import Search from "@/components/Search";

const cols = [
  {
    label: "#",
    type: 'index',
    width: '50'
  },
  {
    label: "姓名",
    width: '180',
    prop: 'username'
  },
  {
    label: "邮箱",
    prop: 'email'
  },
  {
    label: "电话",
    prop: 'mobile'
  },
  {
    label: "角色",
    prop: 'role_name'
  }, {
    label: '状态',
    slot: 'state'
  }, {
    label: '操作',
    slot: 'action'
  }
]
export default {
  name: "users",
  components: {Search},
  data() {

    return {
      cols,
      dialogLoading: false,
      dialogVisible: false,
      rolesdialogVisible: false,
      //搜索loading
      loading: false,
      //表格数据
      list: [],
      //请求列表参数
      queryModel: {
        query: '',
        pagesize: 10,
        pagenum: 1
      },
      //总数
      total: 0,
      //用户权限
      roles: [],
      //用户权限选择
      selectValue: "",
      //添加验证
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'},

          {min: 1, message: '长度在 1 到 10 个字符', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}],
        email: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('请输入正确的邮箱'));
              }
              let reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
              if (reg.test(value)) {
                callback()
              } else {
                callback(new Error('邮箱格式不正确'))
              }
            }, trigger: 'blur'
          },
          {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}],
        mobile: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!value) {
              return callback(new Error('请输入正确的手机号'));
            }
            let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
            if (reg.test(value)) {
              callback()
            } else {
              callback(new Error('手机号格式不正确'))
            }
          }, trigger: 'blur'
        },
          {min: 5, max: 11, message: '长度在 6 到 18 个字符', trigger: 'blur'}]
      },

    }

  },
  computed: {
    isAdd() {
      return this.ruleForm.id ? false : true
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async submitRoles() {
      try {
        const res = await editUserRoles(this.ruleForm.id, {
          rid: this.selectValue
        })
        Message.success('设置角色成功！')
        this.rolesdialogVisible = false
        this.getData()
      } catch (error) {

      }
    },
    /**
     * 获取分配权限信息
     * @return {Promise<void>}
     */
    async getRoles() {
      const res = await getUserRoles()
      this.roles = res
    },
    /**
     *
     * @param row  删除按钮
     * @return {Promise<void>}
     */
    async del(row) {
      let close;
      try {
        close = await this.$confirm(`此操作将永久删除"${row.username}", 是否继续?`)
        await deleteUser(row.id)
        Message.success('删除成功！')
        await this.getData()
      } catch (error) {

      }
      close()
    },
    /**
     * 关闭模态框时候重置表单和数据
     */
    closeDialog() {
      this.ruleForm = {
        username: "",
        password: "",
        email: "",
        mobile: ""
      }
      this.$refs.ruleForm.resetFields()
    },
    /**
     *
     * @param formName 添加用户
     */
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.dialogLoading = true
            await (this.isAdd ? addUser : editUser)(this.ruleForm)
            Message.success(this.isAdd ? '添加成功！' : '修改成功')
            this.dialogVisible = false
            this.getData()
          } catch (error) {
          }
          this.dialogLoading = false
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    /**
     * 修改用户状态
     * @param id
     * @param bool
     * @return {Promise<void>}
     */
    async changeStatus(id, bool) {
      try {
        await switchUser(id, bool)
        Message.success('更新状态成功！')
      } catch (error) {

      }
    },
    async getData() {
      try {
        this.loading = true
        const res = await getUserData(this.queryModel)
        this.total = res.total
        this.list = res.users
        this.loading = false
      } catch (error) {

      }
    }
  },
}
</script>

<style scoped>

.bottom {
  margin: 10px 0;
}


.other .el-input {
  width: 90%;
}

</style>