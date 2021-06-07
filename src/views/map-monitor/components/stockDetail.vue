<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div  class="mask-content-des-all" >
                <!-- 表格开始 -->
                <el-table
                        v-loading="listLoading"
                        :data="list"
                        border
                        fit
                        highlight-current-row
                        style="width: 100%;"
                        height="450px"
                >
                    <el-table-column label="物品名称" type="index" align="center" width="220">
                        <template slot-scope="{row}">{{row.name}}</template>
                    </el-table-column>
                    <el-table-column label="规格" header-align="center" align="center">
                        <template slot-scope="{row}">{{row.melting}}</template>
                    </el-table-column>
                    <el-table-column label="当前库存" header-align="center" align="center">
                        <template slot-scope="{row}">{{row.unCode}}</template>
                    </el-table-column>
                    <el-table-column label="当日领用" header-align="center" align="center">
                        <template slot-scope="{row}">{{row.collect}}</template>
                    </el-table-column>
                    <el-table-column label="当日退库" header-align="center" align="center">
                        <template slot-scope="{row}">{{row.cancelStock}}</template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            align="center"
                            width="150"
                            class-name="small-padding fixed-width"
                    >
                        <template slot-scope="{row}">
                            <span style="color: #0099FF" @click="seeDetail(row)" >查看详情</span>
                        </template>
                    </el-table-column>
                </el-table>


            </div>

        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {basicTankSaveOrUpdate,fetchDangerSource} from '@/api/majorHazardSource'
    import {getByCode} from '@/api/industry'
    import searchGoodsList from '@/views/map-monitor/components/search-goods-list.vue'
    import {dangerList} from '@/api/task'

    export default {
        components: {CommonSubtitle,searchGoodsList},
        name: 'blastDetail',
        props:['userInfo','areaId','data'],
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
                listQuery: {
                    page: 1,
                    size: 10,
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
                }],
                list:[],

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
        mounted() {
            this.getList()
        },
        methods:{
            getList(){
                let self = this;
                self.editParamsInfo=null
                let obj={
                    page:self.listQuery.page,
                    size:self.listQuery.size,
                }
                this.loading = true
                dangerList(obj).then(res => {
                    self.list=res.data.list
                    self.total=res.data.total
                    this.loading = false
                })
                    .catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                        this.loading = false
                    })
            },

            seeDetail(row){
                this.dialogVisible=true
                this.currentRow=row
            },


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
            line-height: 30px;
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


</style>
