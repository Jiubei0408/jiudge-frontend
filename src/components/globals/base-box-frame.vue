<template>
  <el-card :body-style="bodyStyle" shadow="hover" class="base-box-frame">
    <div class="box-title" v-if="$slots.title">
      <slot name="title"/>
    </div>
    <slot name="default"/>
    <div class="notes" v-if="$slots.notes">
      <slot name="notes"/>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "base-box-frame",
  props:{
    bodyStyle: {
      default: null
    }
  }
}
</script>

<style scoped>
.base-box-frame {
  width: 100%;
}

/deep/ .box-title{
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 20px 0;
}

.notes {
  margin-top: 30px;
  color: grey;
  user-select: none;
}

.notes, .notes /deep/ *{
  font-size: 15px !important;
}
</style>
