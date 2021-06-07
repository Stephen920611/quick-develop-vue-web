<template>
  <div class="app-container">
    <el-container>
      <el-main style="padding: 10px;">
        <el-row>
          <!--<el-col class="left-tree-wrap">
                                  <el-row class="title-wrap text-center">
                                      <span class="font-size-20 font-bold">平台用户列表</span>
                                  </el-row>
                                  &lt;!&ndash;<el-row class="btn-wrap text-center">
                                      <el-button type="primary" size="medium" @click.native="addLevelMenu('root')">添加一级菜单</el-button>
                                      <el-button type="primary" size="medium" @click.native="addLevelMenu('child')">添加下级菜单</el-button>
                                      <el-button type="danger" size="medium" @click.native="deleteMenu">删除</el-button>
                                  </el-row>&ndash;&gt;
                                  <el-row class="tree-wrap" v-scrollBar>
                                      <el-tree
                                              class="filter-tree"
                                              :data="treeData"
                                              :props="defaultProps"
                                              highlight-current
                                              default-expand-all
                                              :expand-on-click-node="false"
                                              @node-click="handleNodeClick"
                                              @node-contextmenu="rightClick"
                                              ref="tree">
                                      </el-tree>
                                      <div v-if="rightMenuShow" id="perTreeMenu" class="tree_menu" :style="{...rightMenu}">
                                          <ul v-for="(menu,index) in rightMenus" :key="index">
                                              <li :id="index" class="menu-li"><i :class="menu.icon"/>{{ menu.name }}</li>
                                          </ul>
                                      </div>
                                  </el-row>
                              </el-col>-->
          <el-col class="right-detail-wrap">
            <el-row class="title-wrap text-left">
              <span class="font-size-20 font-bold">用户详情</span>
            </el-row>
            <el-row class="detail-wrap padding-20">
              <el-form ref="userForm" :inline="true" :model="userForm" class="demo-form-inline">
                <el-form-item label="用户名称:" prop="account">
                  <el-input v-model="userForm.account" placeholder="请输入用户名称" />
                </el-form-item>
                <el-form-item label="真实姓名:" prop="realName">
                  <el-input v-model="userForm.realName" placeholder="请输入真实姓名" />
                </el-form-item>
                <el-form-item label="所属角色:" prop="roleId">
                  <el-select v-model="userForm.roleId" placeholder="请选择所属角色">
                    <el-option
                      v-for="(item,index) in roleList"
                      :key="index"
                      :label="item.roleDes"
                      :value="item.roleId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="状态:" prop="enable">
                  <el-radio-group v-model="userForm.enable">
                    <el-radio label="99">全部</el-radio>
                    <el-radio label="1">启用</el-radio>
                    <el-radio label="0">禁用</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item class="margin-l-20">
                  <el-button type="primary" @click="actionSearchUser">查询</el-button>
                  <el-button type="default" @click="actionResetUser">重置</el-button>
                  <el-button type="primary" @click="actionAddUser">新增</el-button>
                  <el-button type="primary" @click="actionEditUser">编辑</el-button>
                  <el-button type="danger" @click="actionDeleteUser">删除</el-button>
                </el-form-item>
              </el-form>
              <el-table
                v-loading="listLoading"
                :data="userList"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                height="350px"
                @row-click="handleRowClick"
              >
                <el-table-column label="序号" type="index" align="center" width="50">
                  <template slot-scope="row">
                    {{ (listQuery.page - 1) * listQuery.pageSize + row.$index + 1
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="用户名称" header-align="center" align="center" min-width="60">
                  <template slot-scope="{row}">{{ row.account }}</template>
                </el-table-column>
                <el-table-column label="真实名称" header-align="center" align="center" min-width="60">
                  <template slot-scope="{row}">{{ row.realName }}</template>
                </el-table-column>
                <!-- <el-table-column label="身份证号" header-align="center" align="center" min-width="60">
                                                     <template slot-scope="{row}">{{ row.personId }}</template>
                                                 </el-table-column>-->
                <el-table-column label="所属角色" header-align="center" align="center" min-width="60">
                  <template slot-scope="{row}">{{ row.roleSpecialName }}</template>
                </el-table-column>
                <el-table-column label="状态" header-align="center" align="center" min-width="40">
                  <template slot-scope="{row}">{{ row.enable == 1 ? '启用' : '禁用' }}</template>
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
                    >编辑用户角色
                    </el-button>
                    <el-button
                      v-show="row.enable==0"
                      type="primary"
                      size="mini"
                      style="margin-left: 3px"
                      @click="setEnableAction(row)"
                    >启用
                    </el-button>
                    <el-button
                      v-show="row.enable==1"
                      type="danger"
                      size="mini"
                      style="margin-left: 3px"
                      @click="setEnableAction(row)"
                    >禁用
                    </el-button>
                    <el-button
                      type="warning"
                      size="mini"
                      style="width: 70px"
                      @click.native="resetPassword(row)"
                    >重置密码
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页控件 -->
              <div style="text-align: center">
                <pagination
                  v-show="this.userTotal>0"
                  :total="this.userTotal"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.pageSize"
                  class="pagination"
                  :page-sizes="[10]"
                  @pagination="getUserList"
                />
              </div>
            </el-row>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <!--添加用户的dialog-->
    <el-dialog
      v-if="dialogVisible.add"
      v-elDragDialog
      title="添加用户"
      :visible.sync="dialogVisible.add"
      width="35%"
      top="12vh"
    >
      <add-user
        ref="addUser"
        :params="preOrNextNodeParam"
        :tree-node-click-info="treeNodeClickInfo"
        :role-list="roleListNotAll"
        @close="closeAddDialog"
      />
    </el-dialog>
    <!--添加用户的dialog-->
    <el-dialog
      v-if="dialogVisible.edit"
      v-elDragDialog
      title="编辑用户"
      :visible.sync="dialogVisible.edit"
      width="35%"
      top="12vh"
    >
      <edit-user
        ref="editUser"
        :role-list="roleListNotAll"
        :data="currentRow"
        :tree-node-click-info="treeNodeClickInfo"
        @close="closeEditDialog"
      />
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
      <edit-role
        ref="editUser"
        :role-list="roleListNotAll"
        :data="currentRoleRow"
        :tree-node-click-info="treeNodeClickInfo"
        @close="closeEditRole"
      />
    </el-dialog>

  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination'
import addUser from './components/add-user.vue'
import editUser from './components/edit-user.vue'
import editRole from './components/edit-role.vue'
import {
  getAreaTree,
  getNextAreaList,
  getUserListQuery,
  setEnable,
  deleteUser,
  getInfoName,
  resetUserPassword
} from '@/api/userManage'
import { getStorage } from '@/utils/storage'
import { getAllRole } from '@/api/powerManage'

export default {
  name: 'PlatformUserManage',
  directives: { elDragDialog },
  components: { addUser, editUser, editRole, Pagination },
  data() {
    return {
      dialogVisible: {
        add: false, // 显示"添加用户"的dialog
        edit: false, // 显示"编辑用户"的dialog
        editUserRole: false // 显示"编辑用户"的dialog
      },
      treeData: [],
      listLoading: false, // 加载等待
      defaultProps: {
        children: 'children',
        label: 'areaName'
      },
      userInfo: null, // 登录用户的信息
      rightMenuShow: false, // 右键菜单显示，默认隐藏
      rightMenu: {},
      rightMenus: [
        { name: '添加用户', icon: 'icon el-icon-circle-plus-outline' }
      ],
      streetList: [], // 街道列表
      communityList: [], // 社区列表
      preOrNextNodeParam: {}, // 右键选择节点的上下级节点参数对象
      userList: [], // 用户列表
      roleList: [], // 所有的角色列表
      roleHashTable: {},
      roleListNotAll: [], // 不包含全部的用户角色列表，用来编辑和新增使用
      areaList: [], // 所有的区划列表
      userTotal: 0, // 用户列表记录总数
      userForm: {
        account: '',
        realName: '',
        //                    unitDes: '',
        //                    areaId: null,
        roleId: 0,
        enable: '99'
        //                    getChildren: 1,//是否查询下级用户
      },
      listQuery: {
        page: 1,
        pageSize: 10
      },
      currentRow: null, // 当前选中的行
      currentRoleRow: null, // 当前点击编辑用户角色的行
      treeNodeClickInfo: {}// 当前选中的树节点
    }
  },
  mounted() {
    // 用户信息
    //            this.userInfo = JSON.parse(localStorage.getItem('yt_nucleic_user_info')).userInfo.value;
    const userInfo = getStorage('userInfo')
    // 获取区划树结构
    //            this.getAreaTree();
    // 获取用户列表
    // 初次加载获取该用户下的列表
    //            this.userForm.areaId = this.userInfo.roleCode === 3 ? this.userInfo.areaIdLevel3 : this.userInfo.areaIdLevel2;

    // 获取所有的角色
    this.getAllRoleList()
  },
  methods: {
    // 获取用户列表
    getUserList() {
      const params = Object.assign(this.userForm, this.listQuery)
      const obj = {}
      for (const key in params) {
        if (params[key] !== '') {
          obj[key] = params[key]
        }
      }

      const sendParams = {
        ...obj,
        enable: obj['enable'] === '99' ? null : obj['enable'],
        roleId: obj['roleId'] === 0 ? null : obj['roleId']
      }

      getUserListQuery(sendParams).then(res => {
        if (res.code == '2000') {
          this.currentRow = null
          /* res.data.list.map(item => {
                                          //根据账户的id获取返回的名称
                                          getInfoName({id: item.id}).then(json => {
                                              if (json.code == '1000') {
                                                  if (JSON.stringify(json.data) != '' && json.data != null) {
                                                      item.areaLevel2Name = json.data.areaLevel2Name;
                                                      item.areaLevel3Name = json.data.areaLevel3Name;
                                                      item.areaLevel4Name = json.data.areaLevel4Name;
                                                  }
                                              }
                                          });
                                      })*/
          const arr = res.data.list.map(val => {
            let str = ''
            if (val.roleIds) {
              const arr = val.roleIds.split(',')
              // 根据后台返回的数据拼接
              arr.map((item, idx) => {
                str += (idx === arr.length - 1) ? this.roleHashTable[item].roleDes : this.roleHashTable[item].roleDes + '，'
              })
            } else {
              str = '暂无'
            }
            return {
              ...val,
              roleSpecialName: str
            }
          })
          this.userList = arr
          this.userTotal = Number(res.data.total)
        }
      })
    },
    // 获取所有角色
    getAllRoleList() {
      getAllRole().then(res => {
        res.data.map(val => {
          this.roleListNotAll.push(val)
          this.roleList.push(val)
          this.roleHashTable[val.roleId] = val
        })
        this.roleList.unshift({
          'roleId': 0,
          'roleCode': 'all',
          'roleDes': '全部'
        })
        this.userForm.roleId = 0
        this.actionSearchUser()
      })
    },
    // 用户列表查询
    actionSearchUser() {
      this.listQuery.page = 1
      this.getUserList()
    },
    // 用户列表重置
    actionResetUser() {
      /* this.userForm.areaId = this.userInfo.roleCode === 3 ? this.userInfo.areaIdLevel3 : this.userInfo.areaIdLevel2;
                           this.treeNodeClickInfo = {};
                           this.userForm.getChildren = 1;*/
      this.userForm.roleId = 0
      this.$refs['userForm'].resetFields()
      this.actionSearchUser()
    },

    // 用户新增
    actionAddUser() {
      /* if (this.userInfo.roleCode === 1 && this.$lodash.isUndefined(this.treeNodeClickInfo.areaLevel)) {
                    this.$message({message: '请选择树节点！', type: 'warning'})
                    return
                }
                // 区市级，只能添加街道this.treeNodeClickInfo
                if (this.userInfo.roleCode === 2 && this.treeNodeClickInfo.areaLevel !== 3) {
                    this.$message({message: '请选择要添加用户的街道！', type: 'warning'})
                    return
                }
                // 街道级，只能添加社区this.treeNodeClickInfo
                if (this.userInfo.roleCode === 3 && this.treeNodeClickInfo.areaLevel !== 4) {
                    this.$message({message: '请选择要添加用户的村、社区！', type: 'warning'})
                    return
                }*/

      this.dialogVisible.add = true
      //                this.getPreOrNextNodeParam(this.treeNodeClickInfo)
    },
    // 用户编辑
    actionEditUser() {
      if (!this.currentRow) {
        this.$message({ message: '请从列表中选中将要编辑账户的一行', type: 'warning' })
        return
      }
      this.dialogVisible.edit = true
    },
    // 用户删除
    actionDeleteUser() {
      if (!this.currentRow) {
        this.$message({ message: '请从列表中选中将要删除账户的一行', type: 'warning' })
        return
      }
      this.$confirm('确定要删除该账户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({ id: this.currentRow.id }).then(res => {
          if (res.code == '1000') {
            this.$message({ message: '删除成功', type: 'success' })
            this.actionSearchUser() // 刷新列表
          }
        })
      })
    },
    // 选择某一行
    handleRowClick(row, event, column) {
      this.currentRow = row
    },
    // 修改启用禁用
    setEnableAction(data) {
      const isEnableName = (data.enable == 1) ? '禁用' : '启用'
      const isEnable = (data.enable == 1) ? 0 : 1
      this.$confirm('确定要设置为' + isEnableName + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setEnable({ userId: data.userId, enable: isEnable }).then(res => {
          if (res.code == '2000') {
            this.$message({ message: '设置成功', type: 'success' })
            this.actionSearchUser() // 刷新列表
          }
        })
      })
    },
    // 左侧树
    getAreaTree() {
      getAreaTree({ areaIdLevel2: this.userInfo.areaIdLevel2 }).then(res => {
        this.treeData = res.data
        this.areaList = this.treeData[0].children
      })
    },
    // 选择树节点
    handleNodeClick(data, node) {
      // 记录选中的树节点
      this.treeNodeClickInfo = data
      // 关闭右键菜单
      this.rightMenuShow = false
      // 市级用户 1  区市2  街道3

      // 区市/街道 点击烟台市时不做任何处理,不获取节点，不获取列表
      if ((this.userInfo.roleCode === 2 || this.userInfo.roleCode === 3) && data.areaLevel === 1) {
        return
      }

      // 获取到社区节点，社区节点不在获取下级节点
      if (data.areaLevel !== 4) {
        // 获取下级节点
        this.getNextNodeList(data.id, data)
      }

      // 当前登录区市级用户：点击树时，点击烟台市、区市节点，不可触发查询，其余均可。
      if (this.userInfo.roleCode === 2 && data.areaLevel === 2) {
        return
      }
      // 当前登录街道用户： 点击树时，点击烟台市、区市节点、街道节点，不可触发查询，其余均可。
      if (this.userInfo.roleCode === 3 && (data.areaLevel === 2 || data.areaLevel === 3)) {
        return
      }

      // 右边联动显示用户列表
      this.userForm.areaId = data.id
      this.userForm.getChildren = 0
      this.actionSearchUser()
    },
    // 获取下级节点
    getNextNodeList(id, node) {
      // 街道用户：用自己的areaIdLevel3  区市、市级用户：用点击的id
      const params = this.userInfo.roleCode === 3 && node.areaLevel === 2 ? { 'areaId': this.userInfo.areaIdLevel3 } : { 'parentId': id }
      getNextAreaList(params).then(res => {
        const departNodes = []
        res.data.forEach(item => {
          departNodes.push(item)
          // 将街道和社区的数据存入，方便查询
          if (item.areaLevel == 3) {
            const flag = this.isInArray(this.streetList, item.id)
            if (!flag) {
              this.streetList.push(item)
            }
          } else if (item.areaLevel == 4) {
            const flag = this.isInArray(this.communityList, item.id)
            if (!flag) {
              this.communityList.push(item)
            }
          }
        })
        if (!node.children) {
          this.$set(node, 'children', [])
        }
        this.$set(node, 'children', departNodes)
      })
    },
    // 判断元素是否在数组中
    isInArray(arr, value) {
      arr.map(item => {
        if (item.id == value) {
          return true
        }
      })
      return false
    },

    // 右键菜单
    rightClick(e, data, node, comp) {
      const self = this
      // 记录选中的树节点
      this.treeNodeClickInfo = data
      // 市级都可以，区市添加第三级， 街道添加四层账号
      if (this.userInfo.roleCode === 1 || (this.userInfo.roleCode === 2 && data.areaLevel === 3) || (this.userInfo.roleCode === 3 && data.areaLevel === 4)) {
        this.rightMenu = { top: e.pageY + 'px', left: e.pageX + 'px' }
        this.rightMenuShow = true // 显示右键菜单

        document.onclick = function(ev) {
          if (ev.target !== document.getElementById('perTreeMenu')) {
            self.rightMenuShow = false
          }
          if (ev.target.className == 'menu-li') {
            const type = ev.target.id
            self.operateUserAddOrUpdate(type, data)
          }
        }
      }
    },
    // 操作用户的新增/编辑/删除
    operateUserAddOrUpdate(type, data) {
      switch (type) {
        case '0':
          // 新增用户
          this.dialogVisible.add = true
          this.getPreOrNextNodeParam(data)
          break
      }
    },
    // 根据选择的节点获取上下级节点参数对象
    getPreOrNextNodeParam(data) {
      const params = {
        areaId: data.id,
        areaLevel: data.areaLevel,
        areaName: data.areaName
      }
      switch (data.areaLevel) {
        case 2:
          // 说明选择节点时县市区节点
          params.areaIdLevel2 = data.id
          params.areaLevel2Name = data.areaName
          delete params.areaIdLevel3
          delete params.areaIdLevel4
          break
        case 3:
          // 说明选择节点时街道节点
          params.areaIdLevel3 = data.id
          params.areaLevel3Name = data.areaName
          this.areaList.map(item => {
            if (item.id == data.parentId) {
              params.areaIdLevel2 = item.id
              params.areaLevel2Name = item.areaName
            }
          })
          delete params.areaIdLevel4
          break
        case 4:
          // 说明选择节点时社区节点
          params.areaIdLevel4 = data.id
          params.areaLevel4Name = data.areaName
          this.streetList.map(item => {
            if (item.id == data.parentId) {
              // 街道
              params.areaIdLevel3 = item.id
              params.areaLevel3Name = item.areaName
              // 县市区
              this.areaList.map(jtem => {
                if (jtem.id == item.parentId) {
                  params.areaIdLevel2 = jtem.id
                  params.areaLevel2Name = jtem.areaName
                }
              })
            }
          })

          break
      }
      this.preOrNextNodeParam = params
    },
    // 关闭新增窗口
    closeAddDialog(flag) {
      this.dialogVisible.add = flag
      this.actionSearchUser()
    },
    // 关闭编辑窗口
    closeEditDialog(flag) {
      this.dialogVisible.edit = flag
      this.actionSearchUser()
    },

    // 重置密码
    resetPassword(data) {
      this.$confirm(`该操作会对用户密码进行重置，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetUserPassword({ userId: data.userId, changePWType: 'reset' }).then(res => {
          this.$message({
            type: 'success',
            message: '重置密码成功!'
          })
        })
      }).catch(() => {
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
      this.actionSearchUser()
    }

  }

}
</script>

<style lang="scss" scoped>
    .left-tree-wrap {
        height: 750px;
        border: 1px solid #ddd;
        border-radius: 5px 0 0 5px;
        width: 300px;
        min-width: 300px;
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
        width: calc(100% - 10px);
        /*width: calc(100% - 315px);*/
        min-width: 350px;
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
