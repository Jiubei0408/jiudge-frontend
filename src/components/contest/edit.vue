<template>
  <base-box-frame v-loading="loading">
    <template v-slot:title>编辑比赛</template>
    <el-form label-width="80px">
      <el-form-item label="比赛名">
        <el-input style="width: 300px" v-model="modifyForm.contest_name"/>
      </el-form-item>
      <el-form-item label="比赛类型">
        <el-select v-model="modifyForm.contest_type" disabled>
<!--          <el-option value="ACM"/>-->
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker type="datetime" v-model="modifyForm.start_time" value-format="yyyy-MM-dd HH:mm:ss"/>
        <el-checkbox style="margin-left: 20px" v-model="modifyForm.is_contest">限时比赛</el-checkbox>
      </el-form-item>
      <el-form-item label="结束时间" v-if="modifyForm.is_contest">
        <el-date-picker type="datetime" v-model="modifyForm.end_time" value-format="yyyy-MM-dd HH:mm:ss"/>
      </el-form-item>
      <el-form-item label="启用密码">
        <el-switch v-model="modifyForm.has_password"/>
      </el-form-item>
      <el-form-item label="比赛密码" v-if="modifyForm.has_password">
        <el-input style="width: 300px" v-model="modifyForm.password"/>
      </el-form-item>
      <el-form-item label="比赛公告">
        <el-input type="textarea" :autosize="{minRows: 3, maxRows: 3}"
                  maxlength="200" show-word-limit v-model="modifyForm.notice"/>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="modifyForm.ready"/>
      </el-form-item>
      <el-form-item label="优先级">
        <el-input-number :max="99" :min="0" v-model="modifyForm.priority"/>
      </el-form-item>
      <el-button type="warning" @click="modifyContest">保存修改</el-button>
    </el-form>
  </base-box-frame>
</template>

<script>
import BaseBoxFrame from "@/components/globals/base-box-frame";

export default {
  name: "edit",
  inject: ['getContest', 'contest_id', 'refreshContestMeta'],
  components: {BaseBoxFrame},
  computed: {
    contest() {
      return this.getContest()
    }
  },
  data() {
    return {
      modifyForm: {
        contest_name: '',
        contest_type: 'ACM',
        start_time: '',
        is_contest: false,
        end_time: '',
        password: '',
        has_password: false,
        ready: false,
        priority: 0,
        notice: ''
      },
      loading: false
    }
  },
  methods: {
    modifyContest() {
      if (this.modifyForm.is_contest) {
        if (this.modifyForm.end_time === '') {
          this.$message.error('请设置结束时间')
          return
        }
        if (this.$moment(this.modifyForm.end_time).isSameOrBefore(this.modifyForm.start_time)) {
          this.$message.error('结束时间应晚于开始时间')
          return
        }
      }
      if (this.modifyForm.has_password && this.modifyForm.password === '') {
        this.$message.error('请设置密码')
        return
      }
      if (this.modifyForm.contest_name === '') {
        this.$message.error('请填写比赛名')
        return
      }
      if (this.modifyForm.start_time === '') {
        this.$message.error('请填写开始时间')
        return
      }
      if (!this.modifyForm.is_contest) this.modifyForm.end_time = ''
      if (!this.modifyForm.has_password) this.modifyForm.password = null
      this.appendDialogVisible = false
      let form = this.modifyForm
      delete form.is_contest
      delete form.has_password
      this.$http.post(this.api + `/contest/${this.contest_id}/modify`, form)
          .then(resp => {
            this.$message.success(resp.data.msg)
            this.refreshData()
            this.refreshContestMeta()
          })
          .catch(err => {
            this.$message.error(err.response.data.msg)
          })
    },
    refreshData() {
      this.loading = true
      this.$http.get(this.api + `/contest/admin/${this.contest_id}`)
          .then(resp => {
            let form = resp.data.data
            form.has_password = (form.password !== null)
            if (form.password === null) form.password = ''
            form.is_contest = (form.end_time !== null)
            if (form.end_time === null) form.end_time = ''
            this.modifyForm = form
            this.loading = false
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
