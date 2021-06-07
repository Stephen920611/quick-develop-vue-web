<template>
  <div class="operate-container">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
      <el-form-item label="账号名称：" :label-width="formLabelWidth" prop="account">
        <el-input v-model="ruleForm.account " auto-complete="off" placeholder="请输入账号名称" />
      </el-form-item>
      <el-form-item label="密码：" :label-width="formLabelWidth" prop="password">
        <el-input v-model="ruleForm.password " show-password auto-complete="off" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="真实姓名：" :label-width="formLabelWidth" prop="realName">
        <el-input v-model="ruleForm.realName " auto-complete="off" placeholder="请输入真实姓名" />
      </el-form-item>

      <el-form-item label="性别：" :label-width="formLabelWidth" prop="gender">
        <el-radio-group v-model="ruleForm.gender">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="联系方式：" :label-width="formLabelWidth" prop="telephone">
        <el-input v-model="ruleForm.telephone" auto-complete="off" placeholder="请输入联系方式" />
      </el-form-item>
      <!--  <el-form-item label="分配角色：" :label-width="formLabelWidth" prop="roleCode">
                <el-select v-model="ruleForm.roleCode" placeholder="请选择分配角色" disabled>
                    <el-option
                            v-for="(item,index) in roleList"
                            :label="item.roleDes"
                            :value="item.roleCode"
                    />
                </el-select>
            </el-form-item>-->

      <el-form-item class="text-center">
        <el-button type="default" @click="resetForm('ruleForm')">重 置</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">添 加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { addUser } from '@/api/userManage'

export default {
  name: 'AddUser',
  components: {},
  props: ['params', 'roleList', 'treeNodeClickInfo'],
  data() {
    return {
      formLabelWidth: '130px',
      ruleForm: {
        account: '',
        realName: '',
        password: '',
        gender: '1',
        telephone: ''
      },

      rules: {
        account: [
          { required: true, message: '请输入账号名称', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        /* personId: [
                                    { required: true, message: '请输入身份证号', trigger: 'blur' }
                                ],*/
        /* telephone: [
                                    {required: true, message: '请输入联系方式', trigger: 'blur'}
                                ],*/
        roleCode: [
          { required: true, message: '请选择分配角色', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
  },
  watch: {},
  mounted() {
  },
  methods: {

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addUser(this.ruleForm).then(res => {
            this.$message({ message: '添加用户成功！', type: 'success' })
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
</style>
