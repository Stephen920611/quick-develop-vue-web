import request from '@/utils/request'

/**
 * 登录
 * @param data
 * todo
 */
export function login(data) {
  /* return request({
        url: '/vue-element-admin/user/login',
        method: 'post',
        data
    })*/

  return request({
    url: '/sys/login',
    // baseURL: process.env.MOCK_BASE_API,
    // url: '/mock/work/auth/web-login',
    method: 'post',
    data
  })
}

/**
 * 修改密码
 * @param data
 */
export function updatePassword(data) {
  return request({
    url: '/changePassword',
    method: 'post',
    data
  })
}

/**
 * 退出登录
 */
export function logout(data) {
  return request({
    // url: '/auth/logout',
    //   baseURL: process.env.MOCK_BASE_API,
    url: '/sys/logout',
    method: 'post',
    data
  })
}

/**
 * 获取验证码
 * todo
 */
export function getVerify(params) {
  return request({
    url: '/auth/getVertify',
    // baseURL: process.env.MOCK_BASE_API,
    // url:'/mock/work/auth/getVertify',
    method: 'get',
    query: params
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

/**
 * 登录获取角色菜单权限
 * @param
 */
export function getUserAuthedPathsApi(data) {
  return request({
    url: '/getUserAuthedPaths',
    method: 'post',
    data
  })
}

