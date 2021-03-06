import {login, logout, getInfo} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import router, {resetRouter} from '@/router'
import {setStorage, removeStorage, getStorage} from '@/utils/storage'

const state = {
    token: getToken(),
    userInfo: {}, // 用户信息
    name: '',
    avatar: '',
    introduction: '',
    // roles: ['zhenggai','visitor','admin']
    roles: []
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
    SET_USER_INFO: (state, userInfo) => {
        state.userInfo = userInfo
    }
}

const actions = {
    // 用户登录
    login({commit}, userInfo) {
        return new Promise((resolve, reject) => {
            login(userInfo).then(response => {
                let {data} = response;
                commit('SET_TOKEN', data.token) // 登录成功后将token存储在cookie之中
                commit('SET_USER_INFO', data.user) // 登录成功后将userInfo存起来
                let userInfo = {
                    roles: data.user.roleCode === 5 ? ['zhenggai'] : data.user.roleCode === 4 ? ['admin'] : ['visitor'],
                    ...data.user
                };
                setStorage('userInfo', userInfo);    //登录成功后将userInfo存在localStorage
                setToken(data);
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // TODO 获取用户信息
    getInfo({commit, state}) {
        return new Promise((resolve, reject) => {
            // getInfo(state.token).then(response => {
            let userInfo = getStorage('userInfo');
            const response = {
                code: 1000,
                data: {
                    roles: userInfo.roles,
                    introduction: '',
                    avatar: '',
                    name: userInfo.username
                }
            };
            const {data} = response;

            if (!data) {
                reject('Verification failed, please Login again.')
            }

            const {roles, name, avatar, introduction} = data

            // roles must be a non-empty array
            if (!roles || roles.length <= 0) {
                reject('getInfo: roles must be a non-null array!')
            }

            commit('SET_ROLES', roles)
            commit('SET_NAME', name)
            commit('SET_AVATAR', avatar)
            commit('SET_INTRODUCTION', introduction)
            resolve(data)
            /* }).catch(error => {
              reject(error)
            })*/
        })
    },

    // user logout
    logout({commit, state, dispatch}) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                removeToken()
                removeStorage('userInfo');
                resetRouter()

                // reset visited views and cached views
                // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485 账户切换，快捷标签栏按钮显示的是上一个账户的
                dispatch('tagsView/delAllViews', null, {root: true})

                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({commit}) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
        })
    },

    // dynamically modify permissions
    changeRoles({commit, dispatch}, role) {
        return new Promise(async resolve => {
            const token = role + '-token'

            commit('SET_TOKEN', token)
            setToken(token)

            const {roles} = await dispatch('getInfo')

            resetRouter()

            // generate accessible routes map based on roles
            const accessRoutes = await dispatch('permission/generateRoutes', roles, {root: true})

            // dynamically add accessible routes
            router.addRoutes(accessRoutes)

            // reset visited views and cached views
            dispatch('tagsView/delAllViews', null, {root: true})

            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
