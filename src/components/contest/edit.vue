<template>
  <base-box-frame>
    <template v-slot:title>编辑比赛</template>

  </base-box-frame>
</template>

<script>
import BaseBoxFrame from "@/components/globals/base-box-frame";

export default {
  name: "edit",
  inject: ['getContest'],
  computed: {
    contest() {
      return this.getContest()
    }
  },
  components: {BaseBoxFrame}
}
</script>

<style scoped>

</style>
