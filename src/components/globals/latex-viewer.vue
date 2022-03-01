<template>
  <div ref="latexEl" style="font-size: 10px">
    <slot v-if="text === null"/>
  </div>
</template>

<script>
export default {
  name: "latex-viewer",
  props: {
    text: {
      type: String,
      default: null
    }
  },
  mounted() {
    if (this.text !== null) {
      this.$refs.latexEl.innerHTML = this.text
    }
    if (window.MathJax) {
      window.MathJax.typeset([this.$refs.latexEl])
    }
  },
  created() {
  }
}
</script>

<style scoped>
</style>
