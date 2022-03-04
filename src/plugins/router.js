import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

let router = new Router({
    routes: [
        {
            path: '/',
            name: 'index-page',
            component: () => import('@/views/contests'),
            meta: {
                title: '主页'
            }
        }, {
            path: '/login',
            name: 'login-page',
            component: () => import('@/views/login'),
            meta: {
                title: '登录'
            }
        }, {
            path: '/contest/:cid',
            component: () => import('@/views/contest'),
            children: [{
                path: '',
                redirect: 'problems'
            }, {
                path: 'problems',
                name: 'problems',
                component: () => import('@/components/contest/problem-list')
            }, {
                path: 'problem/:pid',
                name: 'problem',
                component: () => import('@/components/contest/statement')
            }, {
                path: 'submit/:pid?',
                name: 'submit',
                component: () => import('@/components/contest/submit')
            }, {
                path: 'edit',
                name: 'edit',
                component: () => import('@/components/contest/edit')
            }, {
                path: 'scoreboard',
                name: 'scoreboard',
                component: () => import('@/components/contest/scoreboard')
            }, {
                path: 'status',
                name: 'status',
                component: () => import('@/components/contest/status')
            }, {
                path: 'clarification',
                name: 'clarification',
                component: () => import('@/components/contest/clarification')
            }]
        }, {
            path: '*',
            redirect: '/404'
        }, {
            path: '/404',
            component: () => import('@/views/404')
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

export default router
