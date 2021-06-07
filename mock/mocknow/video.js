// 任务时间列表
const taskPoints = {
    "code": 1000,
    "msg": "请求成功",
    "data": {
        "list": [
            {
                "id": 5,
                "companyId": 80,
                "userId": 61,
                "imgUrl": "http://219.146.132.90:18070/ftpfile/1722063236/images/20200925/160101906181644959.jpg?1619588880745",
                "updateTime": "2020-09-25 15:31:07",
                "createTime": "2020-09-25 15:31:07",
                "des": null,
                "camCode": "37068114491318000015",
                "cameraName": "罐区东南角02云台",
                "captureTime": "2020-09-25 15:31:24"
            },
            {
                "id": 4,
                "companyId": 80,
                "userId": 61,
                "imgUrl": "http://219.146.132.90:18070/ftpfile/1722063236/images/20200925/160101862932022234.jpg?1619588880746",
                "updateTime": "2020-09-25 15:24:06",
                "createTime": "2020-09-25 15:24:06",
                "des": null,
                "camCode": "37068114491318000016",
                "cameraName": "防爆相机南",
                "captureTime": "2020-09-25 15:24:07"
            },
            {
                "id": 3,
                "companyId": 80,
                "userId": 61,
                "imgUrl": "http://219.146.132.90:18070/ftpfile/1722063236/images/20200925/160100605154633398.jpg?1619588880746",
                "updateTime": "2020-09-25 11:54:14",
                "createTime": "2020-09-25 11:54:14",
                "des": null,
                "camCode": "37068114491318000004",
                "cameraName": "西北角通道01云台",
                "captureTime": "2020-09-25 11:54:35"
            },
            {
                "id": 2,
                "companyId": 80,
                "userId": 61,
                "imgUrl": "http://219.146.132.90:18070/ftpfile/1722063236/images/20200925/160100603709747744.jpg?1619588880746",
                "updateTime": "2020-09-25 11:54:06",
                "createTime": "2020-09-25 11:54:06",
                "des": null,
                "camCode": "37068114491318000014",
                "cameraName": "建龙罐区东北角02",
                "captureTime": "2020-09-25 11:54:20"
            },
            {
                "id": 1,
                "companyId": 80,
                "userId": 61,
                "imgUrl": "http://219.146.132.90:18070/ftpfile/1722063236/images/20200925/160100603628369802.jpg?1619588880747",
                "updateTime": "2020-09-25 11:54:04",
                "createTime": "2020-09-25 11:54:04",
                "des": null,
                "camCode": "37068114491318000016",
                "cameraName": "防爆相机南",
                "captureTime": "2020-09-25 11:54:14"
            }
        ],
        "total": 5,
        "pages": 1,
        "page": 1,
        "size": 8
    }
}


const videoManualCaptureByPage = {
    url: '/mock/work/videoManualCapture/page',
    type: 'post',
    response: _ => {
        return taskPoints
    }
};




const video =  [
    videoManualCaptureByPage,
]
export default video
