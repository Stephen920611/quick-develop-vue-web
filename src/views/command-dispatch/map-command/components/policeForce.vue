<template>
    <div class="container">
        <div class="tree-list-wrap">
            <el-form ref="form" label-width="80px" :model="form">
                <el-row>
                    <el-col :span="17">
                        <el-form-item label="设备类型:">
                            <el-select v-model="form.type" placeholder="请选择设备类型" size="small" class="tree-selector" @change="handleChangeType">
                                <el-option v-for="(item,index) in typeList" :key="index" :label="item.des" :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" class="status-wrap">
                        <el-checkbox v-model="checked" @change="handleChangeStatus">在线</el-checkbox>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="17">
                        <el-form-item label="设备名称:">
                            <el-input
                                    placeholder="请输入设备名称"
                                    v-model="form.name"
                                    clearable
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" class="text-center">
                        <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                    </el-col>
                </el-row>

            </el-form>
        </div>

        <div class="list" v-scrollBar>
            <div class="car-cell" v-for="(item,index) in list" :key="index">
                <el-row>
                    <el-col :span="10">
                        <el-image :src="item.picUrl" class="image-item left"></el-image>
                    </el-col>
                    <el-col :span="14">
                        <el-row class="car-item">
                            <span class="name ellipsis-l1" :title="item.des">{{item.des}}</span>
                        </el-row>
                        <el-row class="car-item"><span>车辆状态：</span><span :class="item.status==1?'green-color':'red-color'">{{item.statusName}}</span></el-row>
                        <el-row class="car-item"><span>类型：</span><span>{{item.typeName}}</span></el-row>
                        <el-row class="car-item"><i class="fa fa-eye"></i><span class="margin-l-10">实时预览</span></el-row>
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
                    :page.sync="listQuery.start"
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
    import {getDeviceTypeList,getDeviceInfoByPage,getAllDevice} from '@/api/map/map'
    export default {
        name: "policeForce",
        components: {Pagination},
        data() {
            return {
//                list:[{picUrl:'../static/image/command-car.png',time:'2020-03-04 13:12:13'}],
                list:[],
                allList:[],  //总列表
                form:{
                    name:'',
                    status:'',
                    type:'',
                },
                checked:false,
                listQuery:{
                    start:1,
                    limit:10
                },
                pagerCount:5,
                total:0,
                typeList:[],
            }
        },
        mounted() {
            //查询设备类型，用于生成下拉列表
            this.getDeviceType();
            //查询所有的设备
            this.getAllDeviceList();
        },
        methods: {
            getDeviceType(){
                getDeviceTypeList().then(res=>{
                    this.typeList = res.data;
                    res.data.map((item,index)=>{
                        if(index == 0){
                            this.form.type = item.code;
                            //获取对应的设备列表
                            this.getList();
                        }
                    })
                })
            },
            getList(){
                this.form.status = this.checked?'1':'';
                let params = Object.assign(this.form,this.listQuery);
                for(let key in params){
                    if(params[key] == ''){
                        delete params[key]
                    }
                }
                getDeviceInfoByPage(this.$qs.stringify(params)).then(res=>{
                    res.data.children.map(item=>{
                        if(item.type == 11){
                            item.picUrl = '../static/image/command-car.png'
                        }else if(item.type == 12){
                            item.picUrl = '../static/image/single-pawn.png'
                        }else if(item.type == 14){
                            item.picUrl = '../static/image/PTU-car.png'
                        }else if(item.type == 16){
                            item.picUrl = '../static/image/coverged_communication.png'
                        }
                    });
                    this.list = res.data.children;
                    this.total = res.data.total;
                })
            },
            getAllDeviceList(){
                this.allList = [];
                    getAllDevice().then(res=>{
                    res.data.map(item=>{
                        this.allList.push(item.code);
                    })
                })
            },

            //切换设备类型
            handleChangeType(){
                this.getList();
            },
            //切换在线状态
            handleChangeStatus(){
                this.getList();
            },
            //查询
            handleSearch(){
                this.getList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container{
        width: 100%;
        height: 100%;
        background-color: #0e2c54;
        opacity: 0.82;
        padding: 15px;
        /deep/ .el-input__inner{
            background-color: #3a557a;
            border: solid 1px #08133b;
            color: #fff;
        }
        /deep/ .el-form-item__label{
            color: #fff;
        }
        /deep/ .el-form-item {
            margin-bottom: 10px;
        }
    }
    .status-wrap{
        height: 34px;
        line-height: 34px;
        text-align: center;
        /deep/ .el-checkbox__label{
            color: #fff;
        }
    }
    .list{
        height: calc(100% - 130px);
        position: relative;
        .cell{
            color: #fff;
            font-size: 14px;
            padding: 0 15px;
        }
    }
    .car-cell{
        background-color: #071F3E;
        border: 1px solid #023A64;
        padding: 10px;
        margin-bottom: 10px;
        .image-item{
            width: calc(100% - 10px);
            height: 80px;
            display: inline-block;
            float: left;
            border-radius: 3px;
            &.left{
                margin-right: 10px;
            }
        }
        .car-item{
            color: #fff;
            font-size: 14px;
            margin-bottom: 8px;
            .name{
                color: #1B7CC4;
                font-size: 12px;
                font-weight: 700;
                width: 100%;
                height: 25px;
                line-height: 25px;
                display: inline-block;
                text-align: center;
                border-radius: 3px;
                border: 1px solid #BED6EC;
                background-color: #fff;
            }
            i.fa-eye{
                color: #1296DB;
                font-size: 16px;
                /*font-weight: bold;*/
            }
        }
    }
    /deep/ .el-pagination__total{
        color: #fff;
    }
    .green-color{
        color: green;
    }
    .red-color{
        color: red;
    }
</style>
