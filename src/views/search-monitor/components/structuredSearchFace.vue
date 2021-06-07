<template>
    <div class="one-str-person-content">
        <div class="one-str-person-card">
            <el-row :gutter="10" >
                <template v-for="(item,index) in list">
                    <el-col :span="4" style="min-width: 170px;margin-bottom: 20px;width: 20%">
                        <el-card class="box-card">
                                <div class="one-str-person-image">
                                    <el-image
                                            style="width: 100%; height: 140px"
                                            :src="item.FaceImageUri_ytS"
                                            :preview-src-list="[item.FaceImageUri_ytS]"

                                    >
                                    </el-image>
                                </div>
                            <div class="one-str-person-time">
                                <div class="ellipsis-l1" :title="item.faceAppearTime === null ? '未知' : item.FaceAppearTime">出现时间：<span class="one-str-person-color">{{item.FaceAppearTime === null ? '未知' : item.FaceAppearTime}}</span></div>
                                <div class="ellipsis-l1" :title="item.cameraName === null ? '未知' : item.CameraId_ytS">出现地点：<span class="one-str-person-color">{{item.CameraId_ytS === null ? '未知' : item.CameraId_ytS}}</span></div>
                                <el-row class="one-str-person-icons">
                                    <i class="el-icon-picture-outline"></i>
                                    <i class="el-icon-star-off"></i>
                                    <i class="el-icon-video-play"></i>
                                    <i class="el-icon-view"></i>
                                    <i class="el-icon-delete"></i>
                                </el-row>
                            </div>
                        </el-card>
                    </el-col>

                </template>
            </el-row>
            <div v-if="!toggleDownVisible">
                <!-- 分页控件 -->
                <pagination
                        v-show="total>0"
                        :total="total"
                        :page.sync="listQuery.page"
                        :limit.sync="listQuery.size"
                        style="padding:0px !important"
                        class="pagination"
                        @pagination="getList"
                />
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import Pagination from '@/components/Pagination'
    import { mapGetters } from 'vuex'


    export default {
        components: {Pagination},
        props: ['structuredFaceInfo'],
        data() {
            return {
                list: [{}],
                allList:[],
                total: 0,
                listQuery: {
                    page: 1,
                    size: 5,
                },
                toggleDownVisible: true

            }
        },
        computed: {
            ...mapGetters([
                'structuredFaceInfoPages',
                'structuredFaceInfoDown'
            ])
        },
        watch: {
            //监听展开/收起10条数据，展开5条数据
            toggleDownVisible(newName, oldVal) {
                //更新展开、收起
                this.$store.dispatch('search/toggleStructuredFaceInfoDown',newName);
                this.listQuery.size = newName ? 5 : 10;
                //更新页数
                this.$store.dispatch({
                    type: 'search/toggleStructuredFaceInfoPages', // 调用action
                    structuredFaceInfoPages: this.listQuery
                })
                this.list = newName ? this.allList.slice(0,5): this.allList.slice(0,10);
            },
            //监听结构化人脸信息
            structuredFaceInfo: {
                handler(val, oldVal) {
//                    this.structuredFaceInfo = val;
                    //点击分页时，数据处理
                    this.initInfo();
                    /*if(!this.toggleDownVisible){
                        this.total = this.structuredFaceInfo.hasOwnProperty('total') ? this.structuredFaceInfo.total : 0;
                        this.allList = this.structuredFaceInfo.data;
                        this.list =this.allList;

                    }*/
                },
                deep: true
            },
        },
        mounted() {
            this.initInfo();

        },
        methods: {
            //展开、收起按钮
            toggleDown() {
                this.toggleDownVisible = !this.toggleDownVisible;
                //更新记录展开、收起按钮
                this.$store.dispatch('search/toggleStructuredFaceInfoDown',this.toggleDownVisible);
            },
            //初始化数据
            initInfo() {
                this.toggleDownVisible = this.structuredFaceInfoDown;
                this.listQuery = this.structuredFaceInfoPages;

                this.total = this.structuredFaceInfo.hasOwnProperty('total') ? this.structuredFaceInfo.total : 0;
//                this.total = 20;
                this.allList = this.structuredFaceInfo.data;
                this.list =this.toggleDownVisible ? this.allList.length > 5 ? this.allList.slice(0,5):this.allList : this.allList;

            },
            //获取数据，更新分页
            getList() {
                /*this.$store.dispatch({
                    type: 'search/toggleStructuredFaceInfoPages', // 调用action
                    structuredFaceInfoPages: this.listQuery
                })
                this.$emit('updatePages','2',this.listQuery);*/

            },
        }
    }
</script>
<style lang="scss" scoped type="text/scss">
    .one-str-person-content {
        margin-top: 20px;
        .one-str-person-result {
            display: flex;
            justify-content: space-between;
            .one-str-person-down {
                color: #409eff;
                font-size: 14px;
                .el-tag {
                    height: 26px;
                    line-height: 24px;
                }
            }
        }
        .one-str-person-card {
            margin-top: 20px;
            /deep/ .el-card__body {
                padding: 15px 10px;
            }
            .one-str-person-image {
                /*width: 75px;*/
                /*height: 90px;*/
                width: 100%;
                height: 140px;
                margin-right: 8px;
            }
            .one-str-person-info {
                width: calc(100% - 105px);
                line-height: 20px;
                letter-spacing: 0;
                color: #999999;
                .one-str-person-color {
                    color: #262626;
                }
                .one-str-person-des {
                    font-size: 14px;
                    margin-top: 10px;
                    color: #008000;
                    font-weight: bold;
                }
            }
            .one-str-person-time {
                font-size: 12px;
                line-height: 20px;
                color: #999999;
                .one-str-person-color {
                    color: #262626;
                }
            }

            .one-str-person-icons {
                color: #409eff;
                font-size: 18px;
                margin-top: 5px;
                & > > > i {
                    margin-right: 8px;
                }
            }

        }
    }

    .pagination {
        margin-top: 30px;
        margin-bottom: 50px;
        /deep/ .el-pagination {
            display: flex;
            justify-content: center;
        }
    }


</style>
