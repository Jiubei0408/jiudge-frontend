<template>
  <base-box-frame>
    <template slot="title">
      <div class="clearfix">
        <span style="float: left">比赛榜单</span>
        <el-popconfirm style="float: right" v-if="user.permission === UserPermission.ADMIN" title="确认删除榜单缓存？"
                       @confirm="deleteCache">
          <el-button slot="reference" size="medium" type="danger" icon="el-icon-delete">
            删除缓存
          </el-button>
        </el-popconfirm>
      </div>
    </template>
    <el-table v-loading="loading" :data="tableData" border
              max-height="600px"
              cell-class-name="scoreboard-cell" header-cell-class-name="scoreboard-header-cell">
      <el-table-column label="#" prop="rank" width="60px" fixed>
        <template v-slot="scope" >
        {{ scope.row.register_type === ContestRegisterType.Starred ? '*' : scope.row.rank }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="user.nickname" width="150px" fixed/>
      <el-table-column label="通过" prop="solved" width="60px" fixed/>
      <el-table-column label="罚时" prop="penalty" width="70px" fixed/>
      <el-table-column :label="problem.problem_id" :prop="problem.problem_id"
                       v-for="problem in problems"
                       :key="problem.problem_id"
                       width="60px">
        <div :class="getCellClass(scope)" slot-scope="scope" v-if="isSubmitted(scope)">
          <span class="tried-cnt" :class="getTriedCntClass(scope)">{{ getTriedCntStr(scope) }}</span>
          <span class="solve-time" v-if="isSolved(scope)">{{ getSolveTimeStr(scope) }}</span>
        </div>
      </el-table-column>
    </el-table>
    <template slot="notes">
      <i v-if="update_time !== ''">上次更新时间: {{ update_time }}</i>
    </template>
  </base-box-frame>
</template>

<script>
import BaseBoxFrame from "@/components/globals/base-box-frame";

export default {
  name: "scoreboard",
  inject: ['contest_id'],
  components: {BaseBoxFrame},
  data() {
    return {
      tableData: [],
      problems: [],
      update_time: '',
      loading: false
    }
  },
  methods: {
    deleteCache() {
      this.$http.delete(this.api + `/contest/${this.contest_id}/scoreboard`)
    },
    getCellData(scope) {
      return scope.row[scope.column.property]
    },
    getTriedCntClass(scope) {
      let cell = this.getCellData(scope)
      if (cell.solved) return 'accepted'
      if (cell.tried) return 'failed'
    },
    getCellClass(scope) {
      let cell = this.getCellData(scope)
      let cls = ['problem-cell']
      if (cell.first_blood) cls.push('first-blood')
      return cls
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
      this.$http.get(this.api + `/contest/${this.contest_id}/scoreboard`)
          .then(resp => {
            this.problems = resp.data.problems
            this.tableData = resp.data.scoreboard
            this.update_time = resp.data.update_time
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
  text-align: center;
}

/deep/ .scoreboard-cell {
  padding: 0;
  text-align: center;
}

/deep/ td.scoreboard-cell .cell {
  padding: 0;
  height: 60px;
  line-height: 60px;
}


/deep/ .scoreboard-cell .cell * {
  line-height: 1;
}

/deep/ .problem-cell {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  margin-top: 5px;
}

.first-blood {
  background-color: var(--success-background);
}

.accepted {
  color: var(--success)
}

.failed {
  color: red
}
</style>
