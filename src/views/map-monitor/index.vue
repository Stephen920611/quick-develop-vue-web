<template>
    <el-row class="container">
        <el-col :span="24" class="map-container">
            <div class="map">
                <div class="map-wrapper">
                    <google-map-view ref="googleMap" @map="getMap" :lat="mapCenterLat"
                                     :lng="mapCenterLng"></google-map-view>
                </div>
                <div class="tools">
                    <el-dropdown split-button type="default" @command="handleClickDrawTool">
                        绘图工具
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="marker">画点</el-dropdown-item>
                            <el-dropdown-item command="line">画线</el-dropdown-item>
                            <el-dropdown-item command="circle">画圆</el-dropdown-item>
                            <el-dropdown-item command="rectangle">画矩形</el-dropdown-item>
                            <el-dropdown-item command="polygon">画多边形</el-dropdown-item>
                            <el-dropdown-item command="clear">清除全部</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="draw-tools">
                    <el-dropdown split-button type="default" @command="handleClickDrawByPoints">
                        绘制点线面
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="marker">绘制点</el-dropdown-item>
                            <el-dropdown-item command="line">绘制线</el-dropdown-item>
                            <el-dropdown-item command="circle">绘制圆</el-dropdown-item>
                            <el-dropdown-item command="rectangle">绘制矩形</el-dropdown-item>
                            <el-dropdown-item command="polygon">绘制多边形</el-dropdown-item>
                            <el-dropdown-item command="clear">清除全部</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>

                <div class="operate-tools">
                    <el-dropdown split-button type="default" @command="handleClickOperateBtn">
                        操作
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="track">车辆追踪</el-dropdown-item>
                            <el-dropdown-item command="cancelTrack">取消车辆追踪</el-dropdown-item>
                            <el-dropdown-item command="alarm">车辆报警</el-dropdown-item>
                            <el-dropdown-item command="cancelAlarm">取消报警</el-dropdown-item>
                            <el-dropdown-item command="dragMarker">点位拖拽</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script>

    import {infoWindowMX,dragInfoWindow} from '@/mixins/infoWindowMX'
    import elDragDialog from '@/directive/el-drag-dialog'
    import googleMapView from '@/components/common/googleMapView.vue'
    import utility from '@/utils/ext.utility'

    export default {
        name: 'MapMonitorIndex',
        mixins: [infoWindowMX,dragInfoWindow],
        directives: {elDragDialog},
        components: {
            googleMapView,
        },
        data() {
            return {
                map: null,
                mapCenterLat: '37.360964',   //地图默认区域中心的经纬度,默认为招远市
                mapCenterLng: '120.441533',
                mapTools: null,
                drawOverlays: [], //绘图的轨迹
                drawOverlaysByPoints: [], //根据点坐标绘制图形的轨迹
                markersHash: new utility.hashTable(),   //存储地图上的marker
                trackCarMarkerHash:new utility.hashTable(),  //追踪车辆的marker哈希表
                trackIntervalId:null,   //车辆追踪定时器
                drawCircleHash:new utility.hashTable(),  //报警的波动范围轨迹
                drawCircleIntervalId:null,  //报警的波动范围的定时器
                alarmHash:new utility.hashTable(),  //报警的marker
                _dragMarker:null,  //拖拽的marker
            }
        },
        mounted() {


        },
        methods: {
            getMap(map, mapTools) {
                this.map = map;
                this.mapTools = mapTools;
            },

            /***************************************选择绘图工具（在地图上画点画线画面）**********************************/
            handleClickDrawTool(command) {
                switch (command) {
                    case 'marker':
                        // 鼠标移动、单击显示获取坐标
                        google.maps.event.addListener(this.map, 'click', event => {
                            const lat = event.latLng.lat();
                            const lng = event.latLng.lng();
                            let marker = this.mapTools.addMarker(this.map, new Date().getTime(), lat, lng, 'car64', 'car-1', 'car', true, true, false, () => {
                            })
                            this.markersHash.add(new Date().getTime(), marker);
                            this.drawOverlays.push(marker);
                        });
                        break;
                    case 'line':
                        this.mapTools._eventHandler = 'drawLine';
                        this.mapTools._eventCallback['drawLine'] = this.drawLineComplete;
                        this.mapTools.setDrawModel('polyline');
                        break;
                    case 'circle':
                        this.mapTools._eventHandler = 'drawCircle';
                        this.mapTools._eventCallback['drawCircle'] = this.drawCircleComplete;
                        this.mapTools.setDrawModel('circle');
                        break;
                    case 'rectangle':
                        this.mapTools._eventHandler = 'drawRectangle';
                        this.mapTools._eventCallback['drawRectangle'] = this.drawRectangleComplete;
                        this.mapTools.setDrawModel('rectangle');
                        break;
                    case 'polygon':
                        this.mapTools._eventHandler = 'drawPolygon';
                        this.mapTools._eventCallback['drawPolygon'] = this.drawPolygonComplete;
                        this.mapTools.setDrawModel('polygon');
                        break;
                    case 'clear':
                        this.mapTools.clearAllOverlay(this.drawOverlays);
                        this.drawOverlays = [];
                        break;
                }
            },

            //画线
            drawLineComplete(shape) {
                const overlay = shape.overlay;
                this.drawOverlays.push(overlay);
                const paths = shape.overlay.getPath();

                //常用于获取线上及周边十米范围内的marker点
                let latLngArray = [];//存储所有的顶点坐标
                for (let i = 0; i < paths.length; i++) {
                    latLngArray.push(paths.getAt(i));
                }
                //判断是否marker在线上
                const pointArray = this.mapTools.getPointArrayInLine(latLngArray);
                console.log(pointArray, "pointArray");
                const selectedMarkers = [];
                let flag;
                if (this.markersHash.getSize() > 0) {
                    const allMarkersArrs = this.markersHash.getValues();
                    let allMarkers = [];
                    allMarkersArrs.forEach(ktem => {
                        allMarkers = allMarkers.concat(ktem);
                    });
                    allMarkers.forEach(item => {
                        //判断是否在线的缓冲区域内
                        flag = this.mapTools.isPointInPolygon(pointArray, item);
                        if (flag) {
                            selectedMarkers.push(item);
                        }
                    });
                    this.$message({
                        type: "success",
                        message: '线及周边10米范围内的点位数量：' + selectedMarkers.length + '个',
                        showClose: true
                    });
                }
            },
            //画圆
            drawCircleComplete(shape) {
                const overlay = shape.overlay;
                this.drawOverlays.push(overlay);
                const radius = shape.overlay.getRadius();
                const pt = shape.overlay.getCenter();
                //常用于获取圆形内所包含的marker点
                const selectedMarkers = [];
                if (this.markersHash.getSize() > 0) {
                    const allMarkersArrs = this.markersHash.getValues();
                    let allMarkers = [];
                    allMarkersArrs.forEach(ktem => {
                        allMarkers = allMarkers.concat(ktem);
                    });
                    allMarkers.forEach(item => {
                        const distance = this.mapTools.getDistance(pt, item.getPosition());
                        if (distance < radius) {
                            selectedMarkers.push(item);
                        }
                    });
                    this.$message({
                        type: "success",
                        message: '圆形范围内的点位数量：' + selectedMarkers.length + '个',
                        showClose: true
                    });
                }
            },
            //画矩形
            drawRectangleComplete(shape) {
                const overlay = shape.overlay;
                this.drawOverlays.push(overlay);
                const bounds = shape.overlay.getBounds();
                //常用于获取矩形框内所包含的marker点
                const selectedMarkers = this.mapTools.getMarkersInRect(this.markersHash, bounds.getNorthEast(), bounds.getSouthWest());
                this.$message({
                    type: "success",
                    message: '矩形范围内的点位数量：' + selectedMarkers.length + '个',
                    showClose: true
                });
            },
            //画多边形
            drawPolygonComplete(shape) {
                const overlay = shape.overlay;
                this.drawOverlays.push(overlay);
                const paths = shape.overlay.getPath();

                //常用于获取多边形范围内的marker点
                let selectedMarkers = [], flag, latLngPoints = [];
                if (paths) {
                    for (let j = 0; j < paths.length; j++) {
                        latLngPoints.push(paths.getAt(j));
                    }
                }
                console.log(latLngPoints, "latLngPoints");
                if (this.markersHash.getSize() > 0) {
                    const allMarkersArrs = this.markersHash.getValues();
                    let allMarkers = [];
                    allMarkersArrs.forEach(ktem => {
                        allMarkers = allMarkers.concat(ktem);
                    });
                    allMarkers.forEach(item => {
                        flag = this.mapTools.isPointInPolygon(latLngPoints, item);
                        if (flag) {
                            selectedMarkers.push(item);
                        }
                    });
                    this.$message({
                        type: "success",
                        message: '多边形范围内的点位数量：' + selectedMarkers.length + '个',
                        showClose: true
                    });
                }
            },

            /***************************************根据已知坐标点在地图上绘制点线面**********************************/
            /**随机在地图上绘制点*/
            randomAddMarker() {
                const points = [{
                    id: 1,
                    lat: 37.37302,
                    lng: 120.40226,
                    plateNum: '鲁F12345',
                    color: '白色',
                    address: '机场路2号'
                }, {id: 2, lat: 37.36224, lng: 120.38921, plateNum: '鲁F23456', color: '白色', address: '机场路3号'}, {
                    id: 3,
                    lat: 37.35255,
                    lng: 120.41307, plateNum: '鲁F34567', color: '黑色', address: '机场路4号'
                }, {id: 4, lat: 37.35924, lng: 120.43470, plateNum: '鲁F45678', color: '黑色', address: '机场路5号'}, {
                    id: 5,
                    lat: 37.37384,
                    lng: 120.42371,
                    plateNum: '鲁F56789',
                    color: '红色',
                    address: '机场路6号'
                }]
                points.forEach(point => {
                    const marker = this.mapTools.addMarker(this.map, point.id, point.lat, point.lng, 'car32', point.plateNum, 'car', true, true, true, () => {
                    });
                    marker.info = point;
                    this.markersHash.add(point.id, marker);
                    //将绘制的图形存储在数组中
                    this.drawOverlaysByPoints.push(marker);
                    google.maps.event.addListener(marker, 'click', (event) => {
                        /*const content = `<div class="loc-content loc-content-1">
                                            <div class="loca-info">信息展示</div>
                                            <div class="msg-content">
                                                <p class="msg-info title ellipsis-l1"><span>${marker.info.plateNum}</span></p>
                                                <p class="msg-info ellipsis-l1"><span>车身颜色：${marker.info.color}</span></p>
                                                <p class="msg-info ellipsis-l1"><span>所在地址：${marker.info.address}</span></p>
                                            </div>
                                            <div class="icon-wrap">
                                                <span class="icon" onclick="seeDetail(marker.info)">查看详情</span>
                                            </div>`
                        this.mapTools.showInfoWin(this.map, marker, content);*/
                        let component = new this.infoWindow({
                            propsData:{
                                info:marker.info,
                                vm:this
                            }
                        }).$mount();
                        this.mapTools.showInfoWin(this.map, marker, component.$el);
                    })
                })
            },
            /**关闭信息窗体*/
            closeInfoWin(){
              this.mapTools.closeInfoWin();
            },
            /**随机在地图上绘制线*/
            randomAddLine(){
                const points = [
                        new google.maps.LatLng(37.37302,120.40226),
                        new google.maps.LatLng(37.36224,120.38921),
                        new google.maps.LatLng(37.35255,120.41307),
                        new google.maps.LatLng(37.35924,120.43470),
                        new google.maps.LatLng(37.37384,120.42371),
                        new google.maps.LatLng(37.37302,120.40226)
                ]
                const color = this.mapTools.colorRandom();
                const line = this.mapTools.drawLine(this.map,points,'',color);
                //将绘制的图形存储在数组中
                this.drawOverlaysByPoints.push(line);
            },
            /**随机在地图上绘制圆*/
            randomAddCircle(){
                const r = 800,center =  new google.maps.LatLng(37.37302,120.40226);
                const circle = this.mapTools.drawCircle(r,center);
                //将绘制的图形存储在数组中
                this.drawOverlaysByPoints.push(circle);
            },
            /**随机在地图上绘制矩形*/
            randomAddRectangle(){
                const bounds = new google.maps.LatLngBounds({lat:37.37302,lng:120.40226},{lat:37.35924,lng:120.43470});
                const rectangle = this.mapTools.drawRect(bounds);
                //将绘制的图形存储在数组中
                this.drawOverlaysByPoints.push(rectangle);
            },
            /**随机在地图上绘制矩形*/
            randomAddPolygon(){
                const points = [
                    new google.maps.LatLng(37.37302,120.40226),
                    new google.maps.LatLng(37.36224,120.38921),
                    new google.maps.LatLng(37.35255,120.41307),
                    new google.maps.LatLng(37.35924,120.43470),
                    new google.maps.LatLng(37.37384,120.42371)
                ]
                const polygon = this.mapTools.drawPolygon(points);
                //将绘制的图形存储在数组中
                this.drawOverlaysByPoints.push(polygon);
            },

            /**根据点坐标对绘制点、线、面*/
            handleClickDrawByPoints(command) {
                switch (command) {
                    case 'marker':
                        //随意添加若干点
                        this.randomAddMarker();
                        break;
                    case 'line':
                        this.randomAddLine();
                        break;
                    case 'circle':
                        this.randomAddCircle();
                        break;
                    case 'rectangle':
                        this.randomAddRectangle();
                        break;
                    case 'polygon':
                        this.randomAddPolygon();
                        break;
                    case 'clear':
                        this.mapTools.clearAllOverlay(this.drawOverlaysByPoints);
                        this.drawOverlaysByPoints = [];
                        break;
                }
            },


            /*****************************************车辆追踪、车辆报警、取消报警、marker拖拽 ***********************************************/
            handleClickOperateBtn(command) {
                switch (command) {
                    case 'track':
                        //车辆追踪（用数组进行模拟，实际情况下是websocket推送）
                        this.simulateCarTrack();

                        break;
                    case 'cancelTrack':
                        //取消车辆追踪
                        this.trackIntervalId && clearInterval(this.trackIntervalId);  //取消定时器
                        this.trackIntervalId = null;
                        //移除追踪车辆的marker
                        let trackMarkers = this.trackCarMarkerHash.getValues();
                        trackMarkers.map(marker=>{
                            marker.setMap(null);
                            if(marker.label){
                                marker.label.setMap(null);
                            }
                        });
                        this.trackCarMarkerHash.clear();

                        break;
                    case 'alarm':
                        //车辆报警
                        this.carAlarm();
                        break;
                    case 'cancelAlarm':
                        //取消车辆报警
                        this.carCancelAlarm();
                        break;
                    case 'dragMarker':
                        //拖拽点位
                        this.operateDragMarker();
                        break;
                }
            },
            /**模拟车辆追踪*/
            simulateCarTrack(){
                const points = [{
                    id: 1,
                    lat: 37.37302,
                    lng: 120.40226,
                    plateNum: '鲁F12345',
                    color: '白色',
                    address: '机场路2号'
                }, {id: 2, lat: 37.36224, lng: 120.38921, plateNum: '鲁F23456', color: '白色', address: '机场路3号'}, {
                    id: 3,
                    lat: 37.35255,
                    lng: 120.41307, plateNum: '鲁F34567', color: '黑色', address: '机场路4号'
                }, {id: 4, lat: 37.35924, lng: 120.43470, plateNum: '鲁F45678', color: '黑色', address: '机场路5号'}, {
                    id: 5,
                    lat: 37.37384,
                    lng: 120.42371,
                    plateNum: '鲁F56789',
                    color: '红色',
                    address: '机场路6号'
                }];
                let c = 0;
                const trackCarMarker = this.mapTools.addMarker(this.map,points[0].id,points[0].lat,points[0].lng,'car32', points[0].plateNum, 'car', true, true, true, () => {
                });
                this.trackCarMarkerHash.add(points[0].id,trackCarMarker);
                this.trackIntervalId = setInterval(()=>{
                    c++;
                    if(c >= points.length){
                        //从头开始循环
                        c = 0;
                    }
                    //判断marker是否有label标注，若是有先清除掉，移动marker完成后再添加
                    if(trackCarMarker.label){
                        trackCarMarker.label.setMap(null);
                    }
                    //移动marker
                    const LatLng = new google.maps.LatLng(points[c].lat, points[c].lng);
                    trackCarMarker.setPosition(LatLng);
                    //添加label
                    const label = this.mapTools.addLabelWithFont(points[c].lat, points[c].lng, points[c].plateNum, 15);
                    trackCarMarker.label = label;
                },2000);
            },
            /**车辆报警*/
            carAlarm(){
                const points = [{
                    id: 1,
                    lat: 37.37302,
                    lng: 120.40226,
                    plateNum: '鲁F12345',
                    color: '白色',
                    address: '机场路2号'
                }];
                const carMarker = this.mapTools.addMarker(this.map,points[0].id,points[0].lat,points[0].lng,'car32', points[0].plateNum, 'car', true, true, true, () => {
                });
                this.alarmHash.add(points[0].id,carMarker)
                //模拟一秒后发生报警
                setTimeout(()=>{
                    //放大地图级别
                    this.map.setZoom(17);
                    //定位报警地点(两种方式)
//                    this.mapTools.pan2Point(points[0].lat,points[0].lng);
                    this.mapTools.move2PointByMarker(carMarker);
                    //改变icon
                    let image = this.mapTools.getIcon('carAlarm32');
                    carMarker.setIcon(image);
                    //加入波动范围
                    let count = 0;
                    let radius = 4;   //初始半径
                    let drawCircleArray = [];  //存储绘制轨迹的数组
                    this.drawCircleIntervalId = setInterval(() => {
                        count++;
                        radius = 4 + 4 * count;
                        if (radius < 20) {
                            const tempDrawCircle = this.mapTools.drawCircle(radius, {
                                lat: points[0].lat,
                                lng: points[0].lng
                            }, '#ff3a3a', '#ff3a3a');
                            drawCircleArray.push(tempDrawCircle);
                            this.drawCircleHash.add(carMarker.id, drawCircleArray);
                        } else {
                            //初始半径
                            radius = 4;
                            count = 0;
                            drawCircleArray.forEach(item => {
                                item.setMap(null);
                            });
                            drawCircleArray = [];
                        }
                    }, 180);
                },1000)
            },

            /**取消车辆报警*/
            carCancelAlarm(){
                //清除定时器
                this.drawCircleIntervalId && clearInterval(this.drawCircleIntervalId);
                this.drawCircleIntervalId = null;
                //清除波动轨迹
                let drawCircleOverlays = this.drawCircleHash.getValues();
                this.mapTools.clearAllOverlay(drawCircleOverlays[0]);
                //改变icon
                let markers = this.alarmHash.getValues();
                markers.map(marker=>{
                    let image = this.mapTools.getIcon('car32');
                    marker.setIcon(image);
                })
            },

            /**拖拽点位*/
            operateDragMarker(){
                const point = {
                    id: 1,
                    lat: 37.37247,
                    lng: 120.43470
                };
                if(this._dragMarker){
                    //若是存在该拖拽点，则先清掉该点后再添加
                    this._dragMarker.setMap(null)
                    this._dragMarker = null;
                }
                const dragMarker = this.mapTools.addMarker(this.map,point.id,point.lat,point.lng,'8', '', 'temp', true, true, true, () => {});
                //记录原始位置
                dragMarker._originalPos = new google.maps.LatLng(point.lat,point.lng);
                //设置点位支持拖拽
                dragMarker.setDraggable(true);
                //设置为全局参数
                this._dragMarker = dragMarker;
                //监听拖拽结束事件
                google.maps.event.addListener(dragMarker, 'dragend', (e) => {
                    //停止拖拽
                    dragMarker.setDraggable(false);
                    //弹出窗口
                    let component = new this.dragWindow({
                        propsData:{
                            vm:this
                        }
                    }).$mount();
                    this.mapTools.showInfoWin(this.map, dragMarker, component.$el);
                });
            },
            //保存新位置
            saveNewLocFunc(){
                let newPosition = this._dragMarker.internalPosition;
                this._dragMarker._newPos = newPosition;
                this.$message({message:"保存成功！新位置的坐标点为"+newPosition.lat()+' , '+newPosition.lng(),type:"success",showClose:true})
                this.mapTools.closeInfoWinDelay(100);
            },
            //继续拖拽
            continueDragFunc(){
                this._dragMarker.setDraggable(true);
                this.mapTools.closeInfoWinDelay(100);
            },
            //取消拖拽
            cancelDragFunc(){
                this._dragMarker.setPosition(this._dragMarker._originalPos);
                this.mapTools.closeInfoWinDelay(100);
            }
        }
    }
</script>

<style lang="less" scoped>
    @import './style/style.maker-info-window.less';
    /**调整地图容器样式*/
    .container {
        height: calc(100vh - 60px);
        /*padding: 5px;*/
    }

    .map-container {
        height: 100%;
        /*padding: 5px;*/
    }

    .map {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .map-wrapper {
        width: 100%;
        height: 100%;
    }

    /**画图工具按钮样式*/
    .tools {
        position: absolute;
        top: 10px;
        left: 10px;
    }

    /**绘制点线面工具按钮样式*/
    .draw-tools{
        position: absolute;
        top: 10px;
        left: 150px;
    }

    /**操作*/
    .operate-tools{
        position: absolute;
        top: 10px;
        left: 300px;
    }
</style>
