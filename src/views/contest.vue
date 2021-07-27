<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="18">
        <router-view/>
      </el-col>
      <el-col :span="6">
        <base-box-frame>
          <div class="contest-right-button" @click="$router.push(`/contest/${contest_id}/problems`)">
            <i class="el-icon-menu"/> 题目列表
          </div>
          <div class="contest-right-button" @click="$router.push(`/contest/${contest_id}/status`)">
            <i class="el-icon-upload"/> 我的提交
          </div>
          <div class="contest-right-button" @click="$router.push(`/contest/${contest_id}/scoreboard`)">
            <i class="el-icon-s-order"/> 榜单
          </div>
        </base-box-frame>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BaseBoxFrame from "@/components/globals/base-box-frame";

export default {
  name: "contest",
  components: {BaseBoxFrame},
  computed: {
    contest_id() {
      return this.$route.params.cid
    }
  },

}
</script>

<style scoped>
.contest-right-button {
  width: 100%;
  height: 42px;
  line-height: 42px;
  font-size: 16px;
  padding: 0 40px;
  color: black;
  transition: 0.5s;
  box-sizing: border-box;
}

.contest-right-button:hover {
  background: rgb(244, 244, 244);
  cursor: pointer;
  box-shadow: inset 30px 0 0 -20px rgb(24, 144, 255);
}

.contest-right-button > [class^=el-icon-]{
  margin-right: 10px;
  font-size: 16px;
}
</style>
