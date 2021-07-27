<template>
  <base-box-frame>
    <view-code-dialog ref="VCDialog"/>
    <p slot="title">提交列表</p>
    <el-table :data="tableData">
      <el-table-column label="#" prop="id" width="60px"/>
      <el-table-column label="用户" prop="user.username" width="100px"/>
      <el-table-column label="题目" prop="problem.problem_id" width="60px"/>
      <el-table-column label="结果" width="100px">
        <template slot-scope="scope">
          <p style="font-weight: bold" :style="{'color': getResultColor(scope.row)}">
            {{ scope.row.view_result }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="语言" prop="lang" width="80px"/>
      <el-table-column label="提交时间" prop="submit_time"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link style="margin-right: 20px" @click="viewcode(scope.row.code)" :underline="false">
            查看代码
          </el-link>
          <el-link @click="viewCompileInfo(scope.row.compile_info)" :underline="false">查看编译信息</el-link>
        </template>
      </el-table-column>
    </el-table>
  </base-box-frame>
</template>

<script>
import BaseBoxFrame from "@/components/globals/base-box-frame";
import ViewCodeDialog from "@/components/globals/view-code-dialog";

export default {
  name: "status",
  components: {ViewCodeDialog, BaseBoxFrame},
  computed: {
    contest_id() {
      return this.$route.params.cid
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    refreshData() {
      this.$http.get(this.$store.state.api + `/contest/${this.contest_id}/status`)
          .then(resp => {
            this.tableData = resp.data.submissions
          })
    },
    getResultColor(submission) {
      let result = submission.view_result
      if (result === 'AC') return '#21ba45'
      if (result === 'PENDING') return '#c7c7c7'
      if (result === 'UNKNOWN' || result === 'SpiderError') return 'black'
      return 'red'
    },
    viewcode(code) {
      this.$refs.VCDialog.view(code, '代码', true)
    },
    viewCompileInfo(info) {
      this.$refs.VCDialog.view(info, '编译信息：', false)
    }
  },
  created() {
    this.refreshData()
  }
}
</script>

<style scoped>

</style>
