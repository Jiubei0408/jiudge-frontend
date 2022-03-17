import Vue from 'vue'

const ContestState = {
    BEFORE_START: 'BEFORE_START',
    RUNNING: 'RUNNING',
    ENDED: 'ENDED'
}

const UserPermission = {
    NORMAL: 'NORMAL',
    ADMIN: 'ADMIN'
}

const ContestRegisterType = {
    Participant: 'Participant',
    Observer: 'Observer',
    Starred: 'Starred'
}

const ProblemStatus = {
    NotReady: 'NotReady',
    CrawlQuestCreated: 'CrawlQuestCreated',
    Crawling: 'Crawling',
    Ready: 'Ready'
}

let enums = {ContestState, UserPermission, ContestRegisterType, ProblemStatus}

Vue.mixin({
    data() {
        return {
            ...enums
        }
    }
})
