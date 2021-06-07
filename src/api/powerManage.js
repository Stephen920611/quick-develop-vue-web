import request from '@/utils/request'

/**
 * 获取菜单树
 * @param
 */
export function getSysPathTree() {
  return request({
    url: '/path/getPathTree',
    method: 'get'
  })
}

/**
 * 获取菜单详情
 * @param data
 */
export function getSysPathDetail(data) {
  return request({
    url: '/path/getOnePath',
    method: 'post',
    data
  })
}

/**
 * 新增菜单
 * @param data
 */
export function saveSysPath(data) {
  return request({
    url: '/path/create',
    method: 'post',
    data
  })
}

/**
 * 修改菜单
 * @param data
 */
export function updateSysPath(data) {
  return request({
    url: '/path/update',
    method: 'post',
    data
  })
}

/**
 * 先判断是否该菜单是否已经被分配权限
 * @param data
 */
export function fetchPathRoles(data) {
  return request({
    url: '/path/getPathRoles',
    method: 'post',
    data
  })
}

/**
 * 菜单删除
 * @param data
 */
export function deleteSysPath(data) {
  return request({
    url: '/path/delete',
    method: 'post',
    data
  })
}

/**
 * 获取所有角色
 * @param data
 */
export function getAllRole(data) {
  return request({
    url: '/role/getRoles',
    method: 'get',
    data
  })
}

/**
 * 根据roleId查询菜单
 * @param data
 */
export function getRoleList(data) {
  return request({
    url: '/role/getRolePaths',
    method: 'post',
    data
  })
}

/**
 * 保存角色权限
 * @param data
 */
export function saveRolePower(data) {
  return request({
    url: '/role/addPaths',
    method: 'post',
    data
  })
}

/**
 * 根据roleCode查询菜单id
 * @param data
 */
export function getEpidemicAreaTree(data) {
  return request({
    url: '/sampling-web/area/status-tree',
    method: 'post',
    data
  })
}

/**
 * 保存角色权限
 * @param data
 */
export function saveEpidemicAreaTree(data) {
  return request({
    url: '/sampling-web/area/update-status',
    method: 'post',
    data: data
  })
}

/**
 * 获取摸排导出的树
 * @param data
 */
export function getMopaiAreaTree(data) {
  return request({
    url: '/sampling-web/area/undisable-tree',
    method: 'post',
    data
  })
}

/**
 * 保存摸排导出颗粒到社区；
 * @param data
 */
export function saveMoPaiArea(data) {
  return request({
    url: '/sampling-web/area/update-download-mopai',
    method: 'post',
    data: data
  })
}

/**
 * 获取重复摸排导出的树
 * @param data
 */
export function getRepeatMopaiAreaTree(data) {
  return request({
    url: '/sampling-web/area/undisable-tree',
    method: 'post',
    data
  })
}

/**
 * 保存重复摸排导出颗粒到社区；
 * @param data
 */
export function saveRepeatMoPaiArea(data) {
  return request({
    url: '/sampling-web/area/update-download-repeat',
    method: 'post',
    data: data
  })
}
