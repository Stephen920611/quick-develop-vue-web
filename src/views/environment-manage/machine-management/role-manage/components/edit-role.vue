<template>
  <div class="operate-container">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
      <el-form-item label="角色编码：" :label-width="formLabelWidth" prop="username">
        <el-input v-model="ruleForm.roleCode " auto-complete="off" placeholder="请输入角色编码" />
      </el-form-item>
      <el-form-item label="角色名称：" :label-width="formLabelWidth" prop="realName">
        <el-input v-model="ruleForm.roleDes " auto-complete="off" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item class="text-center">
        <el-button type="default" @click="resetForm('ruleForm')">重 置</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">更 新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { updateRolesApi } from '@/api/userManage'

export default {
  name: 'EditRole',
  components: {},
  props: ['roleList', 'data'],
  data() {
    return {
      formLabelWidth: '130px',
      ruleForm: {
        roleId: '',
        roleCode: '',
        roleDes: ''
      },
      rules: {
        roleCode: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ],
        roleDes: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]

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
      for (const key in this.ruleForm) {
        if (value[key]) {
          this.ruleForm[key] = value[key]
        }
      }
    },

    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateRolesApi(this.ruleForm).then(res => {
            this.$message({ message: '更新角色信息成功！', type: 'success' })
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
