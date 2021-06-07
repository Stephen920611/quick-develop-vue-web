<template>
    <div class="left-container">
        <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="进出口核验" name="1">
                <div class="list" v-scrollBar>
                    <div class="cell" :class="{'active':selectedPassCheckIndex==index}" v-for="(item,index) in passCheckData" @click="handleSelectPassCheck(index)">
                        <el-tag type="danger" :class="item.toPortCheck == 1?'green-color':'red-color'">{{item.toPortCheck == 1?'核验正常':'核验异常'}}</el-tag>
                        <p class="title">
                            <span class="title padding-lr-5">{{item.drivePlate}}</span>
                            <span class="status-tag" :class="item.checkStatus==1?'green-color':'blue-color'">{{item.checkStatus == 1?'进厂':'出厂'}}</span>
                        </p>
                        <p><label class="label ellipsis-l1" title="所在地点">所在地点：</label><span class="ellipsis-l1" :title="item.companyName">{{item.companyName}}</span></p>
                        <p><label class="label ellipsis-l1" title="出入时间">出入时间：</label><span class="ellipsis-l1">{{item.toPortPassCar.passTime}}</span></p>
                        <p>
                            <span class="margin-r-10" @click="viewDetail(passCheckData[index])"><span class="icon iconfont iconxiangqing"></span>详情</span>
                        </p>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <el-dialog :visible.sync="dialogVisible.detail" width="70%" top="12vh" append-to-body title="查看" v-elDragDialog>
            <pass-check-detail v-if="dialogVisible.detail" @toggleDetail="toggleDetail" :recordInformation="record"></pass-check-detail>
        </el-dialog>
    </div>
</template>

<script>
    import elDragDialog from '@/directive/el-drag-dialog'
    import passCheckDetail from '@/views/course-monitor/import-export/info-management/components/more-detail'
    export default {
        name: "CarPassCheck",
        props:['passCheckData'],
        inject:['openDialog'],
        directives: {elDragDialog},
        components: {passCheckDetail},
        data() {
            return {
                activeName: '1',
                dialogVisible:{
                    detail:false,
                },
                record:{},  //详情数据
                selectedPassCheckIndex:null,    //选中的进出口核验的索引值
            }
        },
        mounted() {
            
        },
        methods: {
            // 控制对话框显隐
            toggleDetail(type) {
                this.dialogVisible.detail = type;
            },
            viewDetail(record) {
                this.record = record;
                this.dialogVisible.detail = true;
            },
            //选中进出口核验记录
            handleSelectPassCheck(index){
                this.selectedPassCheckIndex = index;
                this.$emit('selectPassCheckData',this.passCheckData[index])
            },

        }
    }
</script>

<style lang="scss" scoped>
    .left-container{
        width: 100%;
        height: 100%;
    }
    /deep/ .el-collapse{
        border-top: 1px solid #606266;
        border-bottom: 1px solid #606266;
    }
    /deep/ .el-collapse-item__wrap{
        border-bottom: none;
        height: calc(100vh - 130px);
    }
    /deep/ .el-collapse-item__header{
        font-size: 15px;
        font-weight: bold;
        background-color: #33455b;
        color: #fff;
        height: 35px;
        line-height: 35px;
        padding: 10px;
    }
    .list{
        height: calc(100vh - 160px);
        padding: 10px;
        position: relative;
        .cell{
            border: 1px solid #eee;
            border-radius: 5px;
            padding: 5px 10px;
            margin-bottom: 10px;
            cursor: pointer;
            &.active{
                border: 1px solid #1a70dc;
                background-color: #f7fcff;
            }
            .el-tag{
                float: right;
                width: 60px;
                height: 23px;
                line-height: 23px;
                border-radius: 9px 3px 3px 9px;
                color: #fff;
                text-align: center;
                right: 10px;
                position: absolute;
            }
            p{
                height: 25px;
                line-height: 25px;
                color: #666;
                &.special{
                    width: calc(100% - 50px);
                }
            }
            .label{
                width: 70px;
                display: inline-block;
                float: left;
                text-align: left;
                font-weight: 500;
            }
            span.ellipsis-l1{
                display: inline-block;
                width: calc(100% - 70px);
                display: inline-block;
            }
            span.title{
                color: #333;
                font-size: 16px;
                font-weight: bold;
            }
            .iconfont{
                font-size: 16px;
                color: #46a6ff;
                cursor: pointer;
                margin-right: 3px;
            }
            .status-tag{
                padding: 3px 12px;
                border: 1px solid;
                border-radius: 9px;
            }
        }
    }
    .orange-color{
        background-color: #f59a23;
        color: #fff;
    }
    .red-color{
        background-color: #d10909;
        color: #fff;
    }
    .green-color{
        background-color: #259920;
        border-color: #259920;
        color: #fff;
    }
    .blue-color{
        background-color: #6292e0;
        border-color: #6292e0;
        color: #fff;
    }
</style>
