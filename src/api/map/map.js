import request from '@/utils/request'

/**
 * 查询行政区划列表
 *
 */
export function getRegionList() {
    return request({
        url: '/source/getAllAreaCode',
        method: 'post',
    })
}
/**
 * 获取地图上的各部门经纬度
 *
 */
export function getOrganAndCameraCount(data) {
    return request({
        url: '/source/getOrganCameraCount',
        method: 'post',
        data
    })
}
/**
 * 获取有权限的资源树列表
 *
 */
export function getResourceTreeList() {
    return request({
        url: '/source/authedTreeInfo',
        method: 'post',
    })
}
/**
 * 获取有权限的资源树列表
 *
 */
export function getOrganList(data) {
    return request({
        url: '/source/organList',
        method: 'post',
        data
    })
}
/**
 * 获取有权限的资源树列表
 *
 */
export function getCameraList(data) {
    return request({
        url: '/source/cameraList',
        method: 'post',
        data
    })
}
/**
 * 获取地图上的摄像机资源
 *
 */
export function getCameraForMap(data) {
    return request({
        url: '/position/getForMap',
        method: 'post',
        data
    })
}

/**
 * 根据摄像机id获取摄像机详情
 *
 */
export function getCameraInfoById(data) {
    return request({
        url: '/position/getInfoById',
        method: 'post',
        data
    })
}

/**
 * 获取地图上的道路卡口资源
 *
 */
export function getBayonetForMap(data) {
    return request({
        url: '/source/getBayonetForMap',
        method: 'post',
        data
    })
}
/**
 * 获取地图上的人脸资源
 *
 */
export function getFaceForMap(data) {
    return request({
        url: '/face/getAllAreaCode',
        method: 'post',
        data
    })
}

/**
 * 警情事件-按条件查询警情事件
 *
 */
export function queryPoliceList(data) {
    return request({
        url: '/casePoliceInfo/query',
        method: 'post',
        data
    })
}

/**
 * 警情事件-按条件查询警情事件
 *
 */
export function queryCaseList(data) {
    return request({
        url: '/case/query',
        method: 'post',
        data
    })
}
/**
 * 查询人脸报警信息
 *
 */
export function getFaceNewestWarning(data) {
    return request({
        url: '/face/getNewestWarning',
        method: 'post',
        data
    })
}
/**
 * 查询人脸报警信息
 *
 */
export function getFaceNewestWarning2(data) {
    return request({
        url: '/face/getNewestWarning2',
        method: 'post',
        data
    })
}
/**
* 查询人脸报警信息总数
*
*/
export function getNewestWarningNum(data) {
    return request({
        url: '/face/getNewestWarningNum',
        method: 'post',
        data
    })
}
/**
* 查询人脸报警信息总数
*
*/
export function queryVehicleAlarm(data) {
    return request({
        url: '/vehicle-alarm-info/query',
        method: 'post',
        data
    })
}
/**
* 获取人员报警websocket推送的json条件
*
*/
export function queryAlertWebsocketCondition() {
    return request({
        url: '/face/queryAlertWebsocketCondition',
        method: 'post',
    })
}


/**
 * 根据关键字模糊搜索摄像机
 *
 */
export function searchCameraByKeyword(data) {
    return request({
        url: '/camera/search',
        method: 'post',
        data
    })
}
/**
 * 查询某节点下所有摄像机的总数
 *
 */
export function getOrgCamCount(data) {
    return request({
        url: '/source/getOrgCamCount',
        method: 'post',
        data
    })
}

/**
 * 查询设备类型，用于生成下拉列表
 *
 */
export function getDeviceTypeList() {
    return request({
        url: '/deviceGps/getTypeInfo',
        method: 'post',
    })
}
/**
 * 分页查询车载和单兵
 *
 */
export function getDeviceInfoByPage(data) {
    return request({
        url: '/device/getInfoByPage',
        method: 'post',
        data
    })
}
/**
 * 分页查询车载和单兵
 *
 */
export function getAllDevice() {
    return request({
        url: '/device/getAll',
        method: 'post',
    })
}
/**
 * 根据设备编码，查询摄像机信息
 *
 */
export function getCameraInfoByDevice(data) {
    return request({
        url: '/device/get-camera-by-device',
        method: 'post',
        data
    })
}
/**
 * 根据设备编码，查询设备详情
 *
 */
export function getDeviceInfo(data) {
    return request({
        url: '/device/get-detail',
        method: 'post',
        data
    })
}
/**
 * 根据设备编码，查询设备详情
 *
 */
export function getAllDeviceDetail() {
    return request({
        url: '/device/get-all-device-detail',
        method: 'post',
    })
}
/**
 * 根据设备编码，查询设备巡区详情
 *
 */
export function getDeviceDetailByCode(data) {
    return request({
        url: '/device/get-device-detail',
        method: 'post',
        data
    })
}

