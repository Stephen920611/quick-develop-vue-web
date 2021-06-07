<template>
    <el-row class="container">
        <el-col :span="24" class="map-container">
            <div class="map">
                <!--地图显示-->
                <div class="map-wrapper">
                    <google-map-view ref="googleMap" @map="getMap" :lat="mapCenterLat" :lng="mapCenterLng"></google-map-view>
                </div>
                <!--右侧抽屉-->
                <right-panel ref="rightPanel">
                    <right-drawer ref="rightDrawer"></right-drawer>
                </right-panel>
                <!--左侧按钮-->
                <div class="left-icon-group">
                    <el-row v-for="(item,index) in activeBtns" :key="index">
                        <el-row>
                            <el-badge is-dot class="item" v-if="item.type != currentActiveBtnType && item.websocketData.length>0">
                                <img :src="item.isActive?item.activeUrl:item.url" class="image" @click="handleIsActiveBtn(index)">
                            </el-badge>
                            <div v-else>
                                <img :src="item.isActive?item.activeUrl:item.url" class="image" @click="handleIsActiveBtn(index)">
                            </div>
                           </el-row>
                        <el-row class="text-center font-bold"><span :class="{'active':item.isActive}">{{item.name}}</span></el-row>
                    </el-row>
                </div>
                <!--左侧列表-->
                <transition name="fade">
                    <div class="left-list" v-show="listShow">
                        <!--警情列表-->
                        <police-list v-if="currentActiveBtnType=='police'" :data="alarmMessages" @select="handleSelectPolice"></police-list>
                        <!--案件列表-->
                        <case-list v-if="currentActiveBtnType=='case'" :data="caseMessages" @select="handleSelectCase"></case-list>
                        <!--人员报警列表-->
                        <person-alarm-list v-if="currentActiveBtnType=='person'" :data="faceMessages" @select="handleSelectPersonAlarm"></person-alarm-list>
                        <!--车辆报警列表-->
                        <car-alarm-list v-if="currentActiveBtnType=='car'" :data="vehicleMessages" @select="handleSelectVehicleAlarm"></car-alarm-list>
                    </div>
                </transition>

                <!--行政区域-->
                <div class="select-area">
                    <el-select v-model="areaCode" filterable placeholder="请选择行政区域" @change="handleChangeArea">
                        <el-option
                                v-for="item in regions"
                                :key="item.code"
                                :label="item.des"
                                :value="item.code">
                        </el-option>
                    </el-select>
                </div>

                <!--前端感知设备-->
                <div class="device-wrap" :class="{'device-wrap-left': !listShow}">
                    <div class="cell">
                        <div class="title">
                            <CommonSubtitle title="前端感知设备" width="100%"></CommonSubtitle>
                            <i class="icon el-collapse-icon el-icon-arrow-down float-right" title="收缩" v-show="deviceArrowDownShow"
                               @click="changeDeviceArrow"></i>
                            <i class="icon el-collapse-icon el-icon-arrow-up float-right" title="展开" v-show="!deviceArrowDownShow"
                               @click="changeDeviceArrow"></i>
                        </div>
                        <div class="content" v-show="deviceArrowDownShow">
                            <el-checkbox-group v-model="checkDeviceList" class="device-item">
                                <el-checkbox label="治安监控" @change="handleChangeCameraCheckBox"></el-checkbox>
                                <el-checkbox label="道路卡口" @change="handleChangeBayonetCheckBox"></el-checkbox>
                                <el-checkbox label="人脸相机" @change="handleChangeFaceCheckBox"></el-checkbox>
                                <el-checkbox label="制高点"></el-checkbox>
                                <el-checkbox label="无线警力" @change="handleChangeWireLessCheckBox"></el-checkbox>
                                <el-checkbox label="350M手台" @change="handleChangeHandsetCheckBox"></el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
                <!--信息订阅-->
                <div class="subscribe-wrap" :class="{'subscribe-wrap-left': !listShow}">
                    <div class="cell">
                        <div class="title">
                            <CommonSubtitle title="信息订阅" width="100%"></CommonSubtitle>
                            <i class="icon el-collapse-icon el-icon-arrow-down float-right" title="收缩" v-show="subArrowDownShow"
                               @click="changeSubscribeArrow"></i>
                            <i class="icon el-collapse-icon el-icon-arrow-up float-right" title="展开" v-show="!subArrowDownShow"
                               @click="changeSubscribeArrow"></i>
                        </div>
                        <div class="content" v-show="subArrowDownShow">
                            <el-checkbox-group v-model="checkSubscribeList" class="device-item">
                                <el-checkbox label="人脸报警" @change="handleChangeSubscribeFace"></el-checkbox>
                                <el-checkbox label="车辆报警" @change="handleChangeSubscribeVehicle"></el-checkbox>
                                <el-checkbox label="警情" @change="handleChangeSubscribeAlarm"></el-checkbox>
                                <el-checkbox label="案件" @change="handleChangeSubscribeCase"></el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
        <!--视频播放的模态框-->
        <el-dialog title="实时视频" :visible.sync="videoDialogVisible" v-if="videoDialogVisible"  width="50%" :close-on-click-modal="false" class="video-dialog"
                   @close="closeVideoDialog" style="z-index: 65000;" v-elDragDialog>
            <real-play ref="realPlay"
                       :playState="playState"
                       btnShow="true"
                       :winCount="winNum_play"
                       :curWinCount="curWinNum_play"
                       :curRowCls="curVideoRowCls_play"
                       @change-win-num="changeWinNumFunc"
                       @change-win-zoom="updateData"
            ></real-play>
        </el-dialog>
        <!--录像回放的模态框-->
        <el-dialog title="录像回放" :visible.sync="playBackDialogVisible" v-if="playBackDialogVisible" width="50%" :close-on-click-modal="false" class="video-dialog playback-dialog"
                   @close="closePlayBackDialog" style="z-index: 65000;" v-elDragDialog>
            <camera-play-back ref="playBack" :param="playBackCameraParam"></camera-play-back>
        </el-dialog>
        <!--查看大图的模态框-->
        <el-dialog title="查看大图" :visible.sync="seeBigImageVisible" v-if="seeBigImageVisible" :close-on-click-modal="false" class="image-dialog"
                   @close="closeBigImgDialog" style="z-index: 65000;" v-elDragDialog>
               <el-image class="big-img" :src="bigImgUrl"></el-image>
        </el-dialog>
        <!--实时视频监控-->
        <el-dialog title="实时视频监控" :visible.sync="videoMonitorDialogVisible" v-if="videoMonitorDialogVisible" width="80%" top="8vh" :close-on-click-modal="false" style="z-index: 65000;" v-elDragDialog>
            <video-monitor :data="videoPlayData"></video-monitor>
        </el-dialog>
        <!--人脸-->
        <websocket ref="faceWebsocket" :url="faceSocket.wsUrl" :disconnect="faceSocket.disconnect" v-if="faceSocket.wsUrl" title="人脸报警" @connectSuccess="faceWebsocketConnectSuccess" @onmessage="faceWebsocketOnMessage" @onclose="faceWsocketOnClose"></websocket>
        <!--警情-->
        <websocket ref="alarmWebsocket" :url="alarmSocket.wsUrl" :disconnect="alarmSocket.disconnect" v-if="alarmSocket.wsUrl" title="警情报警" @onmessage="alarmWebsocketOnMessage" @onclose="alarmWsocketOnClose"></websocket>
        <!--案件-->
        <websocket ref="caseWebsocket" :url="caseSocket.wsUrl" :disconnect="caseSocket.disconnect" v-if="caseSocket.wsUrl" title="案件报警" @onmessage="caseWebsocketOnMessage" @onclose="caseWsocketOnClose"></websocket>
        <!--车辆-->
        <websocket ref="vehicleWebsocket" :url="vehicleSocket.wsUrl" :disconnect="vehicleSocket.disconnect" v-if="vehicleSocket.wsUrl" title="车辆报警" @onmessage="vehicleWebsocketOnMessage" @onclose="vehicleWsocketOnClose"></websocket>
        <!--无线警力-->
        <websocket ref="wireLessWebsocket" :url="wireLessSocket.wsUrl" :disconnect="wireLessSocket.disconnect" v-if="wireLessSocket.wsUrl" title="无线警力" @onmessage="wireLessWebsocketOnMessage" @onclose="wireLessWsocketOnClose"></websocket>
        <!--手台-->
        <websocket ref="handsetWebsocket" :url="handsetSocket.wsUrl" :disconnect="handsetSocket.disconnect" v-if="handsetSocket.wsUrl" title="手台" @onmessage="handsetWebsocketOnMessage" @onclose="handsetWsocketOnClose"></websocket>
    </el-row>
</template>
<script>

    import elDragDialog from '@/directive/el-drag-dialog'
    import CommonSubtitle from '@/components/Subtitle/CommonSubtitle'
    import googleMapView from '@/components/common/googleMapView.vue'
    import RightPanel from '@/components/RightPanel'
    import realPlay from '@/components/common/realPlay.vue';
    import websocket from "@/components/common/connectWebsocket.vue";
    import rightDrawer from './components/rightDrawer.vue';
    import policeList from './components/policeList.vue';
    import caseList from './components/caseList.vue';
    import personAlarmList from './components/personAlarmList.vue';
    import carAlarmList from './components/carAlarmList.vue';
    import cameraPlayBack from './components/cameraPlayBack.vue';
    import videoMonitor from './components/videoMonitor.vue';

    import {infoWindowMX,dragInfoWindow} from '@/mixins/infoWindowMX'
    import utility from '@/utils/ext.utility'
    import mapShowFunc from '@/utils/mapShowFunc'
    import passParam from '@/utils/ext.passParam'

    //请求接口
    import {getRegionList,getOrganAndCameraCount,getCameraForMap,getBayonetForMap,getFaceForMap,getCameraInfoById,getDeviceInfo,getCameraInfoByDevice,getAllDeviceDetail,getDeviceDetailByCode,queryAlertWebsocketCondition} from '@/api/map/map'
    import {fetchStatisRateByOrgan} from '@/api/dashboard/dashboard'

    import policeImgUrl from '@/assets/map_images/police_icon.png';
    import policeImgActiveUrl from '@/assets/map_images/police_active_icon.png';
    import caseImgUrl from '@/assets/map_images/case_icon.png';
    import caseImgActiveUrl from '@/assets/map_images/case_active_icon.png';
    import personAlarmImgUrl from '@/assets/map_images/person_alarm_icon.png';
    import personAlarmImgActiveUrl from '@/assets/map_images/person_alarm_active_icon.png';
    import carAlarmImgUrl from '@/assets/map_images/car_alarm_icon.png';
    import carAlarmImgActiveUrl from '@/assets/map_images/car_alarm_active_icon.png';

    export default {
        name: 'MapMonitorIndex',
        directives: {elDragDialog},
        components: {googleMapView, CommonSubtitle, RightPanel, rightDrawer,policeList,caseList,personAlarmList,carAlarmList,cameraPlayBack,realPlay,websocket,videoMonitor},
        provide(){
            return{
                locationAndShowInfoWin:this.locationAndShowInfoWin,
            }
        },
        data() {
            return {
                map: null,
                mapTools:null,  //地图方法类
                mapCenterLat: '37.3615407254',  //地图默认区域中心的经纬度,默认为招远市政府
                mapCenterLng: '120.4051633985',
                /**********************左侧列表***************************/
                currentActiveBtnType: 'police',
                activeBtns: [
                    {type: 'police', name: '警情', url: policeImgUrl, activeUrl: policeImgActiveUrl, isActive: true,websocketData:[]},
                    {type: 'case', name: '案件', url: caseImgUrl, activeUrl: caseImgActiveUrl, isActive: false,websocketData:[]},
                    {type: 'person', name: '人员报警', url: personAlarmImgUrl, activeUrl: personAlarmImgActiveUrl, isActive: false,websocketData:[]},
                    {type: 'car', name: '车辆报警', url: carAlarmImgUrl, activeUrl: carAlarmImgActiveUrl, isActive: false,websocketData:[]},
                ],
                policeMarkersHash: new utility.hashTable(),  //存储警情marker列表，key为id value为marker数组
                caseMarkersHash: new utility.hashTable(),  //存储案件marker列表，key为id value为marker数组
                personMarkersHash: new utility.hashTable(),  //存储人员报警marker列表，key为id value为marker数组
                vehicleMarkersHash: new utility.hashTable(),  //存储车辆报警marker列表，key为id value为marker数组
                bigImgUrl:'',  //查看大图的url
                seeBigImageVisible:false, //查看大图的弹窗显示
                /**********************行政区域列表*******************************/
                defaultSelectRegionCode: [],
                areaCode: '',  //选择的行政区域id
                regions: [],   //行政区域列表
                /**********************前端感知设备(marker)***********************/
                checkDeviceList: ['治安监控'],  //选中的前端感知设备
                zyOrganHash: new utility.hashTable(),  //存储招远市部门列表，key为id value为部门数据
                areaOrganMarkersHash: new utility.hashTable(),  //存储各区市的部门marker列表，key为areaCode value为部门marker数组
                areaCameraHash: new utility.hashTable(),  //存储各区市的摄像机列表，key为areaCode value为摄像机数组
                areaCameraMarkersHash: new utility.hashTable(),  //存储各区市的摄像机marker列表，key为areaCode value为摄像机marker数组
                areaBayonetHash: new utility.hashTable(),  //存储各区市的卡口列表，key为areaCode value为卡口数组
                areaBayonetMarkersHash: new utility.hashTable(),  //存储各区市的卡口marker列表，key为areaCode value为卡口marker数组
                areaFaceHash: new utility.hashTable(),  //存储各区市的人脸点位列表，key为areaCode value为人脸点位数组
                areaFaceMarkersHash: new utility.hashTable(),  //存储各区市的人脸点位marker列表，key为areaCode value为人脸点位marker数组
                subArrowDownShow:true,
                //无线警力
                wireLessSocket: { wsUrl: '',disconnect:false},
                wireLessMarkersHash: new utility.hashTable(),  //存储无线警力点位marker列表，key为deviceCode value为无线警力点位marker数组
                wireLessFigureHash: new utility.hashTable(),  //存储无线警力巡区，key为deviceCode value为无线警力巡区
                wireLessFigureCenterHash: new utility.hashTable(),  //存储无线警力巡区中心，key为deviceCode value为无线警力巡区
                wireLessDeviceInfoHash: new utility.hashTable(),  //存储无线警力设备详情，key为deviceCode value为无线警力设备详情
                wireLessCameraHash: new utility.hashTable(),  //存储无线警力车载摄像机，key为deviceCode value为无线警力车载摄像机
                //手台
                handsetSocket: { wsUrl: '',disconnect:false},
                handsetMarkersHash: new utility.hashTable(),  //存储手台点位marker列表，key为deviceCode value为手台点位marker数组
                allDeviceDetailList:[],
                //聚合摄像机
                videoPlayData:[],
                videoMonitorDialogVisible:false,
                /***********************信息订阅(websocket)*************************/
                checkSubscribeList: [],   //选中的信息订阅
                deviceArrowDownShow:true,
                //人脸
                faceSocket: { wsUrl: '',disconnect:false},
                //警情
                alarmSocket: {wsUrl: '',disconnect:false},
                //案件
                caseSocket: {wsUrl: '',disconnect:false},
                //车辆
                vehicleSocket: {wsUrl: '',disconnect:false},
                faceMessages:[],   //websocket返回的数据
                alarmMessages:[],
                caseMessages:[],
                vehicleMessages:[],
                /***********************实时视频窗口参数***************************/
                playState: 'realPlay',
                winNum_play: 4,    //窗口数量，默认为4窗口
                curWinNum_play: 4,   //当前的窗口数量
                curVideoRowCls_play: ['two-row'],  //窗口布局样式
                videoDialogVisible:false,
                /************************录像回放窗口参数*************************/
                playBackDialogVisible:false,
                playBackCameraParam:{cameraId:'',cameraName:''},  //传递摄像机参数

            }
        },
        computed:{
            //根据左侧报警按钮是否选中来控制左侧列表是否显示
            listShow(){
                return this.activeBtns.findIndex(target=>target.isActive===true)>-1
            },
            //获取当前的地图级别
            getMapZoom(){
                if(this.map){
                    return this.map.getZoom();
                }
            }
        },
        watch: {
            //监听地图缩放级别
            'getMapZoom': {
                handler(zoom) {
                    if(zoom > 11){
                        //当级别大于11级时，将勾选的前端感知设备显示出来，隐藏部门点位
                        this.showOrHideOrganMarkers(false);

                    }else{
//                       //当级别小于等于11级时，隐藏前端感知设备标记点，显示部门点位
                        this.showOrHideOrganMarkers(true);
                    }

                },
                deep:true
            },
        },
        created() {
            // 发送this 到 js 文件里
            mapShowFunc.sendThis(this);
            this.getAllDeviceDetailList();

        },
        methods: {
            getMap(map,mapTools) {
                this.map = map;
                this.mapTools = mapTools;
                //加载所有的行政区域：放在地图加载完成之后，防止地图未加载完成就标记点位
                this.getAllRegions();
            },


            //获取烟台市的行政区域
            getAllRegions() {
                this.defaultSelectRegionCode = [];
                getRegionList().then(res => {
                    this.regions = res.data;
                    this.regions.forEach(item => {
                        if (item.isCenter == "1") {
                            this.mapCenterLat = item.lat;
                            this.mapCenterLng = item.lng;
                            this.areaCode = item.code;
                            this.defaultSelectRegionCode.push(this.areaCode);   //初始化区域的选中状态

                            //加载招远市所管辖的部门
                            this.loadAllOrgan();

                            //获取默认区域的摄像机
                            let cameraMarkers = this.areaCameraHash.getValues(this.areaCode);
                            if (!cameraMarkers || cameraMarkers.length == 0) {
                                this.fetchAreaCamerasForMap(this.areaCode);
                            }
                            //获取默认区域的道路卡口
                            let bayonetMarkers = this.areaBayonetHash.getValues(this.areaCode);
                            if (!bayonetMarkers || bayonetMarkers.length == 0) {
                                this.fetchAreaBayonetsForMap(this.areaCode);
                            }
                            //获取默认区域的人脸点位
                            let faceMarkers = this.areaFaceHash.getValues(this.areaCode);
                            if (!faceMarkers || faceMarkers.length == 0) {
                                this.fetchAreaFaceForMap(this.areaCode);
                            }

                        }
                    });
                })
            },
            /**
             * 切换行政区域时，定位所在位置
             */
            handleChangeArea() {
                this.regions.forEach(item => {
                    if (item.code == this.areaCode) {
                        this.mapCenterLat = item.lat;
                        this.mapCenterLng = item.lng;
                        //定位所在位置
                        this.mapTools.pan2Point(this.mapCenterLat, this.mapCenterLng);
                        this.defaultSelectRegionCode.push(this.areaCode);   //初始化区域的选中状态
                    }
                })
            },

            /**
             *  加载招远市所管辖的部门
             */
            loadAllOrgan(){
                getOrganAndCameraCount(this.$qs.stringify({areaCode:this.areaCode})).then(res=>{
                    let markers = [];
                    res.data.map(item=>{
                        this.zyOrganHash.add(item.id,item)
                        if(item.offsetLat && item.offsetLng){
                            //在地图上添加部门点位
                            let organMarker = this.mapTools.addMarker(this.map,item.id,item.offsetLat,item.offsetLng,'zy_organ32',item.des,'organ',true,true,true,()=>{
                                return item.camCount
                            });
                            markers.push(organMarker);
                        }
                    });
                    this.areaOrganMarkersHash.add(this.areaCode,markers)
                })
            },
            /**
             * 通过地图缩放，隐藏或显示部门marker，显示或隐藏前端感知设备marker
             * @param flag:true为显示部门marker，false则隐藏
             */
            showOrHideOrganMarkers(flag){
                //获取前端感知设备的所有marker,以勾选设备为显示基准
                const organArr = this.areaOrganMarkersHash.getValues();
                const cameraArr = this.areaCameraMarkersHash.getValues();
                const bayonetArr = this.areaBayonetMarkersHash.getValues();
                const faceArr = this.areaFaceMarkersHash.getValues();
                const cameraCheckedFlag = this.checkDeviceList.indexOf('治安监控')>-1;
                const bayonetCheckedFlag = this.checkDeviceList.indexOf('道路卡口')>-1;
                const faceCheckedFlag = this.checkDeviceList.indexOf('人脸相机')>-1;
                let organMarkers = [],cameraMarkers = [],bayonetMarkers = [],faceMarkers = [],deviceMarkers=[];
                organArr.map(arr=>{ organMarkers = organMarkers.concat(arr);});
                cameraArr.map(arr=>{ cameraMarkers = cameraMarkers.concat(arr);});
                bayonetArr.map(arr=>{ bayonetMarkers = bayonetMarkers.concat(arr);});
                faceArr.map(arr=>{ faceMarkers = faceMarkers.concat(arr);});
                deviceMarkers = cameraMarkers.concat(bayonetMarkers).concat(faceMarkers);
                if(flag){
                    //显示部门，隐藏全部的前端感知设备
                    this.setMarkerShowOrHide(organMarkers,true,'zy_organ32',cameraCheckedFlag);
                    this.setMarkerShowOrHide(deviceMarkers,false,'zy_cameras16');
                }else{
                    //隐藏部门，显示已勾选的前端感知设备
                    this.setMarkerShowOrHide(organMarkers,false,'zy_organ32',cameraCheckedFlag);
                    this.setMarkerShowOrHide(cameraMarkers,cameraCheckedFlag,'zy_cameras16');
                    this.setMarkerShowOrHide(bayonetMarkers,bayonetCheckedFlag);
                    this.setMarkerShowOrHide(faceMarkers,faceCheckedFlag);
                }
            },
            setMarkerShowOrHide(markerArray,flag,iconName,cameraCheckedFlag){
                let state = flag?this.map:null;
                let organMarkerShow = (cameraCheckedFlag && flag)?this.map:null;
                markerArray.map(marker=>{
                    if(marker){
                        marker.setMap(state);
                        if(marker.label){
                            marker.label.setMap(state);
                        }
                        if (iconName && marker.iconName == iconName) {
                            if(iconName == 'zy_organ32'){
                                marker.setMap(organMarkerShow)
                                if(marker.label){
                                    marker.label.setMap(organMarkerShow)
                                }
                                marker.labelMarker.setVisible(flag && cameraCheckedFlag);
                            }else{
                                marker.labelMarker.setVisible(flag);
                            }

                        }
                    }
                });
            },

            /*************************************************控制面板的收缩和展开***************************************************************/
            changeDeviceArrow(){
                this.deviceArrowDownShow = !this.deviceArrowDownShow;
            },
            changeSubscribeArrow(){
                this.subArrowDownShow = !this.subArrowDownShow;
            },
            /*************************************************左侧列表点击后，在地图上标记出来***************************************************************/
            //切换左侧的按钮，切换列表内容
            handleIsActiveBtn(index) {
                this.activeBtns.map((item, indx) => {
                    if (index == indx) {
                        item.isActive = !item.isActive;
                        this.currentActiveBtnType = item.type
                        //激活状态后，去掉按钮右上角的红色标记
                        item.websocketData = [];
                    }else{
                        item.isActive = false;
                    }
                });

                //清除地图上所有的警情、案件、人员报警、车辆报警
                let policeMarker = this.policeMarkersHash.getValues();
                let caseMarker = this.caseMarkersHash.getValues();
                let personMarker = this.personMarkersHash.getValues();
                let markers = policeMarker.concat(caseMarker).concat(personMarker);
                markers.map(marker=>{
                    marker.setMap(null);
                })
            },
            //警情
            handleSelectPolice(data,showFlag){
                let temp = showFlag?this.map:null;
                let policeMarker = this.policeMarkersHash.getValue(data.id);
                if(!policeMarker){
                    policeMarker = this.mapTools.addMarker(this.map,data.id,data.offsetLat,data.offsetLng,'zy_police_alarm16','','police',true,true,false,()=>{});
                    this.policeMarkersHash.add(data.id,policeMarker);
                    google.maps.event.addListener(policeMarker, 'click', (event) => {
                        let component = new this.infoWindow({
                            propsData:{
                                info: data,
                                vm:this
                            }
                        }).$mount();
                        this.mapTools.showInfoWin(this.map, policeMarker, component.$el);
                    })
                }else{
                    policeMarker.setMap(temp);
                }
                if(showFlag){
                    //地图定位到16级
                    this.map.setZoom(16);
                    //定位
                    mapShowFunc.pan2Point(data.offsetLat,data.offsetLng);
                    //关闭信息提示框
                    mapShowFunc.closeInfoWin();
                    //打开信息提示窗
                    mapShowFunc.showMarkerInfo(this.map, data.id,policeMarker, 'police');
                }
            },
            //案件
            handleSelectCase(data,showFlag){
                let temp = showFlag?this.map:null;
                let caseMarker = this.caseMarkersHash.getValue(data.id);
                if(!caseMarker){
                    caseMarker = mapShowFunc.addMarker(this.map,data.id,data.offsetLat,data.offsetLng,'zy_case16','','case',true,true,()=>{});
                    caseMarker.info = data.id+'&'+data.offsetLat+'&'+data.offsetLng+'&'+data.code+'&'+data.typeDes+'&'+data.caseSourceDes+'&'+data.caseStatusDes
                        +'&'+data.address+'&'+data.caseTime+'&'+data.name+'&'+data.unitDes;
                    this.caseMarkersHash.add(data.id,caseMarker);
                }else{
                    caseMarker.setMap(temp);
                }
                if(showFlag){
                    //地图定位到16级
                    this.map.setZoom(16);
                    //定位
                    mapShowFunc.pan2Point(data.offsetLat,data.offsetLng);
                    //关闭信息提示框
                    mapShowFunc.closeInfoWin();
                    //打开信息提示窗
                    mapShowFunc.showMarkerInfo(this.map, data.id,caseMarker, 'case');
                }
            },
            //人员报警
            handleSelectPersonAlarm(data,showFlag){
                let temp = showFlag?this.map:null;
                let personMarker = this.personMarkersHash.getValue(data.id);
                if(!personMarker){
                    personMarker = mapShowFunc.addMarker(this.map,data.id,data.lat,data.lng,'zy_person_alarm16','','personAlarm',true,true,()=>{});
                    personMarker.info = data.id+'&'+data.lat+'&'+data.lng+'&'+data.repositoryDes+'&'+data.category+'&'+data.name+'&'+data.personId+'&'+data.similarity
                        +'&'+data.cameraDes+'&'+data.hitTime.substring(0,19);
                    personMarker.url = data.picUrl;
                    this.personMarkersHash.add(data.id,personMarker);
                }else{
                    personMarker.setMap(temp);
                }
                if(showFlag){
                    //地图定位到16级
                    this.map.setZoom(16);
                    //定位
                    mapShowFunc.pan2Point(data.lat,data.lng);
                    //关闭信息提示框
                    mapShowFunc.closeInfoWin();
                    //打开信息提示窗
                    mapShowFunc.showMarkerInfo(this.map, data.id,personMarker, 'personAlarm');
                }
            },
            //人脸报警--查看大图
            faceBigImg(id){
                let marker = this.personMarkersHash.getValue(id);
                this.bigImgUrl = marker.url;
                this.seeBigImageVisible = true;
            },
            //车辆报警
            handleSelectVehicleAlarm(data,showFlag){
                let temp = showFlag?this.map:null;
                let vehicleMarker = this.vehicleMarkersHash.getValue(data.id);
                if(!vehicleMarker){
                    vehicleMarker = mapShowFunc.addMarker(this.map,data.id,data.offsetLat,data.offsetLng,'zy_car_alarm16','','vehicleAlarm',true,true,()=>{});
                    vehicleMarker.info = data.id+'&'+data.offsetLat+'&'+data.offsetLng+'&'+data.plateNum+'&'+data.typeName+'&'+data.bayonetName+'&'+data.alarmTime+'&'+data.directionName
                        +'&'+data.laneName;
                    vehicleMarker.url = data.url;
                    this.vehicleMarkersHash.add(data.id,vehicleMarker);
                }else{
                    vehicleMarker.setMap(temp);
                }
                if(showFlag){
                    //地图定位到16级
                    this.map.setZoom(16);
                    //定位
                    mapShowFunc.pan2Point(data.offsetLat,data.offsetLng);
                    //关闭信息提示框
                    mapShowFunc.closeInfoWin();
                    //打开信息提示窗
                    mapShowFunc.showMarkerInfo(this.map, data.id,vehicleMarker, 'vehicleAlarm');
                }
            },
            //车辆报警--查看大图
            vehicleBigImg(id){
                let marker = this.vehicleMarkersHash.getValue(id);
                this.bigImgUrl = marker.url;
                this.seeBigImageVisible = true;
            },

            //关闭查看大图的模态框
            closeBigImgDialog(){
                this.seeBigImageVisible = false;
            },

            /*************************************************前端感知设备在地图上显示***************************************************************/
            /**
             *  获取对应市区的所有摄像机，在地图上标注
             */
            fetchAreaCamerasForMap(areaCode){
                getCameraForMap(this.$qs.stringify({areaCode:areaCode,buildStatus:1,status:''})).then(res=>{
                    this.areaCameraHash.add(areaCode,res.data);
                    let markers = [];
                    res.data.map(item=>{
                        let marker = null;
                        if(item.number>1){
                            marker = mapShowFunc.addMarker(this.map, item.positionId, item.lat, item.lng, 'zy_cameras16', '', "camera", true, false, () => {
                                return item.number;
                            });
                            marker.positionId =  item.positionId;
                            marker.number = item.number;
                            if(marker.labelMarker){
                                marker.labelMarker.setVisible(false);
                            }

                        }else{
                            if(item.cameras && item.cameras[0]){
                                const data = item.cameras[0];
                                const icon = 'zy_'+data.icon.substring(0,data.icon.length-2)+'16';
                                marker = mapShowFunc.addMarker(this.map, data.positionId, data.lat, data.lng, icon, '', "camera", true, false, () => {});
                                marker.positionId =  data.positionId;
                                marker.number = 1;
//                            marker.info = data.id+'&'+data.cameraCode+'&'+data.cameraName+'&'+data.positionDes+'&'+data.areaName+'&'+data.lat+'&'+data.lng;
                            }

                        }
                        if(marker){
                            //监听摄像机点位的点击事件
                            google.maps.event.addListener(marker, 'click', (event) => {
                                this.getCameraInfoById(marker);
                            })
                            markers.push(marker);  //marker不为null才进行存储
                        }
                    });
                    this.areaCameraMarkersHash.add(areaCode,markers);
                })
            },
            /**
             *  通过接口，获取摄像机的详细信息，气泡展示
             */
            getCameraInfoById(marker){
                if(marker.number>1){
                    getCameraInfoById(this.$qs.stringify({id: marker.positionId})).then(res=>{
                        console.log(res,"res");
                        if(res.data && JSON.stringify(res.data) != '{}'){
                            //聚合点
                            let data = res.data.cameras;
                            this.videoPlayData = data;
                            this.videoMonitorDialogVisible = true;
                        }
                    })

                }else {
                    //单个点
                    getCameraInfoById(this.$qs.stringify({id: marker.positionId})).then(res => {
                        const data = res.data;
                        if(data.cameras && data.cameras[0]){
                            const camera = data.cameras[0];
                            let content = '<div class="loc-content loc-content-1">'
                                + '<div class="loca-info">信息展示</div>'
                                + '<div class="msg-content">'
                                + '<p class="msg-info title"><span>' + camera.des + '</span></p>'
                                + '<p class="msg-info"><span>地理位置：</span><span>' + data.des + '</span></p>'
                                + '<p class="msg-info"><span>所属区域：</span><span>' + data.areaName + '</span></p>'
                                + '<p class="msg-info"><span class="location"><i class="square"></i><span class="loc loc-lng">E ' + parseFloat(data.lng).toFixed(5) + '</span></span>'
                                + '<span class="location"><i class="square"></i><span class="loc loc-lat">N ' + parseFloat(data.lat).toFixed(5) + '</span></span></p>'
                                + '</div>';
                            content += '<div class="icon-wrap">'
                                + '<span class="icon" onclick="mapShowFunc.openCameraVideoDialog(\''+camera.code+'\',\''+camera.des+'\')">实时预览</span>'
                                + '<span class="icon" onclick="mapShowFunc.openCameraPlayBackDialog(\''+camera.code+'\',\''+camera.des+'\')">录像回放</span>'
                                + '</div>';
                            content += '</div>';
                            marker.content = content;
                            //关闭信息提示框
                            mapShowFunc.closeInfoWin();
                            //打开信息提示窗
                            mapShowFunc.showInfoWin(this.map, marker, content);
                        }
                    })
                }
            },


            /**
             *  获取对应市区的所有道路卡口，在地图上标注
             */
            fetchAreaBayonetsForMap(areaCode){
                getBayonetForMap(this.$qs.stringify({areaCode:areaCode})).then(res=>{
                    this.areaBayonetHash.add(areaCode,res.data);
                    let markers = [];
                    res.data.map(item=>{
                        let marker = mapShowFunc.addMarker(this.map, item.id, item.lat, item.lng, 'zy_bayonet16', '', "device", true, false, () => {});
                        if(marker){
                            marker.info = item.id+'&'+ item.name+'&'+ item.lat+'&'+ item.lng;
                            markers.push(marker);
                        }
                    });
                    this.areaBayonetMarkersHash.add(areaCode,markers);
                })
            },
            /**
             *  获取对应市区的所有人脸点位，在地图上标注
             */
            fetchAreaFaceForMap(areaCode){
                getFaceForMap(this.$qs.stringify({areaCode:areaCode})).then(res=>{
                    this.areaFaceHash.add(areaCode,res.data);
                    let markers = [];
                    res.data.map(item=>{
                        let marker = mapShowFunc.addMarker(this.map, item.id, item.offsetLat, item.offsetLng, 'zy_face16', '', "device", true, false, () => {});
                        if(marker){
                            marker.info = item.id+'&'+ item.des+'&'+ item.offsetLat+'&'+ item.offsetLng;
                            markers.push(marker);
                        }
                    });
                    this.areaFaceMarkersHash.add(areaCode,markers);
                })
            },
            /**
             * 切换前端感知设备时,加载或隐藏地图上对应的图标
             */
            //摄像机
            handleChangeCameraCheckBox(status){
                let markersArr = this.areaCameraMarkersHash.getValues();
                let markers = [];
                markersArr.map(arr=>{
                    markers = markers.concat(arr);
                });
                const mapZoom = this.map.getZoom();
                //级别大于11时，勾选"治安监控"则显示摄像机，不勾选则隐藏
                let temp = (mapZoom>11 && status)?this.map:null;
                markers.map(marker=>{
                    if(marker){
                        marker.setMap(temp);
                        if (marker.label) {
                            marker.label.setMap(temp);
                        }
                        if (marker.iconName == "zy_cameras16") {
                            marker.labelMarker.setVisible(status && mapZoom>11);
                        }
                    }
                });
                //级别小于或等于11时，勾选则显示部门及旁边的摄像机数量，不勾选则隐藏
                let markersArr1 = this.areaOrganMarkersHash.getValues();
                let markers1 = [];
                markersArr1.map(arr=>{
                    markers1 = markers1.concat(arr);
                });
                let temp1 = (mapZoom<=11 && status)?true:false;
                let organMarkerShow = (mapZoom<=11 && status)?this.map:null;
                markers1.map(marker=>{
                    marker.setMap(organMarkerShow);
                    if(marker.label){
                        marker.label.setMap(organMarkerShow)
                    }
                    marker.labelMarker.setVisible(temp1);
                })

            },
            //道路卡口
            handleChangeBayonetCheckBox(status){
                let markersArr = this.areaBayonetMarkersHash.getValues();
                let markers = [];
                markersArr.map(arr=>{
                    markers = markers.concat(arr);
                });
                const mapZoom = this.map.getZoom();
                let temp = (mapZoom>11 && status)?this.map:null;
                markers.map(marker=>{
                    if(marker){
                        marker.setMap(temp);
                        if (marker.label) {
                            marker.label.setMap(temp);
                        }
                    }
                })
            },
            //人脸
            handleChangeFaceCheckBox(status){
                let markersArr = this.areaFaceMarkersHash.getValues();
                let markers = [];
                markersArr.map(arr=>{
                    markers = markers.concat(arr);
                });
                const mapZoom = this.map.getZoom();
                let temp = (mapZoom>11 && status)?this.map:null;
                markers.map(marker=>{
                    if(marker){
                        marker.setMap(temp);
                        if (marker.label) {
                            marker.label.setMap(temp);
                        }
                    }

                })
            },
            //无线警力
            handleChangeWireLessCheckBox(status){
                if(status){
                    this.wireLessSocket.wsUrl = localStorage.getItem('vehicle_gps_websocket_url');
                    this.wireLessSocket.disconnect = false;
                }else{
                    this.wireLessSocket.disconnect = true;
                    let websocketObj = this.$refs.wireLessWebsocket.websock;
                    if(websocketObj){
                        websocketObj.close();
                    }
                    setTimeout(()=>{
                        this.wireLessSocket.wsUrl = '';
                    },500);
                    //清除地图上无线警力的marker标记和哈希表
                    let markersArr = this.wireLessMarkersHash.getValues();
                    markersArr.map(marker=>{
                        if(marker){
                            marker.setMap(null);
                            if (marker.label) {
                                marker.label.setMap(null);
                            }
                            marker = null;
                        }
                    });
                    this.wireLessMarkersHash.clear();
                    //清除巡区及哈希表
                    let figures = this.wireLessFigureHash.getValues();
                    figures.map(figure=>{
                        figure.setMap(null)
                    });
                    this.wireLessFigureHash.clear();
                    this.wireLessFigureCenterHash.clear();
                }
            },
            //手台
            handleChangeHandsetCheckBox(status){
                if(status){
                    this.handsetSocket.wsUrl = localStorage.getItem('handset_websocket_url');
                    this.handsetSocket.disconnect = false;
                }else{
                    this.handsetSocket.disconnect = true;
                    let websocketObj = this.$refs.handsetWebsocket.websock;
                    if(websocketObj){
                        websocketObj.close();
                    }
                    setTimeout(()=>{
                        this.handsetSocket.wsUrl = '';
                    },500);
                    //清除地图上手台的marker标记和哈希表
                    let markersArr = this.handsetMarkersHash.getValues();
                    markersArr.map(marker=>{
                        if(marker){
                            marker.setMap(null);
                            if (marker.label) {
                                marker.label.setMap(null);
                            }
                            marker = null;
                        }
                    });
                    this.handsetMarkersHash.clear();
                }
            },



            /************************************实时视频方法******************************************/
            //打开摄像机实时视频的窗口
            openCameraVideoDialog(camCode,camName){
                this.videoDialogVisible = true;
                this.winNum_play = 1;    //窗口数量，默认为单窗口
                this.curWinNum_play = 1;   //当前的窗口数量
                this.curVideoRowCls_play = ['one-row']; //窗口布局样式
                setTimeout(()=>{
                    if(this.$refs.realPlay){
                        this.$refs.realPlay.playAGroupOfVideo([{code:camCode,text:camName}]);
                    }
                },300);
            },
            //关闭实时视频播放的弹窗
            closeVideoDialog(){
                //关闭视频
                this.$refs.realPlay.closeAllVideo();
                this.videoDialogVisible = false;
            },

            //实时视频窗口
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
            /*******************************************录像回放****************************************/
            openCameraPlayBackDialog(camCode,camName){
                //弹窗显示
                this.playBackDialogVisible = true;
                this.playBackCameraParam.cameraId = camCode;
                this.playBackCameraParam.cameraName = camName;

            },
            closePlayBackDialog(){

            },
            /***********************************marker的定位并弹出气泡方法****************************/
            locationAndShowInfoWin(positionId){
                //將地图定位到15级
                this.map.setZoom(17);
                //判断前端感知设备是否勾选“治安监控”
                const cameraCheckedFlag = this.checkDeviceList.indexOf('治安监控')>-1;
                if(!cameraCheckedFlag){
                    this.checkDeviceList.push('治安监控');
                    // 显示摄像机点位
                    this.handleChangeCameraCheckBox(true);
                }

                //根据id找到对应的摄像机marker
                const cameraArr = this.areaCameraMarkersHash.getValues();

                let cameraMarkers = [];
                cameraArr.map(arr=>{ cameraMarkers = cameraMarkers.concat(arr);});
                let currentMarker = null;
                cameraMarkers.map(marker => {
                    if(marker.positionId == positionId){
                        currentMarker = marker;
                        //定位
                        mapShowFunc.move2PointByMarker(marker);
                        //弹出气泡---聚合点位只定位不弹窗
                        if(marker.iconName != 'zy_cameras16'){
                            this.getCameraInfoById(marker)
                        }
                    }
                });
                if(!currentMarker){
                    this.$message({message:'缺少经纬度，地图上没有对应的标记点！',type:'warning'})
                }
            },
            /**************************************************信息订阅（websocket链接）*************************************************/
            /**
             *  通过勾选改变信息订阅
             *      -- 勾选则连接，不勾选则断开
             * @param flag
             */
            handleChangeSubscribeFace(flag){
                if(flag){
                    this.faceSocket.wsUrl = localStorage.getItem('face_alert_websocket_url');
                    this.faceSocket.disconnect = false;
                }else{
                    this.faceSocket.disconnect = true;
                    let websocketObj = this.$refs.faceWebsocket.websock;
                    if(websocketObj){
                        websocketObj.close();
                    }
                    setTimeout(()=>{
                        this.faceSocket.wsUrl = '';
                    },500)
                }
            },
            handleChangeSubscribeVehicle(flag){
                if(flag){
                    this.vehicleSocket.wsUrl = localStorage.getItem('vehicle_alarm_websocket_url');
                    this.vehicleSocket.disconnect = false;
                }else{
                    this.vehicleSocket.disconnect = true;
                    let websocketObj = this.$refs.vehicleWebsocket.websock;
                    if(websocketObj){
                        websocketObj.close();
                    }
                    setTimeout(()=>{
                        this.vehicleSocket.wsUrl = '';
                    },500);

                }
            },
            handleChangeSubscribeAlarm(flag){
                if(flag){
                    this.alarmSocket.wsUrl = localStorage.getItem('case_police_info_websocket_url');
                    this.alarmSocket.disconnect = false;
                }else{
                    this.alarmSocket.disconnect = true;
                    let websocketObj = this.$refs.alarmWebsocket.websock;
                    if(websocketObj){
                        websocketObj.close();
                    }
                    setTimeout(()=>{
                        this.alarmSocket.wsUrl = '';
                    },500)

                }
            },
            handleChangeSubscribeCase(flag){
                if(flag){
                    this.caseSocket.wsUrl = localStorage.getItem('case_websocket_url');
                    this.caseSocket.disconnect = false;
                }else{
                    this.caseSocket.disconnect = true;
                    let websocketObj = this.$refs.caseWebsocket.websock;
                    if(websocketObj){
                        websocketObj.close();
                    }
                    setTimeout(()=>{
                        this.caseSocket.wsUrl = '';
                    },500);
                }
            },
            //人脸websocket连接成功后，send参数
            faceWebsocketConnectSuccess(){
                queryAlertWebsocketCondition().then(res=>{
                    this.$refs.faceWebsocket.websock.send(JSON.stringify(res.data));
                })
            },

            //人脸websocket 连接返回的数据
            faceWebsocketOnMessage(data) {
                let faceInfo = data.newestWarning[0];
                this.faceMessages = [];
                this.faceMessages.unshift(faceInfo);
                this.activeBtns[2].websocketData = this.faceMessages;

            },
            //人脸websocket 关闭
            faceWsocketOnClose() {

            },
            //警情websocket 连接返回的数据
            alarmWebsocketOnMessage(data) {
                this.alarmMessages = [];
                this.alarmMessages.unshift(data);
                this.activeBtns[0].websocketData = this.alarmMessages;
            },
            //警情websocket 关闭
            alarmWsocketOnClose() {

            },
            //案件websocket 连接返回的数据
            caseWebsocketOnMessage(data) {
                this.caseMessages = [];
                data.name = data.typeName;
                this.caseMessages.unshift(data);
                this.activeBtns[1].websocketData = this.caseMessages;
            },
            //案件websocket 关闭
            caseWsocketOnClose() {

            },
            //车辆websocket 连接返回的数据
            vehicleWebsocketOnMessage(data) {
                this.vehicleMessages = [];
                this.vehicleMessages.unshift(data);
                this.activeBtns[3].websocketData = this.vehicleMessages;
            },
            //车辆websocket 关闭
            vehicleWsocketOnClose() {

            },
            //无线警力websocket 连接返回的数据
            wireLessWebsocketOnMessage(data) {
//                data.deviceCode = '37061118001380000001';
                //获取招远市所有的警力
                const allPolceList = this.$refs['rightDrawer'].$refs['policeForce'].allList;
//                console.log(allPolceList,"allPolceList");
//                console.log(data.deviceCode,"data.deviceCode");
                //websocket推送的是全市范围内的警力，需要过滤成只有招远的警力
                if(allPolceList.indexOf(data.deviceCode) >-1){
                    //先判断该设备是否已存储在哈希表中，若存在则不再调用接口
                    const deviceInfo =  this.wireLessDeviceInfoHash.getValue(data.deviceCode);
                    const deviceCamera =  this.wireLessCameraHash.getValue(data.deviceCode);
                    if(deviceInfo && deviceCamera){
                        const res = deviceInfo;
                        const resp = deviceCamera;
                        this.operateWireLessMarker(data,res,resp);

                    }else{
                        //先判断该设备是否已存储在哈希表中，若不存在则调用接口
                        //查询详情
                        getDeviceInfo(this.$qs.stringify({code:data.deviceCode})).then(res=>{
                            //存储无线警力设备详情
                            this.wireLessDeviceInfoHash.add(data.deviceCode,res);
                            //获取车载摄像机
                            getCameraInfoByDevice(this.$qs.stringify({code: data.deviceCode})).then(resp=>{
                                //存储无线警力设备详情
                                this.wireLessCameraHash.add(data.deviceCode,resp);
                                this.operateWireLessMarker(data,res,resp)
                            })
                        })
                    }
                }
            },
            operateWireLessMarker(data,res,resp){
                //存储websocket推送的数据
                let marker = this.wireLessMarkersHash.getValue(data.deviceCode);
                if(marker){
                    const LatLng = new google.maps.LatLng(data.lat,data.lng);
                    marker.label.setMap(null);
                    marker.setPosition(LatLng);
                    const label = mapShowFunc.addLabelWithFont(data.lat,data.lng,res.data.des,15);
                    marker.label = label;
                }else{
                    let icon = '';
                    if(res.data.type == 11){icon = 'zy_police_car16'}
                    if(res.data.type == 12){icon = 'zy_single_pawn16'}
                    if(res.data.type == 14){icon = 'zy_police_ptu_car16'}
                    if(res.data.type == 16){icon = 'zy_coverged_communication16'}
                    marker = mapShowFunc.addMarker(this.map,data.deviceCode,data.lat,data.lng,icon,res.data.des,'wireLessCar',true,true,()=>{});
                    marker.info = data.lat+'&'+data.lng+'&'+data.direction+'&'+data.speed+'&'+res.data.des+'&'+data.deviceCode+'&'+JSON.stringify(resp.data);
                    marker.cameras  = resp.data;
                    this.wireLessMarkersHash.add(data.deviceCode,marker)
                }
            },
            //无线警力websocket 关闭
            wireLessWsocketOnClose() {

            },
            //绘制巡区
            drawRoundArea(deviceCode){
//                deviceCode = '37068521181380000001'
                const figure = this.wireLessFigureHash.getValue(deviceCode);
                if(figure){
                    //若是存在巡区，自动定位，无需再次绘制
                    let latLngObj = this.wireLessFigureCenterHash.getValue(deviceCode);
                    mapShowFunc.pan2Point(latLngObj.lat(),latLngObj.lng());
                    return
                }
                getDeviceDetailByCode(this.$qs.stringify({code:deviceCode})).then(res=>{
                    if(res.data && JSON.stringify(res.data) != '{}'){
                        if(res.data.boundary == '' || res.data.boundary == null){
                            this.$message({message:'没有巡区',type:'warning',showClose:true})
                            return
                        }
                        let boundary = JSON.parse(res.data.boundary);
                        if(boundary && boundary.length>0){
                            const option = {
                                strokeColor:'#468EF7',
                                strokeOpatity: 1,
                                fillColor: '#13c2f7',
                            };
                            //绘制区域
                            let drawFigure = null;
                            if(boundary.length == 2){
                                //刻画矩形
                                const rectBounds = new google.maps.LatLngBounds({lat:boundary[0].lat,lng:boundary[0].lng},{lat:boundary[1].lat,lng:boundary[1].lng});
                                drawFigure = mapShowFunc.drawRect(rectBounds,option);
                            }else if(boundary.length > 2){
                                //刻画多边形
                                drawFigure = mapShowFunc.drawPolygon(boundary,option);
                            }
                            this.wireLessFigureHash.add(deviceCode,drawFigure);

                            //移动至地图中央
                            let LatLngBounds = new google.maps.LatLngBounds();//API地图边界
                            boundary.map(ktem=>{
                                const temp = new google.maps.LatLng(ktem.lat, ktem.lng);
                                LatLngBounds.extend(temp);
                            });
                            //得到中心点
                            const latLng = LatLngBounds.getCenter();
                            mapShowFunc.pan2Point(latLng.lat(),latLng.lng());
                            this.wireLessFigureCenterHash.add(deviceCode,latLng);
                        }
                    }else{
                        this.$message({message:'没有巡区',type:'warning',showClose:true})
                    }
                })
            },
            //车载摄像机：全部播放
            allCameraVideoPlay(deviceCode){
                let cameras = this.wireLessMarkersHash.getValue(deviceCode).cameras;
                cameras.map(item=>{
                    item.text = item.name;
                })
                this.videoDialogVisible = true;
                if(cameras.length == 1){
                    this.winNum_play = 1;    //窗口数量，默认为单窗口
                    this.curWinNum_play = 1;   //当前的窗口数量
                    this.curVideoRowCls_play = ['one-row']; //窗口布局样式
                }else if(cameras.length >1 && cameras.length <=4){
                    this.winNum_play = 4;    //窗口数量
                    this.curWinNum_play = 4;   //当前的窗口数量
                    this.curVideoRowCls_play = ['two-row']; //窗口布局样式
                }else if(cameras.length >4 && cameras.length <=9){
                    this.winNum_play = 9;    //窗口数量
                    this.curWinNum_play = 9;   //当前的窗口数量
                    this.curVideoRowCls_play = ['three-row']; //窗口布局样式
                }else if(cameras.length >9){
                    this.winNum_play = 16;    //窗口数量
                    this.curWinNum_play = 16;   //当前的窗口数量
                    this.curVideoRowCls_play = ['four-row']; //窗口布局样式
                }
                setTimeout(()=>{
                    if(this.$refs.realPlay){
                        this.$refs.realPlay.playAGroupOfVideo(cameras);
                    }
                },300);
            },


            //手台websocket 连接返回的数据
            handsetWebsocketOnMessage(data) {
                //获取所有的设备详情,进行过滤
                this.allDeviceDetailList.map(item=>{
                    if(data.code == item.handsetCode){
                        //存储websocket推送的数据
                        let marker = this.handsetMarkersHash.getValue(data.code);
                        if(marker){
                            const LatLng = new google.maps.LatLng(data.lat,data.lng);
                            marker.label.setMap(null);
                            marker.setPosition(LatLng);
                            const label = mapShowFunc.addLabelWithFont(data.lat,data.lng,item.person,15);
                            marker.label = label;
                        }else{
                            marker = mapShowFunc.addMarker(this.map,data.code,data.lat,data.lng,'zy_police_person16',item.person,'handset',true,true,()=>{});
                            marker.info = data.lat+'&'+data.lng+'&'+data.direction+'&'+data.speed+'&'+data.code+'&'+item.person+'&'+ item.telphone+'&'+ item.unit;
                            this.handsetMarkersHash.add(data.code,marker)
                        }
                    }
                })
            },
            //手台websocket 关闭
            handsetWsocketOnClose() {

            },
            //获取全部的设备详情，用户手台过滤
            getAllDeviceDetailList(){
                //获取所有的设备详情,进行过滤
                getAllDeviceDetail().then(res=>{
                  this.allDeviceDetailList = res.data;
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .left-icon-group {
        position: absolute;
        top: 35px;
        left: 20px;
        & > .el-row {
            margin: 5px 0;
            cursor: pointer;
            font-size: 14px;
        }
        span{
            color: #333;
            font-size: 12px;
            &.active {
                color: #2DBDC5;
            }
        }
        //右上角小圆点标记
        /deep/ .el-badge__content.is-dot{
            width: 14px;
            height: 14px;
        }
    }

    .left-list {
        position: absolute;
        left: 80px;
        top: 20px;
        width: 350px;
        height: calc(100vh - 170px);
        background-color: #0e2c54;
        opacity: 0.82;
        padding: 15px;
    }

    .select-area {
        position: absolute;
        top: 10px;
        right: 150px;
    }
    /*/deep/ .el-input__inner {
        background-color: #3a557a;
        border: solid 1px #08133b;
        color: #fff;
    }*/
    .device-wrap {
        position: absolute;
        top: 20px;
        left: 440px;
        width: 160px;
        &.device-wrap-left{
            left: 80px;
        }
    }

    .subscribe-wrap {
        position: absolute;
        top: 20px;
        left: 610px;
        width: 160px;
        &.subscribe-wrap-left{
            left: 250px;
        }
    }
    .title{
        position: relative;
        color: #fff;
        i.icon{
            position: absolute;
            top:8px;
            right: 10px;
            cursor: pointer;
        }
    }

    .common-subtitle {
        margin-bottom: 5px;
    }

    .content {
        height: calc(100% - 60px);
        background-color: #0e2c54;
        border: solid 1px rgba(39, 120, 201, 0.68);
        opacity: 0.79;
        padding: 10px 20px;
        .device-item {
            margin-bottom: 3px;
            label {
                color: #fff;
                margin-bottom: 5px;
            }
        }
    }

    /deep/ .rightPanel-items {
        height: 100%;
    }
    .video-dialog /deep/ .el-dialog__body{
        height: 500px;
        .multiple-win-wrap{
            padding-right: 0 !important;
        }
    }
    .playback-dialog /deep/ .el-dialog__body{
        height: 500px;
    }
    .big-img{
        width: 100%;
        height: 500px;
    }
    /deep/ .el-dialog__body{
        padding: 1px !important;
    }
</style>
<style lang="less" scoped>
    @import "style/style.map-view.less";
    @import "style/style.maker-info-window.less";
</style>
