<template>
  <el-card shadow="hover" class="base-box-frame">
    <div class="box-title" v-if="$slots.title">
      <slot name="title"/>
    </div>
    <slot name="default"/>
  </el-card>
</template>

<script>
export default {
  name: "base-box-frame"
}
</script>

<style scoped>
.base-box-frame {
  width: 100%;
  cursor: default;
}

/deep/ .box-title{
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 20px 0;
}
</style>
