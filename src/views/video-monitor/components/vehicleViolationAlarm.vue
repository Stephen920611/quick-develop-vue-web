<template>
  <div class="past-capture padding-10">
    <el-form ref="form" :inline="true" :model="form" class="search-form">
      <el-form-item label="车牌号码：" prop="carNum">
        <el-input v-model="form.carNum" placeholder="请输入车牌号码" />
      </el-form-item>
      <el-form-item label="起始日期" prop="startTime">
        <el-date-picker
          v-model="form.startTime"
          placeholder="请输入起始日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="date"
          :picker-options="timeForm.pickerTimeBeg"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item label="报警类型：" class="form-inline-search-item" style="margin-bottom: 10px">
            <el-checkbox-group v-model="form.alarmType">
              <el-checkbox
                v-for="(item, index) in alarmTypeOptions"
                :key="item.value"
                :label="item.value"
                border
                style="margin-right: 10px;float:left;margin-bottom: 10px"
              >{{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 因为可能不止加载8个，所以要考虑翻页的问题 -->
    <div class="scroll-box">
      <div v-show="total>0" class="grid-2-4">
        <div
          v-for="(capture, index) in captures"
          :key="index"
          class="cell cm-haq-list-item"
          :class="{'active':isActives.indexOf(capture.id)>-1}"
          @click="handleSelected(capture.id)"
        >
          <div class="image-container">
            <!--<img :src="capture.imgUrl" alt="抓拍快照"/>-->
            <img :src="capture.url" alt="抓拍快照">
          </div>
          <div class="info">车牌号码：{{ capture.carNum }}</div>
          <div class="info">报警时间：{{ capture.alarmTime }}</div>

          <ul class="cm-haq-list-item-notice">
            <li style="cursor: pointer;">
              <span>录像回放</span>
            </li>
            <li style="cursor: pointer;">
              <span>车辆信息</span>
            </li>
            <li style="cursor: pointer;">
              <span>运单信息</span>
            </li>
          </ul>
          <div class="cm-haq-list-item-alarm-times ellipsis-l1 text-right">
            <el-tag type="danger">
              {{ capture.alarmName }}
            </el-tag>
          </div>
        </div>
      </div>
      <div v-show="total==0 && isFirst" class="grid-2-4">
        <span class="no-data">暂无数据！</span>
      </div>
    </div>
    <!-- 分页控件 -->
    <div style="text-align: center">
      <pagination
        v-show="total >0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        class="pagination"
        :page-sizes="[8,16,32,64]"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { videoManualCaptureByPage, delVideoManualCapture, getVideoManualCapture } from '@/api/video'

export default {
  name: 'PastCapture',
  components: { Pagination },
  props: [],
  data() {
    return {
      // 对话框显隐
      detailVisible: false,
      // 翻页插件用
      total: 1,
      listQuery: {
        page: 1,
        size: 8
      },
      // 表单数据
      form: {
        carNum: '',
        companyId: null,
        userId: null,
        startTime: '',
        alarmType: []
      },
      captures: [{
        id: 1,
        carNum: '鲁FAQ155',
        alarmTime: '2020-10-22 23:45:18',
        alarmAddress: '莱州市306省道130公里830米',
        alarmName: '不按规定车道行驶',
        url: require('@/assets/image/car/876.jpg')
      }, {
        id: 2,
        carNum: '鲁FQ9034',
        alarmTime: '2020-10-22 23:56:18',
        alarmAddress: '莱州市306省道130公里830米',
        alarmName: '超速行驶',
        url: require('@/assets/image/car/836.jpg')
      }, {
        id: 3,
        carNum: '鲁UT7592',
        alarmTime: '2020-10-22 22:55:56',
        alarmAddress: '莱州市306省道130公里830米',
        alarmName: '违章停车',
        url: require('@/assets/image/car/816.jpg')
      }, {
        id: 4,
        carNum: '鲁ECC15挂',
        alarmTime: '2020-10-22 21:45:18',
        alarmAddress: '莱州市306省道130公里830米',
        alarmName: '违章停车',
        url: require('@/assets/image/car/801.jpg')
      }, {
        id: 5,
        carNum: '鲁FAB076',
        alarmTime: '2020-10-22 22:56:32',
        alarmAddress: '莱州市306省道130公里830米',
        alarmName: '违章停车',
        url: require('@/assets/image/car/774.jpg')
      }, {
        id: 6,
        carNum: '鲁F39346',
        alarmTime: '2020-10-22 23:36:58',
        alarmAddress: '莱州市306省道130公里830米',
        alarmName: '超速行驶',
        url: require('@/assets/image/car/773.jpg')
      }, {
        id: 7,
        carNum: '鲁FAG055',
        alarmTime: '2020-10-22 23:39:18',
        alarmAddress: '莱州市306省道130公里830米',
        alarmName: '超速行驶',
        url: require('@/assets/image/car/523.jpg')
      }, {
        id: 8,
        carNum: '鲁FCC15挂',
        alarmTime: '2020-10-22 23:46:59',
        alarmAddress: '莱州市306省道130公里830米',
        alarmName: '超速行驶',
        url: require('@/assets/image/car/363.jpg')
      }], // 列表数据
      isFirst: true, // 是否是第一次
      userInfo: null,
      isActives: [], // 选中一个数据
      timeForm: {
        pickerTimeBeg: { // 限制开始时间
          disabledDate: (time) => {
            if (this.form.endTime != '' && this.form.endTime) {
              const timeStr = new Date(this.form.endTime.replace(/-/g, '/'))
              return time.getTime() > timeStr
            } else {
              return ''
            }
          }
        },
        pickerTimeEnd: { // 限制结束时间
          disabledDate: (time) => {
            if (this.form.startTime != '' && this.form.startTime) {
              const timeStr = new Date(this.form.startTime.replace(/-/g, '/'))
              return time.getTime() < timeStr
            } else {
              return ''
            }
          }
        }
      },
      // 报警类型
      alarmTypeOptions: [
        {
          label: '违反交通信号指示',
          value: 1
        },
        {
          label: '不按规定车道行驶',
          value: 2
        },
        {
          label: '超速行驶',
          value: 3
        },
        {
          label: '违章停车',
          value: 4
        }
      ]

    }
  },
  created() {
    this.userInfo = JSON.parse(localStorage.getItem('chaos_user_info')).userInfo.value
    this.form.userId = this.userInfo.id
    this.form.companyId = this.userInfo.companyId
    //            this.getList();
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleReset() {
      this.$refs['form'].resetFields()
      this.handleFilter()
    },
    // 选中或取消选中
    handleSelected(index) {
      const i = this.isActives.indexOf(index)
      if (i > -1) {
        this.isActives.splice(i, 1)
      } else {
        this.isActives.push(index)
      }
    },
    handleDelete() {
      if (this.isActives.length == 0) {
        this.$message({
          message: '请选择一条需要删除的数据',
          type: 'warning'
        })
        return
      }
      const obj = {
        id: this.isActives.join(',')
      }
      this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delVideoManualCapture(obj).then(res => {
          this.$message({
            showClose: true,
            message: '删除成功！',
            type: 'success'
          })
          this.getList()
        }).catch((err) => {
        })
      })
    },
    getList() {
      // 获取列表数据
      const param = Object.assign(this.form, this.listQuery)
      videoManualCaptureByPage(param).then(res => {
        if (res.code == 1000) {
          this.captures = res.data.list
          this.total = res.data.total
          this.isFirst = true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped type="text/scss">
    @import "~@/styles/variables.scss";

    .scroll-box {
        height: calc(100vh - 400px);
        overflow: auto;
    }

    /* 2*4的格子 */
    .grid-2-4 {
        width: 100%;
        padding: 10px 0 0 10px;
    }

    .cell {
        padding: 10px;
        border: 1px solid #eee;
        border-radius: 3px;
        display: inline-block;
        float: left;
        width: calc(25% - 20px);
        margin-right: 20px;
        margin-bottom: 20px;
        &.active {
            border: solid 1px #016f9f;
            border-radius: 5px;
        }
    }

    .info {
        font-size: 14px;
        margin: 5px 0;
        color: #333;
    }

    .image-container {
        text-align: center;
        border: 0;
        margin: 0;
        padding: 0;
        overflow: hidden;
        height: 135px;
    }

    .image-container > img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
    }

    .pagination {
        text-align: center;
    }

    .no-data {
        color: #fff
    }

    .cm-haq-list-item-notice {
        li {
            font-size: 14px;
            color: #1890ff;
            float: left;
            margin-right: 15px;
            i {
                cursor: pointer;
            }
        }
    }
    .cm-haq-list-item{
        position: relative;
    }
    .cm-haq-list-item-alarm-times {
        position: absolute;
        right: 10px;
        top: 10px;
        margin-bottom: 3px;
        line-height: 25px;
        height: 25px;
        span {
            /*color: #3B93E5;*/
            /*font-weight: bold;*/
        }
        .el-tag--medium {
            height: 25px;
            line-height: 25px;
        }
        .el-tag {
            border-radius: 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
</style>
