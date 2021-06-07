<template>
  <div class="video-container">
    <el-row class="video-group">
      <el-col :span="5">
        <el-tabs v-model="activeName" class="tree-tab">
          <el-tab-pane label="视频列表" name="first">
            <div class="tree-list-wrap">
              <el-form ref="treeForm" :model="treeForm" label-width="100px">
                <el-form-item label="资源树列表:">
                  <el-select
                    v-model="treeForm.selectedTreeId"
                    placeholder="请选择资源树"
                    size="small"
                    class="tree-selector"
                    @change="handleChangeSelect"
                  >
                    <el-option
                      v-for="(item,index) in treeForm.treeList"
                      :key="index"
                      :label="item.des"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div class="tree-container" :class="{'tree-container-small':isShowTimeForm}">
              <df-create-tree
                ref="initTree"
                :data="treeData"
                :is-search="true"
                :expanded-keys="expandedKeys"
                :req-search-url="searchCamera"
                req-search-type="post"
                :req-search-param="searchCameraParam"
                :req-next-node-url="queryCamera"
                req-next-node-type="post"
                :req-next-node-param="queryCameraParam"
                @node-click="handleNodeClick"
                @node-depart-click="handleDepartNodeClick"
              />
            </div>
            <el-form
              v-show="isShowTimeForm"
              ref="timeForm"
              :model="timeForm"
              label-width="80px"
              class="time-form"
            >
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="timeForm.startTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  :picker-options="timeForm.pickerTimeBeg"
                />
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="timeForm.endTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  :picker-options="timeForm.pickerTimeEnd"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="queryTimeForm">查询</el-button>
                <el-button type="default" @click="resetTimeForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="预案分组" name="second">
            <el-button
              icon="el-icon-plus"
              style="width: 100%;margin-bottom: 10px;"
              type="primary"
              plain
              @click="addFirstNode=true"
            >创建预案分组
            </el-button>
            <group-tree
              ref="groupTree"
              :data="groupTreeData"
              :is-search="true"
              :expanded-keys="expandedGroupKeys"
              :req-search-url="searchGroupCamera"
              req-search-type="post"
              :req-search-param="searchGroupCameraParam"
              :req-next-node-url="queryGroupCamera"
              req-next-node-type="post"
              :req-next-node-param="queryGroupCameraParam"
              :right-menus="rightMenus"
              @updateRightMenu="updateRightMenu"
              @node-click="handleNodeClick"
              @node-depart-click="handleDepartNodeClick"
              @openDialog="openDialog"
            />
          </el-tab-pane>
          <!--<el-tab-pane label="我的分组" name="third">我的分组</el-tab-pane>-->
        </el-tabs>
      </el-col>
      <el-col :span="19">
        <el-tabs
          v-model="activeVideoName"
          type="border-card"
          class="video-tab"
          @tab-click="refreshTabPauseStyle"
        >
          <el-tab-pane label="实时视频" type="1" name="realPlay">
            <real-play
              ref="realPlay"
              :play-state="playState"
              btn-show="true"
              :win-count="winNum_play"
              :cur-win-count="curWinNum_play"
              :cur-row-cls="curVideoRowCls_play"
              @change-win-num="changeWinNumFunc"
              @change-win-zoom="updateData"
            />
          </el-tab-pane>
          <el-tab-pane label="录像查看" type="2" name="playBack">
            <play-back
              ref="playBack"
              :play-state="playState"
              btn-show="true"
              :win-count="winNum"
              :cur-win-count="curWinNum"
              :cur-row-cls="curVideoRowCls"
              :start-time="startTime"
              :end-time="endTime"
              :hours-per-ruler="hoursPerRuler"
              @change-win-num="changeWinNumFunc"
              @change-win-zoom="updateData"
            />
          </el-tab-pane>
          <!-- 新增历史抓拍 -->
          <el-tab-pane label="历史抓拍" type="3" name="capture">
            <past-capture v-if="activeVideoName=='capture'" />
          </el-tab-pane>
          <!--<el-tab-pane label="车辆运行警告" type="4" name="vehicleOperation">
                        <vehicle-operation-alarm v-if="activeVideoName=='vehicleOperation'" ></vehicle-operation-alarm>
                    </el-tab-pane>-->
          <el-tab-pane label="人员状态告警" type="5" name="personStatus">
            <person-status-alarm v-if="activeVideoName=='personStatus'" />
          </el-tab-pane>
          <el-tab-pane label="身份识别告警" type="6" name="identification">
            <identification-alarm v-if="activeVideoName=='identification'" />
          </el-tab-pane>
          <!--<el-tab-pane label="车辆违章告警" type="7" name="violation">
                        <vehicle-violation-alarm v-if="activeVideoName=='violation'"></vehicle-violation-alarm>
                        &lt;!&ndash;<past-capture v-if="activeVideoName=='capture'"></past-capture>&ndash;&gt;
                    </el-tab-pane>-->

          <!--TODO 演示使用-->
          <!--<el-tab-pane  type="3" name="alarm">
                        <span slot="label">智能告警<el-badge :value="3" class="item"></el-badge></span>
                        <intelligent-alarm></intelligent-alarm>
                    </el-tab-pane>-->
        </el-tabs>
      </el-col>
    </el-row>
    <!--<div class="drawer-wrapper">
            <el-button type="primary" class="drawer-handle" @click="openDrawerDialog">查看信息</el-button>
            <right-drawer :data="drawerTabsData" :maskVisible="maskVisible" :drawerVisible="drawerVisible" @close="closeDrawerDialog"></right-drawer>
        </div>-->
    <right-panel ref="rightPanel">
      <right-drawer ref="rightDrawer" />
    </right-panel>
    <!--添加根节点的dialog-->
    <el-dialog
      v-if="addFirstNode"
      v-elDragDialog
      title="添加根节点"
      :visible.sync="addFirstNode"
      width="25%"
      :close-on-click-modal="false"
      append-to-body
    >
      <root-node @showHiddenAdd="showHiddenAdd" />
    </el-dialog>
    <!--添加下级节点的dialog-->
    <el-dialog
      v-if="addNodeShow"
      v-elDragDialog
      title="添加下级节点"
      :visible.sync="addNodeShow"
      width="480px"
      :close-on-click-modal="false"
      append-to-body
    >
      <add-node
        :current-node="currentNode"
        :root-data="rootData"
        @showHiddenAddNode="showHiddenAddNode"
      />
    </el-dialog>
    <!--编辑节点的dialog-->
    <el-dialog
      v-if="editNode"
      v-elDragDialog
      title="编辑节点"
      :visible.sync="editNode"
      width="480px"
      :close-on-click-modal="false"
      append-to-body
    >
      <edit-node :current-node="currentNode" @showHiddenEdit="showHiddenEdit" />
    </el-dialog>
    <!--添加摄像机dialog-->
    <el-dialog
      v-if="addCameraShow"
      v-elDragDialog
      title="添加摄像机"
      :visible.sync="addCameraShow"
      width="65%"
      :close-on-click-modal="false"
      append-to-body
    >
      <add-camera
        :root-data="rootData"
        :current-node="currentNode"
        @showHiddenAddCamera="showHiddenAddCamera"
      />
    </el-dialog>
    <!--自定义轮巡时间dialog-->
    <el-dialog
      v-if="roundIntervalShow"
      v-elDragDialog
      title="自定义轮巡时间"
      :visible.sync="roundIntervalShow"
      width="480px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="ruleForm" :inline="true" :model="form" :rules="rules" label-width="120px" class="demo-form-inline">
        <el-form-item label="轮巡时间(s):">
          <el-input v-model="form.roundTime" placeholder="请输入轮巡时间" type="number" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="customRoundTime">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
/* 引入组件*/
import realPlay from '@/components/common/realPlay.vue'
import playBack from '@/components/common/playBack.vue'
import rightDrawer from './components/rightDrawer.vue'
import dfCreateTree from '../../components/common/createTree.vue'
import RightPanel from '@/components/RightPanel'
import rootNode from './components/rootNode.vue'
import groupTree from './components/goupTree'
import addNode from './components/addNode'
import editNode from './components/editNode'
import addCamera from './components/addCamera'
import pastCapture from './components/past-capture'
//    import IntelligentAlarm from './components/intelligentAlarm.vue'

import vehicleOperationAlarm from './components/vehicleOperationAlarm.vue'// 车辆运行告警
import personStatusAlarm from './components/personStatusAlarm.vue'// 车辆运行告警
import identificationAlarm from './components/identificationAlarm.vue'// 身份识别告警
import vehicleViolationAlarm from './components/vehicleViolationAlarm.vue'// 车辆违章告警

/* 引入api接口*/
import {
  queryTreeListByRole,
  queryDepartTree,
  queryCamCount,
  queryCameraList,
  checkUserCameraPower,
  listGroupTree,
  delNode,
  delCam
} from '../../api/video'
import { getParamsByCode } from '../../api/public'

/* 引入工具类*/
import passParam from '../../utils/ext.passParam'
import dateTime from '../../utils/ext.dateTime'
import utility from '../../utils/ext.utility'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'VideoMonitorIndex',
  directives: { elDragDialog },
  provide() {
    return {
      'autoOpenRightPanel': this.autoOpenRightPanel
    }
  },
  components: {
    realPlay,
    playBack,
    rightDrawer,
    dfCreateTree,
    RightPanel,
    //            IntelligentAlarm
    rootNode,
    groupTree,
    addNode,
    editNode,
    addCamera,
    // 新增：历史抓拍
    pastCapture,
    // 车辆运行告警
    vehicleOperationAlarm,
    // 人员状态告警
    personStatusAlarm,
    identificationAlarm,
    vehicleViolationAlarm
  },
  data() {
    return {
      treeForm: {
        treeList: [], // 资源树列表
        selectedTreeId: null // 资源树列表默认选中的项（默认为第一项）
      },
      activeName: 'first',
      activeVideoName: 'realPlay',
      treeData: [],
      defaultProps: {
        children: 'nodes',
        label: 'text'
        //                  icon:'icon'
      },
      expandedKeys: [], // 展开树的节点,默认为根节点
      selectedCameraNode: {},
      maskVisible: false, // 右侧抽屉的遮罩层是否显示
      drawerVisible: false, // 右侧抽屉是否显示
      queryCamera: process.env.VUE_APP_BASE_API + '/customCameraTree/list-camera',
      queryCameraParam: { roleId: 1, treeId: null },
      searchCameraParam: { roleId: 1, treeId: null },
      searchCamera: process.env.VUE_APP_BASE_API + '/customCameraTree/camera-search',
      /* queryCamera:this.$api.getApiAddress('/camera/query-camera', 'CESHI_API_HOST'),
                 searchCamera:this.$api.getApiAddress('/camera/query-camera-by-keyword', 'CESHI_API_HOST'),*/
      timeForm: {
        startTime: dateTime.curentDate() + ' 00:00:00',
        endTime: dateTime.curentDate() + ' 23:59:59',
        pickerTimeBeg: { // 限制开始时间
          disabledDate: (time) => {
            if (this.timeForm.endTime != '' && this.timeForm.endTime) {
              const timeStr = new Date(this.timeForm.endTime.replace(/-/g, '/'))
              return time.getTime() > timeStr
            } else {
              return ''
            }
          }
        },
        pickerTimeEnd: { // 限制结束时间
          disabledDate: (time) => {
            if (this.timeForm.startTime != '' && this.timeForm.startTime) {
              const timeStr = new Date(this.timeForm.startTime.replace(/-/g, '/'))
              return time.getTime() < timeStr
            } else {
              return ''
            }
          }
        }
      },
      isShowTimeForm: false, // 是否显示时间查询form表单
      toggleTabCount: 0, // 切换录像回放-tab页面的次数
      playState: 'realPlay',
      /* 默认初始化当天的时间轴*/
      startTime: new Date(dateTime.curentDate() + ' 00:00:00').getTime(),
      endTime: new Date(dateTime.curentDate() + ' 23:59:59').getTime(),
      hoursPerRuler: 24,
      winNum: 4, // 窗口数量，默认为4窗口
      curWinNum: 4, // 当前的窗口数量
      curVideoRowCls: ['two-row'], // 窗口布局样式
      winNum_play: 4, // 窗口数量，默认为4窗口
      curWinNum_play: 4, // 当前的窗口数量
      curVideoRowCls_play: ['two-row'], // 窗口布局样式
      cameraId: '',
      cameraName: '',
      allDepartNodeCodeArray: [], // 所有部门节点的code数组
      userInfo: null, // 存储登录用户信息
      // 预案树
      addFirstNode: false, // 根节点模态框
      groupTreeData: [], // 分组树
      queryGroupCamera: process.env.VUE_APP_BASE_API + '/groupMain/list-node-cam', // 【分组】-节点下摄像机查询
      searchGroupCamera: process.env.VUE_APP_BASE_API + '/groupMain/search-nodes', // 分组搜索
      queryGroupCameraParam: { roleId: 1, id: null },
      searchGroupCameraParam: { roleId: 1, userId: null },
      /*     rightMenus:[{name:'添加',icon:'el-icon-circle-plus-outline'},
                                 {name:'编辑',icon:'el-icon-edit'},
                                 {name:'删除',icon:'el-icon-remove-outline'},
                                 {name:'添加摄像机',icon:'icon iconfont iconshexiangji'}],*/
      rightMenus: [
        { name: '添加摄像机', icon: 'el-icon-circle-plus', id: 1 },
        { name: '删除', icon: 'el-icon-circle-close', id: 2 }
      ],
      addNodeShow: false, // 下级节点模态框
      rootData: null, // 选中添加节点的根节点id
      currentNode: null, // 选中当前节点
      editNode: false, // 编辑节点
      addCameraShow: false,
      roundIntervalShow: false, // 轮巡窗口显示
      expandedGroupKeys: [], // 展开树的节点,默认为根节点
      roundInterval: null, // 轮巡的时间间隔
      nextCamNodeArray: [], // 轮巡分组内的所有摄像机节点
      form: {
        roundTime: '' // 轮巡时间
      }
    }
  },
  computed: {},
  mounted() {
    // 给渲染树传参赋值
    this.userInfo = JSON.parse(localStorage.getItem('chaos_user_info')).userInfo.value
    this.queryCameraParam.roleId = this.userInfo.roleId
    this.searchCameraParam.roleId = this.userInfo.roleId
    this.queryGroupCameraParam.roleId = this.userInfo.roleId
    this.searchGroupCameraParam.roleId = this.userInfo.roleId
    this.searchGroupCameraParam.userId = this.userInfo.id
    this.getTreeListByRole()
    this.getH5ManagerUrl()
    this.getGroupTree()
  },
  methods: {
    /**
             *   打开公共预案的对话框
             *
             */
    openDialog(flag, type, data) {
      this.getParent(data)
      this.currentNode = data
      // 判断是否是该用户添加的预案，如果不是，则无权修改
      if (this.rootData.userId != this.userInfo.id) {
        this.$message({
          showClose: true,
          message: '您没有权限修改该预案',
          type: 'warning'
        })
        return
      }
      switch (type) {
        // type是右击列表的id
        case '1':
          // 判断是不是根节点
          if (this.currentNode.type.indexOf('depart') > -1) {
            this.addCameraShow = flag
          } else {
            this.$message({
              showClose: true,
              message: '请为节点添加摄像机',
              type: 'warning'
            })
          }
          break
        case '2':
          this.deleteGroupNode()
          break
        case '3':
          // 轮巡时间30s
          this.realRoundPlay(this.nextCamNodeArray, 30)
          break
        case '4':
          // 轮巡时间60s
          this.realRoundPlay(this.nextCamNodeArray, 60)
          break
        case '5':
          // 轮巡时间90s
          this.realRoundPlay(this.nextCamNodeArray, 90)
          break
        case '6':
          // 自定义轮巡时间
          this.roundIntervalShow = true
          break
        case '7':
          // 停止轮巡
          this.stopRoundPlay()
          break
      }
    },
    /**
             *   删除节点
             *
             */
    deleteGroupNode() {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 根节点的删除
        if (this.currentNode.type.indexOf('depart') > -1) {
          delNode({ nodeId: this.currentNode.id }).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.getGroupTree()
          }).catch(err => {

          })
        } else {
          // 摄像机的删除
          delCam({ camNodeIdList: this.currentNode.id }).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.getGroupTree()
          }).catch(err => {

          })
        }
      }).catch(() => {

      })
    },
    /**
             *   获取根节点
             *
             */
    getParent(node) {
      let parentNode = null
      // 判断当前节点是否有父节点，并且父节点上的data不能是数组
      if (node.parentCode) {
        // 获取父节点
        parentNode = this.$refs.groupTree.$refs.tree.getNode(node.parentCode)
        // 递归调用 父节点上有父节点
        this.getParent(parentNode.data)
      } else {
        this.rootData = node
      }
    },
    /**
             *   关闭新增摄像机节点界面并刷新？不刷新
             *
             */
    showHiddenAddCamera: function(data, refresh) {
      this.addCameraShow = data
      if (refresh) {
        this.getGroupTree()
      }
    },
    /**
             *   关闭编辑节点界面并刷新？不刷新
             *
             */
    showHiddenEdit: function(data, refresh) {
      this.editNode = data
      if (refresh) {
        this.getGroupTree()
      }
    },
    /**
             *   关闭新增子节点界面并刷新？不刷新
             *
             */
    showHiddenAddNode: function(data, refresh) {
      this.addNodeShow = data
      if (refresh) {
        this.getGroupTree()
      }
    },
    /**
             *   关闭新增根节点界面并刷新？不刷新
             *
             */
    showHiddenAdd: function(data, refresh) {
      this.addFirstNode = data
      if (refresh) {
        this.getGroupTree()
      }
    },
    /**
             *   获取分组树
             *
             */
    getGroupTree: function() {
      this.expandedGroupKeys = []
      listGroupTree({}).then(res => {
        this.groupTreeData = res.data
      }).catch(err => {

      })
    },
    /**
             *   获取资源树列表
             *   params:roleId
             */
    getTreeListByRole() {
      queryTreeListByRole({ roleId: this.userInfo.roleId }).then(res => {
        this.treeForm.treeList = res.data
        if (res.data.length > 0) {
          this.treeForm.selectedTreeId = res.data[0].id
          // 加载对应的资源树
          this.getResourceTree(res.data[0].id)
          // 点击部门加载摄像机和搜索摄像机时，修改传入的参数值
          this.queryCameraParam.treeId = res.data[0].id
          this.searchCameraParam.treeId = res.data[0].id
        }
      }).catch(err => {

      })
    },
    /**
             * select选择框选择值变化时触发
             */
    handleChangeSelect(value) {
      this.queryCameraParam.treeId = value
      this.searchCameraParam.treeId = value
    },

    /**
             *   根据选中的资源树列表项，加载资源树
             *   params:roleId
             */
    getResourceTree(id) {
      queryDepartTree({ roleId: this.userInfo.roleId, treeId: id }).then(res => {
        // this.treeData = res.data;
        if (res.data.length > 0) {
          // 展开根节点
          this.expandedKeys.push(res.data[0].code)
          // 递归查找所有的部门节点
          this.allDepartNodeCodeArray = []
          this.recursiveSearchDepartNode(res.data[0])
          // 查询所有部门对应的摄像机在线数与总数
          this.getCamCount(this.allDepartNodeCodeArray, res.data)
        }
      }).catch(err => {
      })
    },
    /**
             * //递归查找所有的部门节点,返回节点编码数组
             */
    recursiveSearchDepartNode(data) {
      if (data.nodes) {
        data.nodes.map(item => {
          this.allDepartNodeCodeArray.push(item.code)
          this.recursiveSearchDepartNode(item)
        })
      }
    },
    /**
             * //递归给所有的部门节点添加属性tags
             */
    recursiveAddNodeTags(camInfo, data) {
      data.map(item => {
        if (item.nodes) {
          item.nodes.map(ktem => {
            if (ktem.code == camInfo.code) {
              ktem.tags = camInfo.camCount
            }
          })
          this.recursiveAddNodeTags(camInfo, item.nodes)
        }
      })
    },
    /**
             * 查询所有部门对应的摄像机在线数与总数
             */
    getCamCount(departCodeArray, data) {
      const param = {
        roleId: this.userInfo.roleId,
        treeId: this.treeForm.selectedTreeId,
        departCodes: departCodeArray.join(',')
      }
      queryCamCount(param).then(res => {
        if (res.data.camInfo) {
          res.data.camInfo.map(item => {
            this.recursiveAddNodeTags(item, data)
          })
          this.treeData = data
        }
      })
    },
    /**
             *  获取H5地址:存储在缓存中
             */
    getH5ManagerUrl() {
      getParamsByCode({ code: 'h5_manager_ip' }).then(res => {
        if (res.code == 1000) {
          localStorage.setItem('h5_manager_ip', res.data)
        }
      })
    },

    /**
             * 改变录像回放的窗口数量
             * @param winNum
             * @param curWinNum
             * @param curVideoRowCls
             * @param state
             */
    changeWinNumFunc(winNum, curWinNum, curVideoRowCls, state) {
      if (state == 'realPlay') {
        this.winNum_play = winNum
        this.curWinNum_play = curWinNum
        this.curVideoRowCls_play = curVideoRowCls
      } else {
        this.winNum = winNum
        this.curWinNum = curWinNum
        this.curVideoRowCls = curVideoRowCls
      }
    },
    // 双击放大窗口改变参数
    updateData(value1, value2, state) {
      if (state == 'realPlay') {
        this.winNum_play = value1
        this.curVideoRowCls_play = [value2]
      } else {
        this.winNum = value1
        this.curVideoRowCls = [value2]
      }
    },

    // 点击树的部门节点获取摄像机
    handleNodeClick(node) {
      // 先检查用户是否有“视频预览”的权限
      // 1视频预览 2抓拍 3视频录像 4云台控制 5录像查询 6录像下载
      const params = {
        index: 1,
        roleId: this.userInfo.roleId,
        userId: this.userInfo.id,
        camCode: node.code
      }
      checkUserCameraPower(params).then(res => {
        if (res.data) {
          // 用户有权限，进行视频播放
          if (node.type.indexOf('camera') > -1) {
            this.selectedCameraNode = node
            this.cameraId = node.code
            this.cameraName = node.text
            this.$refs.playBack.setCameraId(node)
            if (!this.isShowTimeForm) {
              // 实时视频
              this.$refs.realPlay.playVideoByCameraId(node, '#video-content>li')
            } else {
              // 录像回放
            }
          }
        } else {
          this.$message({ message: '该用户没有对摄像机进行视频播放的权限', type: 'warning' })
        }
      })
    },
    // 点击树的部门节点
    handleDepartNodeClick(node) {
      this.cameraId = ''
      this.cameraName = ''
      console.log(node, 'node111')
      this.nextCamNodeArray = node.nodes
    },

    // 控制右侧抽屉窗口的显示与隐藏
    setRigDrawerShowOrHide(obj) {
      this.maskVisible = obj.maskVisable // 控制遮罩的显示
      this.drawerVisible = obj.drawerVisable // 控制抽屉窗口的显示
    },
    // 打开右侧抽屉窗口
    openDrawerDialog() {
      this.maskVisible = false
      this.drawerVisible = true
    },
    // 关闭右侧抽屉窗口
    closeDrawerDialog() {
      this.maskVisible = false
      this.drawerVisible = false
    },
    // 刷新实时视频/录像回放的tab页，更新的暂停图标的样式
    refreshTabPauseStyle(tab) {
      if (tab.$attrs.type == '1') {
        this.$refs.realPlay.refreshPauseStyle()
        this.isShowTimeForm = false
        this.playState = 'realPlay'
      } else if (tab.$attrs.type == '2') {
        this.$refs.playBack.refreshPauseStyle()
        this.isShowTimeForm = true // 显示时间查询的form表单
        this.playState = 'playBack'

        if (this.toggleTabCount == 0) {
          this.$refs.playBack.initCanvas(new Date(this.timeForm.startTime).getTime(), [], new Date(this.timeForm.endTime).getTime(), 0)
          this.toggleTabCount++
        }
      }
    },
    // 录像回放-查询时间
    queryTimeForm() {
      // 判断是否选中摄像机节点
      if (!this.cameraId) {
        this.$message({ message: '请选中摄像机节点', type: 'warning' })
        return false
      }
      this.startTime = new Date(this.timeForm.startTime).getTime()
      this.endTime = new Date(this.timeForm.endTime).getTime()
      this.hoursPerRuler = dateTime.getSeveralDays(this.timeForm.startTime.substring(0, 10), this.timeForm.endTime.substring(0, 10)) * 24

      // 将时间参数存放到待播放窗口对应的instance对象中
      const dateStart = this.timeForm.startTime.replace(' ', 'T')
      const dateEnd = this.timeForm.endTime.replace(' ', 'T')
      console.log('开始时间和结束时间:' + dateStart + ',' + dateEnd)
      const dateStr = dateStart.split('T')[0]
      // 先检查用户是否有“录像查询”的权限
      // 1视频预览 2抓拍 3视频录像 4云台控制 5录像查询 6录像下载
      const params = {
        index: 5,
        roleId: this.userInfo.roleId,
        userId: this.userInfo.id,
        camCode: this.cameraId
      }
      checkUserCameraPower(params).then(res => {
        if (res.data) {
          // 有查询权限
          this.$refs.playBack.chooseDateAndPlayBack(dateStr + 'T00:00:00', dateStart, dateEnd)
        } else {
          this.$message({ message: '该用户没有对摄像机进行录像查询的权限', type: 'warning' })
        }
      })
    },
    // 录像回放-重置查询时间
    resetTimeForm() {

    },

    // 预案分组--根据右键选中的节点类型判断
    updateRightMenu(type) {
      if (type == 'camera') {
        this.rightMenus = [
          { name: '删除摄像机', icon: 'el-icon-remove-outline', id: 2 }
        ]
      } else if (type == 'depart') {
        this.rightMenus = [
          { name: '添加摄像机', icon: 'el-icon-circle-plus', id: 1 },
          { name: '删除分组', icon: 'el-icon-circle-close', id: 2 },
          { name: '轮巡时间30s', icon: 'el-icon-refresh', id: 3 },
          { name: '轮巡时间60s', icon: 'el-icon-refresh', id: 4 },
          { name: '轮巡时间90s', icon: 'el-icon-refresh', id: 5 },
          { name: '自定义轮巡时间', icon: 'el-icon-refresh', id: 6 },
          { name: '停止轮巡', icon: 'el-icon-refresh', id: 7 }
        ]
      }
    },
    /**
             *  轮巡播放
             * @param cameraArr：摄像机数组
             * @param turningTime：轮巡间隔
             */
    realRoundPlay(cameraArr, turningTime) {
      const cameraAtrr = cameraArr.concat()
      const winNum = this.curWinNum // 播放窗口数量
      const dom = this.$refs.realPlay
      if (this.roundInterval) {
        clearInterval(this.roundInterval)
        dom.closeAllVideo()
      }
      let count = 1
      /* if (self._pauseFlag) {//暂停轮播放后重新启动当前轮巡，播下一组
                    self._pauseFlag = false;
                    cameraAtrr = self.nextArry;
                }*/
      console.log('第1次轮训播放的视频数组', cameraAtrr.slice(0, winNum))
      this.selectPlaying(cameraAtrr.slice(0, winNum))
      dom.playAGroupOfVideo(cameraAtrr.slice(0, winNum), true)
      const cameraArry = cameraAtrr.splice(0, winNum)
      const nextCameraAtrr = cameraAtrr.concat(cameraArry)// 第二次轮巡的点位数组
      // self.nextArry = cameraAtrr;
      this.roundInterval = setInterval(() => {
        count++
        this.realRoundPlay(nextCameraAtrr, turningTime)
      }, turningTime * 1000)
    },
    // 选中轮巡节点
    selectPlaying(arr) {
      // console.log(arr,"arr");
      arr.map(item => {
        this.$refs.groupTree.setCurrSelectedNode(item.code)
      })
    },
    // 停止轮巡
    stopRoundPlay() {
      const dom = this.$refs.realPlay
      if (this.roundInterval) {
        clearInterval(this.roundInterval)
        dom.closeAllVideo()
      }
    },
    // 自定义轮巡时间
    customRoundTime() {
      if (!this.form.roundTime) {
        this.$message({ message: '请输入轮巡时间！', type: 'warning' })
        return
      }
      const camArr = this.nextCamNodeArray
      this.realRoundPlay(camArr, this.nextCamNodeArray, parseInt(this.form.roundTime))
      this.roundIntervalShow = false
    },
    // 自动打开右侧的抽屉
    autoOpenRightPanel() {
      this.$refs.rightPanel.show = true
    }
  }
}
</script>

<style lang="less">
    @import './styles/video-play-manage.less';
</style>
