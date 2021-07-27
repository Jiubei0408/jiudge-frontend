<template>
  <el-dialog :visible.sync="visible" append-to-body>
    <div style="height: 40px; line-height: 40px" slot="title">
      <span class="title">{{ title }}</span>
      <el-button size="mini" type="primary" v-if="showCopy" @click="copyCode" :disabled="copied">
        {{ copied ? '已复制' : '复制' }}
      </el-button>
    </div>
    <pre class="code">{{ code }}</pre>
  </el-dialog>
</template>

<script>
export default {
  name: "view-code-dialog",
  data() {
    return {
      title: '',
      code: '',
      showCopy: false,
      visible: false,
      copied: false
    }
  },
  methods: {
    view(code, title, showCopy = false) {
      this.title = title
      this.code = code
      this.showCopy = showCopy
      this.visible = true
      this.copied = false
    },
    copyCode() {
      let temp = document.createElement("textarea");
      temp.value = this.code;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("Copy");
      document.body.removeChild(temp);
      this.copied = true
      setTimeout(() => {
        this.copied = false
      }, 1000)
    }
  }
}
</script>

<style scoped>
.title {
  font-size: 24px;
  font-weight: bold;
  margin-right: 20px;
}

.code {
  padding: 20px;
  border: 1px solid black;
  background-color: #FAFAFA
}
</style>
