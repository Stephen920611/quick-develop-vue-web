<template>
  <div class="app-container">
    <el-container>
      <el-main style="padding: 10px;">
        <el-row>
          <el-col class="left-tree-wrap">
            <el-row class="title-wrap text-center">
              <span class="font-size-20 font-bold">平台用户列表</span>
            </el-row>
            <!--<el-row class="btn-wrap text-center">
                            <el-button type="primary" size="medium" @click.native="addLevelMenu('root')">添加一级菜单</el-button>
                            <el-button type="primary" size="medium" @click.native="addLevelMenu('child')">添加下级菜单</el-button>
                            <el-button type="danger" size="medium" @click.native="deleteMenu">删除</el-button>
                        </el-row>-->
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
                @node-contextmenu="rightClick"
              />
              <div v-if="rightMenuShow" id="perTreeMenu" class="tree_menu" :style="{...rightMenu}">
                <ul v-for="(menu,index) in rightMenus" :key="index">
                  <li :id="index" class="menu-li"><i :class="menu.icon" />{{ menu.name }}</li>
                </ul>
              </div>
            </el-row>
          </el-col>
          <el-col class="right-detail-wrap">
            <el-row class="title-wrap text-left">
              <span class="font-size-20 font-bold">用户详情</span>
            </el-row>
            <el-row class="detail-wrap padding-20">
              <el-form ref="userForm" :inline="true" :model="userForm" class="demo-form-inline">
                <el-form-item label="用户名称" prop="username">
                  <el-input v-model="userForm.username" placeholder="请输入用户名称" />
                </el-form-item>
                <el-form-item label="真实姓名" prop="realName">
                  <el-input v-model="userForm.realName" placeholder="请输入真实姓名" />
                </el-form-item>
                <el-form-item label="工作单位" prop="unitDes">
                  <el-input v-model="userForm.unitDes" placeholder="请输入工作单位" />
                </el-form-item>
                <el-form-item label="所属角色" prop="roleCode">
                  <el-select v-model="userForm.roleCode" placeholder="请选择所属角色">
                    <el-option v-for="(item,index) in roleList" :key="index" :label="item.roleDes" :value="item.roleCode" />
                  </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="isEnable">
                  <el-radio-group v-model="userForm.isEnable">
                    <el-radio label="">全部</el-radio>
                    <el-radio label="1">启用</el-radio>
                    <el-radio label="0">禁用</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item class="margin-l-20">
                  <el-button type="primary" @click="actionSearchUser">查询</el-button>
                  <el-button type="default" @click="actionResetUser">重置</el-button>
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
                height="550px"
                @row-click="handleRowClick"
              >
                <el-table-column label="序号" type="index" align="center" width="50">
                  <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}</template>
                </el-table-column>
                <el-table-column label="用户名称" header-align="center" align="center" min-width="60">
                  <template slot-scope="{row}">{{ row.username }}</template>
                </el-table-column>
                <el-table-column label="真实名称" header-align="center" align="center" min-width="60">
                  <template slot-scope="{row}">{{ row.realName }}</template>
                </el-table-column>
                <el-table-column label="身份证号" header-align="center" align="center" min-width="60">
                  <template slot-scope="{row}">{{ row.personId }}</template>
                </el-table-column>
                <el-table-column label="所属角色" header-align="center" align="center" min-width="60">
                  <template slot-scope="{row}">{{ row.roleDes }}</template>
                </el-table-column>
                <el-table-column label="所属区市" header-align="center" align="center" min-width="60">
                  <template slot-scope="{row}">{{ row.areaLevel2Name }}</template>
                </el-table-column>
                <el-table-column label="所属街道" header-align="center" align="center" min-width="60">
                  <template slot-scope="{row}">{{ row.areaLevel3Name }}</template>
                </el-table-column>
                <el-table-column label="所属社区" header-align="center" align="center" min-width="60">
                  <template slot-scope="{row}">{{ row.areaLevel4Name }}</template>
                </el-table-column>
                <el-table-column label="状态" header-align="center" align="center" min-width="40">
                  <template slot-scope="{row}">{{ row.isEnable==1?'启用':'禁用' }}</template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column
                  label="操作"
                  align="center"
                  width="200"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="{row}">
                    <el-button v-show="row.isEnable==0" type="primary" size="mini" style="margin-left: 3px" @click="setEnableAction(row)">启用</el-button>
                    <el-button v-show="row.isEnable==1" type="danger" size="mini" style="margin-left: 3px" @click="setEnableAction(row)">禁用</el-button>
                    <el-button type="warning" size="mini" style="width: 70px" @click.native="resetPassword(row)">重置密码</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页控件 -->
              <div style="text-align: center">
                <pagination
                  v-show="this.userTotal>0"
                  :total="this.userTotal"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.size"
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
    <el-dialog v-if="dialogVisible.add" v-elDragDialog title="添加用户" :visible.sync="dialogVisible.add" width="35%" top="12vh">
      <add-user ref="addUser" :params="preOrNextNodeParam" :role-list="roleList" @close="closeAddDialog" />
    </el-dialog>
    <!--添加用户的dialog-->
    <el-dialog v-if="dialogVisible.edit" v-elDragDialog title="编辑用户" :visible.sync="dialogVisible.edit" width="35%" top="12vh">
      <edit-user ref="editUser" :role-list="roleList" :data="currentRow" @close="closeEditDialog" />
    </el-dialog>

  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination'
import addUser from './components/add-user.vue'
import editUser from './components/edit-user.vue'
import { getAreaTree, getNextAreaList, getUserListQuery, setEnable, deleteUser, getInfoName, resetUserPassword } from '@/api/userManage'
import { getAllRole } from '@/api/powerManage'
export default {
  name: 'PlatformUserManage',
  directives: { elDragDialog },
  components: { addUser, editUser, Pagination },
  data() {
    return {
      dialogVisible: {
        add: false, // 显示"添加用户"的dialog
        edit: false // 显示"编辑用户"的dialog
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
      areaList: [], // 所有的区划列表
      userTotal: 0, // 用户列表记录总数
      userForm: {
        username: '',
        realName: '',
        unitDes: '',
        areaId: null,
        roleCode: '',
        isEnable: ''
      },
      listQuery: {
        page: 1,
        size: 10
      },
      currentRow: null // 当前选中的行
    }
  },
  mounted() {
    // 用户信息
    this.userInfo = JSON.parse(localStorage.getItem('yt_nucleic_user_info')).userInfo.value
    // 获取区划树结构
    this.getAreaTree()
    // 获取用户列表
    this.getUserList()
    // 获取所有的角色
    this.getAllRoleList()
  },
  methods: {
    getUserList() {
      const params = Object.assign(this.userForm, this.listQuery)
      const obj = {}
      for (const key in params) {
        if (params[key] != '' && params[key] != null) {
          obj[key] = params[key]
        }
      }
      obj.userType = 1
      getUserListQuery(obj).then(res => {
        if (res.code == '1000') {
          /* res.data.list.map(item=>{
                            console.log(222);
                            this.areaList.map(mtem=>{
                                if(item.areaIdLevel2 && mtem.id == item.areaIdLevel2){
                                    item.areaLevel2Name = mtem.areaName;
                                }
                            })
                            this.streetList.map(ntem=>{
                                if(item.areaIdLevel3 && ntem.id == item.areaIdLevel3){
                                    item.areaLevel3Name = ntem.areaName;
                                }
                            })
                            this.communityList.map(ktem=>{
                                if(item.areaIdLevel4 && ktem.id == item.areaIdLevel4){
                                    item.areaLevel4Name = ktem.areaName;
                                }
                            })
                        })*/
          this.currentRow = null
          res.data.list.map(item => {
            // 根据账户的id获取返回的名称
            getInfoName({ id: item.id }).then(json => {
              if (json.code == '1000') {
                if (JSON.stringify(json.data) != '' && json.data != null) {
                  item.areaLevel2Name = json.data.areaLevel2Name
                  item.areaLevel3Name = json.data.areaLevel3Name
                  item.areaLevel4Name = json.data.areaLevel4Name
                }
              }
            })
          })
          this.userList = res.data.list
          this.userTotal = res.data.total
        }
      })
    },
    // 获取所有角色
    getAllRoleList() {
      getAllRole().then(res => {
        if (res.code == '1000') {
          this.roleList = res.data
        }
      })
    },
    // 用户列表查询
    actionSearchUser() {
      this.listQuery.page = 1
      this.getUserList()
    },
    // 用户列表重置
    actionResetUser() {
      this.userForm.areaId = null
      this.$refs['userForm'].resetFields()
      this.actionSearchUser()
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
      const isEnableName = (data.isEnable == 1) ? '禁用' : '启用'
      const isEnable = (data.isEnable == 1) ? 0 : 1
      this.$confirm('确定要设置为' + isEnableName + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setEnable({ id: data.id, isEnable: isEnable }).then(res => {
          if (res.code == '1000') {
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
      //                console.log('handleNodeClick',data);
      // 关闭右键菜单
      this.rightMenuShow = false
      // 右边联动显示用户列表
      this.userForm.areaId = data.id
      this.actionSearchUser()
      // 获取下级节点
      if (data.areaLevel == 4) {
        // 社区节点
        return
      }
      this.getNextNodeList(data.id, data)
    },
    getNextNodeList(id, node) {
      getNextAreaList({
        parentId: id
      }).then(res => {
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
        resetUserPassword({ id: data.id }).then(res => {
          this.$message({
            type: 'success',
            message: '重置密码成功!'
          })
        })
      }).catch(() => {})
    }

  }

}
</script>

<style lang="scss" scoped>
    .left-tree-wrap{
        height: 750px;
        border: 1px solid #ddd;
        border-radius: 5px 0 0 5px;
        width: 300px;
        min-width: 300px;
        .title-wrap{
            height: 40px;
            line-height: 40px;
            width: 100%;
            border-bottom: 1px solid #ddd;
        }
        .btn-wrap{
            height: 60px;
            line-height: 60px;
            width: 100%;
            border-bottom: 1px solid #ddd;
        }
        .tree-wrap{
            padding: 10px 20px;
            height: calc(100% - 100px);
            /deep/ .el-tree-node__label{
                font-size: 14px;
            }
        }
    }
    .right-detail-wrap{
        border: 1px solid #ddd;
        border-radius: 0 5px 5px 0;
        width: calc(100% - 315px);
        min-width: 350px;
        margin-left: 15px;
        .title-wrap{
            padding-left: 20px;
            height: 40px;
            line-height: 40px;
            width: 100%;
            border-bottom: 1px solid #ddd;
        }
    }
    .width-40{
        width: 40%;
    }
    .width-90{
        width: 90%;
    }

    //右键菜单
    .tree_menu{
        position: fixed;
        display: block;
        z-index: 20000;
        background-color: #fff;
        padding:5px 0;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        box-shadow:0 2px 12px 0 rgba(0,0,0,.1);

        ul{
            margin:0;
            padding:0;
        }
        ul li{
            list-style: none;
            margin:0;
            padding:0 15px;
            font-size: 14px;
            line-height: 30px;
            cursor: pointer;
            .icon{
                margin-right: 5px;
            }
        }
        ul li:hover{
            background-color: #ebeef5
        }
    }
</style>
