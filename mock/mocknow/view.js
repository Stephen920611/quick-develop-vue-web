//月生产数据民爆品用量分析
const consumptionData = {
    "code": 1000,
    "msg": "请求成功",
    "data": {
        "company": {
            num:50,
            alarm:5,
            thisMonthL:500,
            lastMonthL:0.5,
            thisMonthZ:6500,
            lastMonthZ: -6,
            thisMonthD:6500,
            lastMonthD:0.5,
        
        },
        "power": {
            num:65,
            alarm:0.5,
            thisMonthL:5,
            lastMonthL:0.5,
            thisMonthZ:1.5,
            lastMonthZ:5,
            thisMonthD:20,
            lastMonthD:0.5,
        },
        "output": {
            num:200,
            alarm:0.5,
            thisMonthL:5,
            lastMonthL:0.5,
            thisMonthZ:1.5,
            lastMonthZ: -0.5,
            thisMonthD:20,
            lastMonthD:0.5,
        },
        "task": {
            num:200,
            alarm:0.5,
            thisMonthL:50,
            lastMonthL:-0.5,
            thisMonthZ:1.5,
            lastMonthZ:20,
            thisMonthD:200,
            lastMonthD:0.5,
        },
    }
}






const fetchConsumptionData = {
    url: '/mock/work/task/getConsumptionData',
    type: 'post',
    response: _ => {
        return consumptionData
    }
};





//

const view =  [
    fetchConsumptionData,
]
export default view
