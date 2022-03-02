<template>
  <div class="page-nav">
    <el-dialog width="450px" :visible.sync="changePwdDialogVisible" :close-on-click-modal="false" append-to-body>
      <template v-slot:title>修改密码</template>
      <el-form label-width="80px" :model="changePwdForm" class="changePwdForm">
        <el-form-item label="账号">
          <span style="user-select: none">{{ user.username }}</span>
        </el-form-item>
        <el-form-item prop="old_password" label="原密码">
          <el-input v-model="changePwdForm.old_password" autocomplete="off" show-password/>
        </el-form-item>
        <el-form-item prop="new_password" label="新密码">
          <el-input v-model="changePwdForm.new_password" autocomplete="off" show-password/>
        </el-form-item>
        <el-form-item prop="confirm_password" label="确认密码">
          <el-input v-model="changePwdForm.confirm_password" show-password/>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button type="warning" icon="el-icon-lock" @click="changePwd">确认更改</el-button>
        <el-button @click="changePwdDialogVisible=false">取消</el-button>
      </template>
    </el-dialog>
    <el-menu :default-active="this.$route.path" class="middle-box"
             style="height:60px; width:var(--middle-box-width); z-index:1000"
             mode="horizontal" router>
      <el-menu-item index="/">Contests</el-menu-item>
      <div class="userBox">
        <template v-if="user.username !== ''">
          <span style="margin-right: 15px">Welcome,
            <el-dropdown>
              <el-button type="text">
                {{ user.nickname }}
                <el-dropdown-menu>
                  <el-dropdown-item @click.native="showChangePwd">修改密码</el-dropdown-item>
                </el-dropdown-menu>
              </el-button>
            </el-dropdown>
          </span>
          <el-button icon="el-icon-user" @click="logout">Logout</el-button>
        </template>
        <template v-else>
          <el-button type="primary" icon="el-icon-user" @click="$router.push('/login')">Login</el-button>
        </template>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "page-nav",
  data() {
    return {
      changePwdDialogVisible: false,
      changePwdForm: {
        old_password: '',
        new_password: '',
        confirm_password: ''
      }
    }
  },
  methods: {
    showChangePwd() {
      this.changePwdForm = this.$options.data().changePwdForm
      this.changePwdDialogVisible = true
    },
    logout() {
      this.$store.commit('logout')
      this.$router.push('/')
    },
    changePwd() {
      try {
        this.validateChangePwd()
      } catch (error) {
        this.$message.error(error.message)
        return
      }
      this.$http.post(this.api + '/user/modify_password', {
        old_password: this.changePwdForm.old_password,
        new_password: this.changePwdForm.new_password
      }).then(resp => {
        this.$message.success(resp.data.msg)
        this.changePwdDialogVisible = false
      }).catch(err => {
        this.$message.error(err.response.data.msg)
      })
    },
    validateChangePwd() {
      if (this.changePwdForm.old_password === '') {
        throw new Error('原密码不能为空')
      }
      if (this.changePwdForm.new_password === '') {
        throw new Error('新密码不能为空')
      }
      if (this.changePwdForm.confirm_password === '') {
        throw new Error('请确认密码')
      }
      if (this.changePwdForm.confirm_password !== this.changePwdForm.new_password) {
        throw new Error('两次密码输入不一致')
      }
    }
  }
}
</script>

<style scoped>
.page-nav {
  background-color: white;
}

.middle-box {
  position: relative;
  left: 50%;
  transform: translate(-50%);
}

.middle-box.el-menu {
  border-bottom: none;
}

.middle-box .el-menu-item, /deep/ .middle-box .el-submenu__title {
  font-size: 16px;
}

.userBox {
  position: relative;
  float: right;
  top: 50%;
  transform: translate(0, -50%);
  outline: none;
  font-size: 15px;
}

.changePwdForm .el-input {
  width: 300px;
}
</style>
