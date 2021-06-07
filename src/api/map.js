import request from '@/utils/request'

/**
 * 查询区域列表
 * @param data
 */
export function queryAreaList(data) {
    return request({
        // url: '/basicArea/getAreaList',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/basicArea/getAreaList',
        method: 'post',
        data
    })
}

/**
 * 根据编码查询字典
 * @param data
 */
export function getByCode(data) {
    return request({
        // url: '/dict/getByCode',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/dict/getByCode',
        method: 'post',
        data
    })
}

/**
 * 获取某个系统参数
 * @param data
 */
export function getParamsByCode(data) {
    return request({
        // url: '/parameter/find-by-code',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/parameter/find-by-code',
        method: 'post',
        data:data
    })
}

/**
 * 查询公司点位
 * @param data
 */
export function queryCompanyPoints(data) {
    return request({
        // url: '/basicCompany/getCompanyDetail',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/basicCompany/getCompanyDetail',
        method: 'post',
        data
    })
}

/**
 * 查询摄像机点位
 * @param data
 */
export function queryCameraPoints(data) {
    return request({
        // url: '/camBasic/list-position',
        baseURL: process.env.MOCK_BASE_API,
        url:'/camBasic/list-position',
        method: 'post',
        data
    })
}

/**
 * 查询行驶线路信息
 * @param data
 */
export function queryBasicLine(data) {
    return request({
        url: '/basicLine/page',
        method: 'post',
        data
    })
}

/**
 * 查询行驶线路坐标
 * @param data
 */
export function queryLinePoints(data) {
    return request({
        url: '/basicLine/list-point',
        method: 'post',
        data
    })
}

/**
 * 查询进出卡口点位
 * @param data
 */
export function queryBayonetPoints(data) {
    return request({
        // url: '/basicBayonet/getBayonet',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/basicBayonet/getBayonet',
        method: 'post',
        data
    })
}

/**
 * 查询停车场点位
 * @param data
 */
export function queryParkingPoints(data) {
    return request({
        url: '/basicParking/getParking',
        method: 'post',
        data
    })
}

/**
 * 查询装卸区点位
 * @param data
 */
export function queryLadeSiteArea(data) {
    return request({
        // url: '/ladeArea/getLadeArea',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/ladeArea/getLadeArea',
        method: 'post',
        data
    })
}

/**
 * 查询装卸位点位
 * @param data
 */
export function queryLadeSitePoints(data) {
    return request({
        url: '/ladeSite/getLadeSite',
        // baseURL: process.env.MOCK_BASE_API,
        // url:'/mock/work/ladeSite/getLadeSite',
        method: 'post',
        data
    })
}

/**
 * 查询桥梁点位
 * @param data
 */
export function queryBridgePoints(data) {
    return request({
        // url: '/basicBridge/getBridge',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/basicBridge/getBridge',
        method: 'post',
        data
    })
}

/**
 * 查询隧道点位
 * @param data
 */
export function queryTunnelPoints(data) {
    return request({
        // url: '/basicTunnel/getTunnel',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/basicTunnel/getTunnel',
        method: 'post',
        data
    })
}

/**
 * 查询区域企业树
 * @param data
 */
export function queryAreaTree(data) {
    return request({
        // url: '/basicArea/getAreaTree',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/basicArea/getAreaTree',
        method: 'post',
        data
    })
}

/**
 * 查询区域企业下的车辆
 * @param data
 */
export function queryCompanyCar(data) {
    return request({
        url: '/companyCar/getCar',
        method: 'post',
        data
    })
}

/**
 * 查询区域下的重大危险源
 * @param data
 */
export function queryDangerSource(data) {
    return request({
        // url: '/hazardDetail/list-area',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/hazardDetail/list-area',
        method: 'post',
        data
    })
}

/**
 * 所有企业的进出车辆查询
 * @param data
 */
export function companyPassCar(data) {
    return request({
        // url: '/companyPassCheck/getPassCheck',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/companyPassCheck/getPassCheck',
        method: 'post',
        data
    })
}

/**
 * 企业危险品货物管理--分页查询
 * @param data
 * todo
 */
export function companyChemicalPage(data) {
    return request({
        // url: '/companyChemical/page',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/companyChemical/page',
        method: 'post',
        data
    })
}

/**
 * 爆炸仓库--查询，不分页
 * @param data
 */

export function getTankList(data) {
    return request({
        // url: '/basicTank/list',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/basicTank/list',
        method: 'post',
        data
    })
}

/**
 * 查询公司列表（新）
 * @param data
 */
export function getBasicCompanyList(data) {
    return request({
        url: '/basicCompany/list',
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
        // url: '/basicTankAlarm/list-tank-alarm',
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/basicTankAlarm/list-tank-alarm',
        method: 'post',
        data
    })
}

/**
 * 派出所列表--查询，不分页
 * @param data
 */

export function getPoliceList(data) {
    return request({
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/list-police-station',
        method: 'post',
        data
    })
}
/**
 * 绘制区域边界--查询，不分页
 * @param data
 */

export function getAreaBoundary(data) {
    return request({
        baseURL: process.env.MOCK_BASE_API,
        url:'/mock/work/get-area-boundary-points',
        method: 'post',
        data
    })
}