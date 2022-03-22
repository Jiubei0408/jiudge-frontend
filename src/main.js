import Vue from 'vue'
import App from './App.vue'
import '@/plugins/element.js'
import router from "@/plugins/router";
import '@/plugins/axios'
import store from "@/plugins/store"
import '@/plugins/enum'
import '@/plugins/moment'
import '@/assets/css/cf/problem-statement.css'
import '@/assets/css/poj/problem-statement.css'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
    created() {
        store.commit('savePage', this)
        this.$store.commit('updateUser')
    }
}).$mount('#app')
