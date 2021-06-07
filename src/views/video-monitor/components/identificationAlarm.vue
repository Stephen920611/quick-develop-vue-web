<template>
  <div class="past-capture padding-10">
    <el-form ref="form" :inline="true" :model="form" class="search-form">
      <el-form-item label="起始日期" prop="startTime">
        <el-date-picker
          v-model="form.startTime"
          placeholder="请输入起始日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="date"
          :picker-options="timeForm.pickerTimeBeg"
        />
      </el-form-item>
      <el-form-item label="人员姓名：" prop="carNum">
        <el-input v-model="form.carNum" placeholder="请输入人员姓名" />
      </el-form-item>
      <el-form-item label="身份证号：" prop="carNum">
        <el-input v-model="form.carNum" placeholder="请输入身份证号" />
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
            <div class="image-content">
              <img :src="capture.standard" alt="抓拍快照">
              <div class="cm-haq-list-item-alarm-times ellipsis-l1 text-right">
                <el-tag type="warning" style="border-radius: 2px">
                  证件照
                </el-tag>
              </div>
            </div>
            <div class="similarity-num">
              <div class="similarity-num-content">
                <div>相似度</div>
                <div style="color: red">{{ capture.similarity }}</div>
              </div>
            </div>
            <div class="image-content">
              <img :src="capture.snap" alt="抓拍快照">
              <div class="cm-haq-list-item-alarm-times ellipsis-l1 text-right">
                <el-tag type="warning" style="border-radius: 2px">
                  抓拍照
                </el-tag>
              </div>
            </div>

          </div>
          <div class="info">人员姓名：{{ capture.name }}</div>
          <div class="info">身份证号：{{ capture.personId }}</div>
          <div class="info infoType">
            <el-tag type="danger">
              {{ capture.alarmName }}
            </el-tag>
          </div>

          <ul class="cm-haq-list-item-notice">
            <li style="cursor: pointer;">
              <span>人员档案</span>
            </li>
            <li style="cursor: pointer;">
              <span>加入黑名单</span>
            </li>
          </ul>
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
        name: '李红',
        personId: '371201199901232323',
        alarmName: '人单不符',
        standard: require('@/assets/image/person/11-1.jpg'),
        snap: require('@/assets/image/person/11-2.png'),
        similarity: '35%'
      }, {
        id: 2,
        name: '王建',
        personId: '37010119630179526',
        alarmName: '无从业资格证',
        standard: require('@/assets/image/person/17-1.jpg'),
        snap: require('@/assets/image/person/17-2.png'),
        similarity: '97%'
      }, {
        id: 3,
        name: '张凡',
        personId: '370601199001365896',
        alarmName: '证件逾期',
        standard: require('@/assets/image/person/20-1.jpg'),
        snap: require('@/assets/image/person/20-2.png'),
        similarity: '99%'
      }, {
        id: 4,
        name: '张三',
        personId: '370401198501456921',
        alarmName: '黑名单人员',
        standard: require('@/assets/image/person/23-1.jpg'),
        snap: require('@/assets/image/person/23-2.png'),
        similarity: '98%'
      }, {
        id: 5,
        name: '李贺',
        personId: '371201199901965324',
        alarmName: '接打电话',
        standard: require('@/assets/image/person/34-1.jpg'),
        snap: require('@/assets/image/person/34-2.jpg'),
        similarity: '99%'
      }, {
        id: 6,
        name: '马超',
        personId: '371201199901362596',
        alarmName: '证件逾期',
        standard: require('@/assets/image/person/71-1.jpg'),
        snap: require('@/assets/image/person/71-2.jpeg'),
        similarity: '99%'
      }, {
        id: 7,
        name: '刘玉',
        personId: '370901199901369582',
        alarmName: '证件逾期',
        standard: require('@/assets/image/person/90-1.jpg'),
        snap: require('@/assets/image/person/90-2.jpg'),
        similarity: '99%'
      }, {
        id: 8,
        name: '王敏',
        personId: '371201199901256352',
        alarmName: '证件逾期',
        standard: require('@/assets/image/person/94-1.jpg'),
        snap: require('@/assets/image/person/94-2.jpg'),
        similarity: '99%'
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
          label: '证件逾期',
          value: 1
        },
        {
          label: '人单不符',
          value: 2
        },
        {
          label: '黑名单人员',
          value: 3
        },
        {
          label: '无从业资质',
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
        display: flex;
        justify-content: space-between;
        text-align: center;
        border: 0;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    .similarity-num {
        display: flex;
        align-items: center;
        /*flex-direction: column;*/
        .similarity-num-content {
            div {
                text-align: center;
            }
            div:nth-child(1) {
                font-size: 14px;
            }
            div:nth-child(2) {
                margin-top: 5px;
                font-size: 16px;
            }
        }
    }

    .image-content {
        position: relative;
        max-width: 40%;
        height: 180px;
    }

    .image-content > img {
        width: 100%;
        height: 100%;

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

    .cm-haq-list-item-alarm-times {
        position: absolute;
        right: 0;
        top: 0;
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

    .infoType {
        .el-tag {
            border-radius: 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
</style>
