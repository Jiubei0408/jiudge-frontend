import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const debug = false
const localhost = false
let api = 'http://jiudge-api.newitd.com:12345/v1'

if (localhost) {
    api = 'http://127.0.0.1:5000/v1'
}

let state = {
    page: null,
    debug,
    api,
    user: {
        username: '',
        nickname: '',
        permission: 0
    },
    message_count: 0
}

let mutations = {
    savePage(state, page) {
        state.page = page
    },
    updateUser(state) {
        state.page.$http.get(api + '/session')
            .then(resp => {
                state.user = resp.data.data
            })
            .catch(() => {
                state.user = {
                    username: '',
                    password: '',
                    permission: 0
                }
            })
    },
    login(state, {username, password}) {
        state.page.$http.post(api + '/session', {
            'username': username,
            'password': password
        }).then(resp => {
            state.page.$store.commit('updateUser')
            state.page.$message.success(resp.data.msg)
            state.page.$router.push('/')
        }).catch(err => {
            state.page.$message.error(err.response.data.msg)
        })
    },
    logout(state) {
        state.page.$http.delete(api + '/session')
            .then(resp => {
                state.page.$store.user = {
                    username: '',
                    nickname: '',
                    permission: 0
                }
                state.page.$message.success(resp.data.msg)
                state.page.$store.commit('updateUser')
                state.page.$router.push('/')
            })
    }
}

export default new Vuex.Store({
    state,
    mutations
})
