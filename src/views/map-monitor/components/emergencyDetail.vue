<template>
    <div>
        <el-form ref="form" :model="form" label-width="150px">
            <el-row>
                <el-form-item label="公司负责人：">
                    <el-input v-model="form.header" disabled></el-input>
                </el-form-item>
                <el-form-item label="联系电话：">
                    <el-input v-model="form.headerPhone" disabled></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="紧急联系人：">
                    <el-input v-model="form.chargePerson" disabled></el-input>
                </el-form-item>
                <el-form-item label="紧急联系电话：">
                    <el-input v-model="form.chargePhone" disabled></el-input>
                </el-form-item>
            </el-row>
            <common-subtitle :isBold="true" title="应急预案信息"></common-subtitle>
            <el-row>
                <el-form-item label="应急预案名称：">
                    <el-input v-model="form.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="应急预案编制单位：">
                    <el-input v-model="form.name" disabled></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="应急预案归属：">
                    <el-input v-model="form.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="应急预案类型：">
                    <el-input v-model="form.name" disabled></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="应急预案级别：">
                    <el-input v-model="form.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="应急预案事件类型：">
                    <el-input v-model="form.name" disabled></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="应急预案说明：" class="textarea-form-item">
                    <el-input type="textarea" v-model="form.name" disabled></el-input>
                </el-form-item>
            </el-row>
            <common-subtitle :isBold="true" title="应急预案附件"></common-subtitle>
        </el-form>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    export default {
        name: "",
        props:['data'],
        components: {CommonSubtitle},
        data() {
            return {
                form: {
                    name:'',
                    header: '',
                    headerPhone: '',
                    chargePerson:'',
                    chargePhone:''
                },
                emergencyData:{}
            }
        },
        watch:{
            'data':{
                handler(value){
                    this.form.header = value.companyInfo.header;
                    this.form.headerPhone = value.companyInfo.headerPhone;
                    this.form.chargePerson = value.tankInfo.chargePerson;
                    this.form.chargePhone = value.tankInfo.chargePhone;
                },
                deep:true,
                immediate:true
            }
        },
        mounted() {
            
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>

    /deep/ .el-form-item {
        margin-bottom: 22px;
        width: 50%;
        display: inline-block;
        float: left;
        &.textarea-form-item{
            width: 100%;
        }
        .el-input{
            width: 90%;
        }
        .el-textarea{
            width: 96%;
        }
    }
    /deep/ .common-subtitle{
        margin-bottom: 15px;
    }
</style>
