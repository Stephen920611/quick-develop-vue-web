<template>
    <div class="video-container">
        <el-row class="video-group">
            <el-col :span="5">
                <div class="list-wrap"  :class="{'list-wrap-1':activeVideoName=='playBack'}">
                    <!--<div class="filter-container">
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="轮巡间隔">
                                <el-input-number v-model="form.intervalTime" placeholder="轮巡间隔（秒）" type="number" min="30"></el-input-number>
                            </el-form-item>
                            <div class="text-center">
                                <el-button type="primary" size="medium" @click="startRoundPlay">开始轮巡</el-button>
                                <el-button size="medium" @click="stopRoundPlay">停止轮巡</el-button>
                            </div>
                        </el-form>
                    </div>-->
                    <common-subtitle :isBold="true" title="关联摄像机列表" width="100%"></common-subtitle>
                    <div v-show="activeVideoName == 'realPlay'">
                        <el-button type="primary" size="mini" class="margin-d-5" @click="handleAllPlayVideo">全部播放</el-button>
                        <el-button type="primary" size="mini" class="margin-d-5" @click="handleAllCloseVideo">全部关闭</el-button>
                    </div>
                    <div v-show="activeVideoName == 'playBack'">
                        <el-button type="primary" size="mini" class="margin-d-5" @click="handleToggleSelect">全选 / 全不选</el-button>
                    </div>
                    <div class="list" v-scrollBar>
                        <div class="cam-cell" :class="{'active':roundPlayCameraList.indexOf(item)>-1}" v-for="(item,index) in data" @click="handleVideoPlay(item,index)">
                           <span class="ellipsis-l1 cam-item">
                              <i class="self-icon gun-cam-online-icon"></i>
                               <span :title="item.des">{{item.des}}</span>
                          </span>
                        </div>
                    </div>
                </div>
                <el-form ref="timeForm" :model="timeForm" label-width="80px" class="time-form"
                         v-show="isShowTimeForm">
                    <el-form-item label="开始时间">
                        <el-date-picker
                                v-model="timeForm.startTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                :picker-options="timeForm.pickerTimeBeg"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-date-picker
                                v-model="timeForm.endTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                :picker-options="timeForm.pickerTimeEnd"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="queryTimeForm">查询</el-button>
                        <el-button type="default" @click="resetTimeForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="19">
                <el-tabs type="border-card" class="video-tab" v-model="activeVideoName"
                         @tab-click="refreshTabPauseStyle">
                    <el-tab-pane label="实时视频" type="1" name="realPlay">
                        <real-play ref="realPlay"
                                   :playState="playState"
                                   btnShow="true"
                                   :winCount="winNum_play"
                                   :curWinCount="curWinNum_play"
                                   :curRowCls="curVideoRowCls_play"
                                   @change-win-num="changeWinNumFunc"
                                   @change-win-zoom="updateData"
                        ></real-play>
                    </el-tab-pane>
                    <el-tab-pane label="录像查看" type="2" name="playBack">
                        <play-back ref="playBack"
                                   :playState="playState"
                                   btnShow="true"
                                   :winCount="winNum"
                                   :curWinCount="curWinNum"
                                   :curRowCls="curVideoRowCls"
                                   :startTime="startTime"
                                   :endTime="endTime"
                                   :hoursPerRuler="hoursPerRuler"
                                   @change-win-num="changeWinNumFunc"
                                   @change-win-zoom="updateData"
                        ></play-back>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
        <!--<div class="drawer-wrapper">
            <el-button type="primary" class="drawer-handle" @click="openDrawerDialog">查看信息</el-button>
            <right-drawer :data="drawerTabsData" :maskVisible="maskVisible" :drawerVisible="drawerVisible" @close="closeDrawerDialog"></right-drawer>
        </div>-->
        <!--添加根节点的dialog-->
        <el-dialog title="添加根节点" v-if='addFirstNode' :visible.sync="addFirstNode" width="25%"
                   :close-on-click-modal="false" append-to-body v-elDragDialog>
            <root-node v-on:showHiddenAdd="showHiddenAdd"></root-node>
        </el-dialog>
        <!--添加下级节点的dialog-->
        <el-dialog title="添加下级节点" v-if='addNodeShow' :visible.sync="addNodeShow" width="480px"
                   :close-on-click-modal="false" append-to-body v-elDragDialog>
            <add-node :currentNode="currentNode" :rootData="rootData"
                      v-on:showHiddenAddNode="showHiddenAddNode"></add-node>
        </el-dialog>
        <!--编辑节点的dialog-->
        <el-dialog title="编辑节点" v-if='editNode' :visible.sync="editNode" width="480px" :close-on-click-modal="false"
                   append-to-body v-elDragDialog>
            <edit-node :currentNode="currentNode" v-on:showHiddenEdit="showHiddenEdit"></edit-node>
        </el-dialog>
        <!--添加摄像机dialog-->
        <el-dialog title="添加摄像机" v-if='addCameraShow' :visible.sync="addCameraShow" width="65%"
                   :close-on-click-modal="false" append-to-body v-elDragDialog>
            <add-camera :rootData="rootData" :currentNode="currentNode"
                        v-on:showHiddenAddCamera="showHiddenAddCamera"></add-camera>
        </el-dialog>
        <!--自定义轮巡时间dialog-->
        <el-dialog title="自定义轮巡时间" v-if='roundIntervalShow' :visible.sync="roundIntervalShow" width="480px"
                   :close-on-click-modal="false" append-to-body v-elDragDialog>
            <el-form :inline="true" :model="form" :rules="rules"  label-width="120px" ref="ruleForm" class="demo-form-inline">
                <el-form-item label="轮巡时间(s):">
                    <el-input v-model="form.roundTime" placeholder="请输入轮巡时间" type="number"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" @click="customRoundTime">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    /*引入组件*/
    import realPlay from '@/components/common/realPlay.vue';
    import playBack from '@/components/common/playBack.vue';
    import RightPanel from '@/components/RightPanel'
    import CommonSubtitle from '@/components/Subtitle/CommonSubtitle'
    //    import IntelligentAlarm from './components/intelligentAlarm.vue'


    /*引入工具类*/
    import passParam from '@/utils/ext.passParam'
    import dateTime from '@/utils/ext.dateTime'
    import utility from '@/utils/ext.utility'
    import elDragDialog from '@/directive/el-drag-dialog'

    import {doGetVideotape,checkUserCameraPower} from '@/api/video';

    export default {
        name: 'VideoMonitorIndex',
        directives: {elDragDialog},
        props:['data'],
        provide(){
            return {
                'autoOpenRightPanel':this.autoOpenRightPanel
            }
        },
        data() {
            return {
                treeForm: {
                    treeList: [],  //资源树列表
                    selectedTreeId: null //资源树列表默认选中的项（默认为第一项）
                },
                activeName: 'first',
                activeVideoName: 'realPlay',
                treeData: [],
                defaultProps: {
                    children: 'nodes',
                    label: 'text',
//                  icon:'icon'
                },
                expandedKeys: [],   //展开树的节点,默认为根节点
                selectedCameraNode: {},
                maskVisible: false,   //右侧抽屉的遮罩层是否显示
                drawerVisible: false,   //右侧抽屉是否显示
                queryCamera: process.env.VUE_APP_BASE_API + '/customCameraTree/list-camera',
                queryCameraParam: {roleId: 1, treeId: null},
                searchCameraParam: {roleId: 1, treeId: null},
                searchCamera: process.env.VUE_APP_BASE_API + '/customCameraTree/camera-search',
                /* queryCamera:this.$api.getApiAddress('/camera/query-camera', 'CESHI_API_HOST'),
                 searchCamera:this.$api.getApiAddress('/camera/query-camera-by-keyword', 'CESHI_API_HOST'),*/
                timeForm: {
                    startTime: dateTime.curentDate() + " 00:00:00",
                    endTime: dateTime.curentDate() + " 23:59:59",
                    pickerTimeBeg: { //限制开始时间
                        disabledDate: (time) => {
                            if (this.timeForm.endTime != '' && this.timeForm.endTime) {
                                let timeStr = new Date(this.timeForm.endTime.replace(/-/g, '/'));
                                return time.getTime() > timeStr;
                            } else {
                                return ''
                            }
                        }
                    },
                    pickerTimeEnd: { //限制结束时间
                        disabledDate: (time) => {
                            if (this.timeForm.startTime != '' && this.timeForm.startTime) {
                                let timeStr = new Date(this.timeForm.startTime.replace(/-/g, '/'));
                                return time.getTime() < timeStr;
                            } else {
                                return ''
                            }
                        }
                    }
                },
                isShowTimeForm: false,   //是否显示时间查询form表单
                toggleTabCount: 0,  //切换录像回放-tab页面的次数
                playState: 'realPlay',
                /*默认初始化当天的时间轴*/
                startTime: new Date(dateTime.curentDate() + " 00:00:00").getTime(),
                endTime: new Date(dateTime.curentDate() + " 23:59:59").getTime(),
                hoursPerRuler: 24,
                winNum: 4,    //窗口数量，默认为4窗口
                curWinNum: 4,   //当前的窗口数量
                curVideoRowCls: ['two-row'],  //窗口布局样式
                winNum_play: 4,    //窗口数量，默认为4窗口
                curWinNum_play: 4,   //当前的窗口数量
                curVideoRowCls_play: ['two-row'],  //窗口布局样式
                cameraId: '',
                cameraName: '',
                allDepartNodeCodeArray: [],  //所有部门节点的code数组
                userInfo: null,  //存储登录用户信息
                //预案树
                addFirstNode: false,//根节点模态框
                groupTreeData: [],//分组树
                queryGroupCamera: process.env.VUE_APP_BASE_API + '/groupMain/list-node-cam',//【分组】-节点下摄像机查询
                searchGroupCamera: process.env.VUE_APP_BASE_API + '/groupMain/search-nodes',//分组搜索
                queryGroupCameraParam: {roleId: 1, id: null},
                searchGroupCameraParam: {roleId: 1, userId: null},
                /*     rightMenus:[{name:'添加',icon:'el-icon-circle-plus-outline'},
                                 {name:'编辑',icon:'el-icon-edit'},
                                 {name:'删除',icon:'el-icon-remove-outline'},
                                 {name:'添加摄像机',icon:'icon iconfont iconshexiangji'}],*/
                rightMenus: [
                    {name: '添加摄像机', icon: 'el-icon-circle-plus', id: 1},
                    {name: '删除', icon: 'el-icon-circle-close', id: 2}
                ],
                addNodeShow: false,//下级节点模态框
                rootData: null,//选中添加节点的根节点id
                currentNode: null,//选中当前节点
                editNode: false,//编辑节点
                addCameraShow: false,
                roundIntervalShow:false,  //轮巡窗口显示
                expandedGroupKeys: [],//展开树的节点,默认为根节点
                roundInterval:null,  //轮巡的时间间隔
                nextCamNodeArray:[],  //轮巡分组内的所有摄像机节点
                form:{
                    roundTime:'',  //轮巡时间
                    intervalTime:30,
                },
                roundPlayCameraList:[],
            }
        },
        mounted() {

        },
        components: {
            realPlay,
            playBack,
            RightPanel,
            CommonSubtitle,
        },
        computed: {},
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
                } else {
                    this.winNum = winNum;
                    this.curWinNum = curWinNum;
                    this.curVideoRowCls = curVideoRowCls;
                }

            },
            //双击放大窗口改变参数
            updateData(value1, value2, state) {
                if (state == "realPlay") {
                    this.winNum_play = value1;
                    this.curVideoRowCls_play = [value2];
                } else {
                    this.winNum = value1;
                    this.curVideoRowCls = [value2];
                }

            },

            //刷新实时视频/录像回放的tab页，更新的暂停图标的样式
            refreshTabPauseStyle(tab) {
                this.roundPlayCameraList = [];  //清空选中状态
                if (tab.$attrs.type == "1") {
                    this.$refs.realPlay.refreshPauseStyle();
                    this.isShowTimeForm = false;
                    this.playState = 'realPlay';
                } else if (tab.$attrs.type == "2") {
                    this.$refs.playBack.refreshPauseStyle();
                    this.isShowTimeForm = true;   //显示时间查询的form表单
                    this.playState = 'playBack';

                    if (this.toggleTabCount == 0) {
                        this.$refs.playBack.initCanvas(new Date(this.timeForm.startTime).getTime(), [], new Date(this.timeForm.endTime).getTime(), 0);
                        this.toggleTabCount++;
                    }

                }
            },
            //录像回放-查询时间
            queryTimeForm() {
                //判断是否选中摄像机节点
                if (this.roundPlayCameraList.length == 0) {
                    this.$message({message: "请选中摄像机节点", type: 'warning',showClose:true});
                    return false
                }
                this.startTime = new Date(this.timeForm.startTime).getTime();
                this.endTime = new Date(this.timeForm.endTime).getTime();
                this.hoursPerRuler = dateTime.getSeveralDays(this.timeForm.startTime.substring(0, 10), this.timeForm.endTime.substring(0, 10)) * 24;


                //将时间参数存放到待播放窗口对应的instance对象中
                const dateStart = this.timeForm.startTime.replace(' ', 'T');
                const dateEnd = this.timeForm.endTime.replace(' ', 'T');
                console.log("开始时间和结束时间:" + dateStart + ',' + dateEnd);
                const dateStr = dateStart.split('T')[0];
                //循环查询
                this.roundPlayCameraList.map((item,index)=>{
                    //设置选中的窗口
                    this.$refs.playBack.$refs.videoComm.checkedVideoWin = index;
                    this.$refs.playBack.handleToggleWin(index);
                    this.$refs.playBack.chooseDateAndPlayBack(dateStr + 'T00:00:00', dateStart, dateEnd);
                });

                //先检查用户是否有“录像查询”的权限
                //1视频预览 2抓拍 3视频录像 4云台控制 5录像查询 6录像下载
                /*const params = {
                    index: 5,
                    roleId: this.userInfo.roleId,
                    userId: this.userInfo.id,
                    camCode: this.cameraId
                };
                checkUserCameraPower(params).then(res => {
                    if (res.data) {
                        //有查询权限
                        this.$refs.playBack.chooseDateAndPlayBack(dateStr + 'T00:00:00', dateStart, dateEnd);
                    } else {
                        this.$message({message: '该用户没有对摄像机进行录像查询的权限', type: 'warning'})
                    }
                });*/


            },
            //录像回放-重置查询时间
            resetTimeForm() {

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
            handleVideoPlay(data,index){
                if(this.roundPlayCameraList.indexOf(data) == -1){
                    this.roundPlayCameraList.push(data);
                    const node = {
                        code:data.code,
                        text:data.des,
                        typeCode:-1
                    }
                    if(this.activeVideoName == 'realPlay'){
                        //实时视频
                        this.$refs.realPlay.playVideoByCameraId(node, '#video-content>li');
                    }else{
                        //设置选中的窗口
                        this.$refs.playBack.$refs.videoComm.checkedVideoWin = index;
                        this.$refs.playBack.handleToggleWin(index);
                        this.$refs.playBack.setCameraId(node);
                        this.cameraId = data.code;
                    }
                }else{
                    this.roundPlayCameraList.splice(this.roundPlayCameraList.indexOf(data),1)
                }

            },
            /**
             * 全部播放
             */
            handleAllPlayVideo(){
                this.data.map((item,index)=>{
                    this.handleVideoPlay(item,index)
                })
            },
            /**
             * 全部关闭
             */
            handleAllCloseVideo(){
                this.roundPlayCameraList = [];
                this.$refs.realPlay.handleCloseAllVideo();
            },
            /**
             * 全选/全不选
             */
            handleToggleSelect(){
                if(this.roundPlayCameraList.length >0 ){
                    this.roundPlayCameraList = [];
                    this.handleAllCloseVideo();
                }else{
                    this.data.map((item,index)=>{
                        this.handleVideoPlay(item,index)
                    })
                }
            },

        }
    }
</script>

<style lang="less">
    @import '../style/video-play-manage.less';
</style>
<style lang="scss" scoped>
    /deep/ .video-tab{
        height: 100% !important;
    }
    .list-wrap{
        height: 100%;
        padding: 0 10px;
    }
    .list-wrap-1{
        height: calc(100% - 150px);
    }
    /deep/ .el-date-editor{
        width: 100%;
    }
    .list{
        height: calc(100% - 75px);
        position: relative;
    }
    .cam-cell{
        height: 30px;
        line-height: 30px;
        background-color: #f6f6f6;
        border-radius: 2px;
        margin-bottom: 8px;
        padding-left: 10px;
        .cam-item{
            width: 100%;
            display: inline-block;
        }
        &.active{
            background-color: #dbefff;
            border: solid 1px #93cefc;
        }
    }
</style>
<style>
    .el-dropdown-menu {
        z-index: 60000 !important;
    }
    .el-picker-panel{
        z-index: 60000 !important;
    }
</style>
