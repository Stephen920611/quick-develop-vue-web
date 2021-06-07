<template>
  <div class="operate-container">
    <el-form ref="ruleForm" :model="ruleForm">
      <el-form-item label="编辑角色：" :label-width="formLabelWidth" prop="roleCode">
        <el-select v-model="ruleForm.roleIds" multiple placeholder="请选择用户角色">
          <el-option
            v-for="(item,index) in roleList"
            :key="index"
            :label="item.roleDes"
            :value="item.roleId"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="text-center">
        <el-button type="default" @click="resetForm('ruleForm')">重 置</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">更 新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { addUserRoles } from '@/api/userManage'

export default {
  name: 'EditRole',
  components: {},
  props: ['roleList', 'data', 'treeNodeClickInfo'],
  data() {
    return {
      formLabelWidth: '130px',
      ruleForm: {
        id: null,
        roleIds: []
      }
    }
  },
  computed: {
    pickerOptions() {
      return {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  watch: {
    'data': {
      handler(value) {
        this.fillInForm(value)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    // 填充表单信息
    fillInForm(value) {
      if (value.roleIds) {
        const arr = value.roleIds.split(',')
        const roleIds = []
        // 根据后台返回的数据拼接
        arr.map((item, idx) => {
          roleIds.push(item)
        })
        this.ruleForm['roleIds'] = roleIds
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.roleIds.length === 0) {
            this.$message({ message: '请选择用户角色！', type: 'error' })
            return
          }
          // 用户角色
          const roleArr = []
          this.roleList.map(val => {
            // 判断是否存在在用户角色数组里
            if (this.ruleForm.roleIds.indexOf(val.roleId) !== -1) {
              roleArr.push(val)
            }
          })
          const params = {
            roles: roleArr,
            userId: this.data.userId
          }
          addUserRoles(params).then(res => {
            this.$message({ message: '更新用户角色成功！', type: 'success' })
            // 关闭dialog窗口
            this.$emit('close', false)
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
    .operate-container {
        padding: 10px 30px;
    }

    /deep/ .el-form-item {
        margin-bottom: 15px;
    }

    /deep/ .el-select, .el-date-editor {
        width: 100%;
    }

    .text-center {
        margin-top: 10px;
    }
</style>
