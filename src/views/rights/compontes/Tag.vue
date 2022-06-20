<template>
  <div>
    <component
        :is="hasChildren?'div':'el-tag'"
        v-for="item in children"
        :key="item.id"
        :class="hasChildren?'box':''"
        :style="{borderBottom:hasChildren?'0':'1px solid'}"
        :type="hasChildren?'':'warning'"
        closable
        @close="delTag(item)"
    >
      <template v-if="hasChildren">
        <div class="left">
          <el-tag closable @close="delTag(item)">{{ item.authName }}</el-tag>
          <span class="sj"></span>
        </div>
        <div class="right">
          <Tag v-if="item.children" :children="item.children" :roleId="roleId" v-on="$listeners"></Tag>
        </div>
      </template>
      <template v-else>
        {{ item.authName }}
      </template>
    </component>

  </div>
</template>

<script>
import {delTags} from '@/api/api'
import {Message} from "element-ui";

export default {
  props: {
    children: {
      type: Array,
      defaults: () => []
    },
    roleId: {
      required: true,
      type: Number
    }
  },
  name: "Tag",
  methods: {
    async delTag(item) {
      let close;
      try {
        close = await this.$confirm('您确定要删除  [' + item.authName + ']  吗？')
        await delTags(this.roleId, item.id)
        Message.success('删除成功！')
        this.$emit('update')
      } catch (error) {

      }
      close()
    }
  },
  computed: {
    hasChildren() {
      if (!this.children.length) {
        return false
      }
      return !!this.children[0].children
    }

  }

}
</script>

<style lang="scss" scoped>
.sj {
  display: inline-block;
  width: 0px;
  height: 0px;
  border: 5px solid transparent;
  border-left-color: #606266;
 
}

.el-tag {
  border: 1px solid #ecf5ff !important;
  margin: 10px;
}

.box {
  box-sizing: border-box;
  border-top: 1px solid #ddd;

  display: flex;
  align-items: center;


  .left {
    padding: 10px 50px;

    box-sizing: border-box;

  }

  .right {
    flex: 1;
    box-sizing: border-box;

    .box {
      &:first-child {
        border: 0;

        .left {

          .el-tag {
            background-color: #f0f9eb;
            border-color: #e1f3d8;
            color: #67c23a;
          }
        }
      }
    }


  }
}


</style>