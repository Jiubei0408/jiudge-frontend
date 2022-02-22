<template>
  <base-box-frame>
    <view-code-dialog ref="VCDialog"/>
    <p slot="title">赛中问答</p>
    <el-table :data="tableData" v-loading="loading">
      <el-table-column label="题目" width="100px">
        <template slot-scope="scope">
          {{ scope.row.problem_id_in_contest === null ? '全部' : scope.row.problem_id_in_contest }}
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
  inject: ['contest_id'],
  components: {ViewCodeDialog, BaseBoxFrame},
  data() {
    return {
      tableData: [],
      loading: true,
      page: 1,
      page_size: 10,
      total: 0
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
    }
  },
  created() {
    this.refreshData()
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
.content-link:hover{
  color: var(--primary);
}
</style>
