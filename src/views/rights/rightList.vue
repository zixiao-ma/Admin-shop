<template>
  <div>
    <Table :cols="cols" :data="list">
      <template v-slot:level="{row}">

        <el-tag v-if="row.level==='0'">一级</el-tag>
        <el-tag v-if="row.level==='1'" type="warning">二级</el-tag>
        <el-tag v-if="row.level==='2'" type="success">三级</el-tag>
      </template>
    </Table>
  </div>
</template>

<script>
import {getRightList} from '@/api/api'

export default {
  name: "rolesList",
  data() {
    return {
      list: [],
      cols: [
        {
          label: '#',
          type: 'index'
        },
        {
          label: '权限名称',
          prop: 'authName'
        },
        {
          label: '路径',
          prop: 'path'
        },
        {
          label: '权限等级',
          slot: "level"
        }
      ]
    }
  },
  created() {
    this.getdata()
  },
  methods: {
    async getdata() {
      try {
        this.list = await getRightList()
      } catch (error) {

      }
    }
  }
}
</script>

<style scoped>

</style>