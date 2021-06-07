import request from '@/utils/request'

/**
 * 基于月生产数据的民爆品
 * @param data
 */
export function fetchConsumptionData(data) {
    return request({
        // url: '/basicArea/getAreaList',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/task/getConsumptionData',
        method: 'post',
        data
    })
}
