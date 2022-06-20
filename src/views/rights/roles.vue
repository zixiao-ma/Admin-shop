<template>
  <div>
    <div class="top" style="margin-bottom: 15px">
      <el-button type="primary" @click="$refs.dialog.show();model={
        roleName: '',
      roleDesc: ''
      }">添加角色
      </el-button>
    </div>
    <div class="bottom">
      <Table :cols="cols" :data="list" :tree-props="'children1'">
        <!--        expand-->
        <template v-slot:expand="{row}">

          <Tag :children="row.children" :roleId="row.id" @update="getData()"></Tag>
        </template>
        <!--        操做-->
        <template v-slot:action="{row}">
          <el-button class="el-icon-edit" size="mini" type="primary" @click="edit(row)">编辑
          </el-button>
          <el-button class="el-icon-delete" size="mini" type="danger" @click="del(row)">删除
          </el-button>
          <el-tooltip class="item" content="分配角色" effect="dark" placement="top">
            <el-button class="el-icon-setting" size="mini" type="warning" @click="assign(row)">分配权限
            </el-button>
          </el-tooltip>
        </template>
      </Table>
    </div>
    <Dialog ref="dialog" @confirm="$refs.from.submitForm('ruleForm')">
      <From ref="from" v-model="model" :formData="formData" @fromSubmit="addrole"></From>
    </Dialog>
    <!--    分配权限-->
    <Dialog ref="assign" @confirm="assingRoles">
      <el-tree
          ref="tree"
          :data="treelist"
          :default-checked-keys="defaultTree"
          :props=" {
          children: 'children',
          label: 'authName'

        }"
          default-expand-all
          node-key="id"
          show-checkbox>
      </el-tree>
    </Dialog>
  </div>
</template>

<script>
import {Api_addrole, delRole, editRol, getRoleTree, getUserRoles, setRoleTree} from '@/api/api'
import Tag from './compontes/Tag'
import {Message} from "element-ui";
import DialogForm from "@/components/DialogForm";

const formData = {
  roleName: {
    label: "角色名称",
    prop: "roleName",
    disabled: false,
    rules: {
      max: 8,
      min: 3
    }
  },
  roleDesc: {
    label: "角色描述",
    prop: "roleDesc",
    disabled: false,
    rules: {
      max: 10,
      min: 2
    }
  }
}
const cols = [
  {
    label: '',
    type: 'expand',
    slot: 'expand'
  },
  {
    label: '#',
    type: 'index'
  },
  {
    label: '角色名称',
    prop: 'roleName'
  },
  {
    label: '角色描述',
    prop: 'roleDesc'
  }, {
    label: '操作',
    slot: "action"
  }
]
export default {
  name: "roles",
  components: {
    DialogForm,
    Tag
  },
  data() {
    return {
      model: {
        roleName: "",
        roleDesc: ""
      },
      list: [],
      cols, formData,
      treelist: [],
      defaultTree: []
    }
  },
  created() {
    this.getData()
  },
  computed: {
    isAdd() {
      return this.model.id ? '编辑' : "添加"
    }
  },
  methods: {
    async assingRoles() {

      try {
        const tree = this.$refs.tree
        const keys = [...tree.getCheckedKeys(), ...tree.getHalfCheckedKeys()]
        console.log(keys, 'keys')
        this.$refs.assign.start()
        await setRoleTree(this.model.id, keys.toString())
        this.$refs.assign.done()
        this.$refs.assign.hide()
        Message.success('分配成功')
        this.getData()
      } catch (error) {

      }
    },
    async assign(row) {
      this.defaultTree = []
      try {
        this.model = {...row}
        const res = await getRoleTree()
        console.log(res)
        this.treelist = res
        this.$refs.assign.show()
        console.log(row)
        const _that = this

        function checkedTree(children) {
          for (const child of children) {
            if (!child.children) {
              _that.defaultTree.push(child.id);
              continue;
            }
            if (child.children.length) {
              checkedTree(child.children)
            }
          }
        }

        checkedTree(row.children)

      } catch (error) {

      }
    },
    async del(row) {
      let close;
      try {
        close = await this.$confirm(`您确定要删除此项吗？`)
        await delRole(row.id)
        Message.success('删除成功！')
        this.getData()
      } catch (error) {

      }
      close()
    },
    edit(row) {
      console.log(row)
      this.model = {...row}
      this.$refs.dialog.show()
    },
    async addrole(data) {
      try {
        this.$refs.dialog.start()
        if (this.model.id) {
          data = {...data, id: this.model.id}
        }
        await (this.model.id ? editRol : Api_addrole)(data)
        this.$refs.dialog.hide()
        Message.success(this.isAdd + '成功！')
        this.getData()
      } catch (error) {

      }
      this.$refs.dialog.done()
    },
    async getData() {
      try {
        const res = await getUserRoles()
        console.log(res)
        this.list = res
      } catch (error) {

      }
    }
  }
}
</script>

<style scoped>
.left_row {
  margin: 0 !important;

  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
}


.el-tag {
  margin: 5px;
}

.right_one {
  border-bottom: 1px solid #ddd;

}

.right-tow .right_one:last-child {
  border: 0;

}
</style>