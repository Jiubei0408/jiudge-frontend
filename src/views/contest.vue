<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="19">
        <div class="notice" v-if="contest.notice && contest.notice !== ''">
          <span class="notice-title"><i class="el-icon-chat-line-square"/> 公告板</span>
          <pre class="notice-content">{{ contest.notice }}</pre>
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
  background-color: var(--info-background);
  border: 1px solid var(--info);
  border-radius: 8px;
  line-height: 35px;
  font-size: 18px;
  margin-bottom: 10px;
  padding: 10px 20px;
}

.notice-title {
  font-size: 20px;
  line-height: 40px;
  font-weight: bold;
}

.notice-content {
  font-family: "Helvetica Neue", Helvetica, "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  margin: 0;
  word-break: break-all;
}
</style>
