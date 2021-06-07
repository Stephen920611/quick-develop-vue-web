<template>
    <div class="one-tab-content">
        <div class="one-tab-search">
            <div class="one-tab-content-search">
                <div class="one-tab-search-tag-group">已选条件：
                    <el-tag
                            v-for="(tag,idx) in tags"
                            :key="idx"
                            closable
                            :type="tag.type"
                            class="one-tab-search-tag-item"
                            @close="handleClose(tag)"
                    >
                        {{tag.name}}
                    </el-tag>
                </div>
                <div>
                    <el-button type="primary" @click="onSubmit" icon="el-icon-search">搜索</el-button>
                    <el-button @click="onReset" icon="el-icon-refresh">重置</el-button>
                </div>

            </div>

            <div class="one-main-first">
                <div>
                    设备名称：
                    <el-button size="small">
                        <i class="el-icon-upload el-icon--right"></i>
                        设备选择
                    </el-button>
                </div>
                <div>
                    时间范围：
                    <el-radio-group v-model="chooseTime" size="small" @change="onChange('chooseTime')">
                        <el-radio v-for="(item,index) in timeArr" :label="item.value" border>{{item.name}}</el-radio>
                        <el-radio label="custom" class="one-main-custom" border>
                            <span v-if="timeParams.startTime === ''" @click="showTime"> 自定义</span>
                            <span v-else @click="showTime">{{timeParams.startTime + ' - ' + timeParams.endTime}}</span>

                            <!--自定义时间选择弹窗-->
                            <el-card class="box-card one-main-custom-time" v-show="dialogTimeVisible">
                                <div class="block">
                                    <!--<span class="demonstration">默认</span>-->
                                    <el-date-picker
                                            v-model="timeValue"
                                            type="datetimerange"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期">
                                    </el-date-picker>
                                </div>
                                <div class="one-main-custom-time-footer">
                                    <el-button @click="cancelTime" size="small">取 消</el-button>
                                    <el-button type="primary" @click="changeTime" size="small">确 定</el-button>
                                </div>
                            </el-card>
                        </el-radio>
                    </el-radio-group>
                </div>
                <div class="one-main-other-up" @click="toggleIcon">
                    <i class="el-icon-arrow-up"
                       :style="searchVisible ? 'transform: rotate(0deg); transition: 0.4s': 'transform: rotate(-180deg); transition: 0.4s'"></i>
                    {{searchVisible ? '收起' : '展开'}}
                    <!--<span v-if="!searchVisible" ><i class="el-icon-arrow-down" ></i>展开</span>-->

                </div>

            </div>
            <div class="one-main-other" v-if="searchVisible">
                <div class="one-main-other-item">
                    性别：
                    <el-radio-group v-model="chooseGender" size="small" @change="onChange('chooseGender')" >
                        <el-radio v-for="(item,index) in genderArr" :label="item.value" border>{{item.name}}</el-radio>
                    </el-radio-group>
                </div>
                <div class="one-main-other-item">
                    帽子：
                    <el-radio-group v-model="chooseHat" size="small" @change="onChange('chooseHat')" >
                        <el-radio v-for="(item,index) in hatArr" :label="item.value" border>{{item.name}}</el-radio>
                    </el-radio-group>
                </div>
                <div class="one-main-other-item">
                    眼镜：
                    <el-radio-group v-model="chooseGlasses" size="small" @change="onChange('chooseGlasses')" >
                        <el-radio v-for="(item,index) in glassesArr" :label="item.value" border>{{item.name}}</el-radio>

                    </el-radio-group>
                </div>
                <div class="one-main-other-item">
                    口罩：
                    <el-radio-group v-model="chooseMask" size="small" @change="onChange('chooseMask')" >
                        <el-radio v-for="(item,index) in maskArr" :label="item.value" border>{{item.name}}</el-radio>

                    </el-radio-group>
                </div>

            </div>

        </div>

        <el-card class="box-card one-tab-list" shadow="never" >
            <structured-search-Face
                    :structuredFaceInfo=structuredFaceInfo
                    v-on:updatePages="updatePages"
            ></structured-search-Face>
        </el-card>

    </div>
</template>
<script>
    import Vue from 'vue'
    import {mapGetters} from 'vuex'
    import D from '@/utils/DFDZ'
    import StructuredSearchFace from '@/views/search-monitor/components/structuredSearchFace'

    export default {
        components: {StructuredSearchFace},
//        props: ['oneCarInfo'],
        data() {
            return {
                rlzpOptions: [
                    {
                        value: 'clusterId',
                        label: '集群ID'
                    },
                    {
                        value: 'cameraId',
                        label: '摄像机ID'
                    },
                    {
                        value: 'clusterCamera',
                        label: '集群ID+摄像机ID'
                    },
                    {
                        value: 'recAgeRange',
                        label: '年龄段'
                    },
                    {
                        value: 'recGlasses',
                        label: '是否戴眼镜'
                    },
                    {
                        value: 'recGender',
                        label: '性别'
                    },
                    {
                        value: 'recUygur',
                        label: '是否维族'
                    },
                    {
                        value: 'isHit',
                        label: '是否报警'
                    },
                ],//条件检索，人脸抓拍下拉选择
                relationOptions: [{
                    value: '并且',
                    label: '并且'
                }, {
                    value: '或',
                    label: '或'
                }],
                allOptions: {
                    recAgeRangeOptions: [
                        {
                            value: '0',
                            label: '小孩'
                        },
                        {
                            value: '1',
                            label: '青年'
                        },
                        {
                            value: '2',
                            label: '中年'
                        }, {
                            value: '3',
                            label: '老年'
                        },
                        {
                            value: '-1',
                            label: '未知'
                        },

                    ],//人脸抓拍-年龄段
                    recGlassesOptions: [
                        {
                            value: '97',
                            label: '戴眼镜'
                        },
                        {
                            value: '98',
                            label: '不戴眼镜'
                        }, {
                            value: '7',
                            label: '太阳镜'
                        },
                        {
                            value: '-1',
                            label: '未知'
                        },
                    ],//人脸抓拍-是否戴眼镜
                    recGenderOptions: [
                        {
                            value: '1',
                            label: '男'
                        },
                        {
                            value: '2',
                            label: '女'
                        },
                        {
                            value: '-1',
                            label: '未知'
                        },
                    ],//人脸抓拍-性别
                    recUygurOptions: [
                        {
                            value: '1',
                            label: '维族人'
                        },
                        {
                            value: '2',
                            label: '非维族人'
                        },
                        {
                            value: '-1',
                            label: '未知'
                        },
                    ],//人脸抓拍-是否维族
                    isHitOptions: [
                        {
                            value: 'true',
                            label: '报警'
                        },
                        {
                            value: 'false',
                            label: '不报警'
                        },
                    ],//人脸抓拍-是否报警
                },
                toggleSelect: ['recAgeRange', 'recGlasses', 'recGender', 'recUygur', 'isHit'],//需要显示下拉框的字段名
                rowOneData: {
                    value: '',
                    input: '',
                    select: 'XM',
                    key: 1
                },
                rowOtherData: [],//增添条件数组
                rowOtherDataTotal: 1,
                tags: [],//已选条件
                chooseTime: 0,//时间
                chooseGender: 0,//性别
                chooseHat: 0,//帽子
                chooseGlasses: 0,//眼镜
                chooseMask: 0,//口罩
                timeArr: [
                    {
                        name: '24小时',
                        value: 1,
                    },
                    {
                        name: '近7天',
                        value: 2,
                    },
                    {
                        name: '近30天',
                        value: 3,
                    },
                ],
                genderArr: [
                    {
                        value: 0,
                        name: '全部'
                    }, {
                        value: 1,
                        name: '男'
                    }, {
                        value: 2,
                        name: '女'
                    }, {
                        value: 3,
                        name: '其他'
                    }],
                hatArr: [
                    {
                        value: 0,
                        name: '全部'
                    }, {
                        value: 1,
                        name: '无帽子'
                    }, {
                        value: 2,
                        name: '有帽子'
                    }, {
                        value: 3,
                        name: '有头巾'
                    }],
                glassesArr: [
                    {
                        value: 0,
                        name: '全部'
                    }, {
                        value: 1,
                        name: '无眼镜'
                    }, {
                        value: 2,
                        name: '有眼镜'
                    }, {
                        value: 3,
                        name: '有太阳镜'
                    }],
                maskArr: [
                    {
                        value: 0,
                        name: '全部'
                    }, {
                        value: 1,
                        name: '男'
                    }, {
                        value: 2,
                        name: '女'
                    }, {
                        value: 3,
                        name: '其他'
                    }],
                //自定义
                timeParams: {
                    startTime: "",//开始时间
                    endTime: '',//结束时间
                },
                dialogTimeVisible: false,//轨迹自定义时间选择框是否显示
                timeValue: [],//自定义选中时间

                searchVisible: false,// 展开/收起的显示与隐藏

                list: [],
                allList:[],
                total: 0,
                listQuery: {
                    page: 1,
                    size: 5,
                },

                structuredFaceInfo: {},//结构化人脸
                pageData: { //每页数量
                    pagenum: 1,
                    pagesize: 10
                },


            }
        },
        /*watch: {
            //监听一车一档的信息，处理数据
            oneCarInfo(newName, oldVal) {
//                this.oneCarInfo = newName;
                this.initData();
            }
        },*/
        mounted() {
            this.initData();
        },
        methods: {
            toggleIcon() {
                this.searchVisible = !this.searchVisible

            },
            handleClose(tag) {
                console.log(tag,'111111111');
                this.tags.splice(this.tags.indexOf(tag), 1);
            },

            //初始化数据
            initData() {
                //默认为选项的第一个
//                this.rowOneData.select = this.rlzpOptions[0].label;

            },
            //获取数据，更新分页
            getList() {
                //第一条没有条件是并且、或；单独传
                this.$emit('updateSearchCondition', 'rlzp', this.rowOneData, this.rowOtherData);

            },

            //显示时间选择框
            showTime(value) {
                //如果是点击事件或者是自定义
//                if((value.hasOwnProperty('type') && value.type === 'click')|| (value === 'custom')){
                this.dialogTimeVisible = true
//                }
            },
            //时间选择框-点击确认
            changeTime() {
                this.dialogTimeVisible = false;
                this.timeParams.startTime = this.$lodash.isNaN(D.moment(this.timeValue[0]).format('YYYY-MM-DD HH:mm:ss')) ? '' : D.moment(this.timeValue[0]).format('YYYY-MM-DD HH:mm:ss');
                this.timeParams.endTime = this.$lodash.isNaN(D.moment(this.timeValue[1]).format('YYYY-MM-DD HH:mm:ss')) ? '' : D.moment(this.timeValue[1]).format('YYYY-MM-DD HH:mm:ss');
                this.onChange('chooseTime');
            },

            //时间选择框-点击取消
            cancelTime() {
                this.dialogTimeVisible = false;
                this.chooseTime = '';//清空轨迹时间tab
                this.timeParams = { //清空选择的时间
                    startTime: '',
                    endTime: '',
                }
            },
            //改变tags
            changeTags(selectData,arr,name){
                let self = this;
                let resData = this.$lodash.filter(arr, function (o) {
                    return o.value === selectData;
                });
                let keys = self.tags.map((item, index) => {
                    if (item.key === name) {//覆盖
                        self.$set(self.tags,index,{'name': name + "：" + resData[0].name, 'type': '', 'key': name})
                    }
                    return item.key
                });
                //判断是否有该选项，没有插入
                if(keys.indexOf(name) === -1){
                    self.tags.push(
                        {'name': name + "：" + resData[0].name, type: '', 'key': name}
                    );
                }

            },
            //点击点选框
            onChange(type) {
                let self = this;
                switch (type) {
                    case 'chooseTime'://时间范围
                        console.log(self.chooseTime,'self.chooseTime');
                        if(self.chooseTime === 'custom'){
                            let keys = self.tags.map((item, index) => {
                                if (item.key === '时间范围') {//覆盖
                                    self.$set(self.tags,index,{'name': '时间范围' + "：" + self.timeParams.startTime + ' - ' + self.timeParams.endTime, 'type': '', 'key': '时间范围'})
                                }
                                return item.key
                            });
                            //判断是否有该选项，没有插入
                            if(keys.indexOf('时间范围') === -1){
                                self.tags.push(
                                    {'name': '时间范围' + "：" + self.timeParams.startTime + ' - ' + self.timeParams.endTime, type: '', 'key': '时间范围'}
                                );
                            }
                            return;
                        }
                        this.changeTags(self.chooseTime,this.timeArr,'时间范围');

                        break;
                    case 'chooseGender'://性别
                        this.changeTags(self.chooseGender,this.genderArr,'性别');
                        break;
                    case 'chooseHat'://帽子
                        this.changeTags(self.chooseHat,this.hatArr,'帽子');
                        break;
                    case 'chooseGlasses'://眼镜
                        this.changeTags(self.chooseGlasses,this.glassesArr,'眼镜');
                        break;
                    case 'chooseMask'://口罩
                        this.changeTags(self.chooseMask,this.maskArr,'口罩');
                        break;
                    default :
//                        alert('绘制类型错误！');
                }
            },

            //重置
            onReset() {

            },
            //搜索
            onSubmit() {

            },
            //分页，更新数据,pagesType 判断是哪些类型的分页
            updatePages(pagesType, listQuery) {
//                this.updateOneSearchPages(pagesType,listQuery)
            },

        }
    }
</script>
<style lang="scss" scoped type="text/scss">
    //搜索
    .one-tab-search {
        font-size: 14px;
    }

    .one-tab-content-search {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        div {
            &:nth-child(1) {
                width: calc(100% - 200px);
                margin-bottom: 10px;
            }
            &:nth-child(2) {
                width: 200px;
            }

        }
        .one-tab-search-tag-group {
            /*height: 30px;*/
            line-height: 28px;
            .one-tab-search-tag-item {
                margin-right: 10px;
                margin-bottom: 10px;
            }

        }

    }

    //自定义时间
    .one-main-custom {
        position: relative;
        .one-main-custom-time {
            position: absolute;
            top: 25px;
            left: 10px;
            width: 500px;
            height: 150px;
            z-index: 1000;
            background-color: white;
            padding-top: 5px;
            /deep/ .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner {
                width: 100%;
            }
            .one-main-custom-time-footer {
                text-align: center;
                margin-top: 30px;
            }
        }

    }

    //自定义单选框
    /deep/ .el-radio {
        margin-right: 5px;
    }

    /deep/ .el-radio--small.is-bordered {
        padding: 6px 15px 15px;
        height: 28px;
        /*width: 70px;*/
        text-align: center;
    }

    /deep/ .el-radio--small.is-bordered .el-radio__inner {
        display: none;
    }

    /deep/ .el-radio__label {
        padding-left: 0;
    }

    //自定义按钮
    /deep/ .el-button--small {
        padding: 7px 30px;
    }

    .one-main-first {
        display: flex;
        justify-content: flex-start;
        div {
            &:nth-child(1) {
                /*width: calc(100% - 200px);*/
            }
            &:nth-child(2) {
                margin-left: 50px;
            }
            &:nth-child(3) {
                color: #2779ef;
                line-height: 30px;
                margin-left: 10px;
                font-size: 12px;
                cursor: pointer;
                i {
                    margin-right: 3px;
                }
            }

        }
    }

    //其他搜索框
    .one-main-other {
        padding: 10px 30px;
        .one-main-other-item {
            margin-bottom: 10px;
            line-height: 32px;
        }

    }

    //列表内容
    .one-tab-list{
        margin-top: 20px;

    }

</style>
