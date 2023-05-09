<template>
  <div ref="latexEl" style="font-size: 16px">
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
    },
    inlineMath: {
      type: Array,
      default: () => [['$', '$']]
    },
    displayMath: {
      type: Array,
      default: () => [['$$$$$$', '$$$$$$']]
    }
  },
  mounted() {
    if (this.text !== null) {
      this.$refs.latexEl.innerHTML = this.text
    }
    if (window.MathJax) {
      window.MathJax.config.tex = {
        inlineMath: this.inlineMath,
        displayMath: this.displayMath
      }
      window.MathJax.startup.getComponents()
      window.MathJax.typeset([this.$refs.latexEl])
    }
  },
  created() {
  }
}
</script>

<style scoped>
</style>
