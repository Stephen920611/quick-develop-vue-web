/**
 * @description：视频公共方法
 * @Version Created by luzaibao on 2021-3-24.
 * @Author luzaibao
 * @license dongfangdianzi
 */
//加载文件
import videoInstance from '@/utils/videoInstance'

class videoPlayer{
    //传入的vue对象
    _vm = null;
    //'Play'是实时视频页面，'playBack'是录像回放页面
    _playType = 'Play';
    
    constructor(vm,playType){
        this._vm = vm;
        this._playType = playType;
    }
    playVideoByCameraId(camObj, winSelect, type, startTime, endTime) {
        this._playType = type;
        let cameraId = camObj.code;
        let camName = camObj.text;
        let cameraType = camObj.typeCode;
        if (!cameraId) {
            this._vm.$message({
                showClose: true,
                message: '摄像机不存在',
                type: 'error'
            });
            return;
        }
        //待播放视频目前已在播放后的操作
        let win = null;
        if(this._playType=='playBack'){
            win = 'win'+ (this._vm.getCheckedWinIndex()+1);
        }else{
            win = this.getWinNumByCameraId(cameraId);
        }
        
        if (win) {//说明目前在播(win为窗口号,直接将其选中就可以了)
            //通过win得到当前视频窗口的索引值
            const winIndex = parseInt(win.substring(3, win.length)) - 1;
            this._vm.setTargetWinPlayStatus('Play', winIndex);
            this._vm.setTargetWinChecked(winIndex);
            if(this._playType=='playBack'){
                //有录像在播放-》应停止
                this.videoPause(true, win);
                document.querySelector("#playBackContainer #video" + (winIndex+1)).pause();
            }else{
                return;
            }
        }
        //2.查找被选中的窗口是否正在播放
        let videoCheckedWinSelect = this._vm.getCheckedVideoObj();
        if (videoCheckedWinSelect) {
            this.videoPlay(videoCheckedWinSelect, type, camName, cameraType, cameraId, startTime, endTime);
        }
    };
    getWinNumByCameraId(value) {
        let entry = this._vm.winObjHash.getobject();
        for (let prop in entry) {
            if (entry[prop].cameraId == value) {
                return prop;
            }
        }
        return null;
    };
    videoPlay(videoWinSelect, type, camName, cameraType, cameraId, startTime, endTime) {
        let videoId = videoWinSelect.videoId;
        let winNum = videoWinSelect.winId;
        let playState = videoWinSelect.playState;
        this._vm.aimWinNum = winNum;
        let ele = this._playType == 'Play'?'realPlayContainer':'playBackContainer';
        let winIndex = parseInt(videoId.substring(5,6))-1;
        //判断是否有视频正在播放
        if (playState === 'Play') {//有视频在播放-》应停止
            //停止播放
            this.videoPause(true, winNum, type);
            document.getElementById(ele).getElementsByTagName("video")[winIndex].pause();
        }
        //判断视频是否已暂停
        if (document.getElementById(ele).getElementsByTagName("video")[winIndex].paused) {
            this.play(videoId, cameraId, "1", "v1", winNum, type, cameraType, camName, startTime, endTime);
            //该窗口中的隐藏暂停图标
            this._vm.showOrHidePauseIcon(winIndex, false);
            
        }
        //更改视频窗口状态
        this._vm.cancelWinCheckStatus(winIndex);
        this._vm.setTargetWinPlayStatus('Play', winIndex);
        if(this._playType == 'Play'){
            this._vm.selectedNextWin(winIndex);
        }
        
        //在播放窗口显示摄像机名称
        this._vm.showCameraNameInWin(winIndex, camName, cameraId);
        
        
        //将窗口对象添加至winObjHash
        let winValue = {'cameraId': cameraId};
        this._vm.winObjHash.add(winNum, winValue);
    };
    
   videoPause(close, winNum, type) {
       let self = this;
        let videoObj;
        let winsArr = this._vm.videoObjHash.getKeys();
        if (winNum) {//暂停指定
            videoPause(winNum);
        } else {
            for (let i = 0; i < winsArr.length; i++) {
                videoPause(winsArr[i]);
            }
        }
        
        /**
         * （暂停/关闭）视频
         * @param num   窗口号
         */
        function videoPause(num) {
            if (!num) {
                return;
            }
            let ele = self._playType == 'Play'?'realPlayContainer':'playBackContainer';
            let winIndex = parseInt(num.substring(3, num.length)) - 1;
            videoObj = document.getElementById(ele).getElementsByTagName("video")[winIndex];
            self.videoPauseSubFunc(close, num, videoObj, type);
            //关闭加载动画
            let instance = self._vm.videoObjHash.getValue(num);
            if (instance) {
                instance.openOrCloseLoading(false, winIndex);
            }
            
            //关闭视频逻辑
            if (close) {
                //断开重连定时器
                if (instance) {
                    instance.StopRealPlay();
                }
                document.getElementById(ele).getElementsByTagName("video")[winIndex].setAttribute('src', ''); //关闭视频画面
                self._vm.setTargetWinPlayStatus('noPlay', winIndex);
                self._vm.hideReconnectExceedNotice(winIndex);//关闭超过最大重连次数的提示
                self._vm.hideReconnectNotice(winIndex);//关闭重连提示
                clearObj(num, winIndex);
            }
            
            /**
             * 清空指定视频对象，关闭视频时使用
             * @param key   待关闭视频所在的窗口号
             */
            function clearObj(key, winIndex) {
                //清空指定视频对象的状态hash
                self._vm.winObjHash.remove(key);
                //清空对应的videoObj
                self._vm.videoObjHash.remove(key);
                self._vm.showOrHideUnavailableSource(winIndex, false);    //隐藏视频资源无法加载提示
                if(self._playType == 'playBack'){
                    const checkedWinIndex = self._vm.getCheckedWinIndex();
                    //删除timeBar对应窗口的录像块
                    let timeBar = self._vm.timeBarsComp[checkedWinIndex];
                    //是否关闭时间轴，如果是关闭按钮，则为true，如果是点击时间轴，则为false
                    if(self._vm.timeLineClose){
                        timeBar.cells = [];
                    }
                    self._vm.$set(self._vm.timeBarsComp[checkedWinIndex], winIndex, timeBar);
                }
            }
        }
    };
    /**
     * （暂停/关闭）视频子方法
     * @param close 是否关闭（true-是）
     * @param winNum    窗口号，如win1
     * @param winObj    窗口video元素对象
     * @param type  播放类型：实时视频/录像回放
     */
    videoPauseSubFunc(close, winNum, winObj, type) {//窗口号、窗口对象
        let videoObj = this._vm.videoObjHash.getValue(winNum);
        if (videoObj) {  //若是该窗口有播放的视频
            if (!close && type == "playBack") {
                videoObj.doPlayBackCtrl(0);
            } else {
                this.stop(winNum); //关闭视频连接
            }
            let winIndex = parseInt(winNum.substring(3, winNum.length)) - 1;
            winObj.pause(); //视频暂停
            this._vm.showOrHidePauseIcon(winIndex, true);
            if (close) {
                //清除窗口上显示的摄像机名称
                this._vm.showCameraNameInWin(winIndex, '', '');
            }
        }
    };
    //视频播放
    play(videoId, cameraid, sessionid, authcode, winNum, type, cameraType, camName, startTime, endTime) {
        console.log("@@@@@@@@@@@@@params", videoId + "@" + cameraid + "@" + sessionid + "@" + authcode + "@" + winNum + "@" + type);
        //let flag = self.getH5ServerIp(cameraid);
        let instance = this._vm.videoObjHash.getValue(winNum);
        if (instance != null) {
            if (instance._type == "Play") {
                instance.StopRealPlay();
            } else {
                instance.StopPlayback();
            }
            this.h5sPlayerDelete(instance);
            instance = null;
        }
        this.initInstance(videoId, cameraid, sessionid, authcode, winNum, this._vm.browser, cameraType, camName); //暂无主码流和子码流
        instance = this._vm.videoObjHash.getValue(winNum);
        let winIndex = parseInt(winNum.substring(3, winNum.length)) - 1;
        if (instance) {
            instance.openOrCloseLoading(true, winIndex);//开启视频加载动画
        }
        //隐藏暂停按钮
        this._vm.showOrHidePauseIcon(winIndex, false);
        
        if (type == "Play" || type == undefined) {//实时预览
            this.successPlay(instance);
        }
        
        if (type == "playBack") {//录像回放
            instance._type = "Playback";
            instance._endTime = endTime;
            console.log(instance,"instance");
            //调用录像回放
            instance.StartPlayback(startTime, endTime);
        }
        console.log("@@@@@@@@@@@@@params连接");
    };
    
    initInstance(videoId, cameraid, sessionid, authcode, winNum, browserInfo, cameraType, camName) {
        let instance = new videoInstance(this._vm, videoId, cameraid, sessionid, authcode, browserInfo);
        if (cameraType) {
            instance._cameraType = cameraType;
        }
        if (camName) {
            instance._camName = camName;
            instance._cameraid = cameraid;
        }
        this._vm.videoObjHash.add(winNum, instance);
        console.log('@@@@@@@@@@@@@创建H5Player：', winNum, instance);
    };
    successPlay(instance) {
        //调用实时预览
        instance._type = "Play";
        //获取窗口数量
        let showWinCount = this._vm.getCurrentWinCount();
        if (showWinCount <= 4) {
            instance.StartRealPlay(0);//默认主码流
        } else {
            instance.StartRealPlay(1);//默认子码流
        }
    };
    //停止播放
    stop(winNum) {
        let instance = this._vm.videoObjHash.getValue(winNum);
        if (instance != null) {
            if (instance._type == "Play") {
                instance.StopRealPlay();
            } else {
                instance.StopPlayback();
            }
            this.h5sPlayerDelete(instance);
            //instance = null;
        }
    };
    
   h5sPlayerDelete = function (player) {
        this._vm.videoObjHash.remove(player);
        return true;
    };
}

export default videoPlayer