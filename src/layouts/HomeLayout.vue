<template>
  <div class="layout">
    <el-container>
      <el-header>
        <div class="logo">
          <img alt="电商后台管理系统" src="http://shiyansong.cn/img/heima.b5a855ee.png">
          <p>电商后台管理系统</p>
        </div>

        <el-button type="info" @click="exit()">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse?'64px':'200px'">
          <div class="collapse" @click="isCollapse=!isCollapse">
            <span :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"></span>
          </div>
          <el-menu
              :collapse="isCollapse"
              :collapse-transition="false"
              :unique-opened="true"
              active-text-color="rgb(64, 158, 255)"
              background-color="#333744"
              class="el-menu-vertical-demo"
              router
              text-color="#fff"

              @close="handleClose"
              @open="handleOpen"
          >
            <el-submenu v-for="(item,index) in menus" :key="item.id" :index="index+''">
              <template slot="title">
                <i :class="icon(item)"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item v-for="child in item.children" :key="child.id" :index="child.path">
                <i class="el-icon-menu"></i>
                <span>{{ child.authName }}</span>
              </el-menu-item>

            </el-submenu>

          </el-menu>
        </el-aside>
        <el-main>
          <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ name: 'welcome' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="parentName">{{ parentName }}</el-breadcrumb-item>
              <el-breadcrumb-item v-if="parentName">{{ childName }}</el-breadcrumb-item>

            </el-breadcrumb>
          </div>
          <el-card shadow="hover">
            <router-view></router-view>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {Message, MessageBox} from "element-ui";
import {mapState} from "vuex";

export default {
  name: "HemeLayout",
  data() {
    return {
      //菜单收缩
      isCollapse: false,
      //菜单图标数据
      iconsObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-copy-document',
        '101': 'el-icon-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-marketing'
      },
      /**
       * 面包屑导航参数
       */
      parentName: '',
      childName: ''
    }
  },
  computed: {
    ...mapState(['menus'])
  },
  mounted() {
    this.getMenuName();
  },
  updated() {
    this.getMenuName()
  },
  methods: {
    getMenuName() {
      const path = this.$route.path.replace('/', '')

      if (path === 'welcome' || path === 'NotFound') {
        this.parentName = "";
        this.childName = "";
        return false;
      }
      for (const parent of this.menus) {
        for (const child of parent.children) {
          if (child.path === path) {
            this.parentName = parent.authName;
            this.childName = child.authName
            return
          }

        }
      }
    },
    /**
     * @function exit 退出登录
     */
    async exit() {
      try {
        await MessageBox.confirm('此操作将退出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        Message.success('退出成功！')
        await this.$store.dispatch('exit')
        await this.$router.push({name: 'login'})
      } catch (error) {

      }
    },
    /**
     *
     * @param key
     * @param keyPath 导航菜单的方法
     */
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    /**
     *
     * @param item
     * @return {*}設置圖標
     */
    icon(item) {
      for (let key in this.iconsObj) {
        if (item.id == key) {
          return this.iconsObj[key];
        }
      }
    }
  },
}
</script>

<style lang="scss" scoped>


.el-card {
  max-height: 96%;
  overflow: auto;
}

::-webkit-scrollbar {
  width: 7px;
  height: 7px;
  background-color: #f7f7f7;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px #cfcfd1;
  -webkit-box-shadow: inset 0 0 6px #cfcfd1;
  border-radius: 10px;
  background-color: #f7f7f7;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px #cfcfd1;
  -webkit-box-shadow: inset 0 0 6px #cfcfd1;
  background-color: #cfcfd1;
}


.collapse {
  padding-top: 5px;
  width: 100%;

  text-align: center;
}

.el-breadcrumb {
  font-size: 13px;

}

.breadcrumb {
  margin-bottom: 15px;
}

.layout {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;

  align-items: center;

  img {
    margin-right: 10px;
    height: 56px;
    vertical-align: middle;
  }

  p {
    font-size: 20px;
  }
}

.el-header, .el-footer {
  background-color: #373d41;
  color: #fff;
  padding: 0 10px 0 0;

}

.el-aside {
  background-color: #333744;
  color: #fff;
  padding: 0;
}

.el-main {
  background-color: #eaedf1;
  color: #333;
  padding: 0;
  overflow: auto;
  padding: 15px;
}

.el-container {
  height: 100%;
  overflow: hidden;
}

</style>