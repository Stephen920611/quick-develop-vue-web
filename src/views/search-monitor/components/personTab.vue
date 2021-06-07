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
                                v-for="item in rtzpOptions"
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
                    <template v-else>
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
                                   style="width: 60%;">
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
                                    v-for="item in rtzpOptions"
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
                        <template v-else>
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
    import {mapGetters} from 'vuex'

    export default {
//        components: {Pagination},
//        props: ['oneCarInfo'],
        data() {
            return {
                rtzpOptions: [
                    {
                        value: 'sex_code',
                        label: '性别'
                    },
                    {
                        value: 'age_code',
                        label: '年龄段'
                    },
                    {
                        value: 'hair_code',
                        label: '发型'
                    },
                    {
                        value: 'umbrella_code',
                        label: '是否打伞'
                    },
                    {
                        value: 'bag_code',
                        label: '是否背双肩包'
                    },
                    {
                        value: 'hat_code',
                        label: '是否戴帽子'
                    },
                    {
                        value: 'baby_code',
                        label: '是否抱小孩'
                    },
                    {
                        value: 'messenger_bag_code',
                        label: '是否背斜挎包'
                    },
                    {
                        value: 'shoulder_bag_code',
                        label: '是否背单肩包'
                    },
                    {
                        value: 'upper_type_code',
                        label: '上身'
                    },
                    {
                        value: 'upper_color_code',
                        label: '上身颜色'
                    },
                    {
                        value: 'bottom_type_code',
                        label: '下身'
                    },
                    {
                        value: 'bottom_color_code',
                        label: '下身颜色'
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
                    //年龄段
                    age_codeOptions: [
                        {
                            value: '0',
                            label: '未知'
                        },
                        {
                            value: '1',
                            label: '孩童'
                        },
                        {
                            value: '2',
                            label: '青年'
                        },
                        {
                            value: '3',
                            label: '中年'
                        }, {
                            value: '4',
                            label: '老年'
                        }, {
                            value: '5',
                            label: '少年'
                        },
                    ],
                    //发型
                    hair_codeOptions: [
                        {
                            value: '0',
                            label: '未知'
                        },
                        {
                            value: '1',
                            label: '长发'
                        }, {
                            value: '2',
                            label: '短发'
                        },
                        {
                            value: '3',
                            label: '马尾'
                        },
                        {
                            value: '4',
                            label: '头部被遮挡'
                        },
                        {
                            value: '5',
                            label: '盘发'
                        },
                    ],
                    //性别
                    sex_codeOptions: [
                        {
                            value: '0',
                            label: '未知'
                        },
                        {
                            value: '2',
                            label: '男'
                        },
                        {
                            value: '1',
                            label: '女'
                        },
                    ],
                    //是否打伞
                    umbrella_codeOptions: [
                        {
                            value: '0',
                            label: '未知'
                        },
                        {
                            value: '1',
                            label: '未打伞'
                        },
                        {
                            value: '2',
                            label: '打伞'
                        },
                    ],
                    //是否背双肩包
                    bag_codeOptions: [
                        {
                            value: '0',
                            label: '未知'
                        },
                        {
                            value: '1',
                            label: '未背双肩包'
                        },
                        {
                            value: '2',
                            label: '双肩包'
                        },
                        {
                            value: '3',
                            label: '未确定'
                        },
                    ],
                    //是否戴帽子
                    hat_codeOptions: [
                        {
                            value: '0',
                            label: '未知'
                        },
                        {
                            value: '1',
                            label: '未戴帽子'
                        },
                        {
                            value: '2',
                            label: '戴帽子'
                        },
                        {
                            value: '3',
                            label: '戴头盔'
                        },
                    ],
                    //是否抱小孩
                    baby_codeOptions: [
                        {
                            value: '0',
                            label: '未知'
                        },
                        {
                            value: '1',
                            label: '抱小孩'
                        },
                        {
                            value: '2',
                            label: '未抱小孩'
                        },
                        {
                            value: '3',
                            label: '背小孩'
                        },
                    ],
                    //是否背斜挎包
                    messenger_bag_codeOptions: [
                        {
                            value: '0',
                            label: '未知'
                        },
                        {
                            value: '1',
                            label: '非斜挎包'
                        },
                        {
                            value: '2',
                            label: '斜挎包'
                        },
                    ],
                    //是否背单肩包
                    shoulder_bag_codeOptions: [
                        {
                            value: '0',
                            label: '未知'
                        },
                        {
                            value: '1',
                            label: '非单肩包'
                        },
                        {
                            value: '2',
                            label: '单肩包'
                        },
                    ],
                    //上身
                    upper_type_codeOptions: [
                        {
                            value: '0',
                            label: '未知'
                        },
                        {
                            value: '1',
                            label: '长袖'
                        },
                        {
                            value: '2',
                            label: '短袖'
                        },
                    ],
                    //上身颜色
                    upper_color_codeOptions: [
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
                    ],
                    //下身
                    bottom_type_codeOptions: [
                        {value: '0', label: '未知'},
                        {value: '1', label: '长裤'},
                        {value: '2', label: '短裤'},
                        {value: '3', label: '七分裤'},
                        {value: '4', label: '裙子'},
                    ],
                    //下身颜色
                    bottom_color_codeOptions: [
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
                    ],
                },
                toggleSelect: ['sex_code','age_code','hair_code','umbrella_code','bag_code','hat_code','baby_code','shoulder_bag_code', 'upper_type_code', 'upper_color_code', 'bottom_type_code', 'bottom_color_code'],//需要显示下拉框的字段名

                rowOneData: {
                    value: '',
                    input: '',
                    select: 'sex_code',
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
//                this.rowOneData.select = this.rtzpOptions[0].label;

            },
            //获取数据，更新分页
            getList() {
                //第一条没有条件是并且、或；单独传
                this.$emit('updateSearchCondition', 'rtzp', this.rowOneData, this.rowOtherData);

            },
            //条件检索 - 增加一行
            addRow(e) {
                //添加的行数不能多于可选择项的长度
                if (this.rowOtherData.length < this.rtzpOptions.length) {
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
            reduceRow(e, index) {
                //如果是第一行，带加号的
                if (e.hasOwnProperty('key') && e.key === 1) {
                    this.rowOneData.input = '';
                    this.rowOneData.select = this.rtzpOptions.length > 0 ? this.rtzpOptions[0].label : '';
                    this.rowOneData.value = ''
                } else {
                    //带有 并且、或的
                    /*let resData = this.$lodash.remove(this.rowOtherData,(item) =>{
                            return e.key === item.key
                    });*/
                    let resData = this.rowOtherData.splice(index, 1);
                }
            },

            //重置输入框
            resetInput(index) {
                //除了第一行，切换选择框式，清空之前数据
                if (index !== '-1' && this.rowOtherData.length > 0) {
                    this.rowOtherData[index].input = ''
                } else {
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

    /deep/ .el-tabs__item {
        height: 20px;
        line-height: 20px;
        padding: 0 8px;
        margin-right: 20px;
        border-radius: 4px;
        color: #409EFF;
    }

    /deep/ .el-tabs__item.is-active {
        color: #fff;
        background-color: #409EFF;
    }

    /deep/ .el-tabs__item {
        font-size: 14px;
    }

    /deep/ .el-input__inner {
        height: 30px;
        line-height: 30px;
    }

    /deep/ .el-tabs__nav-next, /deep/ .el-tabs__nav-prev {
        line-height: 20px !important;
    }

    /deep/ .el-tabs__nav {
        float: left;
    }

    .one-tab-second {
        padding-top: 10px;
        /deep/ .el-row {
            line-height: 30px;
            margin-bottom: 5px;
        }
        /deep/ .el-input__icon {
            line-height: 30px;
        }
        /deep/ .el-button--mini, .el-button--mini.is-round {
            padding: 5px 8px;
        }
    }

    .one-tab-tabSelect {
        .el-select {
            width: 100%;
        }
    }

</style>
