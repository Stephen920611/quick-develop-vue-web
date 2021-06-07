<!--新版本V1.1-->
<template>
    <div id="playBackContainer" ref="playBackContainer">
        <div class="multiple-win-wrap" :class="{'full-screen':$store.state.video.isFullScreen}">
            <video-comm
                    ref="videoComm"
                    :playState="playState"
                    :winSelectData="winSelectData"
                    @click-win="handleClickWin"
            ></video-comm>
        </div>
        <div id="multiple-channel-choose" v-show="(!$store.state.video.isFullScreen && isShowBtn)">
            <df-drop-down name="窗口选择" type="primary" :data="winSelectData" :defaultValue="curVideoRowCls"
                          @command="handleChooseWin"></df-drop-down>
            <div class="video-btn-group play-back">
                <el-button size="medium" type="primary" @click="pauseAllVideo">暂停全部</el-button>
                <el-button size="medium" type="primary" @click="playAllVideo">播放全部</el-button>
                <el-button size="medium" type="primary" @click="closeAllVideo">关闭全部</el-button>
                <el-button size="medium" type="primary" @click="handleFullScreen">全屏</el-button>
                <el-button size="medium" type="primary" @click="playBackSpeedCtl(0.25)">1/4倍速</el-button>
                <el-button size="medium" type="primary" @click="playBackSpeedCtl(0.5)">1/2倍速</el-button>
                <el-button size="medium" type="primary" @click="playBackSpeedCtl(1)">常速</el-button>
                <el-button size="medium" type="primary" @click="playBackSpeedCtl(2)">2倍速</el-button>
                <el-button size="medium" type="primary" @click="playBackSpeedCtl(4)">4倍速</el-button>
              <!--  <el-button size="medium" type="primary">异步回放</el-button>
                <el-button size="medium" type="primary">收藏录像</el-button>-->
            </div>
        </div>
        <div ref="timeLineBox" id="timeLineBox">
            <template v-for="(item,index) in timeBarsComp">
                <TimeLine ref="timeline" :isCurrent="item.current" :startTime="startTime" :endTime="endTime"
                          :hoursPerRuler="hoursPerRuler" :width="timeParam.canvasWidth" :height="62"
                          @click-bar="handleClickBar" @click-stop-video="stopVideoPlay(index)"></TimeLine>
            </template>
        </div>
    </div>
</template>
<script>
    import {doGetVideotape, checkUserCameraPower} from '@/api/video';
    import screenfull from 'screenfull';
    import passParam from '@/utils/ext.passParam';
    import utility from '@/utils/ext.utility';
    import dateTime from '@/utils/ext.dateTime';
    import videoPlayer from '@/utils/videoPlayer'

    import videoComm from './videoComm.vue';
    import dfDropDown from './dropDownMenu.vue';
    import TimeLine from './timeLine.vue';

    export default {
        props: ['playState', 'startTime', 'endTime', 'hoursPerRuler', 'btnShow'],
        inject:['judgeAuthorityFunc'],
        data() {
            return {
                winSelectData: [
                    {code: 'one-row', des: '单窗口', winNum: 1, choosed: false},
                    {code: 'two-row', des: '4窗口', winNum: 4, choosed: true},
                    {code: 'three-row', des: '9窗口', winNum: 9, choosed: false},
                    {code: 'four-row', des: '16窗口', winNum: 16, choosed: false}
                ],
                winNum: 4,    //窗口数量，默认为4窗口
                curWinNum: 4,   //当前的窗口数量
                curVideoRowCls: ['two-row'],  //窗口布局样式
                isShowBtn: this.btnShow,
                timeParam: {
                    canvasWidth: 1300
                },
                timeBarsComp: [],   //时间轴组件
                checkedWinNum: 0,
                ctrlDefaultValue: 90, //云台控制的速度
                pauseStatusArray: [],  //对应窗口下的暂停状态；
                timeLineClose: false,     //是否关闭时间轴，如果是关闭按钮，则为true，如果是点击时间轴，则为false

                winObjHash: new utility.hashTable(),  //窗口号与摄像机编号进行绑定
                videoObjHash: new utility.hashTable(),
                browser: utility.getBrowserInfoForVideo(),
                aimWinNum: null,
                prevTime:0,    //记录录像播放的上一次时间
                videoPlayer: null,

            }
        },
        components: {
            videoComm,
            dfDropDown,
            TimeLine
        },
        watch: {
            //监听是否全屏，只要操作就要重新给时间轴赋值宽度
            '$store.state.video.isFullScreen': {
                handler() {
                    if (this.$refs.videoComm.playState == 'playBack') {
                        setTimeout(() => {
                            //重新给时间轴赋值宽度
                            this.timeParam.canvasWidth = this.$refs.playBackContainer.clientWidth;
                        }, 300)
                    }
                }
            },

        },
        mounted() {
            this.curVideoRowCls = ['two-row'];  //窗口布局样式
            //页面加载完毕后，初始化时间轴的宽度
            this.$nextTick(() => {
                if (document.getElementById("realPlayContainer")) {
                    this.timeParam.canvasWidth = document.getElementById("realPlayContainer").offsetWidth;
                } else {
                    this.timeParam.canvasWidth = document.getElementById("playBackContainer").offsetWidth;
                }
            });
            passParam.$on('get-ctrl-value', (value) => {
                this.ctrlDefaultValue = value;
            });
            //根据窗口初始化时间轴对象
            this.initTimeBarFunc();
        },
        methods: {
            //传递this对象
            sendVueInstance() {
                this.videoPlayer = new videoPlayer(this,'playBack');
              /*  videoPlayer.sendThis(this);
                videoPlayer._playType = 'playBack';*/
            },
            //切换窗口显示的数量
            handleChooseWin(command) {
                this.winSelectData.forEach(item => {
                    item.choosed = false;
                    if (item.code == command) {
                        item.choosed = true;
                        this.$refs.videoComm.handleChangeWin(item.winNum)
                    }
                });

            },
            handleFullScreen() {
                //全屏显示
                if (!screenfull.enabled) {
                    this.$message({
                        message: '浏览器不支持全屏显示！',
                        type: 'warning'
                    });
                    return false
                }
                //获取选中的窗口元素
                //let winInx = this.$refs.videoComm.checkedWinIndex + 1;
                //let domObj = document.querySelector("#playBackContainer #win"+winInx);
                let domObj = document.querySelector("#playBackContainer");
                screenfull.toggle(domObj);
                this.$store.dispatch('video/videoIsFullScreen', true);
                //重新给时间轴赋值宽度
                setTimeout(() => {
                    this.timeParam.canvasWidth = this.$refs.playBackContainer.clientWidth;
                }, 500)
            },

            /*
            * 初始化时间轴组件
            *  根据窗口数量，初始化进度条timeBar对象
            */
            initTimeBarFunc() {
                this.timeBarsComp = [];
                //初始化时间轴组件
                for (let i = 0; i < 16; i++) {
                    const timeBarComp = {
                        startTime: '',//时间轴默认开始时间
                        endTime: '',   //时间轴默认结束时间 = 0;
                        cameraId: '',
                        cameraName: '',
                        camObj: {},
                        cells: [],  //录像块
                        current: (i == 0) ? true : false,  //当前显示的时间轴
                        intervalTimer: null,   //定时器
                    };
                    this.timeBarsComp.push(timeBarComp);
                    this.pauseStatusArray.push(false);
                }
            },
            /**
             * 根据选中的当前窗口，获取当前的时间轴
             */
            getCurrProgressBar() {
                //获取当前时间轴组件的时间轴对象
                let checkedWinIndex = this.$refs.videoComm.checkedWinIndex;
                return this.timeBarsComp[checkedWinIndex];
            },
            /**
             * 为当前进度条设置待播放的摄像机对象
             * @param camNode   摄像机对象
             */
            setCameraId(camNode) {
                let timeBar = this.getCurrProgressBar();
                timeBar.cameraId = camNode.code;
                timeBar.cameraName = camNode.text;
                timeBar.camObj = {
                    'code': camNode.code,
                    'text': camNode.text,
                    'cameraType': camNode.typeCode
                };
                let winInx = this.$refs.videoComm.checkedWinIndex;
                this.$set(this.timeBarsComp, winInx, timeBar);
            },
            /**
             * 选择日期并回放,时间格式：2001-01-01T00:00:00
             * @param startDate
             * @param startT   查询录像的开始时间
             * @param endT     查询录像的结束时间
             */
            chooseDateAndPlayBack(startDate, startT, endT) {
                //获取时间轴对象
                let currInstance = this.getCurrProgressBar();
                currInstance._startT = startDate;
                currInstance.startTime = startT;
                currInstance.endTime = endT;
                currInstance.cells = [];
                let winInx = this.$refs.videoComm.checkedWinIndex;
                this.$set(this.timeBarsComp, winInx, currInstance);
                //查询当前的录像
                this.queryPlayBack(currInstance, false);
            },

            initCanvas(start_timestamp, timecell, end_timestamp, returnTime) {
                let winInx = this.$refs.videoComm.checkedWinIndex;
                this.$refs.timeline[winInx].initCanvas(start_timestamp, timecell, end_timestamp, returnTime)
            },

            /**
             * 查询录像
             * @param timeBar  当前的进度条对象
             * @param flag  是否需要重置进度条状态
             */
            queryPlayBack(timeBar, flag) {
                const self = this;
                if (!timeBar.cameraId) {
                    self.$message({message: "请重新选择摄像机点位", type: 'warning', showClose: true});
                    return false;
                }
                const param = {
                    "camCode": timeBar.cameraId,
                    "startT": timeBar.startTime,
                    "endT": timeBar.endTime
                };
                doGetVideotape(param).then(res => {
                    const data = res.data;
                    if (JSON.stringify(data) === '{}') {
                        self.$message({message: "服务异常", type: 'warning', showClose: true});
                        return;
                    }
                    const response = JSON.parse(data.result);
                    console.log('@2019录像', response);
                    if (response.Header['Status'] === "500") {//服务异常
                        self.$message({message: "服务异常", type: 'warning', showClose: true});
                        return;
                    }
                    //请求成功时处理
                    if (!response || !response.Body || response.Body['Num'] < 1) {
                        self.$message({message: "暂无录像", type: 'warning', showClose: true});
                        //重置进度条状态
                        this.initCanvas(new Date(timeBar.startTime).getTime(), [], new Date(timeBar.endTime).getTime(), 0);
                        return;
                    }
                    if (flag) {
                        //重置进度条状态
                        this.initCanvas(new Date(timeBar.startTime).getTime(), [], new Date(timeBar.endTime).getTime(), 0);
                    }
                    //绘制录像块
                    const recordData = response.Body['Record_info'];
                    let timeCells = [];
                    recordData.forEach(item => {
                        timeCells.push({
                            "beginTime": new Date(item.Start_time.replace('T', ' ')).getTime(),
                            "endTime": new Date(item.End_time.replace('T', ' ')).getTime(),
                            "style": {
                                "background": "rgba(132, 244, 180, 0.498039)"
                            }
                        });
                    });
                    console.log("timeCells", timeCells);
                    timeBar.cells = timeCells;
                    let winInx = this.$refs.videoComm.checkedWinIndex;
                    this.$set(this.timeBarsComp, winInx, timeBar);
                    this.$refs.timeline[winInx].updateTimeCell(timeCells);

                }).catch((res) => {
                    self.$message({message: res.data.message, type: 'error', showClose: true})
                })
            },
            /**
             *  切换窗口时，将已查询到的录像块添加到对应的时间轴上
             *
             */
            handleClickWin(winIndex) {
                //获取timeBar对象
                this.checkedWinNum = winIndex;
                this.timeBarsComp.forEach((item, index) => {
                    item.current = index == winIndex ? true : false;
                });
                const timeBar = this.timeBarsComp[winIndex];
                const timeCells = timeBar.cells;
                this.$refs.timeline[winIndex].updateTimeCell(timeCells);
            },

            /**
             * 点击时间轴的回调函数--播放录像
             *
             */
            handleClickBar(clickTime) {
                this.timeLineClose = false;
                const timeBar = this.getCurrProgressBar(); //获取当前的timeBar对象
                const startPlayT = clickTime.replace(' ', 'T');
                //先检查用户是否有“视频录像”的权限
                //1视频预览 2抓拍 3视频录像 4云台控制 5录像查询 6录像下载
                this.judgeAuthorityFunc(3,timeBar.camObj.code,()=>{
                    //用户有权限，进行录像播放
                    this.videoPlayer.playVideoByCameraId(timeBar.camObj, '#playBackContainer #video-content>li', 'playBack', startPlayT, timeBar.endTime,true);
                    //将当前窗口的暂停状态设置为false
                    const checkedWinIndex = this.$refs.videoComm.checkedWinIndex;
                    this.pauseStatusArray[checkedWinIndex] = false;
                });
            },

            //播到查询所有的视频播放完毕后自动暂停
            stopVideoPlay(index) {
                this.$refs.videoComm.handleOperBtn(1, index);
            },
            /**
             * 播放指定视频
             * @param winNum    待播放的视频窗口
             * @param type  播放类型：实时视频/录像回放
             */
            playAppointVideo(winNum, type) {
                this.videoPlaySubFunc(winNum, type);
            },
            /**
             * 播放视频逻辑
             * @param winNum    待播放的视频窗口
             * @param type  播放类型：实时视频/录像回放
             */
            videoPlaySubFunc(winNum, type) {
                let self = this;
                let winsArr = self.videoObjHash.getKeys();
                if (winNum) {//播放指定视频
                    videoPlayInWin(winNum);
                } else {
                    for (let i = 0; i < winsArr.length; i++) {
                        videoPlayInWin(winsArr[i]);
                    }
                }

                /**
                 * 在指定窗口中播放视频
                 * @param num   窗口号
                 */
                function videoPlayInWin(num) {
                    const winIndex = parseInt(winNum.substring(3, winNum.length)) - 1;
                    self.pauseStatusArray[winIndex] = false;   //播放时，将指定窗口中的“暂停状态”设置为false
                    let instance = self.videoObjHash.getValue(num);
                    if (type == "playBack") {
                        instance.doPlayBackCtrl(1);
                    }
                    self.$set(self.$refs.videoComm.showInfo.playPauseShow, winIndex, false);   //隐藏暂停按钮

                }
            },
            /**
             * 暂停指定视频
             * @param winNum    待关闭的视频窗口
             * @param type  播放类型：实时视频/录像回放
             */
            pauseAppointVideo(winNum, type) {
                this.videoPlayer.videoPause(false, winNum, type);
                const winIndex = parseInt(winNum.substring(3)) - 1;
                console.log(winIndex, "win");
                this.pauseStatusArray[winIndex] = true;
            },
            /**
             * 关闭指定视频
             * @param winSelect 视频窗口选择器（精确到li）
             * @param winNum    待关闭视频的窗口号
             * @param type  播放类型：实时视频/录像回放
             */
            closeAppointVideo(winNum, type) {
                let self = this;
                if (winNum) {
                    self.timeLineClose = true;
                    this.videoPlayer.videoPause(true, winNum, type);
                    //清空视频对象状态hash
                    let index = parseInt(winNum.substring(3)) - 1;
                    self.$refs.videoComm.videoWinSelect[index].playState = 'noPlay';
                    self.$refs.timeline[index].updateTimeCell([]);
                    self.$refs.timeline[index].updateReturnTime(this.startTime - 1000 * 24 * 60 * 60);
                    //重置对应时间轴参数
                    const timeBarComp = {
                        startTime: '',//时间轴默认开始时间
                        endTime: '',   //时间轴默认结束时间 = 0;
                        cameraId: '',
                        cameraName: '',
                        camObj: {},
                        cells: [],  //录像块
                        current: (index == 0) ? true : false,  //当前显示的时间轴
                        intervalTimer: null,   //定时器
                    };
                    this.timeBarsComp[index] = timeBarComp;
                    //清除定时器
                    this.clearTimeBarInterval(index);
                }
            },
            /**
             * 暂停所有的视频
             */
            pauseAllVideo() {
                this.videoPlayer.videoPause(false, false, 'playBack');
                this.pauseStatusArray.map(item => {
                    item = true
                })
            },
            /**
             * 播放所有的视频
             */
            playAllVideo() {
                this.videoPlaySubFunc(false, 'playBack');
                this.pauseStatusArray.map(item => {
                    item = false
                })
            },
            /**
             * 关闭所有的视频
             */
            closeAllVideo() {
                //重置所有时间轴
                this.checkedWinNum = 0;
                this.$refs.videoComm.checkedWinIndex = 0;
                this.timeLineClose = true;
                this.pauseStatusArray.map(item => {
                    item = false
                })
                //this.initTimeBarFunc();
                //关闭所有视频
                this.videoPlayer.videoPause(true, null, 'playBack');
                this.$refs.videoComm.videoWinSelect.forEach(item => {
                    item.playState = 'noPlay';
                });
                //选中窗口定位到第一个
                this.$refs.videoComm.checkedWinIndex = 0;
                let videoWinSelectArr = this.$refs.videoComm.videoWinSelect;
                videoWinSelectArr.forEach((item, index) => {
                    item.checked = index == 0?true:false
                });
                //重置所有时间轴
                this.$refs.timeline.forEach((item, index) => {
                    item.updateTimeCell([]);
                    item.updateReturnTime(this.startTime - 1000 * 24 * 60 * 60);
                    //清除时间轴的定时器
                    this.clearTimeBarInterval(index);
                });
                //初始化时间轴参数
                this.initTimeBarFunc();

            },
            /**
             * 云台控制
             * @param winSelect   窗口号，如win1
             * @param cmd   控制指令
             * @param speed 速度
             * @param dir   方向
             */
            handleCtrl(winSelect, cmd, dir) {
                var self = this;
                let instance = self.videoObjHash.getValue(winSelect);
                let speed = this.ctrlDefaultValue ? this.ctrlDefaultValue : 90;
                console.log("云台控制速度：", speed);
                if (instance) {
                    let cameraCode = instance._cameraid;
                    instance.doCmd(cameraCode, cmd, speed + '', '0', '0');
                } else {
                    this.$message({
                        message: '请先选择摄像机！',
                        type: 'warning'
                    });
                }
            },

            /**
             *  根据视频播放的当前时间currentTime  设置时间轴的当前时间刻度(播放位置)
             */
            setBarTimePlayLoc() {
                let currentBar = this.getCurrProgressBar();
                let checkedWinIndex = this.$refs.videoComm.checkedWinIndex;
                let currentTime = 0;   //当前时间
                let moveTime = 0;  //每次移动的时间间隔
                currentBar.intervalTimer && clearInterval(currentBar.intervalTimer);
                console.log("this.prevTime---2222",this.prevTime);
                if (this.pauseStatusArray[checkedWinIndex]) {
                    //暂停时，不再移动时间轴刻度
                    return
                }

                currentBar.intervalTimer = setInterval(() => {
                    currentTime = document.getElementById('playBackContainer').getElementsByTagName('video')[checkedWinIndex].currentTime;
                    moveTime = currentTime - this.prevTime;
                    console.log("this.prevTime---333",this.prevTime,moveTime);
                    //移动时间轴刻度
                    this.$refs.timeline[checkedWinIndex].setBarTimeMove(moveTime);
                    this.prevTime = currentTime;
                }, 1000)
            },
            clearTimeBarInterval(winIndex) {
                let timeBar = this.timeBarsComp[winIndex];
                timeBar.intervalTimer && clearInterval(timeBar.intervalTimer);
                timeBar.intervalTimer = null;
            },

            /**
             *  录像倍速控制
             * @speed 速度
             */
            playBackSpeedCtl(speed) {
                const checkVideoWin = this.$refs.videoComm.checkedWinIndex;
                const playState = this.$refs.videoComm.videoWinSelect[checkVideoWin].playState;
                if (playState == 'noPlay') {
                    this.$message({message: '当前选中的窗口暂没有录像播放，无法修改播放速度!', type: 'warning', showClose: true});
                    return
                }
                //控制录像播放速度
                let instance = this.videoObjHash.getValue('win' + (checkVideoWin + 1));
                instance.doPlayBackCtrl(speed);
            },

            /**
             *  设置指定窗口被选中
             */
            setTargetWinChecked(winIndex) {
                this.$refs.videoComm.checkedWinIndex = winIndex;
                this.$refs.videoComm.videoWinSelect.forEach((item, index) => {
                    item.checked = index == winIndex ? true : false;
                });
            },
            /**
             *  取消当前窗口的选中状态
             */
            cancelWinCheckStatus(winIndex) {
                this.$refs.videoComm.videoWinSelect[winIndex].checked = false;
            },
            /**
             *  当前窗口播放时，显示摄像机名称
             */
            showCameraNameInWin(winIndex, camName, cameraId) {
                this.$set(this.$refs.videoComm.showInfo.cameraName, winIndex, camName);
                this.$set(this.$refs.videoComm.showInfo.cameraCode, winIndex, cameraId);
            },

            /**
             * 设置指定窗口的播放状态 若是指定窗口正在播放，将指定窗口的播放状态置为'play'
             * @param status:'Play','noPlay'
             */
            setTargetWinPlayStatus(status, winIndex) {
                this.$refs.videoComm.videoWinSelect[winIndex].playState = status;
            },

            getTargetWinPlayStatus(winIndex){
              return this.$refs.videoComm.videoWinSelect[winIndex].playState
            },
            /**
             * 获取选中窗口的video对象
             */
            getCheckedVideoObj() {
                let videoWinSelectArr = this.$refs.videoComm.videoWinSelect;
                let videoCheckedWinSelect;
                videoWinSelectArr.forEach((item, index) => {
                    if (item.checked) {
                        videoCheckedWinSelect = item;
                    }
                });
                return videoCheckedWinSelect
            },
            /**
             * 窗口中隐藏暂停图标
             */
            showOrHidePauseIcon(winIndex, flag) {
                this.$set(this.$refs.videoComm.showInfo.playPauseShow, winIndex, flag);
            },
            /**
             * 窗口中隐藏"资源无法加载提示"
             */
            showOrHideUnavailableSource(winIndex, flag) {
                this.$set(this.$refs.videoComm.showInfo.unavailableSourceShow, winIndex, flag);
            },

            /**
             *  选中下一个播放窗口
             */
            selectedNextWin(currentWinIndex) {
                const currentWinNum = this.$refs.videoComm.currentWinCount;
                if (currentWinIndex == currentWinNum - 1) {
                    this.$refs.videoComm.checkedWinIndex = 0;   //更新选中视频窗口的索引值
                    this.$refs.videoComm.videoWinSelect[0].checked = true;  //更新下一个待播放视频窗口的选中信息
                } else {
                    this.$refs.videoComm.checkedWinIndex = currentWinIndex + 1;
                    this.$refs.videoComm.videoWinSelect[currentWinIndex + 1].checked = true;
                }
            },
            /**
             * 获取当前窗口的数量
             */
            getCurrentWinCount() {
                return this.$refs.videoComm.currentWinCount;
            },
            /**
             * 获取选中当前窗口的索引值
             */
            getCheckedWinIndex() {
                return this.$refs.videoComm.checkedWinIndex;
            },


            /**
             * 显示连接的错误码和错误提示
             * @param
             */
            showErrorCodeAndContent(winIndex, status, info) {
                this.$refs.videoComm.showInfo.errorCode[winIndex] = status;
                this.$refs.videoComm.showInfo.errorContent[winIndex] = info;
            },

            /**
             * 显示视频重连提示
             * @param liObj 视频窗口选择器，精确到div[data-win="xxx"]一级
             */
            showReconnectNotice(winIndex) {
                this.$set(this.$refs.videoComm.showInfo.exceedShow, winIndex, false);
                this.$set(this.$refs.videoComm.showInfo.errorShow, winIndex, false);
                this.$set(this.$refs.videoComm.showInfo.connectingShow, winIndex, true);
            },
            /**
             * 隐藏视频重连提示
             * @param liObj 视频窗口选择器，精确到div[data-win="xxx"]一级
             */
            hideReconnectNotice(winIndex) {
                this.$set(this.$refs.videoComm.showInfo.connectingShow, winIndex, false);
            },
            /**
             * 显示超出视频最大重连数限制提示
             * @param liObj 视频窗口选择器，精确到div[data-win="xxx"]一级
             */
            showReconnectExceedNotice(winIndex) {
                this.$set(this.$refs.videoComm.showInfo.exceedShow, winIndex, false);
                this.$set(this.$refs.videoComm.showInfo.errorShow, winIndex, true);
                this.$set(this.$refs.videoComm.showInfo.connectingShow, winIndex, false);
            },
            /**
             * 隐藏超出视频最大重连数限制提示
             * @param liObj 视频窗口选择器，精确到div[data-win="xxx"]一级
             */
            hideReconnectExceedNotice(winIndex) {
                this.$set(this.$refs.videoComm.showInfo.errorShow, winIndex, false);
                this.$set(this.$refs.videoComm.showInfo.exceedShow, winIndex, false);
            },

        }
    }
</script>
<style lang="less">
    @import "style/play-back.less";
</style>
