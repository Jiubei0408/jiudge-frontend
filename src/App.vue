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
:root {
  --success: #21BA45;
  --success-background: #E0FFE4;
  --primary: #409EFF;
  --primary-background: #E7F3FF;
  --dangerous: #F56C6C;
  --dangerous-background: #fdd5d5;
  --info: #909399;
  --info-background: #f5f5f5;
  --middle-box-width: 1200px;
}

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
  min-width: var(--middle-box-width);
  background-color: #edf0f2;
}

#appBox {
  width: var(--middle-box-width);
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

.clearfix:after {
  content: "";
  display: block;
  clear: both;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  border-radius: 6px;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background-color: transparent;
}

:hover::-webkit-scrollbar-thumb {
  background-color: #9093994d;
}

:hover::-webkit-scrollbar-thumb:hover {
  background-color: #90939980;
}
</style>
