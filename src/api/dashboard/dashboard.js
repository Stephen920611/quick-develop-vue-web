import request from '@/utils/request'

/**
 * 统计今日警情总数和所有警情总数
 *
 */
export function fetchPoliceCount(data) {
    return request({
        url: '/casePolice/getPoliceCount',
        method: 'post',
        data
    })
}

/**
 * 根据辖区统计警情
 * @param data
 */
export function fetchStatisByOrgan(data) {
    return request({
        url: '/casePolice/statisByOrgan',
        method: 'post',
        data
    })
}


/**
 * 根据类型统计所有警情
 */
export function fetchStatisByType(data) {
    return request({
        url: '/casePolice/statisByType',
        method: 'post',
        data
    })
}

/**
 * 根据辖区统计今日警情
 */
export function fetchStatisTodayByOrgan() {
    return request({
        url: '/casePolice/statisTodayByOrgan',
        method: 'post',
    })
}


/**
 * 统计近七天的警情
 */
export function fetchStatisTodayByTime() {
    return request({
        url: '/casePolice/statisTodayByTime',
        method: 'post',
    })
}


/**
 * 根据类型统计今日警情
 */
export function fetchStatisTodayByType(data) {
    return request({
        url: '/casePolice/statisTodayByType',
        method: 'post',
        data
    })
}
/**
 * 车辆统计近七天报警情况
 */
export function fetchCount7Day() {
    return request({
        url: '/vehicleStatis/count7Day',
        method: 'post',
    })
}

/**
 * 人脸统计近七天报警情况
 */
export function fetchCount7DayFaceAlert() {
    return request({
        url: '/faceStatis/count7DayFaceAlert',
        method: 'post',
    })
}

/**
 * 统计今日重点人员预警数
 */
export function fetchTodayCapture() {
    return request({
        url: '/faceStatis/todayCapture',
        method: 'post',
    })
}

/**
 * 统计今日车辆抓拍情况
 */
export function fetchVehicleStatisTodayCapture() {
    return request({
        url: '/vehicleStatis/todayCapture',
        method: 'post',
    })
}

/**
 * 统计人脸实时动态数据
 */
export function fetchFaceStatisTodayAlert() {
    return request({
        url: '/faceStatis/realTimeData',
        method: 'post',
    })
}

/**
 * 资源统计
 */
export function fetchSourceStatisCount() {
    return request({
        url: '/source/statisCount',
        method: 'post',
    })
}

/**
 * 资源统计
 */
export function fetchStatisRateByOrgan() {
    return request({
        url: '/casePolice/statisRateByOrgan',
        method: 'post',
    })
}
