import request from '@/utils/request'

/**
 * 查询流程
 * @param data
 */
export function fetchTimelineList(data) {
    return request({
        // url: '/basicArea/getAreaList',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/task/getTimeList',
        method: 'post',
        data
    })
}

/**
 * 危化品分页查询
 * @param data
 */
export function dangerList(data) {
    return request({
        // url: '/basicChemicals/page',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/basicChemicals/page',
        method: 'post',
        data
    })
}
/**
 * 人像分页查询
 * @param data
 */
export function fetchPersonList(data) {
    return request({
        // url: '/basicChemicals/page',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/person/page',
        method: 'post',
        data
    })
}
//

/**
 * 人像分页查询
 * @param data
 */
export function fetchAlarmList(data) {
    return request({
        // url: '/basicChemicals/page',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/alarm/page',
        method: 'post',
        data
    })
}