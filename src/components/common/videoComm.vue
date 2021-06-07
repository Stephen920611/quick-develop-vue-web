<!--新版本V1.1-->
<template>
    <div class="multiple-video-show">
        <!--视频窗口开始-->
        <ul id="video-content" :class="defaultRowClass">
            <li
                    v-for="(item,index) in videoWinSelect"
                    v-show="videoWinSelect[index].isShow"
                    ref="winLi"
                    :key="index"
                    class="win"
                    :class="{'checked':index==checkedWinIndex}"
                    @click="handleCheckVideoWin(index)"
                    @dblclick.stop="handleDblClickVideoWin(index)"
            >
                <div
                        :id="item.winId"
                        class="win-content"
                        :data-win="item.winId"
                        data-ctrl="close"
                        data-loc="close"
                        @mouseenter="handleMouseEnter(index)"
                        @mouseleave="handleMouseLeave(index)"
                >
                    <video :id="item.videoId" class="video" width="640" height="480" autoplay/>
                    <div v-for="(dir,d) in dirSelectData" v-show="showInfo.dirShow[index]" :key="d" class="dir-group">
                        <i class="dir" :class="dir.id" :data-type="dir.type" :title="dir.name"
                           @mousedown="handleDirMouseDown(index,dir.type,dir.name)"
                           @mouseup="handleDirMouseUp(index,dir.type,dir.name)"/>
                    </div>
                    <div>
                        <div v-show="showInfo.playPauseShow[index]" class="play-pause" :style="playBtnfontSize"><i
                                class="fa fa-play play-state-icon"
                        /></div>
                        <div v-show="showInfo.unavailableSourceShow[index]" class="unavailable-source"><img
                                src="@/assets/image/other/unavailable-source.png"
                        ></div>
                        <div v-show="showInfo.loadingShow[index]" class="loading"><img
                                src="@/assets/image/other/oval.svg"
                                width="50"
                                alt=""
                        ></div>
                        <div v-show="showInfo.errorShow[index]" class="video-connect-notice error-notice"><span
                                class="error-content"
                        >{{ showInfo.errorContent[index] }}</span>（错误码<span
                                class="error-code"
                        >{{ showInfo.errorCode[index] }}</span>）
                        </div>
                        <div v-show="showInfo.connectingShow[index]" class="video-connect-notice connecting">
                            视频重连中，请稍后...
                        </div>
                        <div v-show="showInfo.exceedShow[index]" class="video-connect-notice exceed">超过最大重连次数</div>
                        <div v-show="showInfo.operateShow[index]" class="video-operate">
                            <ul class="video-operate-ul">
                                <li class="float-left cam-name">{{ showInfo.cameraName[index] }}</li>
                                <li v-show="playState=='realPlay'?false:true" class="float-right video-play" title="播放"
                                    @click.stop="handleOperBtn(0,index)">
                                    <i class="fa fa-play" aria-hidden="true"/>
                                </li>
                                <li v-show="playState=='realPlay'?false:true" class="float-right video-pause" title="暂停"
                                    @click.stop="handleOperBtn(1,index)">
                                    <i class="fa fa-pause" aria-hidden="true"/>
                                </li>
                                <li class="float-right video-close" title="关闭" @click.stop="handleOperBtn(2,index)">
                                    <i class="fa fa-times" aria-hidden="true"/>
                                </li>
                                <li v-show="false" class="float-right video-cut" title="截图"
                                    @click.stop="handleOperBtn(3,index)">
                                    <a class="capture" href="javascript:;">
                                        <i class="fa fa-camera" :style="showInfo.operBtnActiveColor[index][3]"
                                           aria-hidden="true"/>
                                    </a>
                                </li>
                                <li class="float-right video-illegal" title="手动抓拍" @click.stop="handleOperBtn(4,index)">
                                    <a class="capture" href="javascript:;">
                                        <i class="fa fa-camera-retro" :style="showInfo.operBtnActiveColor[index][4]"
                                           aria-hidden="true"/>
                                    </a>
                                </li>
                                <li class="float-right video-ctrl" title="云台控制" @click.stop="handleOperBtn(5,index)">
                                    <a class="capture" href="javascript:;">
                                        <i class="fa fa-arrows" :style="showInfo.operBtnActiveColor[index][5]"
                                           aria-hidden="true"/>
                                    </a>
                                </li>
                                <li v-show="false" class="float-right video-locate" title="3D定位"
                                    @click.stop="handleOperBtn(6,index)">
                                    <a class="capture" href="javascript:;">
                                        <i class="fa fa-location-arrow" :style="showInfo.operBtnActiveColor[index][6]"
                                           aria-hidden="true"/>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <!--视频窗口结束-->
    </div>
</template>
<script>
    import utility from '@/utils/ext.utility'
    import dateTime from '@/utils/ext.dateTime'
    import passParam from '@/utils/ext.passParam'


    export default {
//  inject: ['autoOpenRightPanel'],
        props: {
            playState: {
                type: String
            },
            winSelectData: {
                type: Array
            }
        },
        data() {
            return {
                dirSelectData: [ // 云台控制方向键的信息
                    {id: 'dir1', name: '左上', type: 23},
                    {id: 'dir2', name: '向上', type: 1},
                    {id: 'dir3', name: '右上', type: 24},
                    {id: 'dir4', name: '向左', type: 3},
                    {id: 'dir5', name: '向右', type: 4},
                    {id: 'dir6', name: '左下', type: 25},
                    {id: 'dir7', name: '向下', type: 2},
                    {id: 'dir8', name: '右下', type: 26},
                    {id: 'dir9', name: '倍率变小', type: 6},
                    {id: 'dir10', name: '倍率变大', type: 7}
                ],
                timer: null,
                videoWinSelect: [],
                checkedWinIndex: 0, // 默认选中第一个播放窗口
                currentWinCount: 4,  //当前窗口数量
                defaultWinCount: 4,  //默认的窗口数量
                defaultRowClass: 'two-row',
                showInfo: {
                    dirShow: [], // 云台控制方向键按钮的隐藏与显示状态,默认全部隐藏
                    errorShow: [], // 错误提示码的隐藏与显示状态,默认全部隐藏
                    connectingShow: [], // 重连信息的隐藏与显示状态,默认全部隐藏
                    exceedShow: [], // 超过重连次数信息的隐藏与显示状态,默认全部隐藏
                    operateShow: [], // 头部操作按钮的隐藏与显示状态,默认全部隐藏
                    playPauseShow: [], // 视频窗口的暂停播放的图标显示或隐藏，默认显示
                    loadingShow: [], // 视频窗口的等待播放的图标显示或隐藏，默认隐藏
                    unavailableSourceShow: [], // 视频窗口的资源不可用的显示或隐藏，默认隐藏
                    cameraName: [], // 摄像机名称
                    cameraCode: [], // 摄像机编码
                    errorCode: [], // 错误码
                    errorContent: [], // 错误码对应的错误内容
                    operBtnActiveColor: [], // 头部按钮的颜色数组，数组大小与窗口数量一致
                    operBtnActiveState: [] // 头部按钮的激活状态数组，数组大小与窗口数量一致
                },
                playBtnfontSize: {'font-size': '90px'}, // 视频播放（暂停）按钮的大小，默认为90px
            }
        },
        mounted() {
            // 初始化播放视频窗口
            this.initVideoWin();
        },
        methods: {
            /**
             *  初始化视频播放窗口：个数和操作按钮提示信息的显示状态
             */
            initVideoWin() {
                this.videoWinSelect = []
                for (let i = 0; i < 16; i++) {
                    const liObj = {
                        winId: 'win' + (i + 1),
                        videoId: 'video' + (i + 1),
                        checked: false,
                        isShow: false,
                        playState: 'noPlay',
                        fontSize: '50px'
                    };
                    // 默认第一个窗口被选中
                    if (i == 0) {
                        liObj.checked = true
                    }
                    // 默认前4个窗口显示
                    if (i < this.defaultWinCount) {
                        liObj.isShow = true
                    }

                    this.videoWinSelect.push(liObj);
                    // 初始化每个窗口的显示与隐藏状态
                    this.showInfo.dirShow.push(false);
                    this.showInfo.errorShow.push(false);
                    this.showInfo.connectingShow.push(false);
                    this.showInfo.exceedShow.push(false);
                    this.showInfo.operateShow.push(false);
                    this.showInfo.playPauseShow.push(true);
                    this.showInfo.loadingShow.push(false);
                    this.showInfo.unavailableSourceShow.push(false);
                    this.showInfo.cameraName.push('');
                    this.showInfo.cameraCode.push('');
                    this.showInfo.errorCode.push('');
                    this.showInfo.errorContent.push('');

                    // 初始化头部操作按钮的颜色值
                    const operBtnActiveColor = [];
                    const operBtnActiveState = [];
                    for (let k = 0; k < 7; k++) {
                        operBtnActiveColor.push({'color': '#fff'});
                        operBtnActiveState.push(false);
                    }
                    this.showInfo.operBtnActiveColor.push(operBtnActiveColor)
                    this.showInfo.operBtnActiveState.push(operBtnActiveState)
                }
            },
            /**
             *  根据窗口的数量调整暂停或启动按钮的大小
             *  @param winNum:当前窗口数量
             *  @return 返回启动按钮的样式大小
             */
            setWinPlayBtnSize(winNum) {
                let fontSize = 0;
                switch (winNum) {
                    case 1:
                        fontSize = '120px';
                        break;
                    case 4:
                        fontSize = '90px';
                        break;
                    case 9:
                        fontSize = '60px';
                        break;
                    case 16:
                        fontSize = '50px';
                        break;
                }
                return fontSize
            },

            /**
             * 切换选中的播放窗口
             * @param index:窗口的索引值
             *
             */

            handleCheckVideoWin(index) {
                const timers = this.timer;
                if (timers) {
                    clearTimeout(timers);
                    this.timer = null;
                }
                this.timer = setTimeout(() => {
                    this.checkedWinIndex = index
                    this.videoWinSelect.forEach((item, indx) => {
                        item.checked = indx == index ? true : false;
                    })
                }, 300);
                //为父组件暴露方法
                this.$emit('click-win',index);

                // 录像回放:切换窗口时，将已查询的录像块添加到时间轴上
                /*if (this.playState == 'playBack') {
                    this.$emit('toggle-win', index)
                }*/
            },

            /**
             * 双击窗口进行放大显示
             * @param index:窗口的索引值
             */
            handleDblClickVideoWin(index) {
                const timers = this.timer;
                if (timers) {
                    clearTimeout(timers);
                    this.timer = null;
                }
                if (this.currentWinCount > 1) {
                    this.currentWinCount = 1;
                    for (let i = 0; i < 16; i++) {
                        this.videoWinSelect[i].isShow = (i == index) ? true : false;
                        this.$set(this.videoWinSelect, i, this.videoWinSelect[i]);
                    }
                } else {
                    this.currentWinCount = this.defaultWinCount;
                    for (let i = 0; i < 16; i++) {
                        this.videoWinSelect[i].isShow = (i < this.defaultWinCount) ? true : false;
                        this.$set(this.videoWinSelect, i, this.videoWinSelect[i]);
                    }
                }
                this.handleUpdateRowClass(this.currentWinCount);
                //根据当前窗口的数量，调整暂停按钮的字体大小
                const fontSize = this.setWinPlayBtnSize(this.currentWinCount);
                this.playBtnfontSize = {'font-size': fontSize}

                //为父组件暴露方法
                this.$emit('dbl-click-win');
            },

            /**
             *  根据winNum，改变窗口数量
             *  @param winNum:当前窗口的数量
             */
            handleChangeWin(winNum) {
                //根据窗口的数量调整窗口布局
                this.handleUpdateRowClass(winNum)
                //改变变量，显示对应窗口数量
                this.defaultWinCount = winNum;
                this.currentWinCount = winNum;
                for (let i = 0; i < 16; i++) {
                    this.videoWinSelect[i].isShow = (i < winNum) ? true : false;
                    this.$set(this.videoWinSelect, i, this.videoWinSelect[i]);
                }
                //根据当前窗口的数量，调整暂停按钮的字体大小
                const fontSize = this.setWinPlayBtnSize(winNum);
                this.playBtnfontSize = {'font-size': fontSize}
            },
            /**
             * 根据窗口的数量调整窗口布局
             * @param winNum  窗口数量
             */
            handleUpdateRowClass(winNum){
                switch (winNum) {
                    case 1:
                        this.defaultRowClass = 'one-row';
                        break;
                    case 4:
                        this.defaultRowClass = 'two-row';
                        break;
                    case 9:
                        this.defaultRowClass = 'three-row';
                        break;
                    case 16:
                        this.defaultRowClass = 'four-row';
                        break;
                    default:
                        this.defaultRowClass = 'two-row';
                        break;
                }
            },

            // 鼠标移入移除播放窗口，显示或隐藏头部的操作按钮
            handleMouseEnter(index) {
                // vue只监听了数组的splice,push,unshift等方法，可以使用$set方法会更新视图
                this.$set(this.showInfo.operateShow, index, true);
                // 判断头部的“云台控制”按钮是否处于激活状态
                if (this.showInfo.operBtnActiveState[index][5]) {
                    this.$set(this.showInfo.dirShow, index, true)
                }
            },
            handleMouseLeave(index) {
                this.$set(this.showInfo.operateShow, index, false);
                this.$set(this.showInfo.dirShow, index, false)
            },

            // 操作头部的控制按钮
            handleOperBtn(index, winIndex) {
                switch (index) {
                    case 0:
                        // 播放视频
                        this.$parent.playAppointVideo('win' + (winIndex + 1), this.playState)
                        break;
                    case 1:
                        // 暂停视频
                        this.$parent.pauseAppointVideo('win' + (winIndex + 1), this.playState)
                        break;
                    case 2:
                        // 关闭视频
                        this.$parent.closeAppointVideo('win' + (winIndex + 1), this.playState)
                        break;
                    case 4:
                        // 手动抓拍
                        const curWinPlayState = this.videoWinSelect[winIndex].playState;
                        if (curWinPlayState == 'Play') {
                            const curTime = dateTime.curentTime();
                            const cameraName = this.showInfo.cameraName[winIndex];
                            const cameraCode = this.showInfo.cameraCode[winIndex];
                            const videoId = 'video' + (winIndex + 1);

                            // 先检查用户是否有“手动抓拍”的权限
                            // 1视频预览 2抓拍 3视频录像 4云台控制 5录像查询 6录像下载
                            this.$parent.judgeAuthority(2,cameraCode, () => {
                                // 有权限
                                const imgBase64 = this.captureImageForIllegal(videoId);
                                //“手动抓拍”的图片上传
                                this.$parent.uploadImageBase64(imgBase64, (url) => {
                                    if (res.code == '1000') {
                                        // Base64图片上传
                                        const param = {
                                            cameraName: cameraName,
                                            cameraCode: cameraCode,
                                            time: curTime,
                                            imgUrl: url

                                        };
                                        this.catureData.push(param);
                                        passParam.$emit('captureData', this.catureData);
                                    }
                                })
                            })
                        }
                        break;
                    case 5:
                        // 先检查用户是否有“云台控制”的权限
                        // 1视频预览 2抓拍 3视频录像 4云台控制 5录像查询 6录像下载
                        const cameraCode = this.showInfo.cameraCode[winIndex];
                        if(!cameraCode){
                            //无播放的视频
                            return
                        }
                        //判断按钮是否处于激活状态，若是处于激活状态则不请求权限判定接口
                        const activeState = this.showInfo.operBtnActiveState[winIndex][5];
                        if(activeState){
                            this.$set(this.showInfo.operBtnActiveColor[winIndex], index, {'color': '#fff'})
                            this.$set(this.showInfo.operBtnActiveState[winIndex], index, false)
                            this.$set(this.showInfo.dirShow, winIndex, false)
                            return
                        }
                        //正在处于播放阶段，并且尚未激活按钮，则执行下面操作
                        this.$parent.judgeAuthority(4,cameraCode,()=>{
                            // 用户有权限，显示云台控制按钮
                            this.$set(this.showInfo.operBtnActiveColor[winIndex], index, {'color': '#39AEF5'})
                            this.$set(this.showInfo.operBtnActiveState[winIndex], index, true)
                            this.$set(this.showInfo.dirShow, winIndex, true)
                        });
                        break
                }
            },

            // 操作云台控制的方向键时，按下鼠标的操作
            handleDirMouseDown(winIndex, dirType, dirTitle) {
                const dir = '方向_' + dirTitle
                const winSelect = 'win' + (winIndex + 1)
                this.$parent.handleCtrl(winSelect, dirType, dir)
            },
            // //操作云台控制的方向键时，松开鼠标的操作
            handleDirMouseUp(winIndex, dirType, dirTitle) {
                const winSelect = 'win' + (winIndex + 1)
                this.$parent.handleCtrl(winSelect, 0)
            },
            // 违法抓拍
            captureImageForIllegal(videoId) {
                const canvas = document.createElement('canvas')
                const video = document.getElementById(videoId)
                if (video.videoWidth >= 3000) {
                    canvas.width = 1920
                    canvas.height = 1080
                } else {
                    canvas.width = video.videoWidth
                    canvas.height = video.videoHeight
                }
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
                const imgBase64 = canvas.toDataURL('image/jpg')
                return imgBase64
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "style/video-comm.less";
</style>
