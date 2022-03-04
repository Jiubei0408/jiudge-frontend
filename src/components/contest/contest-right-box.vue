<template>
  <div>
    <base-box-frame body-style="padding: 20px 0">
      <div ref="buttonList" class="button-list">
        <template v-if="showSubmit">
          <div data-route="submit" class="button submit-button" @click="gotoSubmit">
            <i class="el-icon-magic-stick"/> 提交代码
          </div>
          <el-divider/>
        </template>
        <div data-route="problems" class="button" @click="$router.push(`/contest/${contest_id}/problems`)">
          <i class="el-icon-menu"/> 题目列表
        </div>
        <div data-route="status" class="button" @click="$router.push(`/contest/${contest_id}/status`)">
          <i class="el-icon-upload"/> 提交记录
        </div>
        <div data-route="scoreboard" class="button" @click="$router.push(`/contest/${contest_id}/scoreboard`)">
          <i class="el-icon-s-order"/> 比赛榜单
        </div>
        <div data-route="clarification" class="button" @click="$router.push(`/contest/${contest_id}/clarification`)">
          <i class="el-icon-warning"/> 赛中问答
        </div>
        <div class="admin-button-list" v-if="user.permission === UserPermission.ADMIN">
          <el-divider/>
          <div data-route="edit" class="button" @click="$router.push(`/contest/${contest_id}/edit`)">
            <i class="el-icon-s-tools"/> 比赛设置
          </div>
        </div>
      </div>
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

export default {
  name: "contest-right-box",
  inject: ['getContest', 'contest_id'],
  components: {BaseBoxFrame},
  data() {
    return {
      progress: 0,
      progressTimer: undefined,
    }
  },
  computed: {
    contest() {
      return this.getContest()
    },
    showSubmit() {
      if (this.user.username === '') return false
      if (this.user.permission === this.UserPermission.ADMIN) return true
      return this.contest.state === this.ContestState.RUNNING && this.contest.registered
    }
  },
  methods: {
    gotoSubmit() {
      let pid = this.$route.params.pid
      if (pid) this.$router.push(`/contest/${this.contest_id}/submit/${pid}`)
      else this.$router.push(`/contest/${this.contest_id}/submit`)
    },
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
    refreshButtonActive() {
      for (let button of this.$refs['buttonList'].children) {
        button.classList.remove('active')
        if (button.dataset['route'] === this.$route.name) {
          button.classList.add('active')
        }
      }
    }
  },
  watch: {
    $route() {
      this.refreshButtonActive()
    }
  },
  mounted() {
    this.refreshButtonActive()
  },
  created() {
    this.calcProgress()
  },
  destroyed() {
    clearTimeout(this.progressTimer)
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

.button {
  width: 100%;
  height: 50px;
  line-height: 30px;
  font-size: 15px;
  padding: 10px 40px;
  color: black;
  transition: 0.5s;
  box-sizing: border-box;
  cursor: pointer;
}

.button:hover, .button.active {
  box-shadow: inset 8px 0 0 0;
}

.button:hover, .button.active {
  background: var(--primary-background);
  color: var(--primary);
}

.submit-button:hover, .submit-button.active {
  background: var(--success-background);
  color: var(--success);
}

.admin-button-list .button:hover, .admin-button-list .button.active {
  background: var(--warning-background);
  color: var(--warning)
}

.button > [class^=el-icon-] {
  margin-right: 10px;
  font-size: 16px;
}
</style>
