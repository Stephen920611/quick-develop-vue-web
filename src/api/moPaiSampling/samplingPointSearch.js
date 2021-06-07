import request from '@/utils/request'
/**
 * 4.采样点分页
 * @param data
 */
export function fetchSamplingPointList(data) {
  return request({
    url: '/sampling-client/samplingPoint/page',
    method: 'post',
    data
  })
}
/**
 * 5.采样点删除
 * @param data
 */
export function delSamplingPoint(data) {
  return request({
    url: '/sampling-client/samplingPoint/delete',
    method: 'post',
    data
  })
}

/**
 * 6.采样点新增编辑
 * @param data
 */
export function saveOrUpdateSamplingPoint(data) {
  return request({
    url: '/sampling-client/samplingPoint/saveOrUpdate',
    method: 'post',
    data
  })
}

/**
 * 14、采样点信息统计
 * @param data
 */
export function fetchSamplePersonRel(data) {
  return request({
    url: '/sampling-client/samplePersonRel/page-person',
    method: 'post',
    data
  })
}

