import Vue from 'vue'

const ContestState = {
    BEFORE_START: 1,
    RUNNING: 2,
    ENDED: 3
}

const UserPermission = {
    NORMAL: 0,
    ADMIN: 1
}

let enums = {ContestState, UserPermission}

Vue.mixin({
    data() {
        return {
            ...enums
        }
    }
})
