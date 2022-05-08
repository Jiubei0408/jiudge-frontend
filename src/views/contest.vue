<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="19">
        <div class="notice" v-if="contest.notice && contest.notice !== ''">
          <i class="el-icon-info"/>
          <span>{{contest.notice}}</span>
        </div>
        <router-view/>
      </el-col>
      <el-col :span="5">
        <contest-right-box/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ContestRightBox from "@/components/contest/contest-right-box";

export default {
  name: "contest",
  components: {ContestRightBox},
  provide() {
    return {
      contest_id: this.contest_id,
      getContest: () => this.contest,
      refreshContestMeta: this.refereshData
    }
  },
  computed: {
    contest_id() {
      return this.$route.params.cid
    },
  },
  data() {
    return {
      contest: {}
    }
  },
  methods: {
    refereshData() {
      this.$http.get(this.api + `/contest/${this.contest_id}`)
          .then(resp => {
            this.contest = resp.data.data
          })
          .catch(err => {
            this.$message.error(err.response.data.msg)
          })
    }
  },
  created() {
    this.refereshData()
  },
  watch: {
    '$route.params.cid'() {
      window.location.reload()
    }
  }
}
</script>

<style scoped>
.notice {
  color: var(--primary);
  background-color: var(--primary-background);
  border: 1px dashed var(--primary);
  border-radius: 10px;
  line-height: 40px;
  font-size: 18px;
  margin-bottom: 10px;
  padding: 10px 20px;
}

.notice span {
  margin-left: 5px;
  font-weight: bold;
  word-break: break-all;
}
</style>
