<template>
  <div>

    <el-row style="width: 100%;margin-bottom: 10px">
      <el-col :span="8" class="btns" style="float: left">
        <el-card class="box-card">
          <div class="timeline-content">
            <el-timeline :reverse="reverse">
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.timestamp"
                placement="top"
              >
                <div class="timeline-content-all">
                  <div class="timeline-content-all-left">
                    <div class="timeline-content-des">{{ activity.createTime }}</div>
                    <div class="timeline-content-name">{{ activity.name }}</div>
                    <div class="timeline-content-des">申请人：{{ activity.user }}</div>
                    <div class="timeline-content-des">安全员：{{ activity.safeUser }}</div>
                    <div class="timeline-content-des">保管员：{{ activity.keepingUser }}</div>
                  </div>
                  <div>
                    <el-button type="primary" size="small">查看</el-button>
                  </div>

                </div>

              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>

      </el-col>

      <el-col :span="15" class="btns" style="float: left;margin-left: 20px">
        <el-card class="box-card">
          <div class="transport-content">
            <div class="transport-content-title">
              <i class="icon iconfont iconhangye1 transport-content-icon" title="查看" />
              <span>运往现场详情</span>

            </div>
            <div class="transport-content-notice">车辆于2020-12-29 20:04:25 运输抵达终点</div>
            <div class="transport-content-des">车牌号：
              <span class="transport-content-des-blue">鲁F123456</span>
              <el-tag type="warning" class="transport-content-des-tag">已抵达</el-tag>
            </div>
            <div class="transport-content-des">运输路线：
              <span class="transport-content-des-blue">中国山东省烟台市招远市洪甘路锐利信息科技发展公司附近</span>
            </div>
            <div class="transport-content-des">驾驶员：
              <span class="transport-content-des-blue">日驾驶</span>
            </div>
            <div class="transport-content-des">押运员：
              <span class="transport-content-des-blue">日押运</span>
            </div>

          </div>
        </el-card>

      </el-col>
    </el-row>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import CommonSubtitle from '@/components/Subtitle/CommonSubtitle.vue'
import { basicArea, getValidLicence } from '@/api/industry'
import { fetchTimelineList } from '@/api/task'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'TimelineTask',
  components: { Pagination, CommonSubtitle },
  directives: { elDragDialog },
  props: ['activities'],
  data() {
    return {
      reverse: false
    }
  },
  watch: {},
  created() {
    const self = this
    // 获取用户信息
    this.userInfo = JSON.parse(localStorage.getItem('chaos_user_info')).userInfo.value
    //            this.fetchTimelineList()
  },
  methods: {

    /* fetchTimelineList() {
                fetchTimelineList({}).then(res => {
                    console.log(res.data,'res.data');
                    this.activities = res.data.list;
//                    this.showOperateBtn = true;  //测试使用
                });
            },*/

    // 关闭新增电子运单的窗口
    closeAddWayBillDialog() {
      this.$nextTick(() => {
        this.$refs.addWayBill.resetForm('ruleForm')
      })
    }
  }
}
</script>

<style lang="scss" scoped type="text/scss">
    .timeline-content {
        /*text-align: center;*/
    }

    .timeline-content-all {
        display: flex;
        justify-content: flex-start;
        .timeline-content-all-left {
            margin-right: 50px;
        }
        .timeline-content-name{
            font-size: 16px;
            line-height: 25px;
        }
    }

    .timeline-content-des {
        line-height: 25px;
        color: #737373;
    }
    .transport-content-icon{
        color: #0099FF;
        line-height: 40px;
        font-size: 22px;
    }

    //右侧样式
    .transport-content {
        line-height: 28px;
        .transport-content-title {
            font-size: 22px;
            line-height: 40px;
        }
        .transport-content-notice {
            font-size: 16px;
            background-color: #fffbda;
            color: #f76866;
            height: 40px;
            line-height: 40px;
            padding-left: 20px;
            margin-bottom: 5px;
        }
        .transport-content-des {
            line-height: 28px;
            padding-left: 20px;
        }
        .transport-content-des-blue {
            color: #0099FF;
        }
        .transport-content-des-tag {
            padding: 0 5px;
            height: 24px !important;
            line-height: 22px !important;
            margin-left: 15px;
        }

    }
</style>
