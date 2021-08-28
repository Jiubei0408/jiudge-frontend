<template>
  <base-box-frame>
    <el-dialog width="600px" :visible="submitForm.id !== -1"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="false"
               append-to-body>
      <div slot="title">
        提交题目： {{ submitForm.id }}
      </div>
      <el-form :model="submitForm">
        <el-form-item label="代码">
          <el-input :autosize="{minRows: 5, maxRows:15}" type="textarea" v-model="submitForm.code"/>
        </el-form-item>
        <el-form-item label="语言">
          <el-select v-model="submitForm.lang">
            <el-option :value="lang" v-for="lang of submitForm.allowed_lang" :key="lang">
              {{ lang }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelSubmit">Cancel</el-button>
        <el-button type="primary" @click="submitProblem">Submit</el-button>
      </div>
    </el-dialog>
    <template slot="title">题目列表</template>
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
      <el-table-column label="题目名称" prop="problem_name"/>
      <el-table-column label="限制" width="120px">
        <template slot-scope="scope">
          {{ scope.row.time_limit }}s, {{ Math.floor(scope.row.space_limit / 1024) }}MB
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.has_problem_text_file"
                     size="mini" type="primary" @click="openPdf(scope.row.problem_id)">
            查看题面
          </el-button>
          <el-button v-if="user.permission === UserPermission.ADMIN || contest.state !== ContestState.ENDED"
                     size="mini" type="primary" @click="openSubmit(scope.row)">提交
          </el-button>
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
      submitForm: {
        id: -1,
        code: '',
        lang: '',
        allowed_lang: []
      },
      loading: false
    }
  },
  methods: {
    getRowClass({row}) {
      if (row.solved) return 'solved'
      else if (row.tried) return 'tried'
      else return ''
    },
    openPdf(pid) {
      window.open(this.api + `/contest/${this.contest_id}/problem_text_file/${pid}`)
    },
    openSubmit(problem) {
      this.submitForm = {
        id: problem.problem_id,
        code: '',
        lang: ''
      }
      this.submitForm.allowed_lang = problem.allowed_lang
    },
    submitProblem() {
      if (this.submitForm.code === '') {
        this.$message.error('代码不能为空')
        return
      }
      if (this.submitForm.lang === '') {
        this.$message.error('请选择语言')
        return
      }
      this.$http.post(this.api + `/contest/${this.contest_id}/submit/${this.submitForm.id}`, {
        code: this.submitForm.code,
        lang: this.submitForm.lang
      }).then(resp => {
        this.$message.success(resp.data.msg)
        this.cancelSubmit()
        this.$router.push(`/contest/${this.contest_id}/status`)
      }).catch(error => {
        this.$message.error(error.response.data.msg)
        this.cancelSubmit()
      })
    },
    cancelSubmit() {
      this.submitForm.id = -1
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
