<template>
    <div class="index-container">
        <el-row class="index-wrap">
            <el-col :span="6">
                <div class="grid-content left">
                    <!--警情信息-->
                    <div class="cell cell-1">
                        <div class="title">
                            <CommonSubtitle title="警情信息" width="100%"></CommonSubtitle>
                        </div>
                        <div class="content">
                            <!--<countTo :startVal='startVal' :endVal='endVal' :duration='duration'></countTo>-->
                            <el-row class="sc-number-wrap">
                                <el-col :span="8" class="ellipsis-l1">
                                    <span class="sc-title">{{organName}}警情总量</span>
                                </el-col>
                                <el-col :span="16">
                                    <ul class="dataNums inrow">
                                        <li class="dataOne " v-for="(item,index) in totalCount">
                                            <div class="dataBoc">
                                                <div class="tt" t="38" style="transition: all 5s ease-in-out 0s;">
                                                    <span class="num0">{{item}}</span>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </el-col>
                            </el-row>
                            <el-row class="sc-echarts-wrap">
                                <vab-chart
                                        ref="myCircleTotal"
                                        theme="vab-echarts-theme"
                                        :autoresize="true"
                                        :options="chart1"
                                        class="my-circle"
                                />
                            </el-row>
                        </div>
                    </div>
                    <!--当日警情信息-->
                    <div class="cell cell-1">
                        <div class="title">
                            <CommonSubtitle title="当日警情信息" width="100%"></CommonSubtitle>
                        </div>
                        <div class="content">
                            <!--<countTo :startVal='startVal' :endVal='endVal' :duration='duration'></countTo>-->
                            <el-row class="sc-number-wrap">
                                <el-col :span="8" class="ellipsis-l1">
                                    <span class="sc-title">{{organName}}当日警情</span>
                                </el-col>
                                <el-col :span="16">
                                    <ul class="dataNums inrow">
                                        <li class="dataOne " v-for="(item,index) in todayCount">
                                            <div class="dataBoc">
                                                <div class="tt" t="38" style="transition: all 2s ease-in-out 0s;">
                                                    <span class="num0">{{item}}</span>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </el-col>
                            </el-row>
                            <el-row class="sc-echarts-wrap">
                                <vab-chart
                                        ref="myCircle"
                                        theme="vab-echarts-theme"
                                        :autoresize="true"
                                        :options="chart4"
                                        class="my-circle"
                                />
                            </el-row>
                        </div>
                    </div>
                    <!--辖区警情统计-->
                    <div class="cell cell-2">
                        <div class="title">
                            <CommonSubtitle title="辖区警情统计" width="100%"></CommonSubtitle>
                        </div>
                        <div class="content">
                            <el-row class="sc-echarts-wrap">
                                <vab-chart :autoresize="true" :options="chart2"/>
                            </el-row>
                        </div>
                    </div>
                    <!--警情案发趋势-->
                    <div class="cell cell-2">
                        <div class="title">
                            <CommonSubtitle title="警情案发趋势" width="100%"></CommonSubtitle>
                        </div>
                        <div class="content">
                            <el-row class="sc-echarts-wrap">
                                <vab-chart :autoresize="true" :options="chart3"/>
                            </el-row>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content middle">
                    <div class="cell" v-for="item in statistics">
                        <div class="title">
                            <CommonSubtitle :title="item.name" width="100%" background="linear-gradient(45deg, #025AD1, #6750A0)" :center="true"></CommonSubtitle>
                        </div>
                        <div class="content">
                            <!--<span>{{item.num1}}</span>/<span>{{item.num2}}</span>-->
                            <span>{{item.num}}</span>
                        </div>
                    </div>
                    <!--加载svg地图-->
                    <div class="svg-map-wrap">
                        <svg-map @click-map="handleClickMap"></svg-map>
                        <!--<iframe src="/svgMap.html" id="iframeId" frameborder="0" width="100%" height="100%" scrolling="auto" class="iframeClass"></iframe>-->
                    </div>
                    <!--最新动态-->
                    <div class="cell cell-3">
                        <div class="title">
                            <CommonSubtitle title="最新动态" width="40%" ></CommonSubtitle>
                        </div>
                        <div class="content">
                            <vue-seamless-scroll :data="newDynamicAlarmList" :class-option="scrollOption">
                                <div v-for="(item,index) in newDynamicAlarmList" :key="index">
                                    <el-row class="alarm-list">
                                        <el-col :span="3">
                                            <span class="alarm-type">{{item.typeClassDes}}</span>
                                        </el-col>
                                        <el-col :span="15" class="text-left ellipsis-l1">
                                            <span class="alarm-content" :title="item.policeDetail">{{item.policeDetail}}</span>
                                        </el-col>
                                        <el-col :span="6" class="text-right">
                                            <span class="alarm-time">{{item.alarmTime}}</span>
                                        </el-col>
                                    </el-row>
                                    <el-divider></el-divider>
                                </div>
                            </vue-seamless-scroll>
                        </div>
                    </div>

                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content right">
                    <!--今日重点人员预警数-->
                    <div class="key-personnel-warning cell-1">
                        <div class="title">
                            <CommonSubtitle title="今日重点人员预警数" width="100%"></CommonSubtitle>
                        </div>
                        <div class="content">
                            <el-row :gutter="20">
                                <el-col :span="6" v-for="(item,index) in keyPersonnelWarning1" :key="index">
                                    <el-row class="padding-10 text-center background-light">
                                        <span class="font-size-15 font-bold color-fff">{{item.name}}</span>
                                    </el-row>
                                    <el-row class="padding-10 text-center background-dark">
                                        <span class="font-size-15 font-bold color-fff">{{item.num}}</span>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" class="margin-t-10">
                                <el-col :span="6" v-for="(item,index) in keyPersonnelWarning2" :key="index">
                                    <el-row class="padding-10 text-center background-light">
                                        <span class="font-size-15 font-bold color-fff">{{item.name}}</span>
                                    </el-row>
                                    <el-row class="padding-10 text-center background-dark">
                                        <span class="font-size-15 font-bold color-fff">{{item.num}}</span>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <!--今日实时动态数据-->
                    <div class="today-real-dynamic cell-1">
                        <div class="title">
                            <CommonSubtitle title="今日实时动态数据" width="100%"></CommonSubtitle>
                        </div>
                        <div class="content">
                            <el-row :gutter="20">
                                <el-col :span="8" v-for="(item,index) in todayRealDynamic1" :key="index">
                                    <el-row class="padding-10 text-center background-light">
                                        <span class="font-size-15 font-bold color-fff">{{item.name}}</span>
                                    </el-row>
                                    <el-row class="padding-10 text-center background-dark">
                                        <span class="font-size-15 font-bold color-fff">{{item.num}}</span>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="8" v-for="(item,index) in todayRealDynamic2" :key="index">
                                    <el-row class="padding-10 text-center background-light">
                                        <span class="font-size-15 font-bold color-fff">{{item.name}}</span>
                                    </el-row>
                                    <el-row class="padding-10 text-center background-dark">
                                        <span class="font-size-15 font-bold color-fff">{{item.num}}</span>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <!--人脸报警7日趋势图-->
                    <div class="cell cell-2">
                        <div class="title">
                            <CommonSubtitle title="近七日人脸报警7日趋势图" width="100%"></CommonSubtitle>
                        </div>
                        <div class="content">
                            <el-row class="sc-echarts-wrap">
                                <vab-chart :autoresize="true" :options="faceAlarmChart"/>
                            </el-row>
                        </div>
                    </div>
                    <!--近七日车辆报警趋势图-->
                    <div class="cell cell-2">
                        <div class="title">
                            <CommonSubtitle title="近七日车辆报警趋势图" width="100%"></CommonSubtitle>
                        </div>
                        <div class="content">
                            <el-row class="sc-echarts-wrap">
                                <vab-chart :autoresize="true" :options="carAlarmChart"/>
                            </el-row>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!--人脸-->
        <websocket ref="faceWebsocket" :url="faceSocket.wsUrl" :disconnect="false" v-if="faceSocket.wsUrl" title="人脸报警" @onmessage="faceWebsocketOnMessage" @onclose="faceWsocketOnClose"></websocket>
        <!--警情-->
        <websocket ref="alarmWebsocket" :url="alarmSocket.wsUrl" :disconnect="false" v-if="alarmSocket.wsUrl" title="警情报警" @onmessage="alarmWebsocketOnMessage" @onclose="alarmWsocketOnClose"></websocket>
        <!--案件-->
        <websocket ref="caseWebsocket" :url="caseSocket.wsUrl" :disconnect="false" v-if="caseSocket.wsUrl" title="案件报警" @onmessage="caseWebsocketOnMessage" @onclose="caseWsocketOnClose"></websocket>
        <!--车辆-->
        <websocket ref="vehicleWebsocket" :url="vehicleSocket.wsUrl" :disconnect="false" v-if="vehicleSocket.wsUrl" title="车辆报警" @onmessage="vehicleWebsocketOnMessage" @onclose="vehicleWsocketOnClose"></websocket>

    </div>
</template>

<script>
    import * as echarts from 'echarts'
    import VabChart from '@/utils/echarts'
    import CommonSubtitle from '@/components/Subtitle/CommonSubtitle'
    import svgMap from './components/svgMap.vue'
    import countTo from 'vue-count-to';
    import vueSeamlessScroll from 'vue-seamless-scroll'
    import {
        fetchPoliceCount,
        fetchStatisByOrgan,
        fetchStatisByType,
        fetchStatisTodayByOrgan,
        fetchStatisTodayByTime,
        fetchStatisTodayByType,
        fetchCount7Day,
        fetchCount7DayFaceAlert,
        fetchTodayCapture,
        fetchVehicleStatisTodayCapture,
        fetchFaceStatisTodayAlert,
        fetchSourceStatisCount,
        fetchFaceStatisTodayAlertm,

    } from '@/api/dashboard/dashboard'
    import {queryPoliceList} from '@/api/map/map'
    import {getAllParams} from '@/api/public'
    import extDateTime from '@/utils/ext.dateTime'
    import Websocket from "@/components/common/connectWebsocket.vue";

    export default {
        name: 'Index',
        components: {
            VabChart,
            CommonSubtitle,
            countTo,
            vueSeamlessScroll,
            Websocket,
            svgMap
        },
        data() {
            return {
                // 需要滚动的时间
                duration: 5000,
                // 初始值
                startVal: 0,
                todayCount:'',//警情总量
                totalCount:'',//当日警情总量
                // 最终值
                statistics:[
                    {
                        name:'治安监控',
                        num1:500,
                        num2:500,
                        num:0
                    },
                    {
                        name:'道路卡口',
                        num1:500,
                        num2:500,
                        num:0
                    },
                    {
                        name:'人脸卡口',
                        num1:500,
                        num2:500,
                        num:0
                    },
                    {
                        name:'制高点',
                        num1:500,
                        num2:500,
                        num:0
                    },
                    {
                        name:'立体云防',
                        num1:500,
                        num2:500,
                        num:0
                    },
                    {
                        name:'无线警力',
                        num1:500,
                        num2:500,
                        num:0
                    }
                ],
                policeAllData: [],
                policeAllTodayData: [],
                //警情总量echarts
                chart1: {
                    title: {
//                        text: '{val| 2014}\n{name| 警情总量 }',
                        text: '{name| 警情总量 }',
                        top: '45%',
                        left: '12%',
                        textStyle: {
                            rich: {
                                name: {
                                    fontSize: 10,
                                    fontWeight: 'normal',
                                    color: '#fff',
                                    padding: [2, 10]
                                },
                                num: {
                                    fontSize: 10,
                                    fontWeight: 'bold',
                                    color: '#2AC05D',
                                }
                            }
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        type: 'scroll', //分页类型
                        pageIconSize:8,
                        left: 'right',
                        icon: 'circle',
                        align: 'left',
                        top: '10%',
                        itemGap: 5,
                        textStyle: {
                            color: '#fff',
                            lineHeight: 10,
                            fontSize:10
                        },
                        data:[],
                        formatter: (name) => {
                            let count = 0;
                            this.policeAllData.map(item => {
                                if (item.name == name) {
                                    count = item.num;
                                }
                            })
                            return name + '   ' + count;
                        },
                    },
                    color: ['#FFAE00', '#52FF97', '#F53F8C','#9E87FF', '#52FFFF','#58D5FF', '#73ACFF', '#FDD56A', '#FDB36A', '#FD866A','#e8b2fd', '#28B1FF'],
                    series: [
                        {
                            name: '警情总量',
                            type: 'pie',
                            radius: ['60%', '90%'],
                            center: ['21%', '55%'],
                            clockwise: true,
                            avoidLabelOverlap: true,
                            hoverOffset: 10,
                            itemStyle: {
                                normal: {
                                    color: function(params) {
                                        return ['#FFAE00', '#52FF97', '#F53F8C','#9E87FF', '#52FFFF','#58D5FF', '#73ACFF', '#FDD56A', '#FDB36A', '#FD866A','#e8b2fd','#28B1FF', ][params.dataIndex]
                                    }
                                }
                            },
                            label: {
                                show: false,
                                position: 'outside',
//                                formatter: '{a|{b}：{d}%}\n{hr|}',
                                rich: {
                                    hr: {
                                        backgroundColor: 't',
                                        borderRadius: 3,
                                        width: 3,
                                        height: 3,
                                        padding: [3, 3, 0, -12]
                                    },
                                    a: {
                                        padding: [-30, 15, -20, 15]
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    length: 10,
                                    length2: 20,
                                    lineStyle: {
                                        width: 1
                                    }
                                }
                            },
                            data: [],
                        }
                    ]
                },
                //当日警情信息
                chart4: {
                    title: {
//                        text: '{val| 2014}\n{name| 当日警情 }',
                        text: '{name| 当日警情 }',
                        top: '45%',
                        left: '12%',
                        textStyle: {
                            rich: {
                                name: {
                                    fontSize: 10,
                                    fontWeight: 'normal',
                                    color: '#fff',
                                    padding: [2, 10]
                                },
                                num: {
                                    fontSize: 10,
                                    fontWeight: 'bold',
                                    color: '#2AC05D',
                                }
                            }
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        type: 'scroll', //分页类型
                        pageIconSize:8,
                        left: 'right',
                        icon: 'circle',
                        align: 'left',
                        top: '10%',
                        itemGap: 5,
                        textStyle: {
                            color: '#fff',
                            lineHeight: 10,
                            fontSize:10
                        },
                        data: [],
                        formatter: (name) => {
                            let count = 0;
                            this.policeAllTodayData.map(item => {
                                if (item.name == name) {
                                    count = item.num;
                                }
                            })
                            return name + '   ' + count;
                        },
                    },
                    color: ['#FFAE00', '#52FF97', '#28B1FF', '#F53F8C','#9E87FF', '#52FFFF','#58D5FF', '#73ACFF', '#FDD56A', '#FDB36A', '#FD866A',],
                    series: [
                        {
                            name: '当日警情',
                            type: 'pie',
                            radius: ['60%', '90%'],
                            center: ['21%', '55%'],
                            clockwise: true,
                            avoidLabelOverlap: true,
                            hoverOffset: 10,
                            itemStyle: {
                                normal: {
                                    color: function(params) {
                                        return ['#FFAE00', '#52FF97', '#28B1FF', '#F53F8C','#9E87FF', '#52FFFF','#58D5FF', '#73ACFF', '#FDD56A', '#FDB36A', '#FD866A',][params.dataIndex]
                                    }
                                }
                            },
                            label: {
                                show: false,
                                position: 'outside',
//                                formatter: '{a|{b}：{d}%}\n{hr|}',
                                rich: {
                                    hr: {
                                        backgroundColor: 't',
                                        borderRadius: 3,
                                        width: 3,
                                        height: 3,
                                        padding: [3, 3, 0, -12]
                                    },
                                    a: {
                                        padding: [-30, 15, -20, 15]
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    length: 10,
                                    length2: 20,
                                    lineStyle: {
                                        width: 1
                                    }
                                }
                            },
                            data: [],
                        }
                    ]
                },
                //辖区警情统计
                chart2: {
                    textStyle: {
                        fontSize: 15,
                        color:
                            '#6F7481'
                    }
                    ,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer:
                            {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                    }
                    ,
                    grid: {
                        top: "10%",
                        left:
                            "8%",
                        right:
                            '5px',
                        bottom:
                            "20%",

                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: [],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis:
                        [
                            {
                                type: 'value',
                                name: '个数',
                                splitLine: {
                                    show: false,
                                },
                                axisTick: {
                                    show: true,
                                },
                                axisLine: {
                                    show: true,
                                },
                                axisLabel: {
                                    show: true,
                                },
                            }
                        ],

                    series:
                        [
                            {
                                name: '个数',
                                type: 'bar',
                                barWidth: '40%',
                                data: [],
                                itemStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                            {
                                                offset: 0,
                                                color: '#00FFE3',
                                            },
                                            {
                                                offset: 1,
                                                color: '#4693EC',
                                            },
                                        ]),
                                    },
                                },
                            }
                        ]
                },
                //警情案件趋势
                chart3: {
                    textStyle: {
                        fontSize: 15,
                        color:
                            '#6F7481'
                    }
                    ,
                    tooltip: {
                        trigger: 'axis',
                    }
                    ,
                    grid: {
                        top: '15%',
                        left:
                            '5%',
                        right:
                            '5%',
                        bottom:
                            '3%',
                        containLabel:
                            true
                    }
                    ,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: [],
                            axisLabel: {
                                interval:0,
                                rotate:25,
                                fontSize:10
                            }
                        }
                    ],
                    yAxis:
                        [
                            {
                                type: 'value',
                                splitLine: {
                                    show: false     //去掉网格线
                                }
                            }
                        ],
                    series:
                        [
                            {
                                type: 'line',
                                smooth: true,
                                stack: '总量',
                                areaStyle: {},
                                itemStyle: {
                                    normal: { //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                offset: 0, color: '#0E353A' // 0% 处的颜色
                                            }, {
                                                offset: 0.3, color: '#0D323A' // 50% 处的颜色
                                            }, {
                                                offset: 1, color: '#091E38' // 100% 处的颜色
                                            }]
                                        ), //背景渐变色
                                        lineStyle: {        // 系列级个性化折线样式
                                            width: 2,
                                            type: 'solid',
                                            color: "#2BE241" //折线的颜色
                                        }
                                    }
                                },//线条样式
                                symbolSize: 5, //折线点的大小
                                data: []
                            }
                        ]
                },
                //今日重点人员预警数
                keyPersonnelWarning1:[
                    {name:'前科',num:0},
                    {name:'在逃',num:0},
                    {name:'涉毒',num:0},
                    {name:'上访',num:0},
                ],
                keyPersonnelWarning2:[
                    {name:'涉恐',num:0},
                    {name:'涉稳',num:0},
                    {name:'神经病',num:0},
                    {name:'其他',num:0},
                ],
                /*今日实时动态数据*/
                todayRealDynamic1:[
                    {name:'人脸抓拍',num:0},
                    {name:'人脸报警',num:0},
                    {name:'布控人数',num:0},
                ],
                todayRealDynamic2:[
                    {name:'车辆抓拍',num:0},
                    {name:'车辆报警',num:0},
                    {name:'布控车辆',num:0},
                ],
                //近七日人脸报警趋势图
                faceAlarmChart: {
                    textStyle: {
                        fontSize: 15,
                        color:
                            '#6F7481'
                    }
                    ,
                    tooltip: {
                        trigger: 'axis',
                    }
                    ,
                    grid: {
                        top: '15%',
                        left:
                            '5%',
                        right:
                            '5%',
                        bottom:
                            '3%',
                        containLabel:
                            true
                    }
                    ,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: []
                        }
                    ],
                    yAxis:
                        [
                            {
                                type: 'value',
                                splitLine: {
                                    show: false     //去掉网格线
                                }
                            }
                        ],
                    series:
                        [
                            {
                                type: 'line',
                                smooth: true,
                                stack: '总量',
                                areaStyle: {},
                                itemStyle: {
                                    normal: { //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                offset: 0, color: '#0E353A' // 0% 处的颜色
                                            }, {
                                                offset: 0.3, color: '#0D323A' // 50% 处的颜色
                                            }, {
                                                offset: 1, color: '#091E38' // 100% 处的颜色
                                            }]
                                        ), //背景渐变色
                                        lineStyle: {        // 系列级个性化折线样式
                                            width: 2,
                                            type: 'solid',
                                            color: "#2BE241" //折线的颜色
                                        }
                                    }
                                },//线条样式
                                symbolSize: 5, //折线点的大小
                                data: []
                            }
                        ]
                },
                //近七日车辆报警趋势图
                carAlarmChart: {
                    textStyle: {
                        fontSize: 15,
                        color:
                            '#6F7481'
                    }
                    ,
                    tooltip: {
                        trigger: 'axis',
                    }
                    ,
                    grid: {
                        top: '15%',
                        left:
                            '5%',
                        right:
                            '5%',
                        bottom:
                            '3%',
                        containLabel:
                            true
                    }
                    ,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: []
                        }
                    ],
                    yAxis:
                        [
                            {
                                type: 'value',
                                splitLine: {
                                    show: false     //去掉网格线
                                }
                            }
                        ],
                    series:
                        [
                            {
                                type: 'line',
                                smooth: true,
                                stack: '总量',
                                areaStyle: {},
                                itemStyle: {
                                    normal: { //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                offset: 0, color: '#112672' // 0% 处的颜色
                                            }, {
                                                offset: 0.3, color: '#0F2364' // 50% 处的颜色
                                            }, {
                                                offset: 1, color: '#091E38' // 100% 处的颜色
                                            }]
                                        ), //背景渐变色
                                        lineStyle: {        // 系列级个性化折线样式
                                            width: 2,
                                            type: 'solid',
                                            color: "#5970FE" //折线的颜色
                                        }
                                    }
                                },//线条样式
                                symbolSize: 5, //折线点的大小
                                data: []
                            }
                        ]
                },
                //最新动态
                newDynamicAlarmList:[
                    /*{
                        typeClassDes:'[人脸报警]',
                        policeDetail:'布控人员詹三于2020-10-10 00:00:50出现在招远汽车站，相似度90%',
                        alarmTime:'2020-10-10 00:00:50'
                    },
                    {
                        typeClassDes:'[警情信息]',
                        policeDetail:'2020-10-10 00:00:25，报警地点：招远汽车站，警情内容：发生打架斗殴',
                        alarmTime:'2020-10-10 00:00:50'
                    },
                    {
                        typeClassDes:'[车辆报警]',
                        policeDetail:'车牌号：鲁F1234F,2020-10-10 00:25:24，报警地点：招远汽车站，行车方向：由东向西',
                        alarmTime:'2020-10-10 00:25:24'
                    },*/
                ],
                //人脸
                faceSocket: { wsUrl: ''},
                //警情
                alarmSocket: { wsUrl: ''},
                //案件
                caseSocket: { wsUrl: ''},
                //车辆
                vehicleSocket: { wsUrl: ''},

                intervalId:null,
                organName:'招远市',
                organParam:{},

            }
        },
        // 监听属性
        computed: {
            scrollOption () {
                return {
                    step: 1, // 数值越大速度滚动越快
                    limitMoveNum: 3, // 开始无缝滚动的数据量 this.dataList.length
                    hoverStop: true, // 是否开启鼠标悬停stop
                    direction: 1, // 0向下 1向上 2向左 3向右
                    openWatch: true, // 开启数据实时监控刷新dom
                    singleHeight: 40, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
                    singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
                    waitTime: 3000 // 单步运动停止的时间(默认值1000ms)
                }
            }
        },
        mounted() {
            //将全局参数存放到缓存中
            this.storageGlobalParam();

           //最新动态：获取当日的警情信息
           this.getTodayPoliceList();
           //每隔一分钟，重新请求警情总量和当日警情总量
           this.intervalId = setInterval(()=>{
               //统计今日警情总数和所有警情总数  ---左上两个总数
               this.fetchPoliceCount();
               //根据类型统计所有警情 ----左第一个
               this.fetchStatisByType();
               //根据类型统计今日警情 ----左第二个
               this.fetchStatisTodayByType();
           },60*1000)

        },
        methods: {
            storageGlobalParam(){
                getAllParams().then(res=>{
                    res.data.map(item=>{
                        if(item.code == 'case_police_info_websocket_url' || item.code == 'case_websocket_url' ||
                            item.code == 'face_alert_websocket_url' || item.code == 'vehicle_alarm_websocket_url' ||
                            item.code == 'h5_manager_ip' || item.code == 'vehicle_gps_websocket_url'|| item.code == 'handset_websocket_url'){
                            localStorage.setItem(item.code,item.value);
                        }

                    });
                    //初始化数据
                    this.alarmSocket.wsUrl = localStorage.getItem('case_police_info_websocket_url');
                    this.caseSocket.wsUrl = localStorage.getItem('case_websocket_url');
                    this.faceSocket.wsUrl = localStorage.getItem('face_alert_websocket_url');
                    this.vehicleSocket.wsUrl = localStorage.getItem('vehicle_alarm_websocket_url');
                    this.initData();
                })
            },
            initData(){
                //统计今日警情总数和所有警情总数  ---左上两个总数
                this.fetchPoliceCount();

                //根据辖区统计警情
                this.fetchStatisByOrgan();

                //根据类型统计所有警情 ----左第一个
                this.fetchStatisByType();

                //根据类型统计今日警情 ----左第二个
                this.fetchStatisTodayByType();

                //根据辖区统计今日警情  ----左第三个
                this.fetchStatisTodayByOrgan();
                //统计近七天的警情 ----左第四个
                this.fetchStatisTodayByTime();

                //近七日车辆报警趋势图 ----右第四个
                this.fetchCount7Day();

                //近七日人脸报警趋势图 ----右第三个
                this.fetchCount7DayFaceAlert();

                //今日重点人员预警数 ----右第一个
                this.fetchTodayCapture();

                //统计今日车辆抓拍情况 -----右第二个
                this.fetchVehicleStatisTodayCapture();
                //统计今日人员实时动态数据 -----右第二个
                this.fetchFaceStatisTodayAlert();

                //中间总数
                this.fetchSourceStatisCount();
            },
            //统计今日警情总数和所有警情总数  ---左上两个总数
            fetchPoliceCount(){
                fetchPoliceCount(this.$qs.stringify(this.organParam)).then(res => {
                    //警情总量
                    this.totalCount = this.formatZero(res.data.totalCount,6);
                    //今日警情总量
                    this.todayCount = this.formatZero(res.data.todayCount,3);
                }).catch( err => {

                })

            },
            /** * 自定义函数名：formatZero
             * @param num： 需要补零的数值
             * @param len： 补零后的总位数
             */
            formatZero(num, len) {
                if(String(num).length > len) return num;
                return (Array(len).join(0) + num).slice(-len);
            },

            //根据辖区统计警情
            fetchStatisByOrgan(){
                fetchStatisByOrgan(this.$qs.stringify({})).then(res => {
                    /*//数据
                    let seriesOption = res.data.map((item)=>{
                        return item.num
                    });
                    //辖区
                    let xAxisOption = res.data.map((item)=>{
                        return item.name
                    });
                    //赋值
                    this.chart2.xAxis[0].data = xAxisOption
                    this.chart2.series[0].data = seriesOption*/

                }).catch( err => {

                })
            },

            //根据类型统计所有警情 ----左第一个
            fetchStatisByType(){
                /*this.policeAllData = [{"type":"030100","num":58408,"name":"道路交通事故"},{"type":"050100","num":9830,"name":"日常生活求助"},{"type":"051700","num":8834,"name":"信息咨询"},{"type":"020500","num":4421,"name":"殴打他人"},{"type":"020200","num":4158,"name":"盗窃"},{"type":"080600","num":3417,"name":"经济纠纷"},{"type":"080400","num":2913,"name":"邻里纠纷"},{"type":"080300","num":2492,"name":"家庭纠纷"},{"type":"020800","num":2279,"name":"损毁公私财物"},{"type":"011000","num":2005,"name":"盗窃"},{"type":"120700","num":1945,"name":"骚扰"},{"num":134546,"name":"其他"}]
                this.chart1.series[0].data = this.policeAllData.map((item)=>{
                    return {value:item.num,name:item.name}
                });
                this.chart1.legend.data = this.policeAllData.map((item)=>{
                    return item.name
                });*/
                const param = this.organParam;
                fetchStatisByType(this.$qs.stringify(param)).then(res => {
                    this.policeAllData = res.data;
                    this.chart1.series[0].data = this.policeAllData.map((item)=>{
                        return {value:item.num,name:item.name}
                    });
                    this.chart1.legend.data = this.policeAllData.map((item)=>{
                        return item.name
                    });

                }).catch( err => {

                })
            },

            //根据辖区统计今日警情  ----左第三个
            fetchStatisTodayByOrgan(){
                fetchStatisTodayByOrgan({}).then(res => {
                    //数据
                    let seriesOption = res.data.map((item)=>{
                        return item.num
                    });
                    //辖区
                    let xAxisOption = res.data.map((item)=>{
                        return item.name
                    });
                    //赋值
                    this.chart2.xAxis[0].data = xAxisOption
                    this.chart2.series[0].data = seriesOption
                }).catch( err => {

                })
            },

            //统计近七天的警情 ----左第四个
            fetchStatisTodayByTime(){
                fetchStatisTodayByTime({}).then(res => {
                    //倒叙
                    let arr = this.$lodash.reverse(res.data);
                    //时间
                    let timeOption = arr.map((item)=>{
                        return Object.keys(item)[0]
                    });
                    //数量
                    let numOption =  arr.map((item,index)=>{
                        return item[timeOption[index]]
                    });

                    this.chart3.xAxis[0].data = timeOption;
                    this.chart3.series[0].data = numOption;
                }).catch( err => {

                })
            },

            //根据类型统计今日警情 ----左第二个
            fetchStatisTodayByType(){
                const param = this.organParam;
                fetchStatisTodayByType(this.$qs.stringify(param)).then(res => {
                    this.policeAllTodayData = res.data;
                    this.chart4.series[0].data = this.policeAllTodayData.map((item)=>{
                        return {value:item.num,name:item.name}
                    });
                    this.chart4.legend.data = this.policeAllTodayData.map((item)=>{
                        return item.name
                    });
                    /*let legendOption = res.data.map((item)=>{
                        return item.name
                    })
                    this.chart4.series[0].data = this.policeAllTodayData;
                    this.chart4.legend.data = legendOption;*/

                }).catch( err => {

                })
            },

            //近七日车辆报警趋势图 ----右第二个
            fetchCount7Day(){
                fetchCount7Day({}).then(res => {
                    let arr = res.data;
                    //时间
                    let newObj = {}; // 新建一个对象
                    arr.forEach((item) => {
                        newObj = { ...newObj, ...item }  // 要把自己放进去
                    });
                    let timeOption = Object.keys(newObj);
                    //数量
                    let numOption =  timeOption.map((item,index)=>{
                        return newObj[item]
                    });

                    this.carAlarmChart.xAxis[0].data = timeOption;
                    this.carAlarmChart.series[0].data = numOption;
                }).catch( err => {

                })
            },

            //近七日人脸报警趋势图 ----右第三个
            fetchCount7DayFaceAlert(){
                fetchCount7DayFaceAlert({}).then(res => {
                    let arr = res.data;
                    //时间
                    let timeOption = Object.keys(arr)
                    //数量
                    let numOption =  timeOption.map((item,index)=>{
                        return arr[item]
                    });

                    this.faceAlarmChart.xAxis[0].data = timeOption;
                    this.faceAlarmChart.series[0].data = numOption;
                }).catch( err => {

                })
            },

            //今日重点人员预警数 ----右第一个
            fetchTodayCapture(){
                /*let res = {"code":"1000","msg":"请求成功","data":[{"name":"前科","num":0},{"name":"在逃","num":23},{"name":"涉毒","num":0},{"name":"上访","num":0},{"name":"涉稳","num":0},{"name":"涉恐","num":0},{"name":"涉案","num":5},{"name":"其他","num":0}]}
                let arr = res.data;
                this.keyPersonnelWarning1 = this.$lodash.slice(arr,0,4);
                this.keyPersonnelWarning2 = this.$lodash.slice(arr,4,8);*/
                fetchTodayCapture({}).then(res => {
                    let arr = res.data;
                    this.keyPersonnelWarning1 = this.$lodash.slice(arr,0,4);
                    this.keyPersonnelWarning2 = this.$lodash.slice(arr,4,8);


                    //时间
                    /*let timeOption = Object.keys(arr)
                    //数量
                    let numOption =  timeOption.map((item,index)=>{
                        return arr[item]
                    });

                    this.faceAlarmChart.xAxis[0].data = timeOption;
                    this.faceAlarmChart.series[0].data = numOption;*/
                }).catch( err => {

                })
            },

            //统计今日车辆抓拍情况 -----右第二个
            fetchVehicleStatisTodayCapture(){
                fetchVehicleStatisTodayCapture({}).then(res => {
                    let arr = res.data;
                    //todayRealDynamic2
                    this.todayRealDynamic2[0].num = res.data.hasOwnProperty('tadayCapture')? res.data.tadayCapture : 0;
                    this.todayRealDynamic2[1].num = res.data.hasOwnProperty('tadayAlert')? res.data.tadayAlert : 0;
                    this.todayRealDynamic2[2].num = res.data.hasOwnProperty('totalControl')? res.data.totalControl : 0;

                }).catch( err => {

                })
            },

            //统计今日车辆抓拍情况 -----右第二个
            fetchVehicleStatisTodayCapture(){
                fetchVehicleStatisTodayCapture({}).then(res => {
                    let arr = res.data;
                    //todayRealDynamic2
                    this.todayRealDynamic2[0].num =res.data.hasOwnProperty('tadayCapture')? res.data.tadayCapture : 0;
                    this.todayRealDynamic2[1].num = res.data.hasOwnProperty('tadayAlert')? res.data.tadayAlert : 0;
                    this.todayRealDynamic2[2].num = res.data.hasOwnProperty('totalControl')? res.data.totalControl : 0;

                }).catch( err => {

                })
            },

            //统计人脸报警情况  -----右第二个
            fetchFaceStatisTodayAlert(){
                fetchFaceStatisTodayAlert({}).then(res => {
                    let arr = res.data;
                    //todayRealDynamic2
                    this.todayRealDynamic1[0].num = res.data.hasOwnProperty('todayCaputre')? res.data.todayCaputre : 0;
                    this.todayRealDynamic1[1].num = res.data.hasOwnProperty('todayAlarm')? res.data.todayAlarm : 0;
                    this.todayRealDynamic1[2].num = res.data.hasOwnProperty('controlCount')? res.data.controlCount : 0;

                }).catch( err => {

                })
            },

            //中间顶部总数
            fetchSourceStatisCount(){
                fetchSourceStatisCount({}).then(res => {
                    this.statistics[0].num = res.data.hasOwnProperty('camraCount')? res.data.camraCount : 0;
                    this.statistics[3].num = res.data.hasOwnProperty('highCount')? res.data.highCount : 0;
                    this.statistics[5].num = res.data.hasOwnProperty('wirelessCount')? res.data.wirelessCount : 0;
                    this.statistics[1].num = res.data.hasOwnProperty('bayonetCount')? res.data.bayonetCount : 0;
                    this.statistics[2].num = res.data.hasOwnProperty('faceCount')? res.data.faceCount : 0;
                    this.statistics[4].num = res.data.hasOwnProperty('arCount')? res.data.arCount : 0;

                }).catch( err => {

                })
            },

            //人脸websocket 连接返回的数据
            faceWebsocketOnMessage(data) {
                let faceInfo = data.newestWarning[0]
                let newDynamicAlarm = {
                    typeClassDes:'[人脸报警]',
                    policeDetail:faceInfo.name + '于' + faceInfo.hitTime + '出现在' + faceInfo.cameraDes + '，相似度' + faceInfo.similarity,
                    alarmTime:faceInfo.hitTime,
                };
                this.newDynamicAlarmList.unshift(newDynamicAlarm);
            },
            //人脸websocket 关闭
            faceWsocketOnClose() {

            },
            //警情websocket 连接返回的数据
            alarmWebsocketOnMessage(data) {
                let newDynamicAlarm = {
                    typeClassDes:'['+data.typeClassDes+']',
                    policeDetail:data.alarmTime + '，报警地点：' + data.address + '，报警内容：' + data.policeDetail,
                    alarmTime:data.alarmTime,
                };
                this.newDynamicAlarmList.unshift(newDynamicAlarm);


            },
            //警情websocket 关闭
            alarmWsocketOnClose() {

            },
            //案件websocket 连接返回的数据
            caseWebsocketOnMessage(data) {
                let newDynamicAlarm = {
                    typeClassDes:'['+data.typeName+']',
                    policeDetail:data.caseTime + '，案发地址：' + data.address + '，案件内容：' + data.content,
                    alarmTime:data.caseTime,
                };
                this.newDynamicAlarmList.unshift(newDynamicAlarm);

            },
            //案件websocket 关闭
            caseWsocketOnClose() {

            },
            //车辆websocket 连接返回的数据
            vehicleWebsocketOnMessage(data) {
                let newDynamicAlarm = {
                    typeClassDes:'[车辆报警]',
                    policeDetail:'车牌号：' + data.plateNum + '，报警地点：' + data.bayonetName + '，行车方向：' + data.direction,
                    alarmTime:data.alarmTime,
                };
                this.newDynamicAlarmList.unshift(newDynamicAlarm);

            },
            //车辆websocket 关闭
            vehicleWsocketOnClose() {


            },
            //最新动态--查询当天所有的警情信息
            getTodayPoliceList(){
                const params = {
                    startTime:extDateTime.getTimeSelecttTime(extDateTime.curentDate() + ' 00:00:00',-7*24*3600*1000),
                    endTime:extDateTime.curentDate() + ' 23:59:59',
                };
                queryPoliceList(this.$qs.stringify(params)).then(res=>{
                    res.data.data.map(item=>{
                        item.typeClassDes = '['+item.typeClassDes+']';
                        this.newDynamicAlarmList.push(item);
                    })
                })
            },
            handleClickMap(data,selectedStatus){
                console.log(data,'data');
                if(data && JSON.stringify(data) != '{}'){
                    this.organName = selectedStatus?data.name:'招远市';
                    this.organParam = selectedStatus?{unitCode:data.unitCode}:{};
                    //统计今日警情总数和所有警情总数  ---左上两个总数
                    this.fetchPoliceCount();

                    //根据类型统计所有警情 ----左第一个
                    this.fetchStatisByType();

                    //根据类型统计今日警情 ----左第二个
                    this.fetchStatisTodayByType();

                    //重新启动定时器
                    this.intervalId && clearInterval(this.intervalId);
                    //每隔一分钟，重新请求警情总量和当日警情总量
                    this.intervalId = setInterval(()=>{
                        //统计今日警情总数和所有警情总数  ---左上两个总数
                        this.fetchPoliceCount();
                        //根据类型统计所有警情 ----左第一个
                        this.fetchStatisByType();
                        //根据类型统计今日警情 ----左第二个
                        this.fetchStatisTodayByType();
                    },60*1000)

                }
            }

        },
        beforeDestory(){
            if(this.intervalId){
                clearInterval(this.intervalId);
            }
        }
    }
</script>
<style lang="scss" type="text/scss">
    .index-container {
        margin: 0 !important;
        /*background: #00040D !important;*/
        /*height: calc(100vh - 65px);*/
        height: 100%;

    }
    .index-wrap{
        height: 100%;
        padding: 10px;
    }

    .grid-content {
        //height: calc(100vh - #{$base-top-bar-height} - 40px);
        height: calc(100vh - 80px);
        &.left {
            .cell {
                margin-bottom: 20px;
            }
            .cell-1 {
                height: calc(27% - 15px);
            }
            .cell-2 {
                height: calc(22% - 15px);
            }
            .content {
                height: calc(100% - 30px);
                background-color: #081B37;
                border: 1px solid #0D2C51;
                padding: 10px 20px;
            }
        }
        &.middle{
            padding: 0 15px;
            .cell {
                width: calc((100% - 90px)/6);
                margin-right: 15px;
                display: inline-block;
            }
            .content {
                background-color: #081B37;
                border: 1px solid #0D2C51;
                padding: 10px 20px;
                color: #fff;
                text-align: center;
                font-weight: 700;
                font-size: 18px;
                span{
                    margin: 0 10px;
                }
            }
            .cell-3{
                width: 100%;
                height: 20%;
                .content{
                    height: calc(100% - 30px);
                    font-size: 14px;
                    font-weight: 500;
                    color: #A9ACB3;
                    padding: 10px 20px;
                    overflow: hidden;
                }
                .alarm-type{
                    color: #D13A3C;
                }
                .el-divider {
                    background-color: #0F2756;
                    margin: 10px 0;
                }
                .alarm-list{
                    padding: 3px 0;
                }
            }
            .svg-map-wrap{
                height: calc(78% - 80px);
            }
        }
        &.right{
            .cell-1 {
                height: calc(27% - 15px);
                margin-bottom: 20px;
            }
            .cell-2 {
                height: calc(22% - 15px);
                margin-bottom: 20px;
            }
            .content {
                height: calc(100% - 30px);
                background-color: #081B37;
                border: 1px solid #0D2C51;
                padding: 10px 20px;
            }
        }
    }

    .sc-title {
        height: 35px;
        line-height: 35px;
        color: #fff;
        font-weight: bold;
        text-align: center;
    }

    .dataNums {
        display: block;
        width: 100%;
        text-align: right;
        .dataOne {
            width: 28px;
            height: 35px;
            margin: 0px 3px;
            text-align: center;
            background: url(images/num-bg.png) no-repeat;
            background-size: 100% 100%;
            position: relative;
            display: inline-block;

        }
        .dataBoc .tt {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        .tt span {
            width: 100%;
            height: 100%;
            font: bold 28px/40px "Arial";
            color: #ddf0ff;
        }
    }

    .cell-1 .sc-echarts-wrap {
        height: calc(100% - 40px);
    }

    .cell-2 .sc-echarts-wrap {
        height: 100%;
    }

    .echarts {
        width: 100%;
        height: 100%;
    }
    .background-dark{
        background-color: #081A34;
        border: 1px solid #2D5285;
    }
    .background-light{
        background-color: #0E2C54;
        border: 1px solid #193A67;
    }
</style>
