<template>
    <div class="common-subtitle" :class="{'is-bold':isBold, 'is-center':center}" :style="{left: left, top: top, width: width,background:background}">
        <!--<span class="common-subtitle-i" ></span>-->
        <span class="title">{{title}}</span>
    </div>
</template>
<script>
    export default {
        props: {
            title: {
                type: String,
            },
            isBold:{
                type:Boolean,
                default:false
            },
            width: {
                type: String,
                default: '280px'
            },
            left: {
                type: String,
            },
            top: {
                type: String,
            },
            background:{
                type:String,
                default:'linear-gradient(45deg, #035BD0, #31C5C4)'
            },
            center:{
                type:Boolean,
                default:false
            }
        },
    }
</script>
<style lang="scss" scoped>
    .is-bold{
        font-weight: bold;
    }
    .common-subtitle {
        height: 30px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 15px;
        display: flex;
        align-items: center;
        font-stretch: normal;
        letter-spacing: 2px;
        color: #fff;
        margin-bottom: 10px;
        text-align: left;
        /*background: linear-gradient(45deg, #035BD0, #31C5C4),*/
    }
    .is-center{
        justify-content: center;
    }
    span.title{
        padding-left: 20px;
    }
    .common-subtitle-i {
        width: 8px;
        height: 18px;
        display: inline-block;
        border-radius: 5px;
        background-color: #1890ff;
        margin-right: 10px;
    }
</style>
