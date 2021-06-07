<template>
    <div class="app-container" style="height: 100%">
        <el-container style="padding: 10px;height: 100%">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane  name="first">
                    <span slot="label"><i class="el-icon-date"></i>人脸</span>

                    <face-tab></face-tab>
                </el-tab-pane>
                <el-tab-pane  name="second">
                    <span slot="label"><i class="el-icon-date"></i>行人</span>

                    <person-tab></person-tab>
                </el-tab-pane>
                <el-tab-pane  name="third">
                    <span slot="label"><i class="el-icon-date"></i>机动车</span>

                    <car-tab></car-tab>
                </el-tab-pane>
                <el-tab-pane  name="fourth">
                    <span slot="label"><i class="el-icon-date"></i>非机动车</span>

                    <non-vehicle-tab></non-vehicle-tab>
                </el-tab-pane>
            </el-tabs>
        </el-container>
    </div>
</template>

<script>
    import {fetchTimelineTaskList} from '@/api/task'
    import FaceTab from '@/views/search-monitor/components/faceTab'
    import PersonTab from '@/views/search-monitor/components/personTab'
    import CarTab from '@/views/search-monitor/components/carTab'
    import NonVehicleTab from '@/views/search-monitor/components/nonVehicleTab'
    //    const url = "./../../assets/image/person/1.png"
//    const url = require('@/assets/image/person/1.png')

    export default {
        name: 'OrderTrackList',
        components: {FaceTab,PersonTab,CarTab,NonVehicleTab},
        data() {
            return {
                activeName: 'first',
            };
        },
        watch: {},
        created() {

        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }

        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    @import "~@/styles/common/resetTabs";




</style>
