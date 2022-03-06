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
      console.log(this.$route.name, this.routeName)
      return this.$route.name === this.routeName
    },
    routeName() {
      console.log(this.route, this.$router.resolve(this.route))
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
}

.router-button:hover, .router-button.is-active {
  box-shadow: inset 8px 0 0 0;
}

.router-button--default:hover, .router-button--default.is-active {
  background: var(--primary-background);
  color: var(--primary);
}

.router-button--submit:hover, .router-button--submit.is-active {
  background: var(--success-background);
  color: var(--success);
}

.router-button--admin:hover, .router-button--admin.is-active {
  background: var(--warning-background);
  color: var(--warning)
}

.router-button > [class^=el-icon-] {
  margin-right: 10px;
  font-size: 16px;
}
</style>
