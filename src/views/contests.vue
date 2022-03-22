<template>
  <base-box-frame>
    <el-dialog :visible.sync="appendDialogVisible" width="500px" append-to-body>
      <template v-slot:title>新增比赛</template>
      <el-form label-width="80px">
        <el-form-item label="比赛名">
          <el-input style="width: 300px" v-model="appendForm.contest_name"/>
        </el-form-item>
        <el-form-item label="比赛类型">
          <el-select v-model="appendForm.contest_type" disabled>
            <el-option value="ACM"/>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker type="datetime" v-model="appendForm.start_time" value-format="yyyy-MM-dd HH:mm:ss"/>
          <el-checkbox style="margin-left: 20px" v-model="appendForm.is_contest">限时比赛</el-checkbox>
        </el-form-item>
        <el-form-item label="结束时间" v-if="appendForm.is_contest">
          <el-date-picker type="datetime" v-model="appendForm.end_time" value-format="yyyy-MM-dd HH:mm:ss"/>
        </el-form-item>
        <el-form-item label="启用密码">
          <el-switch v-model="appendForm.has_password"/>
        </el-form-item>
        <el-form-item label="比赛密码" v-if="appendForm.has_password">
          <el-input style="width: 300px" v-model="appendForm.password"/>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button type="warning" @click="appendContest">创建比赛</el-button>
        <el-button @click="appendDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <div class="clearfix" slot="title">
      Contests
      <el-button type="primary" size="medium" style="float:right" icon="el-icon-plus"
                 v-if="user.permission === UserPermission.ADMIN"
                 @click="showAppendDialog">新增
      </el-button>
    </div>
    <el-table :data="tableData">
      <el-table-column label="比赛名">
        <template slot-scope="scope">
          <el-link :underline="false" @click="$router.push(`/contest/${scope.row.id}`)">
            {{ scope.row.contest_name }}
          </el-link>
          <el-tag v-if="scope.row.priority >= 1" style="float: right" size="mini">置顶</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" prop="start_time"/>
      <el-table-column label="结束时间">
        <template slot-scope="scope">
          {{ scope.row.end_time === null ? '永久' : scope.row.end_time }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-show="user.username !== '' && !scope.row.registered && scope.row.state !== ContestState.ENDED"
                     size="mini" type="primary" @click="register(scope.row)">注册
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination align="center" layout="prev, pager, next, jumper, slot, total"
                   style="margin-top: 20px" :page-size="page_size"
                   :current-page.sync="page" :total="total" @current-change="refreshData">
      <div style="display: inline-block; width: 50px"/>
    </el-pagination>
  </base-box-frame>
</template>

<script>
import BaseBoxFrame from "@/components/globals/base-box-frame";

export default {
  name: "contests",
  components: {BaseBoxFrame},
  data() {
    return {
      tableData: [],
      page: 1,
      page_size: 10,
      total: 0,
      appendDialogVisible: false,
      appendForm: {
        contest_name: '',
        contest_type: 'ACM',
        start_time: '',
        is_contest: false,
        end_time: '',
        password: '',
        has_password: false
      }
    }
  },
  methods: {
    appendContest() {
      if (this.appendForm.is_contest) {
        if (this.appendForm.end_time === '') {
          this.$message.error('请设置结束时间')
          return
        }
        if (this.$moment(this.appendForm.end_time).isSameOrBefore(this.appendForm.start_time)) {
          this.$message.error('结束时间应晚于开始时间')
          return
        }
      }
      if (this.appendForm.has_password && this.appendForm.password === '') {
        this.$message.error('请设置密码')
        return
      }
      if (this.appendForm.contest_name === '') {
        this.$message.error('请填写比赛名')
        return
      }
      if (this.appendForm.start_time === '') {
        this.$message.error('请填写开始时间')
        return
      }
      this.appendDialogVisible = false
      let form = this.appendForm
      delete form.is_contest
      delete form.has_password
      this.$http.post(this.api + '/contest/create', form)
          .then(resp => {
            this.$message.success(resp.data.msg)
            this.refreshData()
          })
          .catch(err => {
            this.$message.error(err.response.data.msg)
          })
    },
    showAppendDialog() {
      this.appendForm = this.$options.data().appendForm
      this.appendDialogVisible = true
    },
    refreshData() {
      this.$http.get(this.api + '/contests', {
        params: {
          page: this.page,
          page_size: this.page_size,
          order: {
            id: 'desc'
          }
        }
      }).then(resp => {
        this.tableData = resp.data.data
        this.page = resp.data.meta.page
        this.total = resp.data.meta.count
        this.$forceUpdate()
      })
    },
    register(row) {
      if (row.require_password) {
        this.$prompt('', '请输入密码', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          this.$http.post(this.api + `/contest/${row.id}/register`, {
            password: value
          }).then(resp => {
            if (resp.status === 200) this.$message.success(resp.data.msg)
            else this.$message.error(resp.data.msg)
            this.refreshData()
          }).catch(err => {
            this.$message.error(err.response.data.msg)
          })
        }).catch(() => {
        })
      } else {
        this.$http.post(this.api + `/contest/${row.id}/register`)
            .then(resp => {
              if (resp.status === 200) this.$message.success(resp.data.msg)
              else this.$message.error(resp.data.msg)
              this.refreshData()
            })
            .catch(err => {
              this.$message.error(err.response.data.msg)
            })
      }
    }
  },
  created() {
    this.refreshData()
  }
}
</script>

<style scoped>

</style>
