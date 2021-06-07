<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div  class="mask-content-des-all" >
                <el-row>
                    <el-col :span="8">
                        <div class="mask-content-des">仓库名称:{{this.infoData.hasOwnProperty('name') ? this.infoData.name :''}}</div>
                    </el-col>
                    <el-col :span="5">
                        <div class="mask-content-des" >设计容量:{{this.infoData.hasOwnProperty('volume') ? this.infoData.volume :''}}</div>
                    </el-col>
                    <el-col :span="5">
                        <div class="mask-content-des" >库存容量(炸药):{{this.infoData.hasOwnProperty('explosiveAll') ? this.infoData.explosiveAll :''}}</div>
                    </el-col>
                    <el-col :span="5">
                        <div class="mask-content-des" >库存容量(雷管):{{this.infoData.hasOwnProperty('exploderAll') ? this.infoData.exploderAll :''}}</div>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <div class="mask-content-des" >当日出库(炸药):{{this.infoData.hasOwnProperty('explosiveToday') ? this.infoData.explosiveToday :''}}</div>
                    </el-col>
                    <el-col :span="5">
                        <div class="mask-content-des" >当日出库(雷管):{{this.infoData.hasOwnProperty('exploderToday') ? this.infoData.exploderToday :''}}</div>
                    </el-col>
                    <el-col :span="5">
                        <div class="mask-content-des" >当日退库(炸药):{{this.infoData.hasOwnProperty('explosiveCancel') ? this.infoData.explosiveCancel :''}}</div>
                    </el-col>
                    <el-col :span="5">
                        <div class="mask-content-des" >当日退库(雷管):{{this.infoData.hasOwnProperty('exploderCancel') ? this.infoData.exploderCancel :''}}</div>
                    </el-col>
                </el-row>

            </div>

            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="库存明细" name="first">
                    <stock-detail></stock-detail>
                </el-tab-pane>
                <el-tab-pane label="领用及退库" name="second">
                    <collection-goods></collection-goods>
                </el-tab-pane>
                <el-tab-pane name="third" >
                    <span slot="label" class="tab-badge">
                        <el-badge :value="8" class="item tab-badge-item"></el-badge>
                        异常预警
                    </span>
                    <alarm-list></alarm-list>
                </el-tab-pane>
                <!--<el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>-->
            </el-tabs>



        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import StockDetail from './stockDetail.vue'
    import CollectionGoods from './collectionGoods.vue'
    import AlarmList from './alarmList.vue'
    import {basicTankSaveOrUpdate,fetchDangerSource} from '@/api/majorHazardSource'
    import {getByCode} from '@/api/industry'
    import searchGoodsList from '@/views/map-monitor/components/search-goods-list.vue'
    export default {
        components: {
            CommonSubtitle,
            searchGoodsList,
            StockDetail,
            CollectionGoods,
            AlarmList
        },
        name: 'blastDetail',
        props:['infoData'],
        data(){
            return {
                form:{
                    insertId: '',
                    name: '',
                    areaId: '',
                    code:'',
                    companyId: '',
                    designLife: null,
                    material: null,
                    geometry: null,
                    volume: null,
                    diameter: null,
                    workHeight: null,
                    workTemperate: null,
                    chemicalInfo: '',
                    safetyMeasure: '',
                    chargePhone:'',//储罐负责人联系电话
                    chargePerson:'',//储罐负责人
                },
                rules:{
                    name: [
                        { required: true, message: '请输入名称/编号', trigger: 'blur' }
                    ],
                    tankGroup: [
                        { required: true, message: '请输入所属罐组', trigger: 'blur' },
                    ],
                    certificate: [
                        { required: true, message: '请输入危险货物作业附证编号', trigger: 'blur' },
                    ],
                    useCertificate: [
                        { required: true, message: '请输入使用登记证编号', trigger: 'blur' },
                    ],
                },

                //应急预案归属
                typeOptions: [],
                listLoading: false,
                installTypeOptions: [],   //储罐安装形式
                materialOptions: [],   //材料
                geometryOptions: [],   //几何
                dangerSource:[],//危险源

                activeName: 'first',
                companyName:'',
                startTime:'',
                address:'',
                url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                imageUrl:[{
                    img:require("@/assets/image/tmp/u0.jpg"),
                    name:'姓名'
                },{
                    img:require("@/assets/image/tmp/u38.png"),
                    name:'姓名'
                },{
                    img:require("@/assets/image/tmp/u0.jpg"),
                    name:'姓名'
                }]

            }
        },
        created() {
//            this.form.insertId = this.userInfo.id;
//            this.form.areaId = this.areaId;
//            console.log('data',this.data);
//            this.companyName = this.data && this.data.hasOwnProperty('companyName') ? this.data.companyName : ''
//            this.startTime = this.data && this.data.hasOwnProperty('certificationDate') ? this.data.certificationDate : ''
//            this.address = this.data && this.data.hasOwnProperty('officeAddress') ? this.data.officeAddress : ''

//            this.dictionary();
            //获取危险源
//            this.fetchDangerSource();
        },
        mounted(){
            console.log('infoData',this.infoData)
        },
        watch:{
            'data':{
                handler(value){
                    if(value){
                        const keys = Object.keys(this.form);
                        for (let key of keys) {
                            this.form[key] = value[key];
                        }
                        this.form.code = value.code;
                        this.basicTankAlarmLimitDTO = value['basicTankAlarmLimitDTO'];
                    }
                },
                immediate: true,
                deep: true
            }
        },
        methods:{
            //切换tab
            handleClick(tab, event) {
                console.log(tab, event);
            },
            upDecimals(e){
                e.target.value = e.target.value.replace(/[^\d.]/g,'')
            },
            upNumber(e){
                e.target.value = e.target.value.replace(/[^\d]/g,'')
            },
            //字典查询
            dictionary() {
                //储罐的安装形式
                getByCode({code: 'TANK_INSTALL_TYPE', enable: 1}).then(res => {
                    this.installTypeOptions = [];
                    res.data.list.map(item => {
                        item.value= parseInt(item.value);
                        this.installTypeOptions.push(item);
                    })
                });
                //储罐的材料分类
                getByCode({code: 'TANK_MATERIAL', enable: 1}).then(res => {
                    this.materialOptions = [];
                    res.data.list.map(item => {
                        item.value= parseInt(item.value);
                        this.materialOptions.push(item);
                    })
                });
                //储罐的几何形式
                getByCode({code: 'TANK_SHAPE', enable: 1}).then(res => {
                    this.geometryOptions = [];
                    res.data.list.map(item => {
                        item.value= parseInt(item.value);
                        this.geometryOptions.push(item);
                    })
                });
            },
            fetchDangerSource(){
                fetchDangerSource({areaId:this.areaId}).then(res => {
                    this.dangerSource = res.data
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        basicTankSaveOrUpdate(this.form).then(res=>{
                            if(res.code == "1000"){
                                this.$message({message:'添加成功!',type:'success'});
                                this.$emit('closeDialog')
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        }
    }
</script>
<style lang="scss" scoped type="text/scss">
    .mask-content-des-all{
        margin-bottom: 10px;
        .mask-content-des{
            font-size: 18px;
            line-height: 32px;
        }
    }
    .mask-content-image{
        margin: 5px 10px;
        display: inline-block;
    }

    .mask-content-image-name{
        text-align: center;
        margin-top: 10px;
    }



    /deep/ .el-tabs__item{
        font-size: 16px;
    }
    .check-info{
        .el-col{
            height: 15px;
        }
        .line{
            width: 6px;
            height: 22px;
            display: inline-block;
            background-color: #2794e7;
            float: left;
            margin: -4px 10px 0 0;
        }
    }
    /deep/ .el-form--inline{
        /deep/ .el-form-item__content{
            width: calc(100% - 120Px);
            /deep/ .el-date-editor{
                width: 185px;
            }
        }
    }
    //tab键小红按钮
    .tab-badge{
        position: relative;
        .tab-badge-item{
            position: absolute;
            top: -18px;
            right: -28px
        }
    }
</style>
