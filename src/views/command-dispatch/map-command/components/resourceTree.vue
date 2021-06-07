<template>
    <div class="container">
        <div class="tree-list-wrap">
            <el-form ref="treeForm" label-width="100px">
                <el-form-item label="资源树列表:">
                    <el-select v-model="selectedTreeId" placeholder="请选择资源树" size="small"
                               @change="handleChangeSelect" class="tree-selector">
                        <el-option v-for="(item,index) in treeList" :key="index"
                                   :label="item.des" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="tree-container" v-scrollBar>
            <!--<region-tree :data="treeData" :loading="treeLoading" ref="regionTree" @node-click="handleNodeClick" :showSearch="true"></region-tree>-->
            <df-create-tree
                    ref="initTree"
                    :data="treeData"
                    :isSearch="true"
                    :expandedKeys="expandedKeys"
                    :reqSearchUrl="searchCamera"
                    reqSearchType="post"
                    :reqSearchParam="searchCameraParam"
                    :reqNextNodeUrl="queryCamera"
                    reqNextNodeType="post"
                    :reqNextNodeParam="queryCameraParam"
                    @node-click="handleNodeClick"
                    @node-depart-click="handleDepartNodeClick"
                    @node-expand="handleNodeExpand"
                    @node-collapse="handleNodeCollapse"
            >
            </df-create-tree>
        </div>
    </div>
</template>

<script>
//    import regionTree from '@/components/common/regionTree.vue'
    import dfCreateTree from '@/components/common/createTree.vue'

    import {getResourceTreeList,getOrganList,getOrgCamCount} from '@/api/map/map'
    export default {
        name: "resourceTree",
        components: {dfCreateTree},
        inject:['locationAndShowInfoWin'],
        data() {
            return {
                selectedTreeId: null, //资源树列表默认选中的项（默认为第一项）
                treeList: [],  //资源树列表
                treeData: [],
                treeLoading:false,
                defaultProps: {
                    children: 'nodes',
                    label: 'text',
//                  icon:'icon'
                },
                expandedKeys: [],   //展开树的节点,默认为根节点
                selectedCameraNode: {},

                queryCamera: process.env.VUE_APP_BASE_API + '/source/cameraList',
                queryCameraParam: {organCode: 1, treeId: null},
                searchCameraParam: {treeId: null},
                searchCamera: process.env.VUE_APP_BASE_API + '/camera/search ',
            }
        },
        mounted() {
            this.fetchResourceTreeList();
        },
        methods: {
            /**
             * 获取资源树列表
             */
            fetchResourceTreeList(){
                getResourceTreeList().then(res=>{
                    if(res.code == 1000){
                        this.treeList = res.data;
                        res.data.map((item,index)=>{
                            if(index == 0){
                                this.selectedTreeId = item.id;
                                this.queryCameraParam.treeId = item.id;
                                this.searchCameraParam.treeId = item.id;
                                //获取第一个资源树
                                this.fetchFirstResourceTree(item.id)
                            }
                        })
                    }
                })
            },
            /**
             *  查询部门树
             */
            fetchFirstResourceTree(treeId){
                this.treeLoading = true;
                this.expandedKeys = [];
                getOrganList(this.$qs.stringify({treeId:treeId,flag:0})).then(res=>{
                    this.treeData = res.data;
                    this.treeLoading = false;
                    if(res.data.length>0 && res.data[0].nodes.length>0){
                        //获取展开节点下的摄像机数量
                        let expandNodeCodes = [];
                        res.data[0].nodes.map(item=>{
                            expandNodeCodes.push(item.code)
                        });
                       this.getNodeCamCount(res.data[0],expandNodeCodes);
                    }
                })
            },
            /**
             * 获取展开节点下的摄像机数量
             */
            getNodeCamCount(node,nodeCodes){
                let childrenNode = node.nodes;
                node.nodes = []; //将子节点置空后重新赋值，可以使tree结构刷新
                getOrgCamCount(this.$qs.stringify({nodeCode:node.code,codes:nodeCodes.join(','),treeId:this.selectedTreeId})).then(res=>{
                    childrenNode.map(item=>{
                        res.data.camInfo.map(jtem=>{
                            if(item.code == jtem.code){
                                item.tags = [jtem.camCount];
                            }
                        })
                    });
                    //默认展开第一级节点，同时可以重新渲染tree结构
                    if(this.expandedKeys.indexOf(node.code) == -1){
                        this.expandedKeys.push(node.code);
                    }
                    node.nodes = childrenNode;  //将子节点重置赋值
                })
            },

            /**
             * select选择框选择值变化时触发
             */
            handleChangeSelect() {
                //获取第一个资源树
                this.fetchFirstResourceTree(this.selectedTreeId)
                this.queryCameraParam.treeId = this.selectedTreeId;
                this.searchCameraParam.treeId = this.selectedTreeId;
            },
            /**
             * 点击资源树的部门节点获取摄像机列表
             */
            handleNodeClick(node){
                console.log(node,"node");
               this.locationAndShowInfoWin(node.positionId);
            },
            handleDepartNodeClick(node){
                //获取展开节点下的摄像机数量
                let expandNodeCodes = [];
                if(node.nodes.length>0){
                    node.nodes.map(item=>{
                        expandNodeCodes.push(item.code)
                    });
                    this.getNodeCamCount(node,expandNodeCodes);
                }
            },
            //节点展开
            handleNodeExpand(data,node){

            },
            //节点关闭
            handleNodeCollapse(data,node){
                if(this.expandedKeys.indexOf(data.code) > -1){
                    this.expandedKeys.splice(this.expandedKeys.indexOf(data.code),1);
                }
            }
        }
    }
</script>

<style lang="scss">
    .el-select-dropdown, .el-autocomplete-suggestion {
        z-index: 60000 !important;
    }
</style>
<style lang="scss" scoped>
    .container{
        height: 100%;
        padding: 15px;
    }
    .tree-list-wrap{
        /deep/ .el-form-item{
            margin-bottom: 10px;
        }
    }
    .tree-container{
        height: calc(100% - 45px);
        position: relative;
    }
    /deep/ .el-form-item__label{
        color: #fff;
    }
    /deep/ .el-input__inner {
        background-color: #3a557a;
        border: solid 1px #08133b;
        color: #fff;
    }

</style>
