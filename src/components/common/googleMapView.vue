<!--新版本V1.1-->
<!--初始化地图显示-->
<template>
    <div class="map-content">
        <div id="map_canvas"></div>
        <div class="tool_point">
            <p>级别:&nbsp;<span id="showZoom" class="showZoom">{{curZoom}}</span>&nbsp;&nbsp;经纬度:&nbsp;<span
                    id="latAndLng">{{latAndLng}}</span></p>
        </div>
    </div>
</template>
<script>
    import {getParamsByCode} from '@/api/public'
    import {mapGetters} from 'vuex'
    import mapTools from "../../utils/mapTools";
    export default {
        props:['lat','lng'],
        data() {
            return {
                latAndLng: '',    //当前的经纬度坐标
                curZoom: 13,    // 当前的缩放级别
                maxZoom: 18,
                minZoom: 5,
                map: null,
                mapTools:null
            }
        },
        mounted() {
            this.getMaptileUrl();
            this.mapTools = new mapTools({
                zoom: this.curZoom,
                maxZoom: this.maxZoom,
                minZoom: this.minZoom,
                mapTypeControlOptions:{
                    position:3
                }
            })
        },
        methods: {
            //获取地图瓦片的地址
            getMaptileUrl(){
                getParamsByCode(this.$qs.stringify({code:'maptile_url'})).then(res=>{
                    if(res.code == 1000){
                        localStorage.setItem('maptile_url',res.data[0].value);
                        this.initGoogleMap();
                    }
                });

            },
            //初始化地图配置
            initGoogleMap() {
                const mapUrl = localStorage.getItem('maptile_url');
                this.loadingMap("map_canvas", mapUrl);
//                this.loadingMap("map_canvas", 'http://120.192.167.70:8087/');
                this.map = this.mapTools._map;
                this.listenerMapEvent(this.map);
                //设置右键上下级
                let menuContext = new MenuControl(this.map);
                menuContext.sender = this.map;
                this.initMenuContext(this.map, menuContext);
                this.$emit('map',this.map,this.mapTools);
            },

            //加载地图
            loadingMap(obj, url) {
                const container = document.getElementById(obj);
                const lat = '37.360964';
                const lng = '120.441533';
//                const lat = this.lat;
//                const lng = this.lng;
                this.latAndLng = lng + ',' + lat;
//                console.log(this.latAndLng,'this.latAndLng');
                this.mapTools.initMap(container, url, lat, lng);
                this.getThisMap();
            },
            //监听地图事件
            listenerMapEvent(map) {
                // 鼠标移动、单击显示当前坐标，滚轮显示地图等级
                google.maps.event.addListener(map, 'mousemove', event => {
                    this.latAndLng = event.latLng.lng() + ',' + event.latLng.lat();
                });
                google.maps.event.addListener(map, 'zoom_changed', () => {
                    this.curZoom = map.getZoom();
                });
            },
            //设置右键菜单
            initMenuContext(thismap, context) {
                context.addSeparator("map");
                context.addItem(new MenuItem({
                    text: "放大一级",
                    icon: "images/zoomax.png",
                    groupName: "map",
                    handler: (coor) => {
                        if (this.curZoom < this.maxZoom) {
                            this.curZoom = this.curZoom + 1;
                            this.map.setZoom(this.curZoom)
                        }
                    }
                }));
                context.addItem(new MenuItem({
                    text: "缩小一级",
                    icon: "images/zoomin.png",
                    groupName: "map",
                    handler: (coor) => {
                        if (this.curZoom > 1) {
                            this.curZoom = this.curZoom - 1;
                            this.map.setZoom(this.curZoom)
                        }
                    }
                }));
                google.maps.event.addListener(thismap, "rightclick", function (e) {
                    if (context.isEnable) {
                        context.coordinate = {
                            point: e.pixel,
                            latlng: e.latLng
                        };
                        context.container.style.left = e.pixel.x + "px";
                        context.container.style.top = e.pixel.y + "px";
                        context.show("map");
                    }
                });
            },
            getThisMap() {
                this.map = this.mapTools._map;
            }
        },
    }
</script>

<style lang="less" scoped>
    @import "style/google-map.less";
    /**调整图层类型样式*/
    /deep/ .gm-style-mtc > div {
        padding: 8px 10px !important;
        min-width: 50px !important;
        font-size: 12px !important;
    }
</style>
