<!--新版本V1.1-->
<template>
    <div id="realPlayContainer">
        <div class="multiple-win-wrap" :class="{'full-screen':isFullScreen}">
            <video-comm
                    ref="videoComm"
                    :playState="playState"
                    :winSelectData="winSelectData"
            ></video-comm>
        </div>
        <div id="multiple-channel-choose" v-show="btnShow">
            <df-drop-down name="窗口选择" type="primary" :data="winSelectData" :defaultValue="currentRowCls"
                          @command="handleChooseWin"></df-drop-down>
            <div class="video-btn-group real-play">
                <el-button size="medium" type="primary" @click="handleCloseAllVideo">关闭全部</el-button>
                <el-button size="medium" type="primary" @click="handleFullScreen">全屏</el-button>
                <!--<el-button size="medium" type="primary">视频回放</el-button>-->
                <div class="block ctrl-slider">
                    <span class="demonstration">云台控速：</span>
                    <el-slider v-model="cloudSpeed" show-input></el-slider>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import screenfull from 'screenfull'
    import videoComm from './videoComm.vue'
    import dfDropDown from './dropDownMenu.vue'
    import utility from '@/utils/ext.utility'
    import passParam from '@/utils/ext.passParam'
    import videoPlayer from '@/utils/videoPlayer'


    export default {
        props: ['playState', 'btnShow'],
        inject:['judgeAuthorityFunc','uploadBase64Func'],
        data() {
            return {
                winSelectData: [
                    {code: 'one-row', des: '单窗口', winNum: 1, choosed: false},
                    {code: 'two-row', des: '4窗口', winNum: 4, choosed: true},
                    {code: 'three-row', des: '9窗口', winNum: 9, choosed: false},
                    {code: 'four-row', des: '16窗口', winNum: 16, choosed: false}
                ],
                currentRowCls:['two-row'],
                cloudSpeed: 90,     //云台控速的默认值
                isFullScreen: false,  //是否显示全屏
                winObjHash: new utility.hashTable(),  //窗口号与摄像机编号进行绑定
                videoObjHash: new utility.hashTable(),
                browser: utility.getBrowserInfoForVideo(),
                aimWinNum: null,
                videoPlayer:null,
            }
        },
        components: {
            videoComm,
            dfDropDown
        },
        watch: {
            'cloudSpeed': {
                handler(newValue) {
                    passParam.$emit('get-ctrl-value', newValue);
                }
            },
        },
        mounted() {
            //将vue实例传入到videoPlayer.js中
            this.videoPlayer = new videoPlayer(this,'Play');
            /*videoPlayer.sendThis(this);
            videoPlayer._playType = 'Play';*/
            this.$refs.videoComm.realPlayBtnShow = true;   //显示实时视频的操作按钮
            this.$refs.videoComm.playBackBtnShow = false;
            //监听屏幕的全屏事件
            screenfull.on('change', () => {
                if (!screenfull.isFullscreen) {
                    //取消全屏时，要执行的操作
                    this.isFullScreen = false;
                    this.$store.dispatch('video/videoIsFullScreen', false);
                }
            });
        },
        methods: {
            //传递this对象
            sendVueInstance(){
                delete this.videoPlayer;
                this.videoPlayer = new videoPlayer(this,'Play');
            },
            //窗口选择：切换窗口显示的数量
            handleChooseWin(command) {
                this.winSelectData.forEach(item => {
                    item.choosed = false;
                    if (item.code == command) {
                        item.choosed = true;
                        this.$refs.videoComm.handleChangeWin(item.winNum)
                    }
                });
            },
            playVideoByCameraId(camObj, winSelect, type){
              this.videoPlayer.playVideoByCameraId(camObj, winSelect, type)
            },

            handleCloseAllVideo() {
                //关闭所有已在播放的视频
                this.closeAllVideo();
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
                let winInx = this.$refs.videoComm.checkedWinIndex + 1;
                //let domObj = document.querySelector("#realPlayContainer #win"+winInx);
                let domObj = document.querySelector(".multiple-win-wrap");
                screenfull.toggle(domObj);
                this.isFullScreen = true;
                this.$store.dispatch('video/videoIsFullScreen', true);
            },

            closeAllVideo(type) {
                this.videoPlayer.videoPause(true, null, type);
                this.$refs.videoComm.videoWinSelect.forEach(item => {
                    item.playState = 'noPlay';
                });
                //选中窗口定位到第一个
                this.$refs.videoComm.checkedWinIndex = 0;
                let videoWinSelectArr = this.$refs.videoComm.videoWinSelect;
                videoWinSelectArr.forEach((item, index) => {
                    item.checked = index == 0?true:false
                })
            },
            /**
             * 关闭指定视频
             * @param winSelect 视频窗口选择器（精确到li）
             * @param winNum    待关闭视频的窗口号
             * @param type  播放类型：实时视频/录像回放
             */
            closeAppointVideo(winNum, type) {
                if (winNum) {
                    this.videoPlayer.videoPause(true, winNum, type);
                    //清空视频对象状态hash
                    let winIndex = winNum.substring(3) - 1;
                    this.setTargetWinPlayStatus('noPlay',winIndex)
                }
            },
            pauseAllVideo(type) {
                this.videoPlayer.videoPause(false, false, type);
            },
            /**
             * 暂停指定视频
             * @param winNum    待关闭的视频窗口
             * @param type  播放类型：实时视频/录像回放
             */
            pauseAppointVideo(winNum, type) {
                this.videoPlayer.videoPause(false, winNum, type);
            },
            /**
             * 全部播放
             * @param type  播放类型：实时视频/录像回放
             */
            playAllVideo(type) {
                this.videoPlaySubFunc(false, type);
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
                let winsArr = this.videoObjHash.getKeys();
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
                    let instance = this.videoObjHash.getValue(num);
                    if (type == "playBack") {
                        //启动暂停的时间轴
                        instance.doPlayBackCtrl(1);
                    } else {
                        this.videoPlayer.play(instance._videoId, instance._cameraid, instance._sessionid, instance._authcode, num, "Play", null, null, instance._cameraType, instance._camName);
                    }
                    const winIndex = parseInt(winNum.substring(3, winNum.length)) - 1;
                    self.showOrHidePauseIcon(winIndex,false)
                }
            },
            /**
             * 云台控制
             * @param winSelect   窗口号，如win1
             * @param cmd   控制指令
             * @param speed 速度
             * @param dir   方向
             */
            handleCtrl(winSelect, cmd, dir) {
                let instance = this.videoObjHash.getValue(winSelect);
                let speed = this.cloudSpeed;
                if (instance) {
                    let cameraCode = instance._cameraid;
                    instance.doCmd(cameraCode, cmd, speed + '', '0', '0');
                } else {
                    this.$message({
                        message: '请先选择摄像机！',
                        type: 'warning',
                        showClose:true
                    });
                }
            },
            /**
             *  设置指定窗口被选中
             */
            setTargetWinChecked(winIndex){
                this.$refs.videoComm.checkedWinIndex = winIndex;
                this.$refs.videoComm.videoWinSelect.forEach((item, index) => {
                    item.checked = index == winIndex?true:false;
                });
            },
            /**
             *  取消当前窗口的选中状态
             */
            cancelWinCheckStatus(winIndex){
                this.$refs.videoComm.videoWinSelect[winIndex].checked = false;
            },
            /**
             *  当前窗口播放时，显示摄像机名称
             */
            showCameraNameInWin(winIndex,camName,cameraId){
                this.$set(this.$refs.videoComm.showInfo.cameraName, winIndex, camName);
                this.$set(this.$refs.videoComm.showInfo.cameraCode, winIndex, cameraId);
            },

            /**
             * 设置指定窗口的播放状态 若是指定窗口正在播放，将指定窗口的播放状态置为'play'
             * @param status:'Play','noPlay'
             */
            setTargetWinPlayStatus(status,winIndex){
                this.$refs.videoComm.videoWinSelect[winIndex].playState = status;
            },
            /**
             * 获取选中窗口的video对象
             */
            getCheckedVideoObj(){
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
            showOrHidePauseIcon(winIndex,flag){
                this.$set(this.$refs.videoComm.showInfo.playPauseShow, winIndex, flag);
            },
            /**
             * 窗口中隐藏"资源无法加载提示"
             */
            showOrHideUnavailableSource(winIndex,flag){
                this.$set(this.$refs.videoComm.showInfo.unavailableSourceShow, winIndex, flag);
            },

            /**
             *  选中下一个播放窗口
             */
            selectedNextWin(currentWinIndex){
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
            getCurrentWinCount(){
              return this.$refs.videoComm.currentWinCount;
            },
            /**
             * 获取选中当前窗口的索引值
             */
            getCheckedWinIndex(){
                return this.$refs.videoComm.checkedWinIndex;
            },


            /**
             * 显示连接的错误码和错误提示
             * @param
             */
            showErrorCodeAndContent(winIndex,status,info){
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
            //播放一組視頻
            playAGroupOfVideo(cameraArr){
                cameraArr.map(item=>{
                    this.videoPlayer.playVideoByCameraId(item, '#realPlayContainer > #video-content>li');
                });

            },
            //判断“手动抓拍”的权限
            judgeAuthority(type,cameraCode,callback){
                this.judgeAuthorityFunc(type,cameraCode,callback);
            },
            //上传“手动抓拍”的图片
            uploadImageBase64(base64,callback){
                this.uploadBase64Func(base64,callback);
            },
        },

        beforeDestroy() {
            // 组件销毁的时候断开websocket
            this.closeAllVideo();
        },

    }
</script>
<style lang="less">
    @import "style/real-play.less";
</style>
