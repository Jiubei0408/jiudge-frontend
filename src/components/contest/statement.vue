<template>
  <base-box-frame>
    <template v-if="problem !== null">
      <p class="title">{{ problem.problem_name }}</p>
      <p class="sub-title">时间限制: {{ problem.time_limit * 1000 }}ms</p>
      <p class="sub-title">空间限制: {{ problem.space_limit }}KB</p>
      <el-divider/>
      <template v-if="problem.problem_text">
        <latex-viewer :text="problem.problem_text" :inline-math="inlineMath" :display-math="displayMath"/>
      </template>
      <template v-if="problem.has_problem_text_file">
        <div style="text-align: center">
          <el-button icon="el-icon-download" type="primary" @click="openStatementFile">
            查看题面文件
          </el-button>
        </div>
      </template>
    </template>
    <template v-else>
      <div v-loading="true" style="height: 200px"></div>
    </template>
  </base-box-frame>
</template>

<script>
import LatexViewer from "@/components/globals/latex-viewer";
import BaseBoxFrame from "@/components/globals/base-box-frame";

export default {
  name: "statement",
  components: {BaseBoxFrame, LatexViewer},
  inject: ['contest_id'],
  data() {
    return {
      problem: null
    }
  },
  computed: {
    problem_id() {
      return this.$route.params.pid
    },
    inlineMath() {
      if (this.problem == null) return []
      let oj_name = this.problem.oj.name
      if (oj_name === 'hdu') return [['$', '$']]
      else if (oj_name === 'codeforces') return [['$$$', '$$$']]
      return []
    },
    displayMath() {
      if (this.problem == null) return []
      let oj_name = this.problem.oj.name
      if (oj_name === 'hdu') return [['$$$', '$$$']]
      else if (oj_name === 'codeforces') return [['$$$$$$', '$$$$$$']]
      return []
    }
  },
  methods: {
    getProblem() {
      this.problem = null
      this.$http.get(this.api + `/contest/${this.contest_id}/problem_statement/${this.problem_id}`)
          .then(resp => {
            this.problem = resp.data.data
          })
          .catch(err => {
            this.$message.error(err.response.data.msg)
          })
    },
    openStatementFile() {
      window.open(this.api + `/contest/${this.contest_id}/problem_text_file/${this.problem_id}`)
    },
  },
  created() {
    this.getProblem()
  },
  watch: {
    $route() {
      this.getProblem()
    }
  }
}
</script>
<style scoped>
.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 20px 0;
}

.sub-title {
  font-size: 16px;
  font-style: italic;
  font-weight: bold;
}
</style>
