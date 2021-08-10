<template>
  <base-box-frame>
    <template slot="title">Contests</template>
    <el-table :data="tableData">
      <el-table-column label="比赛名">
        <el-link slot-scope="scope" :underline="false" @click="$router.push(`/contest/${scope.row.id}`)">
          {{ scope.row.contest_name }}
        </el-link>
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
      total: 0
    }
  },
  methods: {
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
