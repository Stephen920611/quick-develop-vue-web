<template>
  <div class="app-container">
    <el-container>
      <el-main style="padding: 10px;">
        <el-row>
          <el-col :span="14">
            <el-table
              v-loading="listLoading"
              :data="list"
              border
              fit
              highlight-current-row
              style="width: 100%;"
              height="550px"
              @row-click="handleRowClick"
            >
              <el-table-column label="序号" type="index" align="center" width="50" />
              <el-table-column label="用户角色" header-align="center" align="center" min-width="80">
                <template slot-scope="{row}">{{ row.roleDes }}</template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column
                label="操作"
                align="center"
                width="350"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="{row}">
                  <el-button
                    type="primary"
                    size="mini"
                    style="width: 70px"
                    @click="setPowerAssign(row.roleId)"
                  >分配权限
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="8" class="right-tree-wrap">
            <div class="rightPanel-items">
              <el-row class="title-wrap">
                <el-col class="padding-lr-20">
                  <span class="font-size-18">设置权限{{ currentRow.text ? '（' + currentRow.text + '）' : '' }}</span>
                </el-col>
              </el-row>
              <el-tree
                ref="tree"
                v-scrollBar
                class="tree-wrap"
                :data="treeData"
                show-checkbox
                node-key="pathId"
                :default-checked-keys="checkedKeys"
                default-expand-all
                :expand-on-click-node="false"
                :props="defaultProps"
              />
              <el-row class="btn-wrap">
                <el-button type="primary" @click="handleCheckAllChange">全选</el-button>
                <el-button type="primary" @click="resetChecked">全不选</el-button>
                <el-button type="primary" :loading="saveLoading" @click="savePower">保存</el-button>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!--右侧抽屉-->
        <!--<div ref="rightPanel" :class="{show:show}" class="rightPanel-container">
                    <div class="rightPanel-background" />
                    <div class="rightPanel">
                        <div class="handle-button" :style="{'top':'300px','background-color':'rgb(24, 144, 255)'}" v-show="show" @click="show=!show">
                            <i :class="show?'el-icon-close':'el-icon-setting'" />
                        </div>
                        <div class="rightPanel-items">
                            <el-row class="title-wrap">
                                <el-col :offset="1">
                                    <span class="font-size-18">设置权限（行业部门管理员）</span>
                                </el-col>
                            </el-row>
                            <el-tree
                                    :data="treeData"
                                    show-checkbox
                                    node-key="id"
                                    :default-checked-keys="checkedKeys"
                                    default-expand-all
                                    :expand-on-click-node="false"
                                    :props="defaultProps">
                            </el-tree>
                        </div>
                    </div>
                </div>-->
      </el-main>
    </el-container>

  </div>
</template>

<script>
import { addClass, removeClass } from '@/utils'
import { getSysPathTree, getRoleList, saveRolePower, getAllRole } from '@/api/powerManage'
import {
  getUserRoles
} from '@/api/userManage'

export default {
  name: 'PowerAssign',
  data() {
    return {
      /* list: [
                    {
                        text: '行业部门',
                        roleCode: 5
                    }, {
                        text: '市扶贫办',
                        roleCode: 3
                    }, {
                        text: '县市区扶贫办',
                        roleCode: 7
                    },
                    {
                        text: '乡镇扶贫办',
                        roleCode: 8
                    }],*/
      list: [], // 列表
      listLoading: false,
      show: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'pathName'
      },
      currentRow: {}, // table表中当前选中行
      checkedKeys: [], // 选中的节点key数组
      saveLoading: false, // 保存全选的等待状态
      parentArr: []// 存储父元素

    }
  },
  mounted() {
    this.getAllRoleList()
    this.getTree()
  },
  methods: {
    // 获取所有角色
    getAllRoleList() {
      getUserRoles().then(res => {
        if (res.code == '2000') {
          this.list = res.data
        }
      })
    },

    // 获取树节点
    getTree() {
      getSysPathTree().then(res => {
        this.treeData = res.data

        this.parentArr = []
        this.checkTreeData(this.treeData)
      })
    },

    // 分配角色的权限
    setPowerAssign(roleId) {
      /* this.show = !this.show;*/
      this.checkedKeys = []
      this.resetChecked() // 清空选中项
      getRoleList({ roleId: roleId }).then(res => {
        if (res.code == 2000) {
          /* res.data.map(item => {
                            this.checkedKeys.push(item.sysPathId);
                        });*/

          res.data.map(item => {
            if (this.$lodash.indexOf(this.parentArr, item.pathId) === -1) {
              this.checkedKeys.push(item.pathId)
            }
          })

          // 勾选树节点
          this.$refs.tree.setCheckedKeys(this.checkedKeys)
        }
      })
    },
    // 将有子元素的父元素放在一个数组中
    checkTreeData(treeData) {
      treeData.map((item) => {
        // 如果树节点有子元素，提出父元素
        if (item.hasOwnProperty('children') && item.children.length > 0) {
          this.parentArr.push(item.pathId)
          this.checkTreeData(item.children)
        }
      })
    },

    // 选中table中的一行
    handleRowClick(row, event, column) {
      this.currentRow = row
    },

    // 全不选
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },

    // 全选
    handleCheckAllChange() {
      this.$refs.tree.setCheckedNodes(this.treeData)
    },

    // 保存
    savePower() {
      if (Object.keys(this.currentRow).length == 0) {
        this.$message({
          message: '请选择一种用户角色，给其分配权限！',
          type: 'warning'
        })
        return
      }
      const power = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
      //                const power = this.$refs.tree.getCheckedKeys();
      const sysPathIdList = []
      power.map(val => {
        sysPathIdList.push({ pathId: val })
      })
      const roleId = this.currentRow.roleId
      this.saveLoading = true
      saveRolePower({ roleId: roleId, paths: sysPathIdList }).then(res => {
        //                saveRolePower({roleId: roleId, paths: JSON.stringify(sysPathIdList)}).then(res => {
        if (res.code == 2000) {
          this.saveLoading = false
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
        }
        setTimeout(() => {
          this.saveLoading = false
        }, 1.5 * 1000)
      }).catch(error => {
        this.saveLoading = false
      })
    }
  }

}
</script>

<style lang="scss" scoped>
    .right-tree-wrap {
        border: 1px solid #dfe6ec;
        margin-left: 30px;
        .tree-wrap {
            height: 650px;
            text-align: center;
            padding: 10px;
        }
        .btn-wrap {
            width: 100%;
            text-align: center;
            padding: 10px 20px;
        }
        .rightPanel-items {
            .title-wrap {
                height: 55px;
                line-height: 55px;
                color: #333;
                border-bottom: 1px solid #ddd;

            }
        }
    }

    /*右侧抽屉样式*/
    .rightPanel-background {
        position: fixed;
        top: 0;
        left: 0;
        opacity: 0;
        transition: opacity .3s cubic-bezier(.7, .3, .1, 1);
        background: rgba(0, 0, 0, .2);
        z-index: -1;
    }

    .rightPanel {
        width: 100%;
        max-width: 300px;
        height: 100vh;
        position: fixed;
        top: 0;
        right: 0;
        box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .05);
        transition: all .25s cubic-bezier(.7, .3, .1, 1);
        transform: translate(100%);
        background: #fff;
        z-index: 40000;
    }

    .show {
        transition: all .3s cubic-bezier(.7, .3, .1, 1);

        .rightPanel-background {
            z-index: 20000;
            opacity: 1;
            width: 100%;
            height: 100%;
        }

        .rightPanel {
            transform: translate(0);
        }
    }

    .handle-button {
        width: 48px;
        height: 48px;
        position: absolute;
        right: 300px;
        text-align: center;
        font-size: 24px;
        border-radius: 6px 0 0 6px !important;
        z-index: 20001;
        pointer-events: auto;
        cursor: pointer;
        color: #fff;
        line-height: 48px;
        i {
            font-size: 24px;
            line-height: 48px;
        }
    }

    /*右侧抽屉样式*/
</style>
