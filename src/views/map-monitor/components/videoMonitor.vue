<template>
    <div class="video-monitor-container">
       <el-row class="top-container">
           <el-col :span="16" class="left">
               <el-row class="margin-td-10">
                   <el-col :span="24">
                       <span class="margin-r-15 title">{{info && info.tankInfo.name}}</span>
                       <span class="storage" v-show="info && info.tankInfo.allowMedium">{{info && info.tankInfo.allowMedium}}</span>
                   </el-col>
               </el-row>
               <el-row class="margin-td-10">
                   <el-col :span="24">
                       <span class="margin-r-15">{{info && info.companyInfo.officeAddress}}</span>
                       <span class="margin-r-15">公司负责人：{{info && info.companyInfo.header}}（{{info && info.companyInfo.headerPhone}}）</span>
                       <span>紧急联系人：{{info && info.tankInfo.chargePerson}}（{{info && info.tankInfo.chargePhone}}）</span>
                   </el-col>
               </el-row>
           </el-col>
           <el-col :span="8" class="right">
               <span class="margin-r-20">液位  <span class="count" :class="{'danger':info && info.liquidAlarm == 1}">{{info && info.liquidlevel}}</span><span class="unit" :class="{'danger':info && info.liquidAlarm == 1}">m</span></span>
               <span class="margin-r-20">温度  <span class="count" :class="{'danger':info && info.tempAlarm == 1}">{{info && info.temp}}</span><span class="unit" :class="{'danger':info && info.tempAlarm == 1}">℃</span></span>
               <span>压力 <span class="count" :class="{'danger':info && info.pressureAlarm == 1}">{{info && info.pressure}}</span><span class="unit" :class="{'danger':info && info.pressureAlarm == 1}">MPa</span></span>
           </el-col>
       </el-row>
       <el-row class="bottom-container">
           <el-col class="left">
               <div class="filter-container">
                   <el-form ref="form" :model="form" label-width="80px">
                       <el-form-item label="轮巡间隔">
                           <el-input-number v-model="form.intervalTime" placeholder="轮巡间隔（秒）" type="number" min="30"></el-input-number>
                       </el-form-item>
                       <div class="text-center">
                           <el-button type="primary" size="medium" @click="startRoundPlay">开始轮巡</el-button>
                           <el-button size="medium" @click="stopRoundPlay">停止轮巡</el-button>
                       </div>
                   </el-form>
               </div>
               <common-subtitle :isBold="true" title="关联摄像机列表"></common-subtitle>
               <div class="list" v-scrollBar>
                   <div class="cam-cell" :class="{'active':roundPlayCameraList.indexOf(item)>-1}" v-for="(item,index) in cameraList">
                       <span class="ellipsis-l1">
                          <i class="self-icon gun-cam-online-icon"></i>
                           <span>{{item.cameraName}}</span>
                      </span>
                   </div>
               </div>
           </el-col>
           <el-col class="right">
               <real-play ref="realPlay"
                          :playState="playState"
                          btnShow="true"
                          :winCount="winNum_play"
                          :curWinCount="curWinNum_play"
                          :curRowCls="curVideoRowCls_play"
                          @change-win-num="changeWinNumFunc"
                          @change-win-zoom="updateData"
               ></real-play>
           </el-col>
       </el-row>
    </div>
</template>

<script>
    import realPlay from '@/components/common/realPlay.vue';
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {listHazardCameraQuery} from '@/api/majorHazardSource'
    export default {
        name: "VideoMonitor",
        props:['data'],
        components: {realPlay,CommonSubtitle},
        provide(){
            return {
                'autoOpenRightPanel':this.autoOpenRightPanel
            }
        },
        data() {
            return {
                form:{
                    intervalTime:30,  //轮巡时间
                },
                info:this.data,
                playState: 'realPlay',
                winNum_play: 4,    //窗口数量，默认为4窗口
                curWinNum_play: 4,   //当前的窗口数量
                curVideoRowCls_play: ['two-row'],  //窗口布局样式
                cameraList:[],
                roundPlayCameraList:[],
            }
        },
        watch:{
          'data':{
              handler(value){
                  this.info = value;
              },
              deep:true,
              immediate: true
          }
        },
        mounted(){
          //获取关联的摄像机
          this.getHazardCameraList();
        },
        methods: {
            /**
             * 改变录像回放的窗口数量
             * @param winNum
             * @param curWinNum
             * @param curVideoRowCls
             * @param state
             */
            changeWinNumFunc(winNum, curWinNum, curVideoRowCls, state) {
                if (state == 'realPlay') {
                    this.winNum_play = winNum;
                    this.curWinNum_play = curWinNum;
                    this.curVideoRowCls_play = curVideoRowCls;
                }

            },
            //双击放大窗口改变参数
            updateData(value1, value2, state) {
                if (state == "realPlay") {
                    this.winNum_play = value1;
                    this.curVideoRowCls_play = [value2];
                }
            },
            //自动打开右侧的抽屉
            autoOpenRightPanel(){

            },
            //获取关联的摄像机
            getHazardCameraList(){
                listHazardCameraQuery({hazardId:this.info.tankInfo.hazardId}).then(res=>{
                    this.cameraList = res.data;
                })
            },
            startRoundPlay(){
                if(!this.form.intervalTime){
                    this.$message({message:'请输入轮巡时间！',type:'warning'});
                    return
                }
                this.cameraList.map(item=>{
                    item.code = item.cameraCode;
                    item.text = item.cameraName;
                });
                this.realRoundPlay(this.cameraList,this.form.intervalTime);
            },

            /**
             *  轮巡播放
             * @param cameraArr：摄像机数组
             * @param turningTime：轮巡间隔
             */
            realRoundPlay(cameraArr, turningTime) {
                let cameraAtrr = cameraArr.concat();
                const winNum = this.curWinNum_play; //播放窗口数量
                let dom = this.$refs.realPlay;
                if (this.roundInterval) {
                    clearInterval(this.roundInterval);
                    dom.closeAllVideo();
                }
                let count = 1;
                /*if (self._pauseFlag) {//暂停轮播放后重新启动当前轮巡，播下一组
                    self._pauseFlag = false;
                    cameraAtrr = self.nextArry;
                }*/
                console.log("第1次轮训播放的视频数组", cameraAtrr.slice(0, winNum));
                dom.playAGroupOfVideo(cameraAtrr.slice(0, winNum), true);
                let cameraArry = cameraAtrr.splice(0, winNum);
                this.roundPlayCameraList = cameraArry; //记录正在轮巡的数组
                let nextCameraAtrr = cameraAtrr.concat(cameraArry);//第二次轮巡的点位数组
                // self.nextArry = cameraAtrr;
                this.roundInterval = setInterval(()=> {
                    count++;
                    this.realRoundPlay(nextCameraAtrr, turningTime);
                }, turningTime * 1000);
            },

            //停止轮巡
            stopRoundPlay() {
                let dom = this.$refs.realPlay;
                if (this.roundInterval) {
                    clearInterval(this.roundInterval);
                    dom.closeAllVideo();
                }
            },
        }
    }
</script>
<style lang="less">
    @import "../../video-monitor/styles/video-play-manage.less";
</style>
<style lang="scss" scoped>
    .top-container{
        width: 100%;
        height: 80px;
        padding: 10px 20px;
        border-radius: 3px;
        border: solid 1px #d2d2d2;
        .title{
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }
        .storage{
            padding: 3px 15px;
            background-color: #47a0f2;
            border-radius: 12px;
            color: #fff;
        }
        .right{
            height: 60px;
            line-height: 80px;
            text-align: right;
            .count{
                font-size: 24px;
                font-weight: bold;
            }
            .danger{
                color: #d9001b;
            }
            .warning{
                color: #f59a23;
            }
        }
    }
    .bottom-container{
        height: calc(100vh - 300px);
        padding: 15px 0;
        .left{
            width: 300px;
            height: 100%;
            border: 1px solid #d2d2d2;
            padding: 10px;
            margin-right: 10px;
            float: left;
            .common-subtitle{
                font-size: 17px;
            }
            .common-subtitle-i{
                width: 5px;
                height: 20px;
                margin: -4px 0px;
            }
            .list{
                height: calc(100% - 120px);
                padding: 10px;
                position: relative;
            }
            .cam-cell{
                height: 30px;
                line-height: 30px;
                background-color: #f6f6f6;
                border-radius: 2px;
                margin-bottom: 8px;
                padding-left: 10px;
                &.active{
                    background-color: #dbefff;
                    border: solid 1px #93cefc;
                }
            }
        }
        .right{
            width: calc(100% - 310px);
            height: 100%;
        }
    }

    /deep/ .el-form-item{
        margin-bottom: 10px;
    }
    /deep/ .el-input-number{
        width: 150px;
    }
</style>
