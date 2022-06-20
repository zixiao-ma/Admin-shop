<template>
  <div>
    <!-- 面包屑导航区域 -->

    <!-- 卡片视图 -->

    <el-row>
      <el-col>
        <el-button type="primary" @click="showAddCateDialogVisible()"
          >添加分类</el-button
        >
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table
      class="treeTable"
      :data="cateList"
      style="width: 100%; margin-bottom: 20px"
      row-key="cat_id"
      border
      :default-expand-all="false"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column type="index" label="#" sortable width="50">
      </el-table-column>
      <el-table-column prop="cat_name" label="分类名称"> </el-table-column>
      <el-table-column label="是否有效" width="100">
        <template v-slot="{ row }">
          <i
            class="el-icon-success"
            v-if="row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="100">
        <template v-slot="{ row }">
          <el-tag
            type="primary"
            size="mini"
            v-if="row.cat_level === 0"
            effect="light"
          >
            一级
          </el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="row.cat_level === 1"
            effect="light"
          >
            二级
          </el-tag>
          <el-tag type="warning" size="mini" v-else effect="light">
            三级
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="getTheEditList(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDialog(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 对话框显示区域 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addcateRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="selectedParentId">
          <!-- options指定数据源 -->
          <!-- props指定配置对象 -->
          <el-cascader
            :options="parentCardList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="handleChangle"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框显示区域 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        ref="editFormRef"
        :model="editCateList"
        label-width="80px"
        :rules="addcateRules"
      >
        <el-form-item label="分类名称" prop="editCat_name">
          <el-input v-model="editCateList.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCartSummit(editCateList)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  api_editCartSummit,
  api_getCardList,
  api_getPrCardList,
  api_addCate,
  api_editcateList,
  del_categories,
} from '@/api/api';
import { Message } from 'element-ui';
export default {
  data() {
    return {
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      // 添加分类的验证规则
      addcateRules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' },
        ],
      },
      queryInfo: {
        // 默认全部显示
        // type=1 --> 只展示一级分类
        // type=2 --> 只展示一二级分类
        // type=2 --> 全部展示
        type: 3,
        // 当前是第几页
        pagenum: 1,
        // 当前每页显示的数量
        pagesize: 4,
      },
      // 获取的分类列表
      cateList: [
        {
          cat_id: '',
          cat_name: '',
          cat_pid: '',
          cat_level: '',
          cat_deleted: '',
        },
      ],
      // 总条数据
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      removeDialogVisible: false,
      // 父级分类列表
      parentCardList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true,
        // expand-trigger="hover"
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 根据id查询到的分类列表
      editCateList: {
        cat_id: '',
        cat_name: '',
        cat_pid: '',
        cat_level: '',
      },
    };
  },
  created() {
    this.getCardList();
  },
  methods: {
    // 获取所有分类列表
    async getCardList() {
      const res = await api_getCardList(this.queryInfo);
      this.cateList = res.result;
      this.total = res.total;
    },

    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCardList();
    },

    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCardList();
    },
    showAddCateDialogVisible() {
      this.getParentCardList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类列表
    async getParentCardList() {
      const res = await api_getPrCardList();
      this.parentCardList = res;
    },
    // 选择项发生变化时触发这个函数
    handleChangle() {
      // console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的length大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级节点的id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 为当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCateForm.cat_pid = 0;
        // 为当前分类等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    // 点击按钮添加分类
    addCate() {
      // console.log(this.addcateFrom)
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;

        await api_addCate(this.addCateForm);
        Message.success('添加成功!');
        this.addCateDialogVisible = false;
        this.getCardList();
      });
    },
    addDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    // 展示编辑分类对话框
    showEditDialog() {
      this.editCateDialogVisible = true;
    },
    async getTheEditList(cate) {
      const res = await api_editcateList(cate.cat_id);
      this.editCateList = res;
      this.editCateDialogVisible = true;
    },
    // 编辑完成时重置表单并移除验证效果
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },

    async editCartSummit(list) {
      await api_editCartSummit(list.cat_id, list.cat_name);
      Message.success('更新数据成功');
      this.editCateDialogVisible = false;
      this.getCardList();
    },
    async removeDialog(cart) {
      let close;
      try {
        close = await this.$confirm('确定要删除吗？');
        await del_categories(cart.cat_id);
        Message.success('删除分类成功');
        this.getCardList();
      } catch (error) {}
      close();
    },
  },
};
</script>
<style scoped>
.treeTable {
  margin-top: 15px;
}

el-cascader {
  width: 100%;
}
</style>
