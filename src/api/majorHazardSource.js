import request from '@/utils/request'

/**
 * 重大危险源--分页查询
 * @param data
 */
export function queryHazardSourceList(data) {
    return request({
        url: '/hazardDetail/page',
        method: 'post',
        data
    })
}

/**
 * 重大危险源--详情查询
 * @param data
 */
export function getHazardSourceDetail(data) {
    return request({
        url: '/hazardDetail/get',
        method: 'post',
        data
    })
}

/**
 * 重大危险源--编辑、保存基本信息
 * @param data
 */
export function saveOrUpdateHazardSource(data) {
    return request({
        url: '/hazardDetail/saveOrUpdate',
        method: 'post',
        data
    })
}

/**
 * 重大危险源--更新边界
 * @param data
 */
export function updateBoundsHazardSource(data) {
    return request({
        url: '/hazardDetail/saveOrUpdate-bounds',
        method: 'post',
        data
    })
}

/**
 * 重大危险源--删除
 * @param data
 */
export function deleteHazardSource(data) {
    return request({
        url: '/hazardDetail/delete',
        method: 'post',
        data
    })
}

/**
 * 重大危险源--关联摄像机查询
 * @param data
 */
export function listHazardCamera(data) {
    return request({
        url: '/hazardDetail/list-hazard-camera',
        method: 'post',
        data
    })
}

/**
 * 储罐--分页查询
 * @param data
 */
export function queryTankList(data) {
    return request({
        url: '/basicTank/page',
        method: 'post',
        data
    })
}

/**
 * 储罐--查询，不分页
 * @param data
 */
export function getTankList(data) {
    return request({
        url: '/basicTank/list',
        method: 'post',
        data
    })
}

/**
 * 储罐--详情
 * @param data
 */
export function basicTankDetail(data) {
    return request({
        url: '/basicTank/get',
        method: 'post',
        data
    })
}
/**
 * 储罐--编辑、保存基本信息
 * @param data
 */
export function basicTankSaveOrUpdate(data) {
    return request({
        url: '/basicTank/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 储罐--删除
 * @param data
 */
export function basicTankDelete(data) {
    return request({
        url: '/basicTank/delete',
        method: 'post',
        data
    })
}
/**
 * 储罐--更新边界
 * @param data
 */
export function saveOrUpdateBounds(data) {
    return request({
        url: '/basicTank/saveOrUpdate-bounds',
        method: 'post',
        data
    })
}
/**
 * 储罐--单个储罐的报警详情
 * @param data
 */
export function basicTankAlarmInfo(data) {
    return request({
        url: '/basicTankAlarm/get',
        method: 'post',
        data
    })
}

/**
 * 储罐--储罐实时报警查询
 * @param data
 */
export function allTankAlarmList(data) {
    return request({
        url: '/basicTankAlarm/list-tank-alarm',
        method: 'post',
        data
    })
}
/**
 * 重大危险源--列表
 * @param data
 */
export function fetchDangerSource(data) {
    return request({
        url: '/hazardDetail/list-area',
        method: 'post',
        data
    })
}
/**
 * 【储罐报警】-分页查询
 * @param data
 */
export function fetchBasicTankAlarmList(data) {
    return request({
        url: '/basicTankAlarm/page',
        method: 'post',
        data
    })
}

/**
 * 【储罐报警】-关联摄像机查询
 * @param data
 */
export function listHazardCameraQuery(data) {
    return request({
        url: '/hazardDetail/list-hazard-camera',
        method: 'post',
        data
    })
}