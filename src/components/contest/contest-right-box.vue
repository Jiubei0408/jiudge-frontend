<template>
  <div>
    <base-box-frame body-style="padding: 20px 0">
      <template v-if="showSubmit">
        <router-button icon="magic-stick" :route="submitUrl" type="submit">
          提交代码
        </router-button>
        <el-divider/>
      </template>
      <router-button icon="menu" :route="`/contest/${contest_id}/problems`">
        题目列表
      </router-button>
      <router-button icon="upload" :route="`/contest/${contest_id}/status`">
        提交记录
      </router-button>
      <router-button icon="s-order" :route="`/contest/${contest_id}/scoreboard`">
        比赛榜单
      </router-button>
      <router-button icon="warning" :route="`/contest/${contest_id}/clarification`">
        赛中问答<el-badge v-show="unreadCount > 0" :value="unreadCount"></el-badge>
      </router-button>
      <template v-if="contest.admin">
        <el-divider/>
        <router-button icon="s-tools" type="admin" :route="`/contest/${contest_id}/edit`">
          比赛设置
        </router-button>
        <router-button icon="more" type="admin" :route="`/contest/${contest_id}/edit-problem-list`">
          题目编排
        </router-button>
      </template>
    </base-box-frame>
    <base-box-frame style="margin-top: 5px" v-if="contest.start_time">
      <el-progress :percentage="progress" :status="contest.state === ContestState.ENDED ? 'success' : undefined"
                   :stroke-width="30" :show-text="false"/>
      <p class="contest-state">
        <template v-if="contest.state === ContestState.BEFORE_START">比赛未开始</template>
        <template v-else-if="contest.state === ContestState.RUNNING">比赛正在进行</template>
        <template v-else-if="contest.state === ContestState.ENDED">比赛已结束</template>
      </p>
    </base-box-frame>
    <base-box-frame style="margin-top: 5px" v-if="contest.start_time">
      <el-descriptions :column="1" :colon="false"
                       label-class-name="description-label"
                       content-class-name="description-content">
        <el-descriptions-item label="比赛名">{{ contest.contest_name }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ contest.start_time }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ contest.end_time ? contest.end_time : '永久' }}</el-descriptions-item>
      </el-descriptions>
    </base-box-frame>
  </div>
</template>

<script>
import BaseBoxFrame from "@/components/globals/base-box-frame";
import RouterButton from "@/components/globals/router-button";

export default {
  name: "contest-right-box",
  inject: ['getContest', 'contest_id'],
  components: {RouterButton, BaseBoxFrame},
  data() {
    return {
      progress: 0,
      progressTimer: undefined,
      unreadCount: 0,
      getUnreadCountTimer: undefined
    }
  },
  computed: {
    contest() {
      return this.getContest()
    },
    showSubmit() {
      if (this.user.username === '') return false
      if (this.contest.admin) return true
      return this.contest.state === this.ContestState.RUNNING && this.contest.registered
    },
    submitUrl() {
      let pid = this.$route.params.pid
      if (pid) return `/contest/${this.contest_id}/submit/${pid}`
      return `/contest/${this.contest_id}/submit`
    }
  },
  methods: {
    calcProgress() {
      if (!this.contest.start_time) {
        this.progressTimer = setTimeout(this.calcProgress, 1000)
        return
      }
      let now = this.$moment()
      let begin = this.$moment(this.contest.start_time)
      let end = this.$moment(this.contest.end_time)
      if (begin.isSame(now, 'second')) {
        this.$alert('比赛已经开始', '通知', {
          callback: () => {
            window.location.reload()
          }
        })
        return
      } else if (now < begin) {
        this.progress = 0
      } else if (!end.isValid()) {
        this.progress = 0
        return
      } else if (end.isSame(now, 'second')) {
        this.$alert('比赛已结束', '通知', {
          callback: () => {
            window.location.reload()
          }
        })
        return
      } else if (now > end) {
        this.progress = 100
        return
      } else {
        this.progress = (now.unix() - begin.unix()) / (end.unix() - begin.unix()) * 100
      }
      this.progressTimer = setTimeout(this.calcProgress, 1000)
    },
    getUnreadClarCount() {
      if (!this.contest.id) {
        this.getUnreadCountTimer = setTimeout(this.getUnreadClarCount, 1000)
        return
      }
      this.$http.get(this.api + `/contest/${this.contest.id}/clar_count`)
          .then(resp => {
            this.unreadCount = resp.data.data
          })
          .finally(() => {
            this.getUnreadCountTimer = setTimeout(this.getUnreadClarCount, 10000)
          })
    }
  },
  created() {
    this.calcProgress()
    this.getUnreadClarCount()
  },
  destroyed() {
    clearTimeout(this.progressTimer)
    clearTimeout(this.getUnreadCountTimer)
  }
}
</script>

<style scoped>
.contest-state {
  margin-top: 10px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

/deep/ .description-label {
  color: var(--info);
  font-size: 14px;
  flex: 0 0 60px;
}
</style>
