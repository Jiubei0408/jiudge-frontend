<template>
  <base-box-frame body-style="padding: 20px 0">
    <div ref="buttonList" class="button-list">
      <div data-route="problems" class="button" @click="$router.push(`/contest/${contest_id}/problems`)">
        <i class="el-icon-menu"/> 题目列表
      </div>
      <div data-route="status" class="button" @click="$router.push(`/contest/${contest_id}/status`)">
        <i class="el-icon-upload"/> 提交记录
      </div>
      <div data-route="scoreboard" class="button" @click="$router.push(`/contest/${contest_id}/scoreboard`)">
        <i class="el-icon-s-order"/> 比赛榜单
      </div>
    </div>
  </base-box-frame>
</template>

<script>
import BaseBoxFrame from "@/components/globals/base-box-frame";

export default {
  name: "contest-right-box",
  components: {BaseBoxFrame},
  computed: {
    contest_id() {
      return this.$route.params.cid
    }
  },
  methods: {
    refreshButtonActive() {
      for (let button of this.$refs['buttonList'].children) {
        button.classList.remove('active')
        if (button.dataset['route'] === this.$route.name) {
          button.classList.add('active')
        }
      }
    }
  },
  watch: {
    $route() {
      this.refreshButtonActive()
    }
  },
  mounted() {
    this.refreshButtonActive()
  }
}
</script>

<style scoped>
.button {
  width: 100%;
  height: 50px;
  line-height: 30px;
  font-size: 15px;
  padding: 10px 40px;
  color: black;
  transition: 0.5s;
  box-sizing: border-box;
}

.button:hover, .button-list:not(:hover) .button.active {
  background: #409EFF20;
  cursor: pointer;
  box-shadow: inset 8px 0 0 0 #409EFF;
  color: #409EFF;
}

.button > [class^=el-icon-] {
  margin-right: 10px;
  font-size: 16px;
}
</style>
