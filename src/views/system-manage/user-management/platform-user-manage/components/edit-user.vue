<template>
  <div class="operate-container">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
      <el-form-item label="账号名称：" :label-width="formLabelWidth" prop="account" disabled>
        <el-input v-model="ruleForm.account " auto-complete="off" placeholder="请输入账号名称" />
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

      <!--<el-form-item label="分配角色："  :label-width="formLabelWidth" prop="roleCode">
                <el-select v-model="ruleForm.roleCode" multiple placeholder="请选择分配角色" >
                    <el-option :label="item.roleDes" :value="item.roleCode" v-for="(item,index) in roleList" :key="index" ></el-option>
                </el-select>
            </el-form-item>-->
      <!--  <el-form-item label="有效期：" :label-width="formLabelWidth" prop="validityTime">
                  <el-date-picker
                          v-model="ruleForm.validityTime"
                          type="datetime"
                          value-format="yyyy-MM-dd hh:mm:ss"
                          :picker-options="pickerOptions"
                          clearable
                  >
                  </el-date-picker>
              </el-form-item>-->
      <!-- <el-form-item label="Web权限：" :label-width="formLabelWidth" prop="isWebPower">
                 <el-radio-group  v-model="ruleForm.isWebPower">
                     <el-radio label="1">有</el-radio>
                     <el-radio label="0">无</el-radio>
                 </el-radio-group>
             </el-form-item>
             <el-form-item label="App权限：" :label-width="formLabelWidth" prop="isAppPower">
                 <el-radio-group  v-model="ruleForm.isAppPower" :disabled="treeNodeClickInfo.areaLevel === 3">
                     <el-radio label="1">有</el-radio>
                     <el-radio label="0">无</el-radio>
                 </el-radio-group>
             </el-form-item>-->
      <el-form-item class="text-center">
        <el-button type="default" @click="resetForm('ruleForm')">重 置</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">更 新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { saveOrUpdateUser } from '@/api/userManage'

export default {
  name: 'EditUser',
  components: {},
  props: ['roleList', 'data', 'treeNodeClickInfo'],
  data() {
    return {
      formLabelWidth: '130px',
      ruleForm: {
        userId: null,
        account: '',
        realName: '',
        gender: '1',
        //                    personId: '',
        telephone: '',
        unitDes: '',
        roleCode: ''
        //                    isWebPower: '1',
        //                    isAppPower: '0',
        //                    areaIdLevel2:null,
        //                    areaIdLevel3:null,
        //                    areaIdLevel4:null,
        //                    areaId:null,
        //                    areaLevel:null,
        //                    userType:1,
        //                    validityTime:null
      },
      form: {
        areaLevel2Name: '',
        areaLevel3Name: '',
        areaLevel4Name: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '请选择分配角色', trigger: 'blur' }
        ]
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
      for (const key in this.form) {
        if (value[key]) {
          this.form[key] = value[key]
        }
      }
      for (const key in this.ruleForm) {
        if (value[key]) {
          this.ruleForm[key] = value[key]
        }
      }
      this.ruleForm.userId = value.userId
      this.ruleForm.gender = this.ruleForm.gender + ''
      //                this.ruleForm.isWebPower = this.ruleForm.isWebPower + '';
      //                this.ruleForm.isAppPower = this.ruleForm.isAppPower + '';
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveOrUpdateUser(this.ruleForm).then(res => {
            this.$message({ message: '更新用户成功！', type: 'success' })
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
