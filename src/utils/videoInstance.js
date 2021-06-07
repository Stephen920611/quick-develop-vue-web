/**
 * @description：视频公共方法
 * @Version Created by luzaibao on 2021-3-24.
 * @Author luzaibao
 * @license dongfangdianzi
 */

class videoInstance {
    sourceBuffer; //数据缓冲区
    buffer = [];
    mediaSource;  //h5 videosource
    video;        //video
    videoSocket;     //websocket
    managerSocket;     //websocket
    CheckSourceBufferId;
    keepaliveTimerId;   //心跳包
    emptyBuffCnt = 0;
    lastBuffTime = 0;
    buffTimeSameCnt = 0;
    bNeedReconnect = false;  //是否重连
    bDisConnected = false;   //断开连接
    bVideoConnected = false; //视频连接状
    _bGetCodec = false;      //获取codec
    _strCodec = '';
    
    //增加远程录像接口
    bStartRecording = false;    //开启录像
    winIndex = 0;        //窗口索引号
    videoId = '';        //h5句柄
    cameraid = '';             //cameraid
    sessionid = '';           //sessionid
    authcode = '';             //授权码
    browserInfo = 1; //0 是IE 1其他 谷歌或者其他
    $vue = null;   //vue对象
    
    _stream_type = 0;                //0-主码流，1-子码流
    _pauseTime = null; 		//录像回放暂停播放时的时间
    _endTime = null; 		//录像回放结束时间
    
    _start_time = 0;             //录像开始时间
    _end_time = 0;               //录像结束时间
    _playback_speed = 1;
    
    _type = null; 			//视频对象的类型（realPlay,playBack,...）
    
    _reconnectCount = 0; //重连次数
    _maxReconnectCount = 10; //最大重连次数  如果重连10次失败则认为失败
    
    
    _cameraType = null;
    _camName = null;
    
    reconnectTimerId = null;  //重连定时器timer
    append_succed = true;  //appendBuffer设置为成功（true）
    _readDataFromBufferCurTime = null;  //从buffer里读取出数据的当前时间戳
    
    dataStreamHeaderStatus = null;   //数据流返回的header中的状态值
    
    
    constructor($vue, videoId, cameraid, sessionid, authcode, browserInfo) {
        let params = {
            videoId: videoId,
            cameraid: cameraid,
            sessionid: sessionid,
            authcode: authcode,
            browserInfo: browserInfo,
        };
        Object.keys(params).forEach((key) => {
            this[key] = params[key]
        });
        this.$vue = $vue;
        this.winIndex = this.videoId == '' ? 0 : parseInt(this.videoId.substring(5, this.videoId.length)) - 1;
        this.init();
    }
    
    init() {
    
    }
    
    /*重连函数*/
    ReconnectFunction() {
        console.log('Try Reconnect...', this.bNeedReconnect);
        if (this.bNeedReconnect === true) {
            console.log('Reconnect...');
            this._reconnectCount++;
            
            //关闭视频加载动画
            this.openOrCloseLoading(false, this.winIndex);
            if (this._reconnectCount > 1) {  //第一次重连提示重连信息
                this.$vue.showReconnectNotice(this.winIndex);
            }
            if (this._reconnectCount <= this._maxReconnectCount) {//最大重连限制
                this.ConnectManager("Play"); //注意只有实时预览才重连
            } else {
                //显示：超过最大重连次数
                this.$vue.hideReconnectNotice(this.winIndex);
                this.$vue.showReconnectExceedNotice(this.winIndex);
                clearInterval(this.reconnectTimerId);//清除重连定时器
            }
            this.bNeedReconnect = false;
        }
    }
    
    /*创建与SIP代理的Websocket*/
    H5MWebSocketClient(h5spath) {
        let socket;
        try {
            if (window.location.protocol == "http:") {
                let h5ServerIp = '172.20.63.220:7002';    //TODO 本地调试
//                   let h5ServerIp = localStorage.getItem('h5_manager_ip');
                console.log(h5ServerIp, "h5ServerIp");
                socket = new WebSocket('ws://' + h5ServerIp);
                
            }
            if (window.location.protocol == "https:") {
                socket = new WebSocket('wss://' + window.location.host + h5spath);
            }
        } catch (e) {
            alert('create ws error');
            return;
        }
        return socket;
    };
    
    //创建websocket连接
    H5SWebSocketClient(h5spath) {
        let socket;
        console.log("H5SWebSocketClient");
        try {
            if (window.location.protocol == "http:") {
                socket = new WebSocket(h5spath);
            }
            if (window.location.protocol == "https:") {
                //alert(window.location.host);
                console.log(window.location.host);
                socket = new WebSocket('wss://' + window.location.host + h5spath);
            }
        } catch (e) {
            console.log('create H5SWebSocketClient error');
            return;
        }
        return socket;
    };
    
    //读取数据
    ReadFromBuffer() {
        try {
            if (this.buffer.length == 0 || this.sourceBuffer.updating) {
                return;
            }
        } catch (e) {
            return;
        }
        
        try {
            let data = this.buffer.shift();
            let dataArray = new Uint8Array(data);
            
            this.sourceBuffer.appendBuffer(dataArray);
            this.video.play(); //持续播放
            this.bVideoConnected = true;
            
            //yxm 2018.11.1 增加缓存数据，数据只缓存0.5s
            //console.log('浏览器类型：',this.browserInfo);
            let bufer_time;
            if (this.browserInfo == 1) {
                bufer_time = 0.5;
            } else {
                bufer_time = 5;
            }
            // console.log('设置加速时间：',bufer_time);
            let buffEndTime = this.sourceBuffer.buffered.end(0);
            let buffDiff = buffEndTime - this.video.currentTime;
            
            if (this._type == "Playback") {
                //xzyan:20190128，控制录像时间轴播放进度——start
                let temp = new Date(this._start_time).getTime() + this.video.currentTime * 1000;
                let dateFormat = this.dateFormat(new Date(temp));
                this._pauseTime = dateFormat.replace(' ', 'T');//记录暂停时间
                //控制录像时间轴播放进度——end
                if (this._playback_speed == 4) {
                    this.video.playbackRate = this._playback_speed - 1; //当前播放速度，设置后马上改变
                    /*if (buffDiff > bufer_time) {
                        this.video.playbackRate = this._playback_speed; //当前播放速度，设置后马上改变
                    } else {
                        this.video.playbackRate = this._playback_speed - 1;
                    }*/
                } else {
                    this.video.playbackRate = this._playback_speed; //当前播放速度，设置后马上改变
                }
            } else {
                /* if (buffDiff > bufer_time) {
                     this.video.playbackRate = 1.5; //当前播放速度，设置后马上改变
                 } else {
                     this.video.playbackRate = 1; //当前播放速度，设置后马上改变
                 }*/
            }
        } catch (e) {
            console.log("ReadFromBuffer error...", e);
            //清空sourceBuffer
            this.append_succed = false;
        }
        if (this.append_succed) {
            this._readDataFromBufferCurTime = new Date().getTime();
        }
    };
    
    //时间格式化,将Mon Jan 01 08:05:43 CST 1900转化为2018-10-10 10:10:10
    dateFormat(dateString) {
        let now = new Date(dateString),
            year = now.getFullYear(),       //年
            month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1),     //月
            day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate(),            //日
            hh = now.getHours() < 10 ? "0" + now.getHours() : now.getHours(),            //时
            mm = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes(),          //分
            ss = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds(),           //秒
            clock = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
        return clock;
    };
    
    //保活时间
    keepAliveTimer() {
        try {
            this.managerSocket.send("keepalive");
        } catch (e) {
            console.log(e);
        }
    };
    
    OnWebSocketData(msg) {
        //关闭加载动画
        this.openOrCloseLoading(false, this.winIndex);
        this._reconnectCount = 0; //清空重连次数
        if (this.bDisConnected === true) {
            return;
        }
        //创建mediasource源
        if (this._bGetCodec === false) {
            this._strCodec = String.fromCharCode.apply(null, new Uint8Array(msg.data));
            console.log("String Codec", this._strCodec);
            this.SetupSourceBuffer();
            
            this._bGetCodec = true;
            return;
        } else {
            //处理接收数据信息
            this.buffer.push(msg.data);
            this.ReadFromBuffer();
        }
    }
    
    //创建mediasource源
    SetupSourceBuffer() {
        try {
            window.MediaSource = window.MediaSource || window.WebKitMediaSource;
            if (!window.MediaSource) {
                console.log('MediaSource API is not available');
            }
            
            let mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
            if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
                console.log('MIME type or codec: ', mimeCodec);
            } else {
                console.log('Unsupported MIME type or codec: ', mimeCodec);
            }
            
            this.mediaSource = new window.MediaSource();
            
            let ele = this._type == 'Playback' ? 'playBackContainer' : 'realPlayContainer';
            this.video = document.getElementById(ele).getElementsByTagName("video")[this.winIndex];
            this.video.autoplay = true;
            
            // this.video.playbackRate = 0.5;
            
            console.log(this.videoId);
            
            
            this.video.src = window.URL.createObjectURL(this.mediaSource);
            this.video.play();
            
            this.mediaSource.addEventListener('sourceopen', this.MediaSourceOpen.bind(this), false);
            
        }
        catch (e) {
            console.log(e);
        }
    };
    
    //启动mediansource监听
    MediaSourceOpen() {
        console.log("Add SourceBuffer");
        //得到视频窗口
        let winNum = "win" + (this.winIndex + 1);
        try {
            //开启视频加载动画
            this.openOrCloseLoading(true);
            //配置视频源:创建一个sourceBuffer对象用于数据流的播放处理
            this.sourceBuffer = this.mediaSource.addSourceBuffer(this._strCodec);
            this.mediaSource.duration = Infinity;
            this.mediaSource.removeEventListener('sourceopen', this.MediaSourceOpen, false);
            this.sourceBuffer.addEventListener('updateend', this.ReadFromBuffer.bind(this), false);
            //隐藏视频资源无法加载提示
            this.$vue.$set(this.$vue.$refs.videoComm.showInfo.unavailableSourceShow, this.winIndex, false);
            //隐藏重连提示
            this.$vue.hideReconnectNotice(this.winIndex);
            this.$vue.hideReconnectExceedNotice(this.winIndex);
        } catch (e) {
            console.log(e.name + ':' + e.message);
        }
    };
    
    //创建视频websocket
    SetupWebSocket(req_type, media_ip, media_port, cameraid, callid) {
        const self = this;
        let ele = this._type == 'Playback' ? 'playBackContainer' : 'realPlayContainer';
        this.video = document.getElementById(ele).getElementsByTagName("video")[this.winIndex];
        this.video.autoplay = true;
        //yxm 2018.11.1 增加
        this._type = req_type;
        
        let h5spath = "/h5ss";
        if (req_type == "Play") {
            h5spath = "ws://" + media_ip + ":" + media_port + h5spath + "?type=realplay&cameraid=" + cameraid + "&callid=" + callid;
        } else if (req_type == "Playback") {
            h5spath = "ws://" + media_ip + ":" + media_port + h5spath + "?type=playback&cameraid=" + cameraid + "&callid=" + callid;
        }
        console.log("@@@@@@@@@@h5spath", h5spath);
        
        this.videoSocket = this.H5SWebSocketClient(h5spath);
        
        console.log("SetupWebSocket", this.managerSocket);
        this.videoSocket.binaryType = 'arraybuffer';
        this.videoSocket.onmessage = this.OnWebSocketData.bind(this);
        
        this.videoSocket.onopen = function () {
            self.CheckSourceBufferId = setInterval(self.CheckSourceBuffer.bind(self), 1000);
            // this..keepaliveTimerId = setInterval(this.keepAliveTimer.bind(this), 1000);
            //开启视频加载动画
            self.openOrCloseLoading(true, self.winIndex);
        };
        this.videoSocket.onclose = function () {
            console.log("managerSocket.onclose", self);
            if (self.bDisConnected === true) {
                console.log("managerSocket.onclose disconnect");
            } else {
                self.bNeedReconnect = true;
            }
            self.bVideoConnected = false;
    
            self.CleanUpSourceBuffer(self);
    
            self._strCodec = "";
            self._bGetCodec = false;
            //断开sip代理端数据信息
            
            if(self.managerSocket){
                // self.managerSocket.send("close");
                self.managerSocket.close();
            }
    
            self.CleanUpWebSocket(self);
        }
        
    };
    
    CleanUpSourceBuffer() {
        console.log('Cleanup Source Buffer');
        try {
            this.sourceBuffer.removeEventListener('updateend', this.ReadFromBuffer, false);
            this.sourceBuffer.abort();
            
            if (document.documentMode || /Edge/.test(navigator.userAgent)) {
                console.log('IE or EDGE!');
            } else {
                this.mediaSource.removeSourceBuffer(this.sourceBuffer);
            }
            this.sourceBuffer = null;
            this.mediaSource = null;
            this.buffer = [];
        }
        catch (e) {
            console.log(e);
        }
    };
    
    CleanUpWebSocket(self) {
        console.log('CleanUpWebSocket', self);
        // clearInterval(self.keepaliveTimerId);
        clearInterval(self.CheckSourceBufferId);
        self.emptyBuffCnt = 0;
        self.lastBuffTime = 0;
        self.buffTimeSameCnt = 0;
    };
    
    //检测流数据
   CheckSourceBuffer() {
        if (this.bDisConnected === true) {
            clearInterval(this.keepaliveTimerId);
            clearInterval(this.CheckSourceBufferId);
        }
        try {
            console.log("CheckSourceBuffer size" + this.sourceBuffer.buffered.length)
            if (this.sourceBuffer == null) {
                this.bNeedReconnect = true;
                
            }
            if (this.sourceBuffer.buffered.length <= 0) {
                this.emptyBuffCnt++;
                if (this.emptyBuffCnt > 8) {
                    // this.videoSocket.send("close");
                    this.videoSocket.close();
                    return;
                }
            } else {
                let curTime = new Date().getTime();
                if (this._readDataFromBufferCurTime > 0 && (curTime - this._readDataFromBufferCurTime) > 10 * 1000) {
                    // this.videoSocket.send("close");
                    this.videoSocket.close();
                    return;
                }
            }
        }
        catch (e) {
            console.log("CheckSourceBuffer error...", e);
        }
    };
    
    //发动控制指令,增加扩展字段，speed 速度控制，预置位
    doCmd (cameraid, cmd, speed, param1, param2) {
        if (this.managerSocket != null) {
            let data = {
                "Header": {
                    "Version": "1.0",
                    "CSeq": "1",
                    "MsgType": "H5_PLAY_CTL",
                    "Status": "200"
                },
                "Body": {
                    "Camera_id": cameraid,
                    "Ctl_type": cmd,
                    "Ctl_speed": speed,
                    "Ctl_param1": param1,
                    "Ctl_param2": param2,
                    "Ctl_param3": '0',
                    "Ctl_param4": '0',
                    "Ctl_param5": '0',
                    "Ctl_param6": '0'
                }
            };
            let jsondata = JSON.stringify(data); //将JSON对象序列化为JSON字符串
            this.managerSocket.send(jsondata);
        }
    };
    //3D定位
    do3Dcmd(param1, param2, param3, param4, param5, param6) {
        if (this.managerSocket != null) {
            let data = {
                "Header": {
                    "Version": "1.0",
                    "CSeq": "1",
                    "MsgType": "H5_PLAY_CTL",
                    "Status": "200"
                },
                "Body": {
                    "Camera_id": this.cameraid,
                    "Ctl_type": "200",
                    "Ctl_speed": "150",
                    "Ctl_param1": param1,
                    "Ctl_param2": param2,
                    "Ctl_param3": param3,
                    "Ctl_param4": param4,
                    "Ctl_param5": param5,
                    "Ctl_param6": param6
                }
            };
            let jsondata = JSON.stringify(data); //将JSON对象序列化为JSON字符串
            this.managerSocket.send(jsondata);
        }
    };
    
    //与sip代理通信发送数据,发送json数据信息
    SendManager(req_type) {
        if (this.managerSocket != null) {
            //组合请求json信息
            if (req_type == "Play") {
                let data = {
                    "Header": {
                        "Version": "1.0",
                        "CSeq": "1",
                        "MsgType": "H5_PLAY_REQ",
                        "Status": "200"
                    },
                    "Body": {
                        "Session_id": this.sessionid,
                        "Camera_id": this.cameraid,
                        "Stream_type": this._stream_type
                    }
                };
                let jsondata = JSON.stringify(data); //将JSON对象序列化为JSON字符串
                this.managerSocket.send(jsondata);
                
            } else if (req_type == "Playback") {
                let data = {
                    "Header": {
                        "Version": "1.0",
                        "CSeq": "1",
                        "MsgType": "H5_PLAYBACK_REQ",
                        "Status": "200"
                    },
                    "Body": {
                        "Session_id": this.sessionid,
                        "Camera_id": this.cameraid,
                        "Start_time": this._start_time,
                        "End_time": this._end_time
                    }
                };
                let jsondata = JSON.stringify(data); //将JSON对象序列化为JSON字符串
                this.managerSocket.send(jsondata);
            }
        }
    };
    //接收sip代理数据信息
    RecvManager(evt) {
        let received_msg = evt.data;
        console.log(received_msg);
        
        if (received_msg == "")
            return;
        
        let jsondata = JSON.parse(received_msg);
        if (this._type == 'Playback') {
            this.dataStreamHeaderStatus = jsondata.Header.Status;
            //获取数据流的状态，200的时候启动时间轴定时器
            if (this.dataStreamHeaderStatus == '200') {
                const checkedWinIndex = this.$vue.getCheckedWinIndex();
                console.log(checkedWinIndex, "checkedWinIndex");
                //调用组件playBack中的方法，移动时间轴的时间刻度值
                this.$vue.setBarTimePlayLoc();
            }
        }
        
        //根据提示码修改提示信息
        let errorContent = "";
        switch (jsondata.Header.Status) {
            case '400':
                errorContent = "平台不在线 、下级请求失败";
                break;
            case '404':
                errorContent = " 无设备或平台信息";
                break;
            case '410':
                errorContent = "设备不在线";
                break;
            case '408':
                errorContent = "请求超时";
                break;
            case '500':
                errorContent = "SIP服务自身异常";
                break;
            case '502':
                errorContent = "无可用SIP";
                break;
            case '503':
                errorContent = "无流媒体";
                break;
            case '504':
                errorContent = "流媒体连接或请求失败、流媒体不响应";
                break;
        }
        if ('200' != jsondata.Header.Status) {//设置错误提示码
            this.$vue.showErrorCodeAndContent(this.winIndex, jsondata.Header.Status, errorContent);
            this._maxReconnectCount = 2;	//设置最大重连次数为2
        }
        
        if (jsondata.Header.Status == "400" || jsondata.Header.Status == "410" || jsondata.Header.Status == "408" || jsondata.Header.Status == "504") {
            // this.managerSocket.send("close");
            this.managerSocket.close();
            this.bNeedReconnect = true;
            return;
        }
        
        
        if (jsondata.Header.MsgType == "H5_PLAY_RES" && jsondata.Body) {
            this.SetupWebSocket("Play", jsondata.Body.Media_ip, jsondata.Body.Media_port, this.cameraid, jsondata.Body.Call_id);
            
            //赋值call_id
            this._Call_id = jsondata.Body.Call_id;
        } else if (jsondata.Header.MsgType == "H5_PLAYBACK_RES" && jsondata.Body) {
            
            this.SetupWebSocket("Playback", jsondata.Body.Media_ip, jsondata.Body.Media_port, this.cameraid, jsondata.Body.Call_id);
            
            //赋值call_id
            this._Call_id = jsondata.Body.Call_id;
        }
    };
    
    //开启连接视频请求
    ConnectManager(req_type) {
        const self = this;
        this.managerSocket = this.H5MWebSocketClient();
        
        this.managerSocket.onopen = function () {
            self.SendManager(req_type);
        };
        this.managerSocket.onmessage = function (evt) {
            self.RecvManager(evt);
        };
        this.managerSocket.onclose = function () {
            console.log("flow.html:WebSocket失效连接关闭");
            self.openOrCloseLoading(false, self.winIndex);
            if (self.videoSocket != null) {
                self.videoSocket.send("close");
            }
    
            self.bNeedReconnect = true;
            self.managerSocket = null;
        };
    };
    
    /**
     camera_id  摄像机id
     session_id web端登陆session
     stream_type  码流类型
     */
    StartRealPlay(stream_type) {
        this._stream_type = stream_type;
        this.ConnectManager("Play");
        this.reconnectTimerId = setInterval(this.ReconnectFunction.bind(this), 5000);
    };
    //断开实时视频连接
    StopRealPlay() {
        console.log("disconnect", this);
        this.bDisConnected = true;
        clearInterval(this.reconnectTimerId);
        
        if (this.managerSocket != null) {
            // this.managerSocket.send("close");
            this.managerSocket.close();
        }
        if (this.videoSocket != null) {
            // this.videoSocket.send("close");
            this.videoSocket.close();
        }
        console.log("disconnect", this);
    };
    //录像回放控制
    doPlayBackCtrl(speed) {
        if (this.bVideoConnected == false) {
            return;
        }
        if (this.managerSocket != null) {
            let data = {
                "Header": {
                    "Version": "1.0",
                    "CSeq": "1",
                    "MsgType": "H5_PLAYBACK_CTL_REQ",
                    "Status": "200"
                },
                "Body": {
                    "Camera_id": this.cameraid,
                    "Ctl_type": "BackCtrl",
                    "Ctl_speed": speed,
                    "Ctl_param": "0",
                    "Call_id": this._Call_id
                }
            };
            
            let jsondata = JSON.stringify(data); //将JSON对象序列化为JSON字符串
            this._playback_speed = speed;
            this.managerSocket.send(jsondata);
        }
    };
    //开始录像回放
    StartPlayback(start_time, end_time) {
        this._start_time = start_time;
        this._end_time = end_time;
        this.ConnectManager("Playback");
    };
    //断开录像回放
    StopPlayback() {
        console.log("disconnect---playback", this);
        this.bDisConnected = true;
        clearInterval(this.reconnectTimerId);
        if (this.managerSocket != null) {
            // this.managerSocket.send("close");
            this.managerSocket.close();
        }
        if (this.videoSocket != null) {
            // this.videoSocket.send("close");
            this.videoSocket.close();
        }
    };
    //加载动画开启/关闭
    openOrCloseLoading(open, winIndex) {
        //得到视频窗口
        if (this.$vue.$refs.videoComm) {
            if (open) {
                this.$vue.$set(this.$vue.$refs.videoComm.showInfo.loadingShow, winIndex, true);
            } else {
                this.$vue.$set(this.$vue.$refs.videoComm.showInfo.loadingShow, winIndex, false);
            }
        }
    };
    
}

export default videoInstance