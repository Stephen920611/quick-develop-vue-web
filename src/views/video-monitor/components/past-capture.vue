<template>
  <div class="past-capture padding-10">
    <el-form ref="form" :inline="true" :model="form" class="search-form">
      <el-form-item label="摄像机名称：" prop="cameraName">
        <el-input v-model="form.cameraName" placeholder="请输入摄像机名称" />
      </el-form-item>
      <el-form-item label="抓拍开始时间" prop="startTime">
        <el-date-picker
          v-model="form.startTime"
          placeholder="请输入抓拍开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :picker-options="timeForm.pickerTimeBeg"
        />
      </el-form-item>
      <el-form-item label="抓拍结束时间" prop="endTime">
        <el-date-picker
          v-model="form.endTime"
          placeholder="请输入抓拍结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :picker-options="timeForm.pickerTimeEnd"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      </el-form-item>
    </el-form>

    <!-- 因为可能不止加载8个，所以要考虑翻页的问题 -->
    <div class="scroll-box">
      <div v-show="total>0" class="grid-2-4">
        <div v-for="(capture, index) in captures" :key="index" class="cell" :class="{'active':isActives.indexOf(capture.id)>-1}" @click="handleSelected(capture.id)">
          <div class="image-container">
            <el-image :lazy="true" :src="capture.imgUrl" alt="抓拍快照" />
            <!--<img :src="capture.imgUrl" alt="抓拍快照"/>-->
          </div>
          <div class="info">抓拍摄像机：{{ capture.cameraName }}</div>
          <div class="info">抓拍时间：{{ capture.captureTime }}</div>
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
        cameraName: '',
        companyId: null,
        userId: null,
        startTime: '',
        endTime: ''
      },
      captures: [], // 列表数据
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
      }

    }
  },
  created() {
    this.userInfo = JSON.parse(localStorage.getItem('chaos_user_info')).userInfo.value
    this.form.userId = this.userInfo.id
    this.form.companyId = this.userInfo.companyId
    this.getList()
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
        }).catch((err) => {})
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

<style lang="scss" scoped>
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
        &.active{
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
    }

    .image-container > img {
        max-width: 100%;
    }

    .pagination {
        text-align: center;
    }
    .no-data{
        color:#fff
    }
</style>
