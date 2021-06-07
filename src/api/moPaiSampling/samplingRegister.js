import request from '@/utils/request'
/**
 * 根据编码查询字典
 * @param data
 */
export function getByCode(data) {
  return request({
    url: '/sampling-client/dict/list',
    method: 'post',
    data
  })
}
/**
 * 区县下拉
 * @param data
 */
export function fetchAreaList(data) {
  return request({
    url: '/sampling-client/area/list-area',
    method: 'post',
    data
  })
}

/**
 * 1.区划树
 * @param data
 */
export function fetchSamplingAreaTree(data) {
  return request({
    url: '/sampling-web/area/tree',
    method: 'post',
    data
  })
}

/**
 * 采样点树接口查询
 * @param data
 */
export function fetchSamplingPointList(data) {
  return request({
    url: '/sampling-web/samplingPoint/list',
    method: 'post',
    data
  })
}

/**
 * 独立接口 通过区县直接查询 社区
 * @param data
 */
export function fetchAreaLevel4List(data) {
  return request({
    url: '/sampling-client/area/list-area-level4',
    method: 'post',
    data
  })
}

/**
 * 二维码、身份证、手动录入
 * @param data
 */
export function saveSamplingClient(data) {
  return request({
    url: '/sampling-client/person/saveOrUpdate',
    method: 'post',
    data
  })
}

/**
 * 采样编码查重
 * @param data
 */
export function checkSampleCode(data) {
  return request({
    url: '/sampling-client/sample/check-sampleCode',
    method: 'post',
    data
  })
}

/**
 * 根据采样编码获取采集人员信息
 * @param data
 */
export function fetchListPerson(data) {
  return request({
    url: '/sampling-client/samplePersonRel/list-person',
    method: 'post',
    data
  })
}
/**
 * 9位验证码 查询市民信息
 * @param data
 */
export function fetchPersonInfo(data) {
  return request({
    url: '/sampling-client/person/get',
    method: 'post',
    data
  })
}
/**
 * 采样登记提交
 * @param data
 */
export function saveSampleRegister(data) {
  return request({
    url: '/sampling-client/sample/saveOrUpdate',
    method: 'post',
    data
  })
}

/**
 * 采样查询- 列表查询
 * @param data
 */
export function fetchSamplingSearchPage(data) {
  return request({
    url: '/sampling-client/sample/page',
    method: 'post',
    data
  })
}

/**
 * 采样查询- 列表查询
 * @param data
 */
export function fetchSamplingExcelErrorPage(data) {
  return request({
    url: '/sampling-web/excel/list-error',
    method: 'post',
    data
  })
}

/**
 * 上传文件- 列表查询
 * @param data
 */
export function fetchExcelList(data) {
  return request({
    url: '/sampling-web/excel/list',
    method: 'post',
    data
  })
}

// 摸底数据查询
/**
 * 摸底数据查询- 列表查询
 * @param data
 */
export function fetchPersonPage(data) {
  return request({
    url: '/sampling-web/person/page',
    method: 'post',
    data
  })
}

/**
 * excel 表格导入
 * @param data
 */
export function fetchExcelImport(data) {
  return request({
    url: '/sampling-web/excel/import',
    method: 'post',
    data
  })
}

/**
 * excel 表格删除
 * @param data
 */
export function fetchExcelDelete(data) {
  return request({
    url: '/sampling-web/excel/delete',
    method: 'post',
    data
  })
}
/**
 * excel 表格下载
 * @param data
 */
export function fetchExcelDownload(data) {
  return request({
    url: '/sampling-web/download/template/mopai',
    method: 'post',
    data
  })
}

/**
 * excel 数据检查
 * @param data
 */
export function samplingExcelCheck(data) {
  return request({
    url: '/sampling-web/excel/check',
    method: 'post',
    data
  })
}

/**
 * 重新导入人员数据
 * @param data
 */
export function reImportPerson(data) {
  return request({
    url: '/sampling-web/person/reimport',
    method: 'post',
    data
  })
}

/**
 * 采样点列表
 * @param data
 */
export function fetchPointList(data) {
  return request({
    url: '/sampling-client/samplingPoint/list',
    method: 'post',
    data
  })
}
