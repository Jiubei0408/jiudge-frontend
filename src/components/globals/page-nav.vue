<template>
  <div>
    <el-menu :default-active="this.$route.path" class="page-nav" style="height:60px;width:100%;z-index:1000"
             mode="horizontal" router>
      <el-menu-item index="/">Contests</el-menu-item>
      <div class="userBox">
        <template v-if="this.$store.state.user.username !== ''">
          <span style="margin-right: 15px">Welcome, {{$store.state.user.nickname}}</span>
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
.page-nav .el-menu-item, /deep/ .page-nav .el-submenu__title {
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
