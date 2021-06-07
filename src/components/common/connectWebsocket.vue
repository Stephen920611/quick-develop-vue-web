<template>
    <div class="websocket"></div>
</template>

<script>
    export default {
        name: 'websocket',
        props: ['url', 'disconnect','title'],
        data() {
            return {
                websock: null,
                lockReconnect: false,//避免重复连接
                timeoutNum:null,//断开 重连倒计时
                timeout: 3000, //每隔三秒发送心跳
                num: 3,  //3次心跳均未响应重连
                timeoutObj: null,//心跳倒计时
                serverTimeoutObj: null,//心跳倒计时
            }
        },
        created() {
            if (!this.websock) {
                this.initWebSocket();
            }
        },
        destroyed() {
            if (this.disconnect) {
                this.websock.close() //离开路由之后断开websocket连接
            }
        },
        methods: {
            initWebSocket() { //初始化weosocket
                this.websock = new WebSocket(this.url);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen() { //连接建立之后执行send方法发送数据
                console.log(this.title+"websocket连接成功！");
                let self = this;
                //心跳检测重置
                this.heartCheckStart();

            },

            websocketonerror() {  //连接建立失败重连
                //重连
                this.websocketReconnect();
                console.log(this.title+"websocket连接失败！");
                this.$emit("onerror");
                //this.initWebSocket();
            },
            websocketonmessage(e) { //数据接收
                const redata = JSON.parse(e.data);
                console.log(this.title+"返回数据是：", redata);
                this.$emit("onmessage", redata);

                //心跳检测重置
                this.heartCheckStart();

            },
            websocketclose(e) {  //关闭
                //重连
                this.websocketReconnect();
                console.log(this.title+'断开连接', e);
                this.$emit("onclose");
            },
            //重连
            websocketReconnect() {
                let self = this;
                if(this.lockReconnect) {
                    return;
                };
                this.lockReconnect = true;
                this.timeoutNum && clearTimeout(this.timeoutNum);
                this.timeoutNum = setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
                    self.initWebSocket();
                    self.lockReconnect = false;
                }, 5000);
            },
            heartCheckStart(){
                let self = this;
                let _num = this.num;
                this.timeoutObj && clearTimeout(this.timeoutObj);
                this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
                this.timeoutObj = setTimeout(function(){
                    //这里发送一个心跳，后端收到后，返回一个心跳消息，
                    //onmessage拿到返回的心跳就说明连接正常
                    self.websock.send("123456789"); // 心跳包
                    _num--;
                    //计算答复的超时次数
                    if(_num === 0) {
                        self.websock.close(); // 心跳包
                    }
                }, this.timeout)
            }

        },
    }
</script>
<style lang='scss'>

</style>
