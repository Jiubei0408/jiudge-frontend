<template>
  <base-box-frame v-loading="loading">
    <template v-slot:title>题目编排</template>
    <div>
      <base-box-frame class="problem-list-item"
                      v-for="problem in problem_list"
                      :key="problem.id">
        <div><b>{{ problem.problem_id }}</b></div>
        <div class="problem-input">
          <el-select size="mini" class="problem-input-oj" v-model="problem.oj.id" disabled>
            <el-option :value="oj.id" :label="oj.name" v-for="oj in oj_list" :key="oj.id"/>
          </el-select>
          <el-input size="mini" class="problem-input-remote-id" v-model="problem.remote_problem_id" disabled/>
        </div>
        <div>
          <div style="display: inline-block; width: 500px">
            <template v-if="problem.problem_name"> {{ problem.problem_name }}</template>
            <template v-else><span style="color: var(--dangerous)">未知</span></template>
          </div>
        </div>
        <el-tooltip :content="getStatusTitle(problem.status)" placement="top">
          <i class="status-icon" :class="getStatusIcon(problem.status)"/>
        </el-tooltip>
        <el-tooltip content="爬取题面" placement="top">
          <i class="clickable-icon el-icon-refresh" @click="crawlProblem(problem.oj.id, problem.remote_problem_id)"/>
        </el-tooltip>
      </base-box-frame>
    </div>
    <base-box-frame class="problem-list-item" v-if="showAdd">
      <div><b>+</b></div>
      <div class="problem-input">
        <el-select size="mini" class="problem-input-oj" v-model="addForm.oj_id">
          <el-option :value="oj.id" :label="oj.name" v-for="oj in oj_list" :key="oj.id"/>
        </el-select>
        <el-input size="mini" class="problem-input-remote-id" v-model="addForm.remote_problem_id"/>
      </div>
      <div>
        <div style="display: inline-block; width: 500px">
          <span style="color: var(--dangerous)">未知</span>
        </div>
      </div>
      <el-tooltip content="添加" placement="top">
        <i class="clickable-icon el-icon-check" @click="addProblem"/>
      </el-tooltip>
      <i class="clickable-icon el-icon-minus" @click="showAdd = false"/>
    </base-box-frame>
    <el-button v-else size="mini" icon="el-icon-plus" type="primary" @click="showAddProblem"/>
  </base-box-frame>
</template>

<script>
import BaseBoxFrame from "@/components/globals/base-box-frame";

export default {
  name: "edit-problem-list",
  inject: ['contest_id'],
  components: {BaseBoxFrame},
  data() {
    return {
      problem_list: [],
      oj_list: [],
      loading: false,
      showAdd: false,
      addForm: {
        oj_id: '',
        remote_problem_id: ''
      }
    }
  },
  methods: {
    addProblem() {
      if (this.addForm.oj_id === '') {
        this.$message.error('请选择oj')
        return
      }
      if (this.addForm.remote_problem_id === '') {
        this.$message.error('请输入题号')
        return
      }
      this.$http.post(this.api + `/contest/${this.contest_id}/add_problem`, this.addForm)
          .then(resp => {
            this.$message.success(resp.data.msg)
            this.refreshData()
          })
          .catch(err => {
            this.$message.error(err.response.data.msg)
          })
    },
    showAddProblem() {
      this.addForm = this.$options.data().addForm
      this.showAdd = true
    },
    refreshData() {
      this.showAdd = false
      this.loading = true
      this.$http.get(this.api + `/contest/${this.contest_id}/problem_status`)
          .then(resp => {
            this.problem_list = []
            for (let problem of resp.data.problems) {
              this.problem_list.push(problem)
            }
            this.loading = false
          })
      this.$http.get(this.api + '/oj')
          .then(resp => {
            this.oj_list = resp.data.data
          })
    },
    crawlProblem(oj_id, remote_problem_id) {
      this.$http.post(this.api + '/problem/crawl_problem_info', {
        oj_id, remote_problem_id
      }).then(resp => {
        this.$message.success(resp.data.msg)
      })
    },
    getStatusIcon(status) {
      const ProblemStatus = this.ProblemStatus
      switch (status) {
        case ProblemStatus.NotReady:
          return 'el-icon-warning-outline'
        case ProblemStatus.Crawling:
          return 'el-icon-loading'
        case ProblemStatus.CrawlQuestCreated:
          return 'el-icon-loading'
        case ProblemStatus.Ready:
          return 'el-icon-check'
      }
    },
    getStatusTitle(status) {
      const ProblemStatus = this.ProblemStatus
      switch (status) {
        case ProblemStatus.NotReady:
          return '未获取题面'
        case ProblemStatus.Crawling:
          return '正在爬取题面'
        case ProblemStatus.CrawlQuestCreated:
          return '爬取题面任务已创建'
        case ProblemStatus.Ready:
          return '已获取题面'
      }
    }
  },
  created() {
    this.refreshData()
  }
}
</script>

<style scoped>
.problem-list-item {
  margin-bottom: 10px;
}

/deep/ .problem-list-item .el-card__body {
  font-size: 14px;
  padding: 10px;
  display: flex;
  justify-content: space-around;
  line-height: 28px;
}

.problem-input-oj {
  width: 100px;
}

/deep/ .problem-input-oj .el-input__icon {
  height: 28px;
}

.problem-input-remote-id {
  width: 100px;
}

.problem-input {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

/deep/ .problem-input-oj input {
  border: none;
  padding: 0 10px;
}

/deep/ .problem-input-remote-id input {
  border: none;
  border-left: 1px solid #EBEEF5;
  border-radius: 0;
}

.status-icon {
  line-height: 28px;
}

.clickable-icon {
  line-height: 28px;
  cursor: pointer;
}
</style>
