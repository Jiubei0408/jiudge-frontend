<template>
  <a
      :href="routeHref" class="router-button"
      :class="[
        type ? `router-button--${type}` : '',
        {
          'is-active': active
        }
      ]">
    <i v-if="icon !== ''" :class="`el-icon-${icon}`"/>
    <slot/>
  </a>
</template>

<script>
export default {
  name: "router-button",
  props: {
    route: [String, Object],
    icon: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    active() {
      return this.$route.name === this.routeName
    },
    routeName() {
      return this.$router.resolve(this.route).route.name
    },
    routeHref() {
      return this.$router.resolve(this.route).href
    }
  }
}
</script>

<style scoped>
.router-button {
  display: block;
  text-decoration: none;
  height: 50px;
  line-height: 30px;
  font-size: 15px;
  padding: 10px 40px;
  color: black;
  transition: 0.5s;
  box-sizing: border-box;
  cursor: pointer;
  --text-color: var(--primary);
  --background-color: var(--primary-background);
}

.router-button:hover, .router-button.is-active {
  box-shadow: inset 8px 0 0 0 var(--text-color);
  background-color: var(--background-color);
  color: var(--text-color);
}

.router-button--submit:hover, .router-button--submit.is-active {
  --background-color: var(--success-background);
  --text-color: var(--success);
}

.router-button--admin:hover, .router-button--admin.is-active {
  --background-color: var(--warning-background);
  --text-color: var(--warning)
}

.router-button > [class^=el-icon-] {
  margin-right: 10px;
  font-size: 16px;
}
</style>
