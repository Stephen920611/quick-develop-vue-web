<!--右侧抽屉-->
<template>
    <div class="drawer-container">
      <transition name="slide-fade">
        <div class="detail-box" >
            <el-tabs tab-position="left" type="card" class="tabs-container" v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="资源树" name="tree">
                    <resource-tree ref="tree"></resource-tree>
                </el-tab-pane>
                <el-tab-pane label="警力" name="police">
                    <police-force ref="policeForce"></police-force>
                </el-tab-pane>

            </el-tabs>
        </div>
      </transition>
    </div>
</template>
<script>
    import policeForce from './policeForce.vue'
    import resourceTree from './resourceTree.vue'
    export default {
        data(){
          return{
              activeName: "tree",
              tabRefresh: {
                  tree: true,
                  police: false,

              },
          }
        },
        components:{
            policeForce,resourceTree
        },
        methods:{
            handleTabClick(){
                for (let [key, value] of Object.entries(this.tabRefresh)) {
                    if (key == this.activeName) {
                        this.tabRefresh[key] = true
                    } else {
                        this.tabRefresh[key] = false
                    }
                }
            },
        }
    }
</script>
<style lang="less">
  @import "../style/style.right-drawer.less";
</style>
