<template>
  <base-box-frame>
    <template slot="title">Contests</template>
    <el-table :data="tableData">
      <el-table-column label="比赛名">
        <el-link slot-scope="scope" :underline="false" @click="$router.push(`/contest/${scope.row.id}`)">
          {{ scope.row.contest_name }}
        </el-link>
      </el-table-column>
      <el-table-column label="开始时间" prop="start_time"/>
      <el-table-column label="结束时间">
        <template slot-scope="scope">
          {{ scope.row.end_time === null ? '永久' : scope.row.end_time }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-show="user.username !== '' && !scope.row.registered && scope.row.state !== ContestState.ENDED"
                     size="mini" type="primary" @click="register(scope.row.id)">注册
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </base-box-frame>
</template>

<script>
import BaseBoxFrame from "@/components/globals/base-box-frame";

export default {
  name: "contests",
  components: {BaseBoxFrame},
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    refreshData() {
      this.$http.get(this.api + '/contests')
          .then(resp => {
            this.tableData = resp.data.contests
            this.$forceUpdate()
          })
    },
    register(cid) {
      this.$http.post(this.api + `/contest/${cid}/register`)
          .then(resp => {
            if (resp.status === 200) this.$message.success(resp.data.msg)
            else this.$message.error(resp.data.msg)
            this.refreshData()
          })
          .catch(err => {
            this.$message.error(err.response.data.msg)
          })
    }
  },
  created() {
    this.refreshData()
  }
}
</script>

<style scoped>

</style>
