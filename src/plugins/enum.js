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

const ContestRegisterType = {
    Participant: 0,
    Observer: 1,
    Starred: 2
}

const ProblemStatus = {
    NotReady: 0,
    CrawlQuestCreated: 1,
    Crawling: 2,
    Ready: 3
}

let enums = {ContestState, UserPermission, ContestRegisterType, ProblemStatus}

Vue.mixin({
    data() {
        return {
            ...enums
        }
    }
})
