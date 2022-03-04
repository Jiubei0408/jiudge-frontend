<template>
  <base-box-frame>
    <template v-slot:title>题目列表</template>
    <el-table :data="tableData" v-loading="loading" :row-class-name="getRowClass">
      <el-table-column label="=" width="40px">
        <template slot-scope="scope">
          <div class="problem-status">
            <i style="color: var(--success)" class="el-icon-check" v-if="scope.row.solved"/>
            <i style="color: var(--dangerous)" class="el-icon-close" v-else-if="scope.row.tried"/>
            <i style="color: var(--info)" class="el-icon-minus" v-else/>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="题号" prop="problem_id" width="80px"/>
      <el-table-column label="题目名称">
        <template v-slot="scope">
          <el-link :underline="false" @click="$router.push(`/contest/${contest_id}/problem/${scope.row.problem_id}`)">
            {{ scope.row.problem_name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="限制" width="120px">
        <template slot-scope="scope">
          {{ scope.row.time_limit }}s, {{ Math.floor(scope.row.space_limit / 1024) }}MB
        </template>
      </el-table-column>
      <el-table-column label="通过率">
        <template slot-scope="scope">
          {{ (scope.row.tried_cnt === 0 ? 0 : scope.row.solve_cnt / scope.row.tried_cnt * 100).toFixed(2) }}%
          ({{ scope.row.solve_cnt }}/{{ scope.row.tried_cnt }})
        </template>
      </el-table-column>
    </el-table>
  </base-box-frame>
</template>

<script>
import BaseBoxFrame from "@/components/globals/base-box-frame";

export default {
  name: "problem-list",
  inject: ['getContest', 'contest_id'],
  components: {BaseBoxFrame},
  computed: {
    contest() {
      return this.getContest()
    }
  },
  data() {
    return {
      tableData: [],
      loading: false,
      submittingProblem: false
    }
  },
  methods: {
    getRowClass({row}) {
      if (row.solved) return 'solved'
      else if (row.tried) return 'tried'
      else return ''
    },
    openSubmit(problem) {
      this.submitForm = {
        id: problem.problem_id,
        code: '',
        lang: ''
      }
      this.submitForm.allowed_lang = problem.allowed_lang
    },
    cancelSubmit() {
      this.submitForm.id = -1
      this.submittingProblem = false
    },
    refreshData() {
      this.loading = true
      this.$http.get(this.api + `/contest/${this.contest_id}/problems`)
          .then(resp => {
            this.tableData = resp.data.data
            this.loading = false
          })
          .catch(error => {
            this.$message.error(error.response.data.msg)
          })
    }
  },
  created() {
    this.refreshData()
  }
}
</script>

<style scoped>
.problem-status {
  font-weight: bolder;
  font-size: 16px;
}

/deep/ .solved {
  background: linear-gradient(to right, var(--success-background) 5%, transparent 15%);
}

/deep/ .tried {
  background: linear-gradient(to right, var(--dangerous-background) 5%, transparent 15%);
}
</style>
