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
  provide() {
    return {
      contest_id: this.contest_id,
      getContest: () => this.contest
    }
  },
  computed: {
    contest_id() {
      return this.$route.params.cid
    },
  },
  data() {
    return {
      contest: {}
    }
  },
  methods: {
    refereshData() {
      this.$http.get(this.api + `/contest/${this.contest_id}`)
          .then(resp => {
            this.contest = resp.data.data
          })
          .catch(err => {
            this.$message.error(err.response.data.msg)
          })
    }
  },
  created() {
    this.refereshData()
  }
}
</script>

<style scoped>

</style>
