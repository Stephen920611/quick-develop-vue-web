// 用户信息
const userinfo = {
    "code": 1000,
    "msg": "请求成功",
    "data": {
        "user": {
            "id": 1,
            "name": "admin_lk01",
            "passwd": null,
            "realName": "系统管理员01",
            "organCode": null,
            "companyId": 80,
            "priority": 1000,
            "roleId": 6,
            "telephone": "123",
            "loginNum": 927,
            "lastIp": "172.20.63.2",
            "job": "无",
            "gender": 1,
            "enable": 1,
            "personId": "123456",
            "lastLoginTime": "2021-04-22 10:41:33",
            "allowIp": null,
            "createTime": null,
            "updateTime": "2021-04-22 10:41:33",
            "companyName": "山东建龙新材料科技有限公司龙口分公司",
            "areaId": 4,
            "userType": 1
        },
        "token": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJjeWxpYW4iLCJzdWIiOiIxIiwiaWF0IjoxNjE5MDU5MjkzfQ.wVp28UFzTY2UP8m6EWdIuYmdnwghZJ5hhL6y2Jm9BQzdJqlNqRtg0CZks2TJ9P1WNYmoHa6DmW-A-eMtwO-_9g"
    }
}
// 系统名称
const systemname = {"code": 1000, "msg": "", "data": "xx管理系统"}
// 验证码
const getVerifydata = {"code":1000,"msg":null,"data":{"code":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAZCAIAAADYL2XTAAABzElEQVR42tWYPU4EMQyF3VBRcxMKboDoVpyBFpq9v2ClkaLo2X6xnWR2GbnKJBP7G/8l8vtPnuv1p8lpm8rj2GzK+co8EJ2hfrWPrNJBHjaI7gio6SDZDS7PT4fsdvsZRsOFwS9L6hO3kUYHDIB88fH+TWQ5I52q+CrzrR6UFGOgQwxYRafgR5Gkbv54PS5ZL/UiK2IAp/P68gkCE77eLr0MtQ3SAfdHOqmy6kXWkBFBo7loQIDGAwRme8p4dOCVZJOcF1ncd4JoYK9GRxMxAZl/K+ViAEiCAd8WaDpmVi4EFDEJWBxbRABtp9NbTugMM3QQjfmYILz46rX1PJoQ7AElataxE6ejGWUdh9PRkXUTr5YHjyNm/UrTKXSDwxIepONlZfAdE8cQEKnuG+k0NGSmR8ccByIksibpVCIL6GghXuPpl6IDisXpFE4VJ9EZ9somiCEd3hOWT6SQZ6X8abP1nqHTszC7QTPElh+G+3onk+ALbqzn8F75mG/mY/6HNt5gbL1YMaeRkwS0f9AZbgK05fZrBlDk5E36t+WMpJauhgbcBdCqW8EtdLyL9B2ASL5bCEgKawqpuub2qauVhT47Rad2L7m8oJwA6A9TNZZBSmOb1QAAAABJRU5ErkJggg==","uuid":"8e43dc3821bd490e88f5953fe4de96b0"}}
// 角色菜单
const menupower = {"code":1000,"msg":"请求成功","data":["/dashboard/index","/video-monitor/index","/map-monitor/index","/course-monitor","/course-monitor/handling-process","/course-monitor/handling-process/operation-process/index","/course-monitor/handling-process/historical-alarm-query/index","/course-monitor/handling-process/rectification-notice/index","/course-monitor/import-export","/course-monitor/alarm-synthesis","/course-monitor/alarm-synthesis/alarm-synthesis-search/index","/evaluate-analysis","/industry-info","/industry-info/electronic-waybill","/industry-info/electronic-waybill/waybill-manager/index","/industry-info/base-info","/industry-info/base-info/administrate-region/index","/industry-info/base-info/danger-directory/index","/industry-info/base-info/road-code-info/index","/industry-info/base-info/restricted-road/index","/industry-info/base-info/tunnel-information/index","/industry-info/enterprise-management","/industry-info/enterprise-management/enterprise-info/index","/industry-info/enterprise-management/personnel-info/index","/industry-info/enterprise-management/vehicle-info/index","/statistic-analysis","/system-manage","/system-manage/alarm-configuration","/system-manage/alarm-configuration/alarm-manager/index","/system-manage/global-parameter","/system-manage/global-parameter/parameter-configuration/index","/evaluate-analysis/department-preliminary-assessment/index","/evaluate-analysis/enterprise-self-assessment/index","/evaluate-analysis/level-check/index","/evaluate-analysis/check-records/index","/evaluate-analysis/check-indicator/index","/industry-info/base-info/bridge-information/index","/industry-info/base-info/parking-information/index","/industry-info/base-info/inlet-outlet/index","/industry-info/base-info/loading-unloading/index","/emergency-management","/emergency-management/emergency-plan-management","/emergency-management/emergency-resource-management","/emergency-management/emergency-resource-management/material-reserve/index","/emergency-management/training-exercises","/emergency-management/training-exercises/training/index","/emergency-management/training-exercises/exercise/index","/emergency-management/emergency-resource-management/emergency-team/index","/emergency-management/emergency-resource-management/emergency-personnel/index","/emergency-management/emergency-resource-management/emergency-resources/index","/emergency-management/emergency-resource-management/external-resources/index","/emergency-management/emergency-resource-management/expert-database/index","/industry-info/base-info/enterprise-label/index","/emergency-management/emergency-home/index","/emergency-management/hazard-module","/emergency-management/hazard-module/tank-management-department/index","/emergency-management/hazard-module/tank-management-company/index","/emergency-management/hazard-module/hazard-management-company/index","/emergency-management/hazard-module/hazard-management-department/index","/industry-info/loading-management","/industry-info/loading-management/loading-management-search/index","/course-monitor/import-export/info-management/index","/emergency-management/hazard-module/alarm-rules/index","/course-monitor/import-export/real-verification/index","/course-monitor/import-export/car-bayonet-manage/index","/course-monitor/import-export/person-search/index","/emergency-management/hazard-module/tank-group-management/index","/course-monitor/alarm-synthesis/tank-alarm-search/index","/course-monitor/handling-process/loading-management/index","/course-monitor/handling-process/statistic-analysis/index","/course-monitor/import-export/dangerousGoodsAnalysis/index","/course-monitor/alarm-synthesis/dangerSourceAnalysis/index","/course-monitor/alarm-synthesis/tank-management-department/index","/course-monitor/alarm-synthesis/tank-group-management/index","/industry-info/electronic-waybill/waybill-manager-dashboard/index"]}
// 登录用户的信息
const weblogin = {"code":1000,"msg":"请求成功","data":{"user":{"id":1,"name":"admin_lk01","passwd":null,"realName":"系统管理员01","organCode":null,"companyId":80,"priority":1000,"roleId":6,"telephone":"123","loginNum":943,"lastIp":"172.20.63.2","job":"无","gender":1,"enable":1,"personId":"123456","lastLoginTime":"2021-04-22 16:46:45","allowIp":null,"createTime":null,"updateTime":"2021-04-22 16:46:45","companyName":"山东建龙新材料科技有限公司龙口分公司","areaId":4,"userType":1},"token":"Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJjeWxpYW4iLCJzdWIiOiIxIiwiaWF0IjoxNjE5MDgxMzQ4fQ.A0KM4fz_Qlx4Xuh_CFSmZYUZmgR0_RJWmjD1c4RLHTozMsT3sHHjwsTe6eMOGltW6G4jlktNdIDRkI1s9KKiHQ"}}

const login = {
    url: '/mock/work/auth/web-login',
    type: 'post',
    response: _ => {
        return userinfo
    }
};
const getSysName = {
    url: "/mock/work/parameter/get-sys-name",
    type: 'post',
    response: _ => {
        return systemname
    },
};
const getVerify = {
    url: '/mock/work/auth/getVertify',
    method: 'get',
    response: _ => {
        return getVerifydata
    },
};
const getRoleMenuAuth = {
    url: '/mock/work/power/menu-power',
    type: 'post',
    response: _ => {
        return menupower
    },
};
const user =  [
    login,
    getSysName,
    getVerify,
    getRoleMenuAuth
]
export default user
