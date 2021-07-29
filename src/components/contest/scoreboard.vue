<template>
  <base-box-frame>
    <template slot="title">比赛榜单</template>
    <el-table v-loading="loading" :data="tableData" border
              max-height="600px"
              cell-class-name="scoreboard-cell" header-cell-class-name="scoreboard-header-cell">
      <el-table-column label="#" width="60px" fixed>
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="学号" prop="user.username" width="100px" fixed/>
      <el-table-column label="姓名" prop="user.nickname" width="80px" fixed/>
      <el-table-column label="通过" prop="solved" width="60px" fixed/>
      <el-table-column label="罚时" prop="penalty" width="70px" fixed/>
      <el-table-column :label="problem.problem_id" :prop="problem.problem_id"
                       v-for="problem in problems"
                       :key="problem.problem_id"
                       width="60px">
        <template slot-scope="scope" v-if="isSubmitted(scope)">
          <span class="tried-cnt" :class="getTriedCntClass(scope)">{{ getTriedCntStr(scope) }}</span>
          <span class="solve-time" v-if="isSolved(scope)">{{ getSolveTimeStr(scope) }}</span>
        </template>
      </el-table-column>
      <el-table-column/>
    </el-table>
    <template slot="notes">
      jiubei太菜了没写爬榜单
      <br/>
      如果你想看到除了实验室人员之外的榜单，请
      <el-button
          style="font-size: 16px" type="text" @click="openRemoteScoreboard">
        查看原榜单
      </el-button>
    </template>
  </base-box-frame>
</template>

<script>
import BaseBoxFrame from "@/components/globals/base-box-frame";

export default {
  name: "scoreboard",
  components: {BaseBoxFrame},
  computed: {
    contest_id() {
      return this.$route.params.cid
    }
  },
  data() {
    return {
      tableData: [],
      problems: [],
      loading: false
    }
  },
  methods: {
    getCellData(scope) {
      return scope.row[scope.column.property]
    },
    getTriedCntClass(scope) {
      let cell = this.getCellData(scope)
      if (cell.solved) return 'accepted'
      if (cell.tried) return 'failed'
    },
    getTriedCntStr(scope) {
      let cell = this.getCellData(scope)
      let tried = cell.tried
      if (cell.solved) {
        return tried === 1 ? '+' : `+${tried - 1}`
      }
      return `-${tried}`
    },
    getSolveTimeStr(scope) {
      let cell = this.getCellData(scope)
      let hour = Math.floor(cell.solve_time / 60)
      let minute = cell.solve_time % 60
      hour = hour < 10 ? `0${hour}` : `${hour}`
      minute = minute < 10 ? `0${minute}` : `${minute}`
      return `${hour}:${minute}`
    },
    isSubmitted(scope) {
      return this.getCellData(scope).tried > 0
    },
    isSolved(scope) {
      return this.getCellData(scope).solved
    },
    refreshData() {
      this.loading = true
      this.$http.get(this.$store.state.api + `/contest/${this.contest_id}/scoreboard`)
          .then(resp => {
            this.problems = resp.data.problems
            this.tableData = resp.data.scoreboard
            this.loading = false
          })
          .catch(err => {
            this.$message.error(err.response.data.msg)
          })
    },
    openRemoteScoreboard() {
      window.open('http://acm.zju.edu.cn/domjudge/public')
    }
  },
  created() {
    this.refreshData()
  }
}
</script>

<style scoped>
/deep/ .scoreboard-header-cell {
  font-weight: normal;
  color: black;
}

/deep/ .scoreboard-header-cell, /deep/ .scoreboard-cell {
  text-align: center;
}

.tried-cnt {
  display: block;
  font-weight: bold;
  font-size: 16px;
}

.solve-time {
  display: block;
  font-size: 12px;
  color: grey;
}

.accepted {
  color: #21ba45
}

.failed {
  color: red
}
</style>
