<template>
    <div class="police-container">
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
                            <el-input v-model="form.policeDetail"  placeholder="请输入事件内容"></el-input>
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
            <div class="cell" v-for="(item,index) in policeList" :key="index" @click="handleClick(item)" :class="{'active':multiSelect.indexOf(item.id)>-1}">
                <el-row class="padding-td-5"><span class="title">警情编号：{{item.code}}</span></el-row>
                <el-row class="padding-td-5 ellipsis-l1"><span class="sub-title" :title="item.policeDetail">{{item.policeDetail}}</span>
                </el-row>
                <el-row class="padding-td-5"><span class="sub-type">{{item.typeClassDes}}>{{item.typeDes}}>{{item.smallTypeDes}}</span></el-row>
                <el-row class="padding-td-5">
                    <span class="alarm-time-title">报警时间</span>
                    <span class="alarm-time-content">{{item.alarmTime}}</span>
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
    import {queryPoliceList} from '@/api/map/map'
    export default {
        name: "policeList",
        components: {Pagination},
        props:['data'],
        data() {
            return {
                form:{
                    policeDetail:'',
                    startTime:'',
                    endTime:''
                },
                listQuery:{
                    page:1,
                    limit:5
                },
                pagerCount:5,
                total:0,
                policeList: [],
                loading:false,
                multiSelect:[],
            }
        },
        watch:{
          'data':{
              handler(value){
                  this.policeList = value.concat(this.policeList)
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
                this.loading = true;
                queryPoliceList(this.$qs.stringify(params)).then(res=>{
                    this.loading = false;
                    this.policeList = res.data.data;
                    this.total = res.data.total;
                })
            },
            handleSearch(){
                this.listQuery.page = 1;
                this.getList();
            },
            handleReset(){
                this.form.policeDetail = '';
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
    .police-container{
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
        height: calc(100% - 120px);
        padding-right: 10px;
        position: relative;
        .cell {
            color: #fff;
            font-size: 13px;
            margin-bottom: 10px;
            padding: 10px;
            cursor: pointer;
            .title {
                /*font-family: MicrosoftYaHei;*/
                font-size: 14px;
                color: #1079cd;
                font-weight: 700;
            }
            .sub-title {
                font-size: 16px;
                font-weight: 700;
            }
            .alarm-time-title {
                padding: 3px 15px;
                background-color: #BD0E0E;
                border-radius: 15px;
                margin-right: 10px;
            }
            &.active{
                /*background-color: #fff;*/
                border: 2px solid #0F6FDE;
                border-radius: 5px;
            }
        }
    }
    .el-divider--horizontal {
        margin: 10px 0;
        background-color: #466dbc;
        opacity: 0.3;
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
