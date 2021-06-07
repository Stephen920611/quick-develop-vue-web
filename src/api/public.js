import request from '@/utils/request'

/**
 * 获取全部系统参数
 *
 */
export function getAllParams() {
    return request({
        url: '/param/getAll ',
        method: 'post',
    })
}

/**
 * 根据编码查询全局参数
 * @param data
 */
export function getParamsByCode(data) {
    return request({
        url: '/param/getByCode',
        method: 'post',
        data
    })
}


/**
 * 登录获取系統名称
 */
export function getSysName() {
    return request({
        url: '/parameter/get-sys-name',
        method: 'post',
    })
}