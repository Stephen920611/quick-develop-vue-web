<template>
  <div class="app-container">
    <el-container>
      <el-main style="padding: 10px;">
        <el-row>
          <el-col class="left-tree-wrap">
            <el-row class="title-wrap text-center">
              <span class="font-size-20 font-bold">菜单列表</span>
            </el-row>
            <el-row class="btn-wrap text-center">
              <el-button type="primary" size="medium" @click.native="addLevelMenu('root')">添加一级菜单
              </el-button>
              <el-button type="primary" size="medium" @click.native="addLevelMenu('child')">添加下级菜单
              </el-button>
              <el-button type="danger" size="medium" @click.native="deleteMenu">删除</el-button>
            </el-row>
            <el-row v-scrollBar class="tree-wrap">
              <el-tree
                ref="tree"
                class="filter-tree"
                :data="treeData"
                :props="defaultProps"
                highlight-current
                default-expand-all
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
              />
            </el-row>
          </el-col>
          <el-col class="right-detail-wrap">
            <el-row class="title-wrap text-left">
              <span class="font-size-20 font-bold">菜单详情</span>
            </el-row>
            <el-row class="detail-wrap padding-20">
              <el-form
                ref="ruleForm"
                :model="ruleForm"
                :rules="addRules"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="菜单名称：" class="width-40" prop="pathName">
                  <el-input v-model="ruleForm.pathName" type="text" auto-complete="off" />
                </el-form-item>
                <el-form-item label="菜单路径：" class="width-40" prop="path">
                  <el-input v-model="ruleForm.path" type="text" auto-complete="off" />
                </el-form-item>
                <el-form-item label="排序：" class="width-40" prop="displayOrder">
                  <el-input v-model.number="ruleForm.displayOrder" />
                </el-form-item>
                <el-form-item label="级别：" class="width-40">
                  <el-input v-model.number="ruleForm.pathLevel" disabled />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm','rule')">保 存</el-button>
                  <el-button @click="resetForm('ruleForm')">重 置</el-button>
                </el-form-item>
              </el-form>
            </el-row>
          </el-col>
        </el-row>
      </el-main>

    </el-container>

    <!--添加一级菜单的dialog-->
    <el-dialog v-elDragDialog title="添加一级菜单" :visible.sync="dialogAddVisible.root" width="25%">
      <el-form ref="addRootForm" :model="addRootForm" :rules="addRules">
        <el-form-item label="菜单名称：" :label-width="formLabelWidth" class="width-90" prop="pathName">
          <el-input v-model="addRootForm.pathName" auto-complete="off" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单路径：" :label-width="formLabelWidth" class="width-90" prop="path">
          <el-input v-model="addRootForm.path" auto-complete="off" placeholder="请输入菜单路径" />
        </el-form-item>
        <el-form-item label="排序：" :label-width="formLabelWidth" class="width-90" prop="displayOrder">
          <el-input
            v-model="addRootForm.displayOrder"
            auto-complete="off"
            placeholder="请输入排序号"
            type="number"
            min="0"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addRootForm')">重 置</el-button>
        <el-button type="primary" :disabled="addDisable.root" @click="submitForm('addRootForm','root')">确 定
        </el-button>
      </div>
    </el-dialog>

    <!--添加下级菜单的dialog-->
    <el-dialog v-elDragDialog title="添加下级菜单" :visible.sync="dialogAddVisible.child" width="25%">
      <el-form ref="addChildForm" :model="addChildForm" :rules="addRules">
        <el-form-item label="本级节点名称：" :label-width="formLabelWidth" class="width-90" prop="parentName">
          <el-input v-model="addChildForm.parentName" auto-complete="off" disabled />
        </el-form-item>
        <el-form-item label="菜单名称：" :label-width="formLabelWidth" class="width-90" prop="pathName">
          <el-input v-model="addChildForm.pathName" auto-complete="off" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单路径：" :label-width="formLabelWidth" class="width-90" prop="path">
          <el-input v-model="addChildForm.path" auto-complete="off" placeholder="请输入菜单路径" />
        </el-form-item>
        <el-form-item label="排序：" :label-width="formLabelWidth" class="width-90" prop="displayOrder">
          <el-input
            v-model="addChildForm.displayOrder"
            auto-complete="off"
            placeholder="请输入排序号"
            type="number"
            min="0"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addChildForm')">重 置</el-button>
        <el-button type="primary" :disabled="addDisable.child" @click="submitForm('addChildForm','child')">确 定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import {
  getSysPathTree,
  getSysPathDetail,
  saveSysPath,
  updateSysPath,
  deleteSysPath,
  fetchPathRoles,
  getRoleList
} from '@/api/powerManage'

export default {
  name: 'MenuManage',
  directives: { elDragDialog },
  data() {
    return {
      dialogAddVisible: {
        root: false, // 显示"添加一级菜单"的dialog
        child: false // 显示"添加下级菜单"的dialog
      },
      addDisable: {
        root: false, // "添加一级菜单"的按钮的禁用状态
        child: false // "添加下级菜单"的按钮的禁用状态
      },
      formLabelWidth: '120px',
      ruleForm: {
        pathId: null,
        pathName: '',
        path: '',
        displayOrder: null,
        pathLevel: null,
        parentId: null,
        parentName: '',
        sysType: 3
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'pathName'
      },
      addRootForm: {
        pathName: '',
        path: '',
        displayOrder: null,
        pathLevel: 1,
        parentId: 0,
        sysType: 3
      },
      addChildForm: {
        pathName: '',
        path: '',
        displayOrder: null,
        pathLevel: null,
        parentId: null,
        parentName: '',
        sysType: 3
      },
      addRules: {
        pathName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' }
        ],
        displayOrder: [
          { required: true, message: '请输入排序号', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '请输入父节点名称', trigger: 'blur' }
        ]
      },
      selectTreeNode: null
    }
  },
  watch: {
    // 监听dialog是否打开，打开时重置表单
    'dialogAddVisible.root': {
      handler(value) {
        if (value) {
          this.$nextTick(() => {
            this.resetForm('addRootForm')
          })
        }
      }
    },
    'dialogAddVisible.child': {
      handler(value) {
        if (value) {
          this.$nextTick(() => {
            this.resetForm('addChildForm')
            this.addChildForm.parentName = this.selectTreeNode.pathName
            this.addChildForm.parentId = this.selectTreeNode.pathId
          })
        }
      }
    }
  },
  mounted() {
    // 获取菜单树结构
    this.getTree()
  },
  methods: {
    getTree() {
      getSysPathTree().then(res => {
        this.treeData = res.data
        this.selectTreeNode = null
      })
    },
    submitForm(formName, role) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (valid) {
            this.addDisable[role] = true
            let params = {}
            let text = ''
            if (role == 'root') {
              params = this.addRootForm
              text = '新增'
            } else if (role == 'child') {
              params = this.addChildForm
              text = '新增'
            } else {
              params = this.ruleForm
              text = '编辑'
              if (!this.selectTreeNode) {
                this.$message({
                  message: '请选择树节点！',
                  type: 'warning'
                })
                return
              }
            }
            if (text === '新增') {
              // 新增或者编辑节点
              saveSysPath(params).then(res => {
                this.addDisable[role] = false
                this.dialogAddVisible[role] = false
                // 刷新树
                this.getTree()
                this.$message({
                  type: 'success',
                  message: `${text}成功!`
                })
                setTimeout(() => {
                  this.addDisable[role] = false
                }, 1.5 * 1000)
              }).catch(err => {
                this.addDisable[role] = false
              })
            } else {
              // 新增或者编辑节点
              updateSysPath(params).then(res => {
                this.addDisable[role] = false
                this.dialogAddVisible[role] = false
                // 刷新树
                this.getTree()
                this.$message({
                  type: 'success',
                  message: `${text}成功!`
                })
                setTimeout(() => {
                  this.addDisable[role] = false
                }, 1.5 * 1000)
              }).catch(err => {
                this.addDisable[role] = false
              })
            }
          } else {
            return false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 选择树节点
    handleNodeClick(data, node) {
      // 获取节点的详细信息
      getSysPathDetail({ pathId: data.pathId }).then(res => {
        if (res.code == 2000) {
          this.selectTreeNode = res.data
          // 填充到添加下级菜单表单中
          this.addChildForm.parentName = res.data.pathName
          this.addChildForm.parentId = res.data.pathId
          this.addChildForm.pathLevel = node.level
          // 菜单详情
          this.ruleForm.pathId = res.data.pathId
          this.ruleForm.pathName = res.data.pathName
          this.ruleForm.path = res.data.path
          this.ruleForm.pathLevel = node.level
          this.ruleForm.displayOrder = res.data.displayOrder
          this.ruleForm.parentId = res.data.parentId
        }
      })
    },
    // 添加一级或者下级菜单
    addLevelMenu(role) {
      if (role == 'child' && !this.selectTreeNode) {
        this.$message({
          message: '请选择树节点！',
          type: 'warning'
        })
        return
      }
      this.dialogAddVisible[role] = true
    },
    // 删除菜单
    deleteMenu() {
      if (!this.selectTreeNode) {
        this.$message({
          message: '请选择树节点！',
          type: 'warning'
        })
        return
      }

      // 先判断是否该菜单是否已经被分配权限，进行提示
      fetchPathRoles({ pathId: this.selectTreeNode.pathId }).then(res => {
        let str = ''
        res.data.map((val, idx) => {
          str += (idx !== res.data.length - 1) ? val.roleDes + ',' : val.roleDes
        })
        this.$confirm(str === '' ? `该菜单没有分配给任何角色，确定要删除该菜单吗？` : `该菜单已经分配给"${str}"角色，确定要删除该菜单吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSysPath({ pathId: this.selectTreeNode.pathId }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 刷新列表
            this.getTree()
          })
        }).catch(() => {
        })
      })
    }
  }

}
</script>

<style lang="scss" scoped>
    .left-tree-wrap {
        height: 750px;
        border: 1px solid #ddd;
        border-radius: 5px 0 0 5px;
        width: 400px;
        min-width: 400px;
        .title-wrap {
            height: 40px;
            line-height: 40px;
            width: 100%;
            border-bottom: 1px solid #ddd;
        }
        .btn-wrap {
            height: 60px;
            line-height: 60px;
            width: 100%;
            border-bottom: 1px solid #ddd;
        }
        .tree-wrap {
            padding: 10px 20px;
            height: calc(100% - 100px);
            /deep/ .el-tree-node__label {
                font-size: 14px;
            }
        }
    }

    .right-detail-wrap {
        border: 1px solid #ddd;
        border-radius: 0 5px 5px 0;
        width: calc(100% - 450px);
        min-width: 400px;
        margin-left: 15px;
        .title-wrap {
            padding-left: 20px;
            height: 40px;
            line-height: 40px;
            width: 100%;
            border-bottom: 1px solid #ddd;
        }
    }

    .width-40 {
        width: 40%;
    }

    .width-90 {
        width: 90%;
    }
</style>
