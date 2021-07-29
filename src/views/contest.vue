<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="18">
        <router-view/>
      </el-col>
      <el-col :span="6">
        <contest-right-box/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ContestRightBox from "@/components/contest/contest-right-box";

export default {
  name: "contest",
  components: {ContestRightBox},
  computed: {
    contest_id() {
      return this.$route.params.cid
    }
  },
  provide(){
    return {
      contest_id: this.contest_id
    }
  }
}
</script>

<style scoped>

</style>
