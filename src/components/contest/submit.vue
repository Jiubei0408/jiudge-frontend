<template>
  <base-box-frame>
    <template v-slot:title>提交代码</template>
    <el-form label-width="60px" label-position="left">
      <el-form-item label="比赛名">
        {{ contest.contest_name }}
      </el-form-item>
      <el-form-item label="题号">
        <el-select v-model="submitForm.id" placeholder="请选择题号" :disabled="lockProblemID">
          <el-option v-for="problem in contest.problems" :key="problem.id"
                     :value="problem.problem_id"
                     :label="`${problem.problem_id}. ${problem.problem_name}`">
            <span style="float: left">{{ problem.problem_name }}</span>
            <span style="float: right; margin-left: 20px; color: #8492a6; font-size: 13px">
              {{ problem.problem_id }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="语言">
        <el-select v-model="submitForm.lang" placeholder="请选择语言" :disabled="problem === null">
          <template v-if="problem !== null">
            <el-option v-for="lang in problem.allowed_lang" :key="lang" :value="lang"
                       :label="lang"/>
          </template>
        </el-select>
      </el-form-item>
      <el-input type="textarea" style="width: 500px" v-model="submitForm.code"
                :autosize="{minRows:10, maxRows: 25}" placeholder="请输入代码..."/>
      <div style="margin-top: 20px">
        <el-button type="primary" size="medium" @click="submitProblem" :disabled="submittingProblem">
          提交
        </el-button>
      </div>
    </el-form>
  </base-box-frame>
</template>

<script>
import BaseBoxFrame from "@/components/globals/base-box-frame";

export default {
  name: "submit",
  inject: ['getContest'],
  components: {BaseBoxFrame},
  computed: {
    contest() {
      return this.getContest()
    }
  },
  data() {
    return {
      submitForm: {
        id: '',
        code: '',
        lang: ''
      },
      problem: null,
      lockProblemID: false,
      submittingProblem: false
    }
  },
  methods: {
    submitProblem() {
      if (this.submittingProblem) return;
      this.submittingProblem = true
      if (this.submitForm.id === '') {
        this.$message.error('请选择题目')
        this.submittingProblem = false
        return
      }
      if (this.submitForm.lang === '') {
        this.$message.error('请选择语言')
        this.submittingProblem = false
        return
      }
      if (this.submitForm.code === '') {
        this.$message.error('代码不能为空')
        this.submittingProblem = false
        return
      }
      this.$http.post(this.api + `/contest/${this.contest.id}/submit/${this.submitForm.id}`, {
        code: this.submitForm.code,
        lang: this.submitForm.lang
      }).then(resp => {
        this.$message.success(resp.data.msg)
        this.submittingProblem = false
        this.$router.push(`/contest/${this.contest.id}/status`)
      }).catch(error => {
        this.submittingProblem = false
        this.$message.error(error.response.data.msg)
      })
    },
    refreshProblem() {
      if (!this.contest.problems) return
      this.problem = null
      for (let problem of this.contest.problems) {
        if (problem.problem_id === this.submitForm.id) {
          this.problem = problem
          break
        }
      }
      if (this.problem === null || this.problem.allowed_lang.indexOf(this.submitForm.lang) === -1) {
        this.submitForm.lang = ""
      }
    }
  },
  created() {
    if (this.$route.params.pid) {
      this.lockProblemID = true
      this.submitForm.id = this.$route.params.pid
    }
  },
  watch: {
    'submitForm.id'() {
      this.refreshProblem()
    },
    'contest.problems'() {
      this.refreshProblem()
    }
  }
}
</script>

<style scoped>

</style>
