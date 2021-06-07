<template>
    <div class="left-container">
        <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="危险源告警" name="1">
                <div class="list" v-scrollBar>
                    <div class="cell" :class="{'active':selectedTankAlarmIndex==index}" v-for="(item,index) in tankAlarmData" @click="selectDangerSource(item,index)">
                        <el-tag type="warning" class="red-color" v-show="item.isResetting == 0">报警</el-tag>
                        <el-tag type="warning" class="green-color" v-show="item.isResetting == 1">复位</el-tag>
                        <p class="special"><span :title="item.tankInfo.name" class="title ellipsis-l1">{{item.tankInfo.name}}</span></p>
                        <p><label class="label ellipsis-l1" title="告警内容">告警内容：</label>
                            <span class="ellipsis-l1" :title="item.alarmContent">{{item.alarmContent}}</span>
                        </p>
                        <p><label class="label ellipsis-l1" title="告警时间">告警时间：</label><span class="ellipsis-l1" :title="item.alarmTime">{{item.alarmTime}}</span></p>
                        <p><label class="label ellipsis-l1" title="告警时间">更新时间：</label><span class="ellipsis-l1" :title="item.updateTime">{{item.updateTime}}</span></p>
                        <p><label class="label ellipsis-l1" title="所属企业">所属企业：</label><span class="ellipsis-l1" :title="item.companyInfo.companyName">{{item.companyInfo.companyName}}</span></p>
                        <!--<p><label class="label ellipsis-l1" title="负责人">负责人：</label><span class="ellipsis-l1" :title="item.tankInfo.chargePerson">{{item.tankInfo.chargePerson}}</span></p>-->
                        <!--<p><label class="label ellipsis-l1" title="告警时间">联系电话：</label><span class="ellipsis-l1" :title="item.tankInfo.chargePhone">{{item.tankInfo.chargePhone}}</span></p>-->
                        <p>
                            <span class="margin-r-10" @click="openVideoMonitor(item)"><span class="icon iconfont iconjiankong"></span>实时视频</span>
                            <span class="margin-r-10" @click="openEmergency(item)"><span class="icon iconfont iconyingjiyuan"></span>应急预案</span>
                        </p>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="进出口核验告警" name="2">
                <div class="list" v-scrollBar>

                </div>
            </el-collapse-item>
            <el-collapse-item title="装卸七连锁告警" name="3">
                <div class="list" v-scrollBar>

                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    import elDragDialog from '@/directive/el-drag-dialog'
    export default {
        name: "LeftMonitorAlarm",
        props:['tankAlarmData'],
        inject:['openDialog','locMarkerOpenInfoWindow','updateTankAlarm'],
        directives: {elDragDialog},
        data() {
            return {
                activeName: '1',
                dialogVisible:{
                    detail:false,
                },
                selectedTankAlarmIndex:0,   //选中的储罐报警的索引值
            }
        },
        mounted() {
            
        },
        watch:{
            /**
             * 报警列表展示：（1）新储罐报警，则新增一条
             *               （2）已有储罐报警，则删掉之前的报警数据，保留最新的一条
             *               （3）已有储罐报警复位，则删除之前的报警，展示最新的一条复位数据
             */
            'tankAlarmData':{
                handler(data){
                    //根据报警类型的值，获取报警内容
                    data.map(item=>{
                        let content = [];
                        if(item.liquidAlarm == 1){
                            content.push('液位报警');
                        }
                        if(item.tempAlarm == 1){
                            content.push('温度报警');
                        }
                        if(item.pressureAlarm == 1){
                            content.push('压力报警');
                        }
                        item.alarmContent = content.join('，');
                    });

                    //监听是否已复位，若是复位则对应的报警点重置为原始状态
                    if(data[0] && data[0].isResetting == 1){
                        //已复位
                        this.resetKey(data[0].tankId);
                        //将列表中已存在的报警的状态由“报警”转为“复位”
                        this.updateTankAlarm(data[0].id,data[0].tankId)

                    }else if(data[0] && data[0].isResetting == 0){
                        //若是该储罐已存在报警，则保留最新一条报警，旧报警删掉
                        this.updateTankAlarm(data[0].id,data[0].tankId);
                        //最新报警：定位--放大级别--弹出气泡窗口
//                        this.locMarkerOpenInfoWindow(data[0].tankId,'tank',true);

                        //调用点击事件，绘制报警波动范围(最新一条报警)
                        this.selectDangerSource(data[0],0);
                    }
                },
                deep:true
            }
        },
        methods: {
            openVideoMonitor(data){
                this.openDialog("videoMonitorDialogVisible",data)
            },
            openEmergency(data){
                this.openDialog("egDialogVisible",data)
            },
            //选中危险源报警信息
            selectDangerSource(data,index){
                this.selectedTankAlarmIndex = index;
                this.$emit('selectTankAlarmData',data);
                //最新报警：定位--放大级别--弹出气泡窗口
                this.locMarkerOpenInfoWindow(data.tankId,'tank',true);
            },

            handleSelectDangerSource(data,index){
                this.selectedTankAlarmIndex = index;
                //最新报警：定位--放大级别--弹出气泡窗口
                this.locMarkerOpenInfoWindow(data.tankId,'tank',true);
            },
            //复位
            resetKey(id){
                this.$emit('reset',id,true)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .left-container{
        width: 100%;
        height: 100%;
    }
    /deep/ .el-collapse{
        border-top: 1px solid #606266;
        border-bottom: 1px solid #606266;
    }
    /deep/ .el-collapse-item__wrap{
        border-bottom: none;
        height: calc(100vh - 165px);
    }
    /deep/ .el-collapse-item__header{
        font-size: 15px;
        font-weight: bold;
        background-color: #33455b;
        color: #fff;
        height: 35px;
        line-height: 35px;
        padding: 10px;
    }
    .list{
        height: calc(100vh - 175px);
        padding: 10px;
        position: relative;
        .cell{
            border: 1px solid #eee;
            border-radius: 5px;
            padding: 5px 10px;
            margin-bottom: 10px;
            cursor: pointer;
            &.active{
                border: 1px solid #1a70dc;
                background-color: #f7fcff;
            }
            .el-tag{
                float: right;
                width: 60px;
                height: 23px;
                line-height: 23px;
                border-radius: 9px 3px 3px 9px;
                color: #fff;
                text-align: center;
                right: 10px;
                position: absolute;
            }
            p{
                height: 25px;
                line-height: 25px;
                color: #666;
                &.special{
                    width: calc(100% - 50px);
                }
            }
            .label{
                width: 70px;
                display: inline-block;
                float: left;
                text-align: left;
                font-weight: 500;
            }
            span.ellipsis-l1{
                display: inline-block;
                width: calc(100% - 70px);
                display: inline-block;
            }
            span.title{
                color: #333;
                font-size: 16px;
                font-weight: bold;
            }
            .iconfont{
                font-size: 16px;
                color: #46a6ff;
                cursor: pointer;
                margin-right: 3px;
            }
            .status-tag{
                padding: 3px 12px;
                border: 1px solid;
                border-radius: 9px;
            }
        }
    }
    .orange-color{
        background-color: #f59a23;
        color: #fff;
    }
    .red-color{
        background-color: #d10909;
        color: #fff;
    }
    .green-color{
        background-color: #259920;
        border-color: #259920;
        color: #fff;
    }
    .blue-color{
        background-color: #6292e0;
        border-color: #6292e0;
        color: #fff;
    }
</style>
