<template>
    <div class="alarm-container">
        <div class="search-form">
            <el-form ref="form" :model="form" size="mini">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="">
                            <el-date-picker
                                    v-model="form.startTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd hh:mm:ss"
                                    placeholder="选择开始时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="">
                            <el-date-picker
                                    v-model="form.endTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd hh:mm:ss"
                                    placeholder="选择结束时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="">
                            <el-input v-model="form.plateNum"  placeholder="请输入车牌号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="mini">
                            <el-button type="primary" @click="handleSearch">查询</el-button>
                            <el-button type="default" @click="handleReset">重置</el-button>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
        </div>
        <div class="list" v-scrollBar v-loading="loading">
            <div class="car-cell" v-for="(item,index) in carAlarmList" :key="'car'+index" @click="handleClick(item)" :class="{'active':multiSelect.indexOf(item.id)>-1}">
                <el-row>
                    <el-col :span="10">
                        <el-image :src="item.url" class="image-item left"></el-image>
                    </el-col>
                    <el-col :span="14">
                        <el-row class="car-item">
                            <span class="name">{{item.plateNum}}</span>
                        </el-row>
                        <el-row class="car-item"><i
                                class="fa fa-map-marker margin-r-10"></i><span>{{item.bayonetName}}</span></el-row>
                        <el-row class="car-item"><i class="fa fa-times margin-r-10"></i><span>{{item.alarmTime && item.alarmTime.substring(0,19)}}</span>
                        </el-row>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- 分页控件 -->
        <div style="text-align: center">
            <pagination
                    small
                    v-show="total >0"
                    :total="total"
                    :page.sync="listQuery.page"
                    :limit.sync="listQuery.limit"
                    style="padding:0px !important"
                    class="pagination"
                    layout="total, prev, pager, next"
                    @pagination="getList"
                    :pagerCount="pagerCount"
                    :pageSizes="[5]"
            />
        </div>

    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import extDateTime from '@/utils/ext.dateTime'
    import {queryVehicleAlarm} from '@/api/map/map'
    export default {
        name: "carAlarmList",
        components: {Pagination},
        props:['data'],
        data() {
            return {
                form:{
                    plateNum:'',
                    startTime:'',
                    endTime:''
                },
                listQuery:{
                  page:1,
                  limit:10
                },
                pagerCount:5,
                total:0,
                timerange:'',
//                carAlarmList: [{picUrl: '../static/image/command-car.png', time: '2020-03-04 13:12:13'}],
                carAlarmList: [],
                loading:false,
                multiSelect:[],
            }
        },
        watch:{
            'data':{
                handler(value){
                    if(value){
                        this.carAlarmList = value.concat(this.carAlarmList)
                    }
                },
                deep:true,
                immediate:true
            }
        },
        mounted() {
            //默认当天
//            this.form.startTime = extDateTime.curentDate() + ' 00:00:00';
            this.form.startTime = extDateTime.getTimeSelecttTime(extDateTime.curentDate() + ' 00:00:00',-7*24*3600*1000);
            this.form.endTime = extDateTime.curentDate() + ' 23:59:59';
            this.getList();
        },
        methods: {
            getList(){
                this.loading = true;
                const param = Object.assign(this.form,this.listQuery);
                queryVehicleAlarm(this.$qs.stringify(param)).then(res=>{
                    this.total = res.data.total;
                    this.carAlarmList = res.data.data;
                    this.loading = false;
                })
            },
            handleSearch(){
                this.listQuery.page = 1;
                this.getList();
            },
            handleReset(){
                this.form.plateNum = '';
//                this.form.startTime = extDateTime.curentDate() + ' 00:00:00';
                this.form.startTime = extDateTime.getTimeSelecttTime(extDateTime.curentDate() + ' 00:00:00',-7*24*3600*1000);
                this.form.endTime = extDateTime.curentDate() + ' 23:59:59';
                this.handleSearch();
            },
            handleClick(data){
                console.log(data);
                let showFlag = false;
                //选中状态的显示
                if(this.multiSelect.indexOf(data.id) == -1){
                    this.multiSelect.push(data.id);
                    showFlag = true
                    //若无经纬度，给出提示
                    if(!data.offsetLat || !data.offsetLng){
                        this.$message({message:'无经纬度坐标，无法定位',type:'warning', showClose: true});
                        return
                    }
                }else{
                    this.multiSelect.splice(this.multiSelect.indexOf(data.id),1)
                    showFlag = false;
                }
                this.$emit('select',data,showFlag)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .alarm-container{
        width: 100%;
        height: 100%;
    }
    .search-form{
        /deep/ .el-date-editor{
            width: 100%;
        }
        /deep/ .el-form-item{
            margin-bottom: 5px;
        }
    }
    .list {
        height: calc(100% - 100px);
        /*padding: 15px 0;*/
        position: relative;
        padding-right: 10px;
        .car-cell {
            background-color: #071F3E;
            border: 1px solid #023A64;
            padding: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            .image-item {
                width: calc(100% - 10px);
                height: 80px;
                display: inline-block;
                float: left;
                border-radius: 3px;
                &.left {
                    margin-right: 10px;
                }
            }
            .car-item {
                color: #8BBCCA;
                font-size: 14px;
                margin-bottom: 6px;
                .name {
                    color: #fff;
                    font-size: 16px;
                    font-weight: 700;
                }
                i.fa {
                    color: #00CBD4;
                }
            }
            &.active{
                /*background-color: #fff;*/
                border: 2px solid #0F6FDE;
                border-radius: 5px;
            }
        }
    }
    /deep/ .el-pagination__total{
        color: #fff;
    }
    /deep/ .el-pagination{
        margin-left: -10px;
    }
    /deep/ .el-input__inner{
        background-color: #3a557a;
        border: solid 1px #08133b;
        color: #fff;
    }
</style>
