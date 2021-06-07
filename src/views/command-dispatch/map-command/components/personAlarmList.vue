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
                            <el-input v-model="form.name"  placeholder="请输入姓名"></el-input>
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
        <div class="list" v-scrollBar  v-loading="loading">
            <div class="person-cell" v-for="(item,index) in personAlarmList" :key="'person_'+index" @click="handleClick(item)" :class="{'active':multiSelect.indexOf(item.id)>-1}">
                <el-row>
                    <el-col :span="11" class="margin-t-10">
                        <el-image :src="item.faceUrl" class="image-item left"></el-image>
                        <el-image :src="item.hitFaceImageUrl" class="image-item right"></el-image>
                    </el-col>
                    <el-col :span="13">
                        <el-row class="person-item">
                            <el-col :span="8"><span class="name">{{item.name}}</span></el-col>
                            <el-col :span="16"><span class="similar-title">相似度</span><span
                                    class="similar-content">{{parseFloat(item.similarity).toFixed(2)}}%</span></el-col>
                        </el-row>
                        <el-row class="person-item"><span class="tags">{{item.repositoryDes}}</span></el-row>
                        <el-row class="person-item"><span>{{item.personId}}</span></el-row>
                        <el-row class="person-item"><i class="fa fa-map-marker margin-r-10"></i><span>{{item.cameraDes}}</span>
                        </el-row>
                        <el-row class="person-item"><i class="fa fa-times margin-r-10"></i><span>{{item.hitTime && item.hitTime.substring(0,19)}}</span>
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
    import {getFaceNewestWarning2} from '@/api/map/map'
    export default {
        name: "personAlarmList",
        components: {Pagination},
        props:['data'],
        data() {
            return {
                form:{
                    name:'',
                    startTime:'',
                    endTime:''
                },
                listQuery:{
                    page:1,
                    limit:5
                },
                pagerCount:5,
                total:0,
                personAlarmList: [],
//                srcList: ['../static/image/faceImg.png', '../static/image/face_differ.png'],
                loading:false,
                multiSelect:[],
            }
        },
        watch:{
            'data':{
                handler(value){
                    if(value){
                        this.personAlarmList = value.concat(this.personAlarmList)
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
                const params = Object.assign(this.form,this.listQuery);
                this.personAlarmList = [];
                this.loading = true;
                //获取数据
                getFaceNewestWarning2(this.$qs.stringify(params)).then(res=>{
                    this.loading = false;
                    this.personAlarmList = res.data.newestWarning;
                    this.total = res.data.total;
                })
            },
            handleSearch(){
                this.listQuery.page = 1;
                this.getList();
            },
            handleReset(){
                this.form.name = '';
//                this.form.startTime = extDateTime.curentDate() + ' 00:00:00';
                this.form.startTime = extDateTime.getTimeSelecttTime(extDateTime.curentDate() + ' 00:00:00',-7*24*3600*1000);
                this.form.endTime = extDateTime.curentDate() + ' 23:59:59';
                this.handleSearch();
            },
            handleClick(data){
                let showFlag = false;
                //选中状态的显示
                if(this.multiSelect.indexOf(data.id) == -1){
                    this.multiSelect.push(data.id);
                    showFlag = true
                    //若无经纬度，给出提示
                    if(!data.lat || !data.lng){
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
        .person-cell {
            background-color: #071F3E;
            border: 1px solid #023A64;
            padding: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            .image-item {
                width: calc(50% - 10px);
                height: 80px;
                display: inline-block;
                float: left;
                border-radius: 3px;
                &.left {
                    margin-right: 10px;
                }
            }
            .person-item {
                color: #8BBCCA;
                font-size: 12px;
                margin-bottom: 3px;
                .name {
                    color: #fff;
                    font-size: 15px;
                    font-weight: 700;
                }
                .similar-title {
                    background-color: #EB3B44;
                    color: #fff;
                    padding: 2px 4px;
                    border-radius: 3px 0 0 3px;
                    border: 1px solid #EB3B44;
                    display: inline-block;
                    float: left;
                    font-size: 8px;
                }
                .similar-content {
                    background-color: #fff;
                    color: #EB3B44;
                    padding: 2px 4px;
                    border-radius: 0 3px 3px 0;
                    border: 1px solid #EB3B44;
                    display: inline-block;
                    font-size: 8px;
                }
                .tags {
                    border: 1px solid #EB3B44;
                    border-radius: 3px;
                    padding: 2px 8px;
                    color: #EB3B44;
                    display: inline-block;
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
