<template>
  <div class="page-nav">
    <el-menu :default-active="this.$route.path" class="middle-box"
             style="height:60px;width:1100px;z-index:1000"
             mode="horizontal" router>
      <el-menu-item index="/">Contests</el-menu-item>
      <div class="userBox">
        <template v-if="this.$store.state.user.username !== ''">
          <span style="margin-right: 15px">Welcome, {{ $store.state.user.nickname }}</span>
          <el-button icon="el-icon-user" @click="logout">Logout</el-button>
        </template>
        <template v-else>
          <el-button type="primary" icon="el-icon-user" @click="$router.push('/login')">Login</el-button>
        </template>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "page-nav",
  methods: {
    logout() {
      this.$store.commit('logout')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.page-nav {
  background-color: white;
}

.middle-box {
  position: relative;
  left: 50%;
  transform: translate(-50%);
}

.middle-box.el-menu {
  border-bottom: none;
}

.middle-box .el-menu-item, /deep/ .middle-box .el-submenu__title {
  font-size: 16px;
}

.userBox {
  position: relative;
  float: right;
  top: 50%;
  transform: translate(0, -50%);
  outline: none;
  font-size: 15px;
}
</style>
