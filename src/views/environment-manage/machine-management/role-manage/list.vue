<template>
  <div class="app-container">
    <el-container>
      <el-main style="padding: 10px;">
        <el-row>
          <el-col class="right-detail-wrap">
            <el-row class="title-wrap text-left">
              <el-col :span="3">
                <span class="font-size-20 font-bold">角色详情</span>
              </el-col>
              <el-col :span="21" class="title-wrap-content">
                <div>
                  <el-button type="primary" @click="actionAddUser">新增角色</el-button>
                </div>
              </el-col>

            </el-row>
            <el-row class="detail-wrap padding-20">

              <el-table
                v-loading="listLoading"
                :data="userList"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                height="480px"
              >
                <el-table-column label="序号" type="index" align="center" width="50">
                  <template slot-scope="row">
                    {{ (listQuery.page - 1) * listQuery.pageSize + row.$index + 1
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="用户角色" header-align="center" align="center" min-width="60">
                  <template slot-scope="{row}">{{ row.roleDes }}</template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column
                  label="操作"
                  align="center"
                  width="300"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="{row}">
                    <el-button
                      type="primary"
                      size="mini"
                      style="width: 100px"
                      @click.native="editUserRoleCode(row)"
                    >编辑角色信息
                    </el-button>
                    <el-button
                      type="danger"
                      size="mini"
                      style="width: 70px"
                      @click.native="deleteRoleCode(row)"
                    >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

            </el-row>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <!--添加用户的dialog-->
    <el-dialog
      v-if="dialogVisible.add"
      v-elDragDialog
      title="新增角色"
      :visible.sync="dialogVisible.add"
      width="35%"
      top="12vh"
    >
      <add-role ref="addRole" @close="closeAddDialog" />
    </el-dialog>

    <!--添加用户的dialog-->
    <el-dialog
      v-if="dialogVisible.editUserRole"
      v-elDragDialog
      title="编辑用户角色"
      :visible.sync="dialogVisible.editUserRole"
      width="35%"
      top="12vh"
    >
      <edit-role ref="editUser" :data="currentRoleRow" @close="closeEditRole" />
    </el-dialog>

  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination'
import addRole from './components/add-role.vue'
import editUser from './components/edit-user.vue'
import editRole from './components/edit-role.vue'
import {
  getAreaTree,
  getNextAreaList,
  getUserRoles,
  setEnable,
  deleteRolesApi,
  getInfoName,
  resetUserPassword
} from '@/api/userManage'
import { getStorage } from '@/utils/storage'
import { getAllRole } from '@/api/powerManage'

export default {
  name: 'PlatformUserManage',
  directives: { elDragDialog },
  components: { addRole, editUser, editRole, Pagination },
  data() {
    return {
      dialogVisible: {
        add: false, // 显示"添加用户"的dialog
        edit: false, // 显示"编辑用户"的dialog
        editUserRole: false // 显示"编辑用户"的dialog
      },
      listLoading: false, // 加载等待
      listQuery: {
        page: 1,
        pageSize: 10
      },
      userInfo: null, // 登录用户的信息

      userList: [], // 用户列表
      currentRoleRow: null // 当前点击编辑用户角色的行
    }
  },
  mounted() {
    // 获取所有的角色
    this.getUserRolesList()
  },
  methods: {
    // 获取用户列表
    getUserRolesList() {
      getUserRoles().then(res => {
        if (res.code == '2000') {
          this.userList = res.data
        }
      })
    },

    // 用户新增
    actionAddUser() {
      this.dialogVisible.add = true
    },

    // 关闭新增窗口
    closeAddDialog(flag) {
      this.dialogVisible.add = flag
      this.getUserRolesList()
    },

    // 删除角色
    deleteRoleCode(data) {
      this.$confirm('确定要删除该角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRolesApi({ roleId: data.roleId }).then(res => {
          if (res.code == '2000') {
            this.$message({ message: '删除角色成功', type: 'success' })
            this.getUserRolesList() // 刷新列表
          }
        })
      })
    },
    // 打开编辑用户角色
    editUserRoleCode(data) {
      this.currentRoleRow = data
      this.dialogVisible.editUserRole = true
    },
    // 关闭编辑角色窗口
    closeEditRole(flag) {
      this.dialogVisible.editUserRole = flag
      this.getUserRolesList()
    }

  }

}
</script>

<style lang="scss" scoped>

    .right-detail-wrap {
        border: 1px solid #ddd;
        border-radius: 0 5px 5px 0;
        width: calc(100% - 10px);
        /*width: calc(100% - 315px);*/
        min-width: 350px;
        margin-left: 15px;
        .title-wrap {
            padding-left: 20px;
            height: 60px;
            line-height: 60px;
            width: 100%;
            border-bottom: 1px solid #ddd;
            .title-wrap-content {
                height: 100%;
                display: flex;
                justify-content: flex-end;
                div {
                    padding-right: 20px;
                }
            }

        }
    }

    .width-40 {
        width: 40%;
    }

    .width-90 {
        width: 90%;
    }

    //右键菜单
    .tree_menu {
        position: fixed;
        display: block;
        z-index: 20000;
        background-color: #fff;
        padding: 5px 0;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

        ul {
            margin: 0;
            padding: 0;
        }
        ul li {
            list-style: none;
            margin: 0;
            padding: 0 15px;
            font-size: 14px;
            line-height: 30px;
            cursor: pointer;
            .icon {
                margin-right: 5px;
            }
        }
        ul li:hover {
            background-color: #ebeef5
        }
    }
</style>
