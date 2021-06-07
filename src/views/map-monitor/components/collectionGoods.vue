<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="mask-content-image" v-for="(item,index) in resImageUrl" :key="index">
                <div class="mask-content-image-all" >
                    <div class="mask-content-image-left">
                        <el-image
                                style="width: 100px; height: 120px"
                                :src="item.img"
                        ></el-image>
                    </div>
                    <div class="mask-content-image-right">
                        <div class="mask-content-image-name" >
                            <span class="mask-content-image-name1">{{item.name}}</span>
                            <span class="mask-content-image-name2">{{item.userType}}</span>
                        </div>
                        <div class="mask-content-image-des" >动作：退库</div>
                        <div class="mask-content-image-des" >
                            <el-row>
                                <el-col :span="12" >雷管：20发</el-col>
                                <el-col :span="12" >炸药：20公斤</el-col>
                            </el-row>
                        </div>
                        <div class="mask-content-image-des" >时间：2021-04-27 10:12</div>
                        <div class="mask-content-image-info" >查看详情</div>

                    </div>
                </div>


            </div>

        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {basicTankSaveOrUpdate,fetchDangerSource} from '@/api/majorHazardSource'
    import {getByCode} from '@/api/industry'
    import searchGoodsList from '@/views/map-monitor/components/search-goods-list.vue'
    import {fetchPersonList} from '@/api/task'

    export default {
        components: {CommonSubtitle,searchGoodsList},
        name: 'blastDetail',
        props:[],
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
                imageUrl:[],
                resImageUrl:[{
                    img:require("@/assets/image/person/11-1.jpg"),
                    name:'姓名',
                    userType:'爆破员',
                    action:'领用',
                },{
                    img:require("@/assets/image/tmp/u38.png"),
                    name:'姓名',
                    userType:'爆破员',
                    action:'退库',
                },{
                    img:require("@/assets/image/person/34-1.jpg"),
                    name:'姓名',
                    userType:'爆破员',
                    action:'退库',
                },{
                    img:require("@/assets/image/person/17-1.jpg"),
                    name:'姓名',
                    userType:'爆破员',
                    action:'领用',
                },{
                    img:require("@/assets/image/person/20-1.jpg"),
                    name:'姓名',
                    userType:'爆破员',
                    action:'退库',
                },{
                    img:require("@/assets/image/person/23-1.jpg"),
                    name:'姓名',
                    userType:'爆破员',
                    action:'领用',
                },{
                    img:require("@/assets/image/person/34-1.jpg"),
                    name:'姓名',
                    userType:'爆破员',
                    action:'退库',
                },{
                    img:require("@/assets/image/tmp/u38.png"),
                    name:'姓名',
                    userType:'爆破员',
                    action:'领用',
                },{
                    img:require("@/assets/image/person/90-1.jpg"),
                    name:'姓名',
                    userType:'爆破员',
                    action:'退库',
                }],
                list:[],

            }
        },
        created() {

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
                let obj={
                    page:self.listQuery.page,
                    size:self.listQuery.size,
                }
                this.loading = true
                console.log(self.resImageUrl,'self.resImageUrl');
                fetchPersonList(obj).then(res => {
//                    self.imageUrl=res.data.list
                    self.imageUrl= this.resImageUrl
                    console.log(self.imageUrl,'self.imageUrl');
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
    .mask-content-image{
        margin: 5px 10px;
        display: inline-block;
        .mask-content-image-all{
            display: flex;
            justify-content: space-between;
            width: 300px;
            .mask-content-image-right{
                width: calc(100% - 100px - 10px);
                margin-left: 10px;
                text-align: left;
                line-height: 25px;
            }
            border: 1px solid #dfe4ed;
            padding: 8px;
            border-radius: 3px;
            .mask-content-image-info{
                text-align: right;
                color: #0099FF;
            }
        }

    }

    .mask-content-image-name{
        /*text-align: center;*/
        margin-top: 10px;
        .mask-content-image-name1{
            font-size: 18px;
        }
        .mask-content-image-name2{
            margin-left: 3px;
        }
    }



</style>
