<template>
  <div id="app" ref="pageBox">
    <el-scrollbar class="scrollbar">
      <page-nav/>
      <div id="appBox">
        <div class="page-main-box" ref="pageMainBox">
          <router-view/>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>

import PageNav from "@/components/globals/page-nav";

export default {
  name: 'App',
  components: {PageNav},
  data() {
    return {
      clientHeight: window.innerHeight,
      clientWidth: window.innerWidth
    }
  },
  methods: {
    fixBox() {
      this.clientHeight = window.innerHeight
      this.clientWidth = window.innerWidth
      this.$refs.pageMainBox.style.minHeight = this.clientHeight - 60 + 'px'
      this.$refs.pageBox.style.height = this.clientHeight + 'px'
      this.$refs.pageBox.style.widows = this.clientWidth + 'px'
    }
  },
  mounted() {
    this.fixBox()
    const that = this
    window.onresize = () => {
      that.fixBox()
    }
  }
}
</script>
<style>
* {
  padding: 0;
  margin: 0;
  border: 0;
  text-decoration: none;
  list-style-type: none;
}

#app {
  font-family: "Helvetica Neue", Helvetica, "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  overflow: hidden;
  width: 100%;
  min-width: 1100px;
  background-color: #edf0f2;
}

#appBox {
  width: 1100px;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
}

.page-main-box {
  margin-top: 20px;
  margin-bottom: 20px;
  position: relative;
}

.scrollbar {
  height: 100%;
}

#app > .el-scrollbar .el-scrollbar__wrap {
  overflow: auto;
}

.el-button.el-button--text {
  padding: 0;
}
</style>
