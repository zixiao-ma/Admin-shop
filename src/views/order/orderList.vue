<template>


  <div class="main">
    <el-input
        v-model="keyword"
        class="input-with-select"
        clearable
        placeholder="请输入搜索内容"
        style="width: 400px"
        @clear="clearKey()"
    >
      <el-button
          slot="append"
          icon="el-icon-search"
          @click="search()"
      ></el-button>
    </el-input>
    <el-table :data="arr" border style="width: 100%; margin-top: 5px">
      <el-table-column label="#" type="index" width="50"></el-table-column>
      <el-table-column label="用户id" prop="user_id" width="70">
      </el-table-column>
      <el-table-column label="订单编号" prop="order_number" width="210">
      </el-table-column>
      <el-table-column label="价格" prop="order_price" width="70">
      </el-table-column>

      <el-table-column label="订单支付" width="90">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.order_pay == 0" type="danger"
          >未支付
          </el-tag
          >
          <el-tag v-show="scope.row.order_pay == 1" type="success"
          >支付宝
          </el-tag
          >
          <el-tag v-show="scope.row.order_pay == 2" type="success"
          >微信
          </el-tag
          >
          <el-tag v-show="scope.row.order_pay == 3" type="success"
          >银行卡
          </el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="是否付款" width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status == 1" type="success"
          >已付款
          </el-tag
          >
          <el-tag v-else type="danger">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send" width="80">
      </el-table-column>
      <el-table-column label="下单时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | formDate }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.update_time | formDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              class="el-icon-edit"
              size="mini"
              type="primary"
              @click="olderEdit(scope.$index, scope.row)"
          ></el-button>
          <el-button
              class="el-icon-truck"
              size="mini"
              type="success"
              @click="kuaidi(scope.$index, scope.row)"
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        :current-page="pagenum"
        :page-size="pagesize"
        :page-sizes="[1, 2, 3, 4]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    >
    </el-pagination>
    <el-dialog
        :title="isedit ? '订单修改' : '物流信息'"
        :visible.sync="dialogVisible"
        width="45%"
    >
        <span>
          <template v-if="isedit == false">
            <el-timeline>
              <el-timeline-item
                  v-for="(activity, index) in wuliu"
                  :key="index"
                  :timestamp="activity.ftime"
              >
                {{ activity.context }}
              </el-timeline-item>
            </el-timeline>
          </template>
          <template v-else>
            <div id="xg">
            <el-form
                ref="addressFormRef"
                :model="addressForm"
                :rules="addressFormRules"
                label-width="100px"
            >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
              v-model="addressForm.address1"
              :options="cityData"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>

            </div>
          </template>
        </span>
      <span v-if="isedit == true" slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>

</template>

<script>
import {api_getOrderList, api_kuaidi} from '@/api/api'
import cityData from './city'

export default {
  data() {
    return {
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            message: '请选择省市区/县',
            trigger: 'blur'
          }
        ],
        address2: [
          {
            required: true,
            message: '请选择详细地址',
            trigger: 'blur'
          }
        ]
      },
      cityData,
      arr: [],
      keyword: '',
      pagenum: 1,
      pagesize: 3,
      isedit: true,
      total: 0,
      dialogVisible: false,
      wuliu: [],
      editId: '',
      olderedit: {
        is_send: '',
        order_pay: '',
        order_price: 0,
        order_number: '',
        pay_status: '',
      },
      isSearch: false,
    };
  },
  created() {
    this.load();
  },
  methods: {
    async search() {
      this.isSearch = true;
      // 清空原数据列表数据
      this.arr = [];
      // 重新请求全部的列表数据
      const res = await api_getOrderList({
        pagenum: 1,
        pagesize: 100,
      })
      // 定义数组，可用使用数组filter,indexof方法，模糊查找符合条件的数据
      let arr = res.goods.filter((item) => {
        return item.order_number.indexOf(this.keyword) >= 0;
      });
      // 分页时数据只有一页
      if (arr.length <= this.pagesize) {
        this.arr = arr;
      } else {
        // 多页时可用使用数组的slice方法使用公式:从(pagenum-1)*pagesize开始，到pagenum*pagesize前结束
        this.arr = arr.slice(
            (this.pagenum - 1) * this.pagesize,
            this.pagenum * this.pagesize
        );
      }
      // 分页总条数
      this.total = arr.length;

    },
    async load() {
      try {
        const res = await api_getOrderList({
          query: this.keyword,
          pagenum: this.pagenum,
          pagesize: this.pagesize,

        })
        this.arr = res.goods;
        this.total = res.total;
      } catch (error) {

      }

    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      // data中定义isSearch变量为false，
      if (this.isSearch) {
        // 通过变量控制页面渲染搜索内容还是全部内容
        this.search();
      } else {
        this.load();
      }
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      if (this.isSearch) {
        this.search();
      } else {
        this.load();
      }
    },
    olderEdit(index, row) {
      this.isedit = true;
      this.dialogVisible = true;
      console.log(row);

    },
    async kuaidi(index, row) {
      this.isedit = false;
      this.dialogVisible = true;
      console.log(row);

      try {
        const res = await api_kuaidi(row.id)
        this.wuliu = res
      } catch (error) {

      }
    },

  },
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}

#box {
  background-color: #eaedf1;
}

#xg p {
  margin: 20px 0;
}

ul[type='disc'] li {
  margin: 10px 0;
  border-bottom: 1px dashed #ddd;
  font-size: 12px;
}

.main {
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.el-breadcrumb {
  margin-top: 5px;
  font-size: 12px !important;
}
</style>
