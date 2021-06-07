import request from '@/utils/request'

/**
 * 获取全部系统参数
 *
 */
export function getAllParams() {
    return request({
        url: '/parameter/get-all',
        method: 'post',
    })
}

/**
 * 获取某个系统参数
 * @param data
 */
export function getParamsByCode(data) {
    return request({
        url: '/parameter/find-by-code',
        method: 'post',
        data:data
    })
}


/**
 * 登录获取系統名称
 */
export function getSysName() {
    return request({
        baseURL: process.env.MOCK_BASE_API,
        url: '/mock/work/parameter/get-sys-name',
        method: 'post',
    })
}
