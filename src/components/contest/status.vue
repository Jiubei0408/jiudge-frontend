<template>
  <base-box-frame>
    <view-code-dialog ref="VCDialog"/>
    <template v-slot:title>提交列表</template>
    <el-form align="center" inline>
      <el-form-item label="账号">
        <el-input @keypress.native.enter="refreshData" style="width: 150px" v-model="filterForm.username"/>
      </el-form-item>
      <el-form-item label="题目">
        <el-input @keypress.native.enter="refreshData" style="width: 100px" v-model="filterForm.problem_id"/>
      </el-form-item>
      <el-form-item label="结果">
        <el-select v-model="filterForm.result">
          <el-option v-for="result of resultFilters" :key="result.value"
                     :value="result.value" :label="result.text"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refreshData"><i class="el-icon-search"/> 查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" v-loading="loading">
      <el-table-column label="#" width="80px">
        <template slot-scope="scope">
          <el-link style="margin-right: 20px" @click="viewcode(scope.row.code)" :underline="false">
            {{ scope.row.id }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="账号" width="80px">
        <template slot-scope="scope">
          <el-tooltip style="width: fit-content" :content="scope.row.user.username">
            <p>{{ scope.row.user.nickname }}</p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="题目" prop="problem.problem_id" width="60px">
        <template v-slot="scope">
          <el-link :underline="false" @click="gotoProblem(scope.row.problem.problem_id)">
            {{ scope.row.problem.problem_id }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="结果" prop="view_result" width="100px">
        <template slot-scope="scope">
          <el-tooltip style="width: fit-content" :content="scope.row.remote_result" placement="top">
            <p style="font-weight: bold" :style="{'color': getResultColor(scope.row)}">
              {{ getResultText(scope.row) }}
            </p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="语言" prop="lang"/>
      <el-table-column label="资源消耗">
        <template v-slot="scope">
          {{ scope.row.time_used }}ms / {{ scope.row.memory_used }}KB
        </template>
      </el-table-column>
      <el-table-column label="提交时间" prop="submit_time" width="150px"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link @click="viewCompileInfo(scope.row.compile_info)" :underline="false">查看编译信息</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination align="center" layout="prev, pager, next, jumper, slot, total"
                   style="margin-top: 20px" :page-size="filterForm.page_size"
                   :current-page.sync="filterForm.page" :total="total" @current-change="refreshData">
      <div style="display: inline-block; width: 50px"/>
    </el-pagination>
  </base-box-frame>
</template>

<script>
import BaseBoxFrame from "@/components/globals/base-box-frame";
import ViewCodeDialog from "@/components/globals/view-code-dialog";

let judgeResults = ['PENDING', 'RUNNING', 'AC', 'WA', 'TLE', 'MLE', 'RE', 'CE', 'UNKNOWN', 'SpiderError']

export default {
  name: "status",
  inject: ['contest_id'],
  components: {ViewCodeDialog, BaseBoxFrame},
  computed: {
    resultFilters() {
      let res = [{text: '全部', value: ''}]
      for (let i of judgeResults) {
        res.push({
          text: i,
          value: i
        })
      }
      return res
    }
  },
  data() {
    return {
      tableData: [],
      filterForm: {
        username: '',
        problem_id: '',
        result: '',
        page: 1,
        page_size: 10
      },
      total: 0,
      loading: false
    }
  },
  methods: {
    gotoProblem(problem_id){
      this.$router.push(`/contest/${this.contest_id}/problem/${problem_id}`)
    },
    refreshData() {
      this.loading = true
      this.$http.get(this.api + `/contest/${this.contest_id}/status`, {
        params: this.filterForm
      }).then(resp => {
        this.tableData = resp.data.data.data
        this.filterForm.page = resp.data.data.meta.page
        this.total = resp.data.data.meta.count
        this.loading = false
      }).catch(err => {
        this.$message.error(err.response.data.msg)
      })
    },
    getResultText(submission) {
      let now = this.$moment()
      //愚人节彩蛋
      if (now.month() + 1 === 4 && now.date() === 1) {
        if (submission.view_result === 'WA') {
          return 'AC?'
        }
      }
      return submission.view_result
    },
    getResultColor(submission) {
      let now = this.$moment()
      //愚人节彩蛋
      if (now.month() + 1 === 4 && now.date() === 1) {
        if (submission.view_result === 'WA') {
          return '#21ba45'
        }
      }
      let result = submission.view_result
      if (result === 'AC') return '#21ba45'
      if (result === 'PENDING' || result === 'RUNNING') return '#c7c7c7'
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
