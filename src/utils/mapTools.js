/*新版本V1.1*/
import emapExtension from '../../public/static/js/emap/emap.extension'
class mapTools {
    //把地图的配置参数传入，可修改默认的options参数
    _params = null;
    //生成的map对象
    _map = null;
    //地图瓦片地址
    _mapTileUrl= '';
    //绘制对象
    _drawingManager = null;
    //绘制句柄
    _eventHandler = null;
    //信息窗口
    _infoWindow = null;
    //地球半径
    _earthRadius = 6378137.0; //单位M
    //地图的默认参数
    options = {
        center: null,  //中心点坐标，Object
        zoom: 15,  //加载地图时默认的当前的级别
        maxZoom: 18,  //最大级别
        minZoom: 5,  //最小级别
        mapTypeControl: true, //地图类型插件
        streetViewControl: false,  //街景插件
        zoomControl: true, //缩放插件
        panControl: true, //平移插件
        scaleControl: true,  //比例尺控件
        /*scaleControlOptions : { //比例控件,公里、英尺 置于地图的右下角
          position : google.maps.ControlPosition.BOTTOM_LEFT
        },*/
        mapTypeControlOptions: {
            mapTypeIds: ['satel', 'localMap'], //包括两种地图类型
            position: 3,  //地图类型插件放于地图的右上角
            // position : google.maps.ControlPosition.TOP_RIGHT,//地图类型插件放于地图的右上角
        },
        drawStyle: {
            fillColor: "#13c2f7",
            strokeColor: "#468EF7",
            strokeWeight: 3,
            strokeOpacity: 0.8,
            fillOpacity: 0.1
        },
    };
    //绘制的线/面的轨迹
    drawOverlays = {
        rectangleOverlays: [],  //矩形
        circleOverlays: [],   //圆形
        lineOverlays: [],   //线形
        polygonOverlays: [],   //多边形
        
    };
    //绘制完成的回调函数
    _eventCallback = {
        drawMarker:(shape)=>{},
        drawLine:(shape)=>{},
        drawCircle:(shape)=>{},
        drawRectangle:(shape)=>{},
        drawPolygon:(shape)=>{},
    };
    
    constructor(params) {
        this._params = params;
        //初始化
        this.init()
    }
    
    init() {
        //取出所有的参数
        let params = this._params;
        //首先判断是否传入了参数，并且验证参数是否是对象类型
        if (params && Object.prototype.toString.call(params) === '[object Object]') {
            //遍历赋值
            for (let key in params) {
                if (typeof params[key] == 'object') {
                    for (let k in params[key]) {
                        if (this.options[key] && this.options[key][k]) {
                            this.options[key][k] = params[key][k]
                        }
                    }
                } else {
                    if (this.options[key]) {
                        this.options[key] = params[key]
                    }
                }
            }
            console.log(params, "@@@", this.options)
        }
    }
    
    /**
     * 初始化地图
     */
    initMap(container, tileUrl, lat, lng) {
        this._mapTileUrl = tileUrl;
        let localMap = new this.MapEntity(tileUrl, 'map', this.options.maxZoom, this.options.minZoom);
        localMap.name = '电子地图';
        let sateMap = new this.MapEntity(tileUrl, 'satellite', this.options.maxZoom, this.options.minZoom);
        sateMap.name = '卫星影像';
        this.options.center = new google.maps.LatLng(lat, lng);
        let map = new google.maps.Map(container, this.options);
        map.mapTypes.set('localMap', localMap);
        map.mapTypes.set('satel', sateMap);
        //默认先展示“电子地图”,若是默认先展示“影像地图”，则 map.setMapTypeId('satel');
        map.setMapTypeId('localMap');
        this._map = map;
        this.setupEvents();   //初始化绘制工具
        
    }
    
    MapEntity(baseTileUrl, tileType, maxZoom, minZoom) {
        const self = this;
        self.tileSize = new google.maps.Size(256, 256);
        self.maxZoom = maxZoom;
        self.minZoom = minZoom;
        
        self.getTile = function (coord, zoom, ownerDocument) {
            let img = ownerDocument.createElement("img");
            img.style.width = this.tileSize.width + "px";
            img.style.height = this.tileSize.height + "px";
            let strURL = baseTileUrl + tileType + '/';
            strURL += zoom + "/" + coord.x + "/" + coord.y + '.png';
            img.src = strURL;
            img.onerror = function () {
                img.src = baseTileUrl + "images/noimg.jpg";
            };
            return img;
        }
    }
    
    //工具类：监听事件及绘制工具
    setupEvents() {
        let map = this._map;
        // 绘画工具 设置
        this._drawingManager = new google.maps.drawing.DrawingManager({
            drawingControl: false,
            polylineOptions: this.options.drawStyle,
            circleOptions: this.options.drawStyle,
            rectangleOptions: this.options.drawStyle,
            polygonOptions: this.options.drawStyle
        });
        this._drawingManager.setMap(map);
        
        // 矩形、折线绘制完成后触发的事件
        google.maps.event.addListener(this._drawingManager, 'overlaycomplete', (shape) => {
            this.overlayComplete(shape);
        });
    }
    
    /**
     * 绘制线/面完成后的调用事件
     */
    overlayComplete(shape) {
        const handler = this._eventHandler;
        // 将十字绘制图标取消掉，变为小手，取消绘制模式
        this._drawingManager.setDrawingMode(null);
        if (handler && this._eventCallback[handler]) {
            this._eventCallback[handler].call(this, shape);
        } else {
            alert('未找到对应的形状类型！');
        }
    }
    setDrawModel = (type) => {
        switch (type) {
            case 'rectangle':
               this._drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
                break;
            case 'polyline':
               this._drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
                break;
            case 'polygon':
               this._drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
                break;
            case 'circle':
               this._drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
                break;
            case 'marker':
               this._drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
                break;
            default :
                alert('绘制类型错误！');
        }
    };
    
    //清除所有轨迹
    clearAllOverlay(overlays){
        overlays.forEach(overlay => {
            //以下是针对marker中有label标注
            if(overlay.label){
                overlay.label.setMap(null);
            }
            overlay.setMap(null);
            overlay = null;
            
        });
    };
    //清除指定的所有轨迹
    clearOverlay(overlay){
        //以下是针对marker中有label标注
        if(overlay.label){
            overlay.label.setMap(null);
        }
        overlay.setMap(null);
        overlay = null;
       
    };
    
    /************************************************ 以下是地图操作的方法 ***************************************************************/
    
    getMap() {  //获取地图对象
        return this._map;
    };
    
    zoomIn(num, thisMap) { //放大指定的级数
        let map = thisMap || this._map;
        const zoom = map.getZoom() + num;
        if (zoom < this.options.maxZoom) {
            map.setZoom(zoom);
        } else {
            map.setZoom(this.options.maxZoom);
        }
    };
    
    zoomOut = (num, thisMap) => {//缩小指定的级数
        let map = thisMap || this._map;
        const zoom = map.getZoom() - num;
        if (zoom > this.options.minZoom) {
            map.setZoom(zoom);
        } else {
            map.setZoom(this.options.minZoom)
        }
    };
    
    getLevel(thisMap) {//获取当前的缩放级别
        let map = thisMap || this._map;
        return map.getZoom();
    };
    
    pan2Point = (lat, lng, thisMap) => {  //根据经纬度定位
        const centlatlng = new google.maps.LatLng(lat, lng);
        const map = thisMap || this._map;
        map.panTo(centlatlng);
    };
    move2PointByEvent = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const centlatlng = new google.maps.LatLng(lat, lng);
        this._map.panTo(centlatlng);
    };
    move2PointByMarker = (marker) => {   //根据marker定位
        this._map.panTo(marker.position);
    };
    
    
    /************************************************ 以下是根据坐标点/对绘制点线面的方法 ***************************************************************/
    
    /************************* 以下是关于marker绘制的方法 *************************/
    
    /**
     * 地图上添加marker
     */
    addMarker(map, id, lat, lng, icon, title, type, flag, showFlag,showLabelFlag, callback) {
        // flag标识是否要展开右侧信息收缩栏，true：展开，false：不展开
        // showFlag标识是否要在地图显示图标，true：显示，false：不显示
        map = map || this._map;
        let marker = this.getMarker(id, lat, lng, icon, title);
        if (icon == "cameras32") {
            //聚合图标
            marker.number = callback();
            marker.iconName = "cameras32";
            this.getClusterMarker(map, marker, showFlag);
        }
        
        if (showLabelFlag && callback) {
            const content = callback();
            const label = this.addLabelWithFont(lat, lng, title, 15);
            marker.label = label;
            marker.content = content;
        }
        if (showFlag) {
            marker.setMap(map);
        } else {
            marker.setMap(null);
        }
        return marker;
    };
    
    /**添加marker具体方法
     * @param id 唯一值
     * @param lat 纬度
     * @param lng  经度
     * @param icon 图标
     * @param title
     * @returns {Ug|*}
     */
    getMarker(id, lat, lng, icon, title) {
        const makerlatlng = new google.maps.LatLng(lat, lng);
        const img = this.getIcon(icon);
        const marker = new google.maps.Marker({
            id: id,
            position: makerlatlng,  // 标注点的坐标位置
            icon: img,
            type: icon,
            /*icon: {
              url: icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(50, 50),
              anchor: new google.maps.Point(100, 100),
              scaledSize: new google.maps.Size(25, 25)
            },*/
            draggable: false,
            visible: true,
            title: title
        });
        return marker;
    };
    /** 添加标注label */
    addLabelWithFont(lat, lng, text, fontSize){
        const makerLatLng = new google.maps.LatLng(lat, lng);
        const mapLabel = new MapLabel({
            text: text,
            position: makerLatLng,
            map: this.getMap(),
            fontSize: fontSize,
            fontColor: '#009cf9 ',
            strokeColor: '#f9f9f9',
            align: 'center'
        });
        return mapLabel;
    };
    
    //获取聚合样式图标--多点聚合
    getClusterMarker(map, marker, flag){
        const MarkerWithLabel = emapExtension.getMarkerLabel(google.maps);
        const iconDefault = this.getIcon('blank');
        const latLng = marker.getPosition();
        const pictureDiv = document.createElement('span');
        pictureDiv.title = '摄像机数量：' + marker.number;
        pictureDiv.style['color'] = 'white';
        pictureDiv.style['font-size'] = '13px';
        pictureDiv.style['text-align'] = 'center';
        pictureDiv.innerHTML = marker.number;
        const labelMarker = new MarkerWithLabel({
            position: latLng,
            map: map,
            draggable: false,
            raiseOnDrag: true,
            icon: iconDefault,
            labelContent: pictureDiv,
            labelAnchor: new google.maps.Point(-12, 40),
            labelClass: "marker-label", // the CSS class for the label
            labelInBackground: false
        });
        marker.labelMarker = labelMarker;
        if (flag) {
            marker.labelMarker.setVisible(true);
        } else {
            marker.labelMarker.setVisible();
        }
    };
    
    getIcon(icon) {
        return this._mapTileUrl + 'icon/' + icon + '.png';
    };
    
    /*********** 以下是绘制线/矩形/圆/多边形的方法 ********************/
    //绘制线路
    drawLine(map, pointsArray, title, color, opacity, weight){
        let line = new google.maps.Polyline({
            path: pointsArray,
            map: map || this.getMap(),
            strokeColor: color || '#468EF7',
            strokeOpacity: opacity || '0.8',
            strokeWeight: weight || '3',
        });
        //若是传入title不为null或者不为空，则悬浮上线显示内容
        google.maps.event.addListener(line, 'mouseover', (event) => {
            const marker = new google.maps.Marker({
                position: event.latLng, // 标注点的坐标位置
                icon: "",
                map: map,
                draggable: false,
                visible: false
            });
            if (title && title != '') {
                this.showInfoWin(map, marker, title);
                this.closeInfoWinDelay(3000);
            }
        });
        return line;
    };
    //生成随机颜色，线路使用
    colorRandom(){
        const colorStr = "#" + ("00000" + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
        return colorStr;
    };
    
    //根据多个坐标点对，绘制区域
    drawPolygon(pointsArray, option, flag = true){
        const polygon = new google.maps.Polygon({
            paths: pointsArray,
            strokeColor: (option && option.strokeColor) || '#FF0000',
            strokeOpatity: (option && option.strokeOpatity)  || 0.8,
            strokeWeight: (option && option.strokeWeight)  || 2,
            fillColor: (option && option.fillColor)  || '#FF0000',
            fillOpacity: (option && option.fillOpacity)  || 0.35
        });
        flag == true ? polygon.setMap(this._map) : polygon.setMap(null);
        return polygon;
    };
    
    //画圆
    drawCircle(r, center, color, strokeOpacity, fillColor){
        return new google.maps.Circle({
            radius: r,//半径
            center: center,//中心点
            strokeColor: color || '#FF0000',//描边颜色
            strokeOpacity: (strokeOpacity != null) ? strokeOpacity : 1.0,//描边透明度
            strokeWeight: 2, //描边线的像素
            fillColor: fillColor || '#FF0000',//填充颜色
            fillOpacity: 0.2,//填充透明度
            map: this._map
        });
    };
    
    //画矩形
    drawRect(bounds, option, flag = true){
        const rectangle = new google.maps.Rectangle({
            bounds: bounds,
            strokeColor: (option && option.strokeColor) || '#FF0000',//描边颜色
            strokeOpacity: (option && option.strokeOpacity) || 1.0,//描边透明度
            strokeWeight: (option && option.strokeWeight) || 2, //描边线的像素
            fillColor: (option && option.fillColor) || '#FF0000',//填充颜色
            fillOpacity: (option && option.fillOpacity) || 0.2,//填充透明度
            map: this._map
        });
        flag == true ? rectangle.setMap(this._map) : rectangle.setMap(null);
        return rectangle;
    };
    
    
    /************************************************ 以下是关于信息窗口的方法 ***************************************************************/
    /**
     * 打开信息窗口
     * @param map
     * @param marker
     * @param content
     */
    showInfoWin = (map, marker, content) => {
        this.closeInfoWin();
        this._infoWindow = new google.maps.InfoWindow({
            content: content
        });
        this._infoWindow.open(map, marker);
    };
    //关闭信息窗口
    closeInfoWin = () => {
        const win = this._infoWindow;
        if (win) {
            win.close();
        }
    };
    //infoWindow的窗口延迟关闭
    closeInfoWinDelay = (delay) => {
        setTimeout(()=>{
            this.closeInfoWin();
        }, delay);
    };
    
    
    /************************************************ 以下是计算点线面之间距离关系的方法 ***************************************************************/
    
    /**
     * 获取 2个经纬度之间的距离
     */
    
    getDistance(point1, point2) {
        const radLat1 = this.getRadius(point1.lat());
        const radLat2 = this.getRadius(point2.lat());
        const a = radLat1 - radLat2;
        const b = this.getRadius(point1.lng()) - this.getRadius(point2.lng());
        const s = this.getTwoPointDistance(radLat1, radLat2, a, b);
        return s;
    }
    
    /**
     * 求弧度
     */
    
    getRadius(d) {
        const PI = Math.PI; //π
        return d * PI / 180.0;
    }
    
    /**
     * 数学计算两点距离
     */
    
    getTwoPointDistance(radLat1, radLat2, a, b) {
        let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
            + Math.cos(radLat1) * Math.cos(radLat2)
            * Math.pow(Math.sin(b / 2), 2)));
        s = s * this._earthRadius;
        s = (Math.round(s * 10000) / 10000.0).toFixed(2);
        return s;
    };
    
    /**
     * 获取线及周围10米范围的点坐标
     */
    getPointArrayInLine(latLngArray) {
        let array1 = [];//线上方多边形范围的点数组
        let array2 = [];//线下方多边形范围的点数组
        for (let j = 0; j < latLngArray.length - 1; j++) {
            const degreeResult1 = 0.0001134;//10米范围对应的经纬度范围，
            const degreeResult2 = 0.0001134;//10米范围对应的经纬度范围
            let a = 0;//线的角度
            if (latLngArray[j + 1].lng() == latLngArray[j].lng()) {//如果垂直，则为90度
                a = 3.14 / 2;
            } else {
                a = Math.atan((latLngArray[j + 1].lat() - latLngArray[j].lat()) / (latLngArray[j + 1].lng() - latLngArray[j].lng()));//求线的角度a
            }
            const x1 = latLngArray[j].lng() - degreeResult1 * Math.sin(a);
            const y1 = latLngArray[j].lat() + degreeResult1 * Math.cos(a);
            const x2 = latLngArray[j + 1].lng() - degreeResult2 * Math.sin(a);
            const y2 = latLngArray[j + 1].lat() + degreeResult2 * Math.cos(a);
            const x3 = latLngArray[j + 1].lng() + degreeResult2 * Math.sin(a);
            const y3 = latLngArray[j + 1].lat() - degreeResult2 * Math.cos(a);
            const x4 = latLngArray[j].lng() + degreeResult1 * Math.sin(a);
            const y4 = latLngArray[j].lat() - degreeResult1 * Math.cos(a);
            const point1 = new google.maps.LatLng(y1, x1);
            const point2 = new google.maps.LatLng(y2, x2);
            const point3 = new google.maps.LatLng(y3, x3);
            const point4 = new google.maps.LatLng(y4, x4);
            
            const f = (latLngArray[j + 1].lng() - latLngArray[j].lng()) * (y1 - latLngArray[j].lat()) -
                (x1 - latLngArray[j].lng()) * (latLngArray[j + 1].lat() - latLngArray[j].lat());
            if (f > 0) {
                array1.push(point1);
                array1.push(point2);//将线上方的点放入array1
                
                array2.push(point4);
                array2.push(point3);//将线下方的点放入array2
            } else {
                array1.push(point4);
                array1.push(point3);//将线上方的点放入array1
                
                array2.push(point1);
                array2.push(point2);//将线下方的点放入array2
            }
        }
        let multi = "";//多边形点的坐标字符串
        const length1 = array1.length;
        const length2 = array2.length;
        if (length1 == 2) {//如果只有一条线则无需求交点
            multi = array1[0].lng() + "," + array1[0].lat() + "," + array1[1].lng() + "," + array1[1].lat() + ","
                + array2[1].lng() + "," + array2[1].lat() + "," + array2[0].lng() + "," + array2[0].lat() + ","
                + array1[0].lng() + "," + array1[0].lat();
        }
        else {
            for (let i = 0; i < length1 / 2 - 1; i++) {//求线上方的点的交点，并加入到multi中
                const p = 2 * i;
                multi = multi + array1[p].lng() + "," + array1[p].lat() + ",";
                const k1 = (array1[p].lat() - array1[p + 1].lat()) / (array1[p].lng() - array1[p + 1].lng());
                const k2 = (array1[p + 2].lat() - array1[p + 3].lat()) / (array1[p + 2].lng() - array1[p + 3].lng());
                const x = (k1 * array1[p].lng() - k2 * array1[p + 2].lng() + array1[p + 2].lat() - array1[p].lat()) / (k1 - k2);
                const y = array1[p].lat() + (x - array1[p].lng()) * k1;
                multi = multi + x + "," + y + ",";
            }
            multi = multi + array1[length1 - 1].lng() + "," + array1[length1 - 1].lat() + ",";
            for (let j = length2 / 2 - 2; j > -1; j--) {//求线下方的点的交点，并加入到multi中
                const q = j * 2 + 3;
                multi = multi + array2[q].lng() + "," + array2[q].lat() + ",";
                const k1 = (array2[q].lat() - array2[q - 1].lat()) / (array2[q].lng() - array2[q - 1].lng());
                const k2 = (array2[q - 2].lat() - array2[q - 3].lat()) / (array2[q - 2].lng() - array2[q - 3].lng());
                const x = (k1 * array2[q].lng() - k2 * array2[q - 2].lng() + array2[q - 2].lat() - array2[q].lat()) / (k1 - k2);
                const y = array2[q].lat() + (x - array2[q].lng()) * k1;
                multi = multi + x + "," + y + ",";
            }
            multi = multi + array2[0].lng() + "," + array2[0].lat() + "," + array1[0].lng() + "," + array1[0].lat();
        }
        const multiarray = multi.split(",");
        const pointArray = [];
        for (let i = 0; i < multiarray.length; i = i + 2) {
            pointArray.push(new google.maps.LatLng(multiarray[i + 1], multiarray[i]))
        }
        return pointArray
    };
    
    /**
     * 获取矩形框内所有显示的点
     * @param markersHash: markers的哈希表
     * @param maxCoordinate：东北角的位置
     * @param minCoordinate：西南角的位置
     */
    
    getMarkersInRect = (markers, maxCoordinate, minCoordinate) => {
        let selectedMarkers = [];
        const keys = markers.getKeys();
        const maxLng = maxCoordinate.lng();
        const minLng = minCoordinate.lng();
        const maxLat = maxCoordinate.lat();
        const minLat = minCoordinate.lat();
        let allMarkers;
        let thisLng;
        let thisLat;
        allMarkers = markers.getValues();
        allMarkers.forEach(item => {
            thisLng = item.getPosition().lng();
            thisLat = item.getPosition().lat();
            if (thisLng < maxLng && thisLng > minLng && thisLat < maxLat && thisLat > minLat) {
                selectedMarkers.push(item);
            }
        });
        return selectedMarkers;
    };
    
    /**
     * 射向法判断点(marker)是否在多边形内部
     * @param latLngPoints  多边形顶点数组
     * @param markerPoint  需要比较的点
     */
    isPointInPolygon(latLngPoints, markerPoint) {
        let latLngPoint;
        if (markerPoint) {
            const point = markerPoint.getPosition();
            latLngPoint = point;
        }
        
        if (!latLngPoints || latLngPoints.length == 0 || !latLngPoint) {
            return -1;
        }
        let counter = 0;
        let xinters;
        let p1 = null;
        let p2 = null;
        let isPointOnLineFlag = false;
        p1 = latLngPoints[0];
        
        for (let i = 1; i <= latLngPoints.length; i++) { //p2 = latLngPoints + (i % nCount);
            p2 = latLngPoints[i % latLngPoints.length];
            if (this.isPointOnLine(p1, p2, latLngPoint)) {
                isPointOnLineFlag = true;
            }
            if (latLngPoint.lng() > Math.min(p1.lng(), p2.lng())) {
                if (latLngPoint.lng() <= Math.max(p1.lng(), p2.lng())) {
                    if (latLngPoint.lat() <= Math.max(p1.lat(), p2.lat())) {
                        if (p1.lng() != p2.lng()) {
                            xinters = (latLngPoint.lng() - p1.lng()) * (p2.lat() - p1.lat()) / (p2.lng() - p1.lng()) + p1.lat();
                            if ((p1.lat() == p2.lat()) || (latLngPoint.lat() < xinters) || (latLngPoint.lat() == xinters)) {
                                counter++;
                            }
                        }
                    }
                }
            }
            p1 = p2;
        }
        if (isPointOnLineFlag) {
            //点在边上
            return true;
        }
        if (counter % 2 == 0) {
            //点在多边形外
            return false;
        } else {
            //点在多边形内
            return true;
        }
    };
    
    /**
     * 判断点是否在线段上
     * p1、p2：线段的两个端点
     * p：    被判断点
     * 返回值：    false：点在不在线段上；true：点在线段上
     */
    isPointOnLine(p1, p2, p) {
        let x1, y1, x2, y2;
        x1 = p.lat() - p1.lat();
        x2 = p2.lat() - p1.lat();
        y1 = p.lng() - p1.lng();
        y2 = p2.lng() - p1.lng();
        if (this.FC(x1 * y2 - x2 * y1, 0) == 0) {
            return false;
        }
        if ((Math.min(p1.lat(), p2.lat()) <= p.lat() && p.lat() <= Math.max(p1.lat(), p2.lat())) && (Math.min(p1.lng(), p2.lng()) <= p.lng() && p.lng() <= Math.max(p1.lng(), p2.lng()))) {
            return true;
        } else {
            return false;
        }
    };
    
    FC(x1, x2) {
        if (x1 - x2 < 0.000002 && x1 - x2 > -0.000002) {
            return 1;
        } else {
            return 0;
        }
    };
    
    
}

export default mapTools