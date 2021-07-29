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
    <el-table :data="tableData" v-loading="loading">
      <el-table-column label="题号" prop="problem_id" width="100px"/>
      <el-table-column label="题目名称" prop="problem_name"/>
      <el-table-column label="限制" width="150px">
        <template slot-scope="scope">
          {{ scope.row.time_limit }}s / {{ scope.row.space_limit }}KB
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.has_problem_text_file"
                     size="mini" type="primary" @click="openPdf(scope.row.problem_id)">
            查看题面
          </el-button>
          <el-button size="mini" type="primary" @click="openSubmit(scope.row)">提交</el-button>
        </template>
      </el-table-column>
    </el-table>
  </base-box-frame>
</template>

<script>
import BaseBoxFrame from "@/components/globals/base-box-frame";

export default {
  name: "problem-list",
  inject: ['contest_id'],
  components: {BaseBoxFrame},
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
    openPdf(pid) {
      window.open(this.$store.state.api + `/contest/${this.contest_id}/problem_text_file/${pid}`)
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
      this.$http.post(this.$store.state.api + `/contest/${this.contest_id}/submit/${this.submitForm.id}`, {
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
      this.$http.get(this.$store.state.api + `/contest/${this.contest_id}/problems`)
          .then(resp => {
            this.tableData = resp.data.data
            this.loading = false
          })
          .catch(error => {
            this.$message.error(error.response.data.msg)
            this.$router.go(-1)
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
