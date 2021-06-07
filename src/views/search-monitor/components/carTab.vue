<template>
    <div>
        <div class="one-tab-second">
            <el-row>
                <el-col :span="4">
                    <!--添加/删除-->
                    <el-button size="mini" type="primary" icon="el-icon-plus" plain
                               @click="addRow(rowOneData)"></el-button>
                    <el-button size="mini" type="primary" icon="el-icon-minus" plain
                               @click="reduceRow(rowOneData)"></el-button>
                </el-col>
                <el-col :span="9">
                    <el-select v-model="rowOneData.select" placeholder="请选择" @change="resetInput('-1')">
                        <el-option
                                v-for="item in gczpOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="9" class="one-tab-tabSelect">
                    <!--判断显示输入框还是下拉框-->

                    <template v-if="toggleSelect.indexOf(rowOneData.select) > -1">
                        <el-select v-model="rowOneData.input" placeholder="请选择">
                            <el-option
                                    v-for="item in allOptions[rowOneData.select + 'Options']"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                    <template v-else >
                        <el-input v-model="rowOneData.input" placeholder="请输入内容"></el-input>
                    </template>

                </el-col>
            </el-row>
            <!--添加的一行模板-->
            <template>
                <el-row v-for="(val,idx) in rowOtherData">
                    <el-col :span="4">
                        <el-button size="mini" type="primary" icon="el-icon-minus"
                                   style="margin-right: 10px" plain
                                   @click="reduceRow(val)"></el-button>
                        <el-select v-model="val.relation" placeholder="请选择"
                                   style="width: 60%;" >
                            <el-option
                                    v-for="item in relationOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>

                    <el-col :span="9">
                        <el-select v-model="val.select" placeholder="请选择" @change="resetInput(idx)">
                            <el-option
                                    v-for="item in gczpOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="9" class="one-tab-tabSelect">
                        <!--<el-input v-model="val.input" placeholder="请输入内容"></el-input>-->
                        <!--判断显示输入框还是下拉框-->

                        <template v-if="toggleSelect.indexOf(val.select) > -1">
                            <el-select v-model="val.input" placeholder="请选择">
                                <el-option
                                        v-for="item in allOptions[val.select + 'Options']"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                        <template v-else >
                            <el-input v-model="val.input" placeholder="请输入内容"></el-input>
                        </template>

                    </el-col>
                </el-row>
            </template>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'

    export default {
//        components: {Pagination},
//        props: ['oneCarInfo'],
        data() {
            return {
                gczpOptions:[
                    {
                        value: 'TollgateID',
                        label: '过车地点ID'
                    },
                    /*{
                        value: 'DeviceID',
                        label: ''
                    },*/
                    {
                        value: 'LaneNo',
                        label: '车道号'
                    },
                    {
                        value: 'PlateClass',
                        label: '号牌种类'
                    },
                    {
                        value: 'PlateColor',
                        label: '号牌颜色'
                    },
                    {
                        value: 'PlateNo',
                        label: '车牌号'
                    },
                    {
                        value: 'Direction',
                        label: '行驶方向'
                    },
                    {
                        value: 'VehicleClass',
                        label: '车辆年款'
                    },
                    {
                        value: 'VehicleBrand',
                        label: '车辆品牌'
                    },{
                        value: 'VehicleModel',
                        label: '车辆型号'
                    },{
                        value: 'VehicleColor',
                        label: '车身颜色'
                    },



                ],//条件检索，人脸抓拍下拉选择
                relationOptions: [{
                    value: '并且',
                    label: '并且'
                }, {
                    value: '或',
                    label: '或'
                }],
                allOptions:{
                    //号码牌颜色
                    PlateColorOptions:[
                        {value: '0', label: '未知'},
                        {value: '1', label: '白色'},
                        {value: '2', label: '黑色'},
                        {value: '4', label: '黄色'},
                        {value: '6', label: '蓝色'},
                        {value: '7', label: '绿色'},
                        {value: '14', label: '黄绿'},

                    ],
                    //号牌种类
                    PlateClassOptions:[
                        {value: '1', label: '大型汽车号牌 黄底 黑字'},
                        {value: '2', label: '小型汽车号牌 蓝底 白字'},
                        {value: '3', label: '使馆汽车号牌 黑底 红字'},
                        {value: '4', label: '领馆汽车号牌 黑底 红字'},
                        {value: '5', label: '境外汽车号牌 黑底 红字'},
                        {value: '6', label: '外籍汽车号牌 黑底 白字'},
                        {value: '7', label: '两、三轮摩托车号牌 黄底 黑字'},
                        {value: '8', label: '轻便摩托车号牌 蓝底 白字'},
                        {value: '9', label: '使馆摩托车号牌 黑底 红字'},
                        {value: '10', label: '领馆摩托车号牌 黑底 红字'},
                        {value: '11', label: '境外摩托车号牌 黑底 白字'},
                        {value: '12', label: '外籍摩托车号牌 黑底 白字'},
                        {value: '13', label: '农用运输车号牌 黄底 黑字'},
                        {value: '14', label: '拖拉机号牌 绿底 白字'},
                        {value: '15', label: '挂车号牌 黄底 黑字'},
                        {value: '16', label: '教练汽车号牌 黄底 黑字'},
                        {value: '17', label: '教练摩托车号牌 黄底 黑字'},
                        {value: '18', label: '试验汽车号牌 黄底 黑字'},
                        {value: '19', label: '试验摩托车号牌 黄底 黑字'},
                        {value: '20', label: '临时人境汽车号牌 白底 红字'},
                        {value: '21', label: '临时人境摩托车号牌 白底 红字'},
                        {value: '22', label: '临时行驶车号牌 白底 黑字'},
                        {value: '23', label: '警用汽车号牌 白底 红字'},
                        {value: '24', label: '警用摩托号牌 白底 红字'},
                        {value: '26', label: '香港入出境车 黑底 白字'},
                        {value: '27', label: '澳门入出境车 黑底 白字'},
                        {value: '31', label: '武警号牌 白底 红字'},
                        {value: '32', label: '军队号牌 白底 红字'},
                        {value: '99', label: '其他号牌'},
                    ],
                    //车身颜色
                    VehicleColorOptions:[
                        {value: '0', label: '未知'},
                        {value: '1', label: '白色'},
                        {value: '2', label: '黑色'},
                        {value: '3', label: '红色'},
                        {value: '4', label: '黄色'},
                        {value: '5', label: '灰色'},
                        {value: '6', label: '蓝色'},
                        {value: '7', label: '绿色'},
                        {value: '8', label: '棕色'},
                        {value: '9', label: '粉色'},
                        {value: '10', label: '紫色'},
                        {value: '11', label: '青色'},
                        {value: '12', label: '深灰色'},
                        {value: '13', label: '金色'},
                        {value: '14', label: '黄绿'},
                    ]
                },
                toggleSelect:['PlateColor','PlateClass','PlateClass','VehicleColor'],//需要显示下拉框的字段名
                rowOneData: {
                    value: '',
                    input: '',
                    select: '过车地点ID',
                    key: 1
                },
                rowOtherData: [],//增添条件数组
                rowOtherDataTotal: 1,

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
            //初始化数据
            initData() {
                //默认为选项的第一个
//                this.rowOneData.select = this.gczpOptions[0].label;

            },
            //获取数据，更新分页
            getList() {
                //第一条没有条件是并且、或；单独传
                this.$emit('updateSearchCondition','gczp',this.rowOneData,this.rowOtherData);

            },
            //条件检索 - 增加一行
            addRow(e) {
                //添加的行数不能多于可选择项的长度
                if (this.rowOtherData.length < this.gczpOptions.length) {
                    this.rowOtherDataTotal++;
                    this.rowOtherData.push({
                        select: '',
                        input: '',
                        relation: '并且',
                        key: this.rowOtherDataTotal
                    })
                }

            },

            //条件检索 - 减少一行
            reduceRow(e,index) {
                //如果是第一行，带加号的
                if (e.hasOwnProperty('key') && e.key === 1) {
                    this.rowOneData.input = '';
                    this.rowOneData.select = this.gczpOptions.length > 0 ? this.gczpOptions[0].label:'';
                    this.rowOneData.value = ''
                }else{
                    //带有 并且、或的
                    /*let resData = this.$lodash.remove(this.rowOtherData,(item) =>{
                            return e.key === item.key
                    });*/
                    let resData = this.rowOtherData.splice(index,1);
                }
            },

            //重置输入框
            resetInput(index){
                //除了第一行，切换选择框式，清空之前数据
                if(index !== '-1'&& this.rowOtherData.length > 0){
                    this.rowOtherData[index].input = ''
                }else{
                    //第一行，切换选择框式，清空之前数据
                    this.rowOneData.input = ''
                }
            }
        }
    }
</script>
<style lang="scss" scoped type="text/scss">

        /deep/ .el-tabs__active-bar {
            display: none;
        }
        /deep/ .el-tabs__nav {
            display: block;
        }
        /deep/.el-tabs__item{
            height: 20px;
            line-height: 20px;
            padding: 0 8px;
            margin-right: 20px;
            border-radius: 4px;
            color: #409EFF;
        }
        /deep/.el-tabs__item.is-active{
            color: #fff;
            background-color: #409EFF;
        }
        /deep/.el-tabs__item{
            font-size:14px;
        }
        /deep/.el-input__inner{
            height: 30px;
            line-height: 30px;
        }
        /deep/.el-tabs__nav-next, /deep/.el-tabs__nav-prev{
            line-height: 20px !important;
        }
        /deep/ .el-tabs__nav {
            float: left;
        }
        .one-tab-second{
            padding-top: 10px;
            /deep/ .el-row{
                line-height: 30px;
                margin-bottom: 5px;
            }
            /deep/ .el-input__icon{
                line-height: 30px;
            }
            /deep/ .el-button--mini, .el-button--mini.is-round{
                padding: 5px 8px;
            }
        }
        .one-tab-tabSelect{
            .el-select {
                width: 100%;
            }
        }

</style>
