<template>
  <base-box-frame>
    <view-code-dialog ref="VCDialog"/>
    <el-dialog width="800px" :visible.sync="newClarDialogVisible"
               append-to-body :close-on-click-modal="false">
      <template #title>发送新的赛中问答</template>
      <el-form>
        <el-form-item label="涉及题目">
          <el-select v-model="newClarForm.problem_id">
            <el-option :value="null" label="全部"/>
            <el-option v-for="problem in contest.problems" :key="problem.id"
                       :value="problem.id" :label="problem.problem_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="发送给">
          <el-select v-model="newClarForm.to">
            <template v-if="contest.admin">
              <el-option value="" label="所有人"/>
              <el-option v-for="contestant in contestants" :key="contestant.username"
                         :value="contestant.user.username" :label="contestant.user.nickname"/>
            </template>
            <template v-else>
              <el-option value="jury" label="jury"/>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" placeholder="问答内容" :autosize="{minRows: 5, maxRows: 10}"
                    v-model="newClarForm.content"/>
        </el-form-item>
        <el-button type="primary" @click="newClar">提交</el-button>
      </el-form>
    </el-dialog>
    <template v-slot:title>赛中问答</template>
    <el-button type="primary" icon="el-icon-plus" style="float: right"
               v-if="user.username !== ''" @click="openNewClarDialog">
      发送
    </el-button>
    <el-table :data="tableData" v-loading="loading">
      <el-table-column label="题目" width="100px">
        <template slot-scope="scope">
          <template v-if="scope.row.problem_id_in_contest === null">全部</template>
          <el-link v-else :underline="false"
                   @click="$router.push(`/contest/${contest_id}/problem/${scope.row.problem_id_in_contest}`)">
            {{ scope.row.problem_id_in_contest }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="发送者" prop="who.nickname" width="100px"/>
      <el-table-column label="发送给" width="100px">
        <template slot-scope="scope">
          {{ scope.row.to === null ? '所有人' : scope.row.to.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template slot-scope="scope">
          <p class="content-link" :title="scope.row.content" @click="showContent(scope.row)">
            {{ scope.row.content }}
          </p>
        </template>
      </el-table-column>
      <el-table-column width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.unread" size="mini" type="primary" @click="readClar(scope.row.id)">已读</el-button>
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
import ViewCodeDialog from "@/components/globals/view-code-dialog";

export default {
  name: "clarification",
  inject: ['contest_id', 'getContest'],
  components: {ViewCodeDialog, BaseBoxFrame},
  computed: {
    contest() {
      return this.getContest()
    }
  },
  data() {
    return {
      tableData: [],
      loading: true,
      page: 1,
      page_size: 10,
      total: 0,
      contestants: [],
      newClarDialogVisible: false,
      newClarForm: {
        to: '',
        content: '',
        problem_id: null
      }
    }
  },
  methods: {
    refreshData() {
      this.loading = true
      this.$http.get(this.api + `/contest/${this.contest_id}/clarifications`, {
        params: {
          page: this.page,
          page_size: this.page_size
        }
      }).then(resp => {
        this.tableData = resp.data.data
        this.page = resp.data.meta.page
        this.total = resp.data.meta.count
        this.loading = false
      })
    },
    showContent(row) {
      this.$refs.VCDialog.view(row.content, `来自${row.who.nickname}的消息：`, false)
    },
    readClar(clar_id) {
      this.$http.post(this.api + `/contest/read_clar/${clar_id}`)
          .finally(this.refreshData)
    },
    getContestants() {
      this.$http.get(this.api + `/contest/${this.contest_id}/contestants`)
          .then(resp => {
            this.contestants = resp.data.data
          })
    },
    openNewClarDialog() {
      this.newClarForm = this.$data.newClarForm
      if (!this.contest.admin) {
        this.newClarForm.to = 'jury'
      }
      this.newClarDialogVisible = true
    },
    newClar() {
      if (this.newClarForm.content === '') {
        this.$message.error('请填写内容')
        return
      }
      this.$http.post(this.api + `/contest/${this.contest_id}/new_clar`, this.newClarForm)
          .then(resp => {
            this.$message.success(resp.data.msg)
            this.newClarDialogVisible = false
            this.refreshData()
          })
          .catch(err => {
            this.$message.error(err.response.data.msg)
          })
    }
  },
  created() {
    this.refreshData()
    this.getContestants()
  }
}
</script>

<style scoped>
.content-link {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}

.content-link:hover {
  color: var(--primary);
}
</style>
