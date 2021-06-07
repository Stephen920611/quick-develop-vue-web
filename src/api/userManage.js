import request from '@/utils/request'

/**
 * 获取区划树
 * @param
 */
export function getAreaTree(data) {
  return request({
    url: '/sampling-web/area/tree',
    method: 'post',
    data
  })
}

/**
 * 获取下级街道或者社区
 * @param parentId
 */
export function getNextAreaList(data) {
  return request({
    url: '/sampling-web/area/list-area',
    method: 'post',
    data
  })
}

/**
 * 新增账号
 * @param
 */
export function addUser(data) {
  return request({
    url: '/sys/regist',
    method: 'post',
    data
  })
}

/**
 * 新增编辑账号
 * @param
 */
export function saveOrUpdateUser(data) {
  return request({
    url: '/updateUser',
    method: 'post',
    data
  })
}
/**
 * 账号分页查询
 * @param
 */
export function getUserListQuery(data) {
  return request({
    url: '/getUsers',
    method: 'post',
    data
  })
}
/**
 * 设置启用或者禁用
 * @param
 */
export function setEnable(data) {
  return request({
    url: '/enableOrDisableUser',
    method: 'post',
    data
  })
}
/**
 * 删除用户
 * @param
 */
export function deleteUser(data) {
  return request({
    url: '/sampling-auth/user/delete',
    method: 'post',
    data
  })
}
/**
 * 采样点树接口查询
 * @param
 */
export function samplePointList(data) {
  return request({
    url: '/sampling-web/samplingPoint/list',
    method: 'post',
    data
  })
}
/**
 * 所有名称返回:区县街道社区采样点名称
 * @param
 */
export function getInfoName(data) {
  return request({
    url: '/sampling-auth/user/get',
    method: 'post',
    data
  })
}

/**
 * 重置密码
 * @param
 */
export function resetUserPassword(data) {
  return request({
    url: '/changePassword',
    method: 'post',
    data
  })
}

/**
 * 给用户赋予角色
 * @param
 */
export function addUserRoles(data) {
  return request({
    url: '/addRoles',
    method: 'post',
    data
  })
}

/**
 * 获取角色列表
 * @param
 */
export function getUserRoles() {
  return request({
    url: '/role/getRoles    ',
    method: 'get'
  })
}

/**
 * 创建角色
 * @param
 */
export function addRolesApi(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data
  })
}

/**
 * 编辑角色
 * @param
 */
export function updateRolesApi(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}

/**
 * 删除角色
 * @param
 */
export function deleteRolesApi(data) {
  return request({
    url: '/role/delete',
    method: 'post',
    data
  })
}
