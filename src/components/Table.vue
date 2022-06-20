<template>
  <div>
    <el-table
        :data="data"
        :tree-props="{children: treeProps}"
        border
        row-key="id"
        style="width: 100%">
      <el-table-column
          v-for="(item,index) in cols"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :type="item.type"
          :width="item.width">
        <template v-if="item.slot" v-slot="{row,$index,column}">
          <slot
              :column="column"
              :index="$index"
              :name="item.slot"
              :row="row"
          >
          </slot>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
        v-if="pages.pagesize"
        :current-page="pages.pagenum"
        :page-size="pages.pagesize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="val=>{changePage('pagesize',val)}"
        @current-change="val=>{changePage('pagenum',val)}">
    </el-pagination>
  </div>
</template>

<script>
/**
 * @module Table组件二次封装
 *
 *
 */
export default {
  name: "Table",
  methods: {
    /**
     * @param type 分页传递的类型
     * @param val 分页页码
     */
    changePage(type, val) {
      //浅拷贝对象，后置覆盖前值
      let obj = {...this.value, [type]: val}
      this.$emit('input', obj)
      this.$emit('change', obj)
    }
  },
  computed: {
    pages() {
      return this.value || {}
    }
  },
  props: {
    treeProps: {
      type: String,
      default: 'children'
    },
    data: {
      required: true,
      type: Array,
      default: () => []
    },
    cols: {
      required: true,
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      defaults: {}
    },
    total: Number
  }
}
</script>

<style scoped>

</style>