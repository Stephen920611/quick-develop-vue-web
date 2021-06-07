import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { setStorage, removeStorage, getStorage } from '@/utils/storage'

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
    setStorage('')
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
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response
        // commit('SET_TOKEN', data.token) // 登录成功后将token存储在cookie之中
        commit('SET_USER_INFO', data) // 登录成功后将userInfo存起来
        const userInfo = {
          // roles: data.user.roleCode === 5 ? ['zhenggai'] : data.user.roleCode === 4 ? ['admin'] : ['visitor'],
          ...data
        }
        setStorage('userInfo', userInfo) // 登录成功后将userInfo存在localStorage
        setToken(data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  /* login({commit}, userInfo) {
          console.log(userInfo);
          return new Promise((resolve, reject) => {
             /!* let data = {
                  user: {
                      "id": 32,
                      "name": "luzaibao",
                      "passwd": null,
                      "realName": "测试",
                      "organCode": null,
                      "companyId": 80,
                      "priority": 1000,
                      "roleId": 1,
                      "telephone": "",
                      "loginNum": 299,
                      "lastIp": "172.20.63.100",
                      "job": "",
                      "gender": 1,
                      "enable": 1,
                      "personId": "1222",
                      "lastLoginTime": "2020-12-21 15:22:39",
                      "allowIp": null,
                      "createTime": null,
                      "updateTime": "2020-12-21 15:22:39",
                      "companyName": null,
                      "areaId": 4,
                      "userType": 2
                  },
                  token: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJjeWxpYW4iLCJzdWIiOiIzMiIsImlhdCI6MTYwODUzNjE3Mn0.tXQwN0bh35K3m7xGLyLKAvgFKlXiCMb32IDcWy_SK69QWm2Z-4_e-Sv8_IulqU9gtJRiWyG-KmeKsOpwN-9hwQ"
              };
              console.log(data.token, "data.token");
              commit('SET_TOKEN', data.token); // 登录成功后将token存储在cookie之中
              commit('SET_USER_INFO', data.user); // 登录成功后将userInfo存起来
              let userInfo = {
                  roles: data.user.roleCode === 5 ? ['zhenggai'] : data.user.roleCode === 4 ? ['admin'] : ['visitor'],
                  ...data.user
              };
              setStorage('userInfo', userInfo);    //登录成功后将userInfo存在localStorage
              setToken(data);
              console.log(getToken(),"getToken")
              resolve(data)*!/
          })
      },*/

  // TODO 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token).then(response => {
      const userInfo = getStorage('userInfo')
      console.log(userInfo, 'userInfo')
      if (userInfo) {
        const response = {
          code: 2000,
          data: {
            roles: userInfo.hasOwnProperty('roles') ? userInfo.roles : [],
            introduction: '',
            avatar: '',
            name: userInfo.hasOwnProperty('username') ? userInfo.username : ''
          }
        }
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      } else {
        reject('获取用户失败!')
      }

      /* }).catch(error => {
                    reject(error)
                  })*/
    })
  },

  // user logout
  logout({ commit, state, dispatch }, userInfo) {
    return new Promise((resolve, reject) => {
      logout(userInfo).then(() => {
        // logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        removeStorage('userInfo')
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485 账户切换，快捷标签栏按钮显示的是上一个账户的
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

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
