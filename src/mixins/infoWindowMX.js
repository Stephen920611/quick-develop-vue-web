/**
 * @description  marker信息窗体内容的混入对象
 * @Version Created by LuLarry on 2021-5-11.
 * @Author LuLarry
 * @license dongfangdianzi
 */

import Vue from 'vue/dist/vue.esm.js'
export const infoWindowMX = {
    data(){
        return{
            infoWindow:null
        }
    },
    mounted(){
        //marker的信息窗体内容模板,props接收传入参数
        this.infoWindow = Vue.extend({
            template: `<div class="loc-content loc-content-1">
                                <div class="loca-info">信息展示</div>
                                <div class="close" @click="closeInfoWindow"><i class="fa fa-times"></i></div>
                                <div class="msg-content">
                                    <p class="msg-info title ellipsis-l1"><span>{{info.plateNum}}</span></p>
                                    <p class="msg-info ellipsis-l1"><span>车身颜色：{{info.color}}</span></p>
                                    <p class="msg-info ellipsis-l1"><span>所在地址：{{info.address}}</span></p>
                                </div>
                                <div class="icon-wrap">
                                    <span class="icon" @click="seeDetail(info)">查看详情</span>
                                </div>
                        </div>`,
            data(){
                return{
                
                }
            },
            props:['info','vm'],
            methods:{
                seeDetail(info){
                    alert(info.plateNum)
                },
                closeInfoWindow(){
                    this.vm.closeInfoWin()
                }
            }
        })
    }
}

//拖拽信息窗体
export const dragInfoWindow = {
    data(){
        return{
            dragWindow:null
        }
    },
    mounted(){
        //marker的信息窗体内容模板,props接收传入参数
        this.dragWindow = Vue.extend({
            template: `<div class="loc-content loc-content-5">
                            <div class="loca-info">信息展示</div>
                            <div class="close" @click="closeInfoWindow"><i class="fa fa-times"></i></div>
                            <div class="btn-wrap">
                                <button class="gray medium button" @click="saveNewLocFunc">保存新位置</button>
                                <button class="gray medium button"  @click="continueDragFunc">继续拖拽</button>
                                <button class="gray medium button"  @click="cancelDragFunc">取消操作</button>
                            </div>
                        </div>`,
            data(){
                return{
                
                }
            },
            props:['vm'],
            methods:{
                closeInfoWindow(){
                    this.vm.closeInfoWin()
                },
                saveNewLocFunc(){
                    this.vm.saveNewLocFunc()
                },
                continueDragFunc(){
                    this.vm.continueDragFunc()
                },
                cancelDragFunc(){
                    this.vm.cancelDragFunc()
                }
            }
        })
    }
}

export const infoWindowPolice = {
    data(){
        return{
            infoWindow:null
        }
    },
    mounted(){
        //marker的信息窗体内容模板,props接收传入参数
        this.infoWindow = Vue.extend({
            template: `<div class="loc-content loc-content-2">
                                <div class="loca-info">信息展示</div>
                                <div class="close" @click="closeInfoWindow"><i class="fa fa-times"></i></div>
                                <div class="msg-content">
                                    <p class="msg-info title"><span>{{info.typeClassDes}} > {{info.typeDes}} > {{info.smallTypeDes}}</span></p>
                                    <p class="msg-info ellipsis-l1"><span>类型：{{info.color}}</span></p>
                                    <p class="msg-info ellipsis-l1"><span>详情：{{info.policeDetail}}</span></p>
                                    <p class="msg-info ellipsis-l1"><span>地点：{{info.address}}</span></p>
                                    <p class="msg-info ellipsis-l1"><span>时间：{{info.alarmTime}}</span></p>
                                    <p class="msg-info ellipsis-l1"><span>派出所：{{info.unitDes}}</span></p>
                                    <p class="msg-info">
                                        <span class="location"><i class="square"></i><span class="loc loc-lng">E {{info.offsetLng}}</span></span>
                                        <span class="location"><i class="square"></i><span class="loc loc-lat">N {{info.offsetLat}}</span></span>
                                    </p>
                                </div>
                        </div>`,
            data(){
                return{
                
                }
            },
            props:['info','vm'],
            methods:{
                closeInfoWindow(){
                    this.vm.closeInfoWin()
                }
            }
        })
    }
}