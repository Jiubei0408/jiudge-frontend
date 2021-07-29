<template>
  <base-box-frame>
    <view-code-dialog ref="VCDialog"/>
    <template slot="title">提交列表</template>
    <el-form align="center" inline>
      <el-form-item label="学号">
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
      <el-table-column label="#" prop="id" width="60px"/>
      <el-table-column label="学号" prop="user.username" width="100px"/>
      <el-table-column label="姓名" prop="user.nickname" width="80px"/>
      <el-table-column label="题目" prop="problem.problem_id" width="60px"/>
      <el-table-column label="结果" width="100px" prop="view_result">
        <template slot-scope="scope">
          <p style="font-weight: bold" :style="{'color': getResultColor(scope.row)}">
            {{ scope.row.view_result }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="语言" prop="lang" width="80px"/>
      <el-table-column label="提交时间" prop="submit_time"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link style="margin-right: 20px" @click="viewcode(scope.row.code)" :underline="false">
            查看代码
          </el-link>
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

let judgeResults = ['PENDING', 'AC', 'WA', 'TLE', 'MLE', 'RE', 'CE', 'UNKNOWN', 'SpiderError']

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
    getResultColor(submission) {
      let result = submission.view_result
      if (result === 'AC') return '#21ba45'
      if (result === 'PENDING') return '#c7c7c7'
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
