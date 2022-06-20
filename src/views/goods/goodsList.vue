<template>
  <div>
    <Search
        v-model="queryModel.query"
        title="添加商品"
        @click="$refs.dialog.show();clearModel()"
        @search="getData();queryModel.pagenum=1"
    ></Search>
    <Table v-model="queryModel" :cols="cols" :data="goods" :total="total" @change="getData()">
      <template v-slot:time="{row:{add_time}}">
        {{ new Date(add_time * 1000).format() }}
      </template>
      <template v-slot:action="{row}">
        <el-button icon="el-icon-edit" size="mini" type="primary" @click="edit(row)"></el-button>
        <el-button icon="el-icon-delete" size="mini" type="danger" @click="del(row)"></el-button>
      </template>
    </Table>
    <Dialog ref="dialog" :title="isAdd+'商品'" @confirm="$refs.from.submitForm('ruleForm')">
      <From ref="from" v-model="model" :formData="formData" @fromSubmit="addrole">
        <el-upload
            v-if="isAdd==='添加'"
            :file-list="fileList"
            :headers="{'Authorization':$store.getters.getToken}"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            action="http://shiyansong.cn:8888/api/private/v1/upload"
            class="upload-demo"
            list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </From>
    </Dialog>
  </div>
</template>

<script>
import {addGoods, delGoods, editGoods, getGoodsList} from '@/api/api'
import {Message} from "element-ui";

const formData = {
  goods_name: {
    label: "商品名称",
    prop: "goods_name",
    disabled: false,
    rules: {
      max: 20,
      min: 3
    }
  },
  goods_price: {
    label: "商品价格",
    prop: "goods_price",
    disabled: false,
    rules: {
      max: 10,
      min: 3
    }
  },
  goods_number: {
    label: "商品数量",
    prop: "goods_number",
    disabled: false,
    rules: {
      max: 10,
      min: 3
    }
  },
  goods_weight: {
    label: "商品重量",
    prop: "goods_weight",
    disabled: false,
    rules: {
      max: 10,
      min: 3
    }
  }
}

const cols = [
  {
    label: "#",
    type: 'index'
  },
  {
    label: '商品名称',
    prop: 'goods_name',
    width: '600'
  },
  {
    label: '商品价格(元)',
    prop: 'goods_price',
    width: '80'
  },
  {
    label: '商品重量',
    prop: 'goods_weight',
    width: '80'
  },
  {
    label: '创建时间',
    slot: 'time',
    width: '200'
  }, {
    label: '操作',
    slot: 'action'
  },

]
export default {
  name: "goodsList",
  data() {
    return {
      formData,
      fileList: [],
      cols,
      queryModel: {
        query: '',
        pagenum: 1,
        pagesize: 10
      }
      ,
      total: 0,
      goods: [],
      model: {
        goods_name: '',
        goods_cat: '1',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '这是一件商品'
      }
    }
  },
  created() {
    this.getData()
  },
  computed: {
    isAdd() {
      return this.model.goods_id ? '编辑' : "添加"
    }
  },
  methods: {
    clearModel() {
      this.model = {
        goods_name: '',
        goods_cat: '1',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '这是一件商品'
      }
    },
    async edit(row) {
      try {
        this.model = {...row}
        this.$refs.dialog.show()
      } catch (error) {

      }
    },
    async del(row) {
      let close;
      try {
        console.log(row)
        close = await this.$confirm('您确定要删除该条商品吗？')
        await delGoods(row.goods_id)
        Message.success('删除成功！')
        this.getData()
      } catch (error) {

      }
      close()
    },
    async addrole(val) {
      try {
        this.$refs.dialog.start()
        let newgoods = {...this.model, ...val}

        await (this.model.goods_id ? editGoods : addGoods)(newgoods)
        this.$refs.dialog.hide()
        Message.success(this.isAdd + '成功！')
        await this.getData()
      } catch (error) {

      }
      this.$refs.dialog.done()
      this.clearModel()
    },
    async getData() {
      try {
        const {total, goods} = await getGoodsList(this.queryModel)
        console.log(goods)
        this.total = total
        this.goods = goods
      } catch (error) {

      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    }
  },
}
</script>

<style scoped>

</style>