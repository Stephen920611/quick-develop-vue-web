class socket {
    //websocket实例
    ws = null;
    
    /*'_'为私有属性，外部不可调用 */
    
    //把类的参数传入到这里方便调用
    _params = null;
    //连接状态
    _alive = false;
    
    //心跳计时器
    _heart_timer = null;
    //重连计时器
    _reconnect_timer = null;
    // 信息onmessage缓存方法
    _message_func = null;
    
    /* 参数 */
    //心跳时间 50秒一次
    heartBeat = 50000;
    //心跳信息：默认为‘hello’随便改，看后台
    heartMsg = 'hello';
    //是否自动重连
    reconnect = true;
    //重连间隔时间
    reconnectTime = 5000;
    //重连次数
    reconnectTimes = 10;
    
    constructor(params) {
        this._params = params;
        this.init();
    }
    
    /**
     * 初始化
     */
    init() {
        //重中之重，不然重连的时候会越来越快
        clearInterval(this._reconnect_timer);
        clearInterval(this._heart_timer);
        
        //取出所有的参数
        let params = this._params;
        //设置连接路径
        let {url, port} = params;
        let global_params = ['heartBeat', 'heartMsg', 'reconnect', 'reconnectTime', 'reconnectTimes'];
        //定义全局变量
        Object.keys(params).forEach(key => {
            if (global_params.indexOf(key) !== -1) {
                this[key] = params[key];
            }
        });
        let ws_url = port ? url + ':' + port : url;
        
        // this.ws = null
        delete this.ws;
        this.ws = new WebSocket(ws_url);
    
        if (this._message_func) {
            this.onmessage(this._message_func)
        }
        
        //默认绑定事件
        this.ws.onopen = () => {
            //设置状态为开启
            this._alive = true;
            clearInterval(this._reconnect_timer);
            //连接后进入心跳状态
            this.onheartbeat();
            
        };
        
        this.ws.onclose = () => {
            //设置状态为关闭
            this._alive = false;
            clearInterval(this._heart_timer);
            //自动重连开启
            if (this.reconnect) {
                /* 断开后立刻重连 */
                this.onreconnect()
                
            }
        }
    }
    
    /**
     *
     * 新增‘心跳事件’和‘重连事件’
     *
     */
    //心跳事件
    onheartbeat(func) {
        //在连接状态下
        if (this._alive) {
            //心跳计时器
            this._heart_timer = setInterval(() => {
                //发送心跳信息
                this.send(this.heartMsg);
                func ? func(this) : false
            }, this.heartBeat)
        }
    }
    
    onreconnect(func) {
        //重连间隔计时器
        this._reconnect_timer = setInterval(() => {
            //限制重连次数
            if (this.reconnectTimes <= 0) {
                //关闭定时器
                clearInterval(this._reconnect_timer);
                //跳出函数之间的循环
                return;
            } else {
                //重连次数减一
                this.reconnectTimes--;
            }
            //进入初始状态
            this.init();
            func ? func(this) : false;
            
        }, this.reconnectTime)
    }
    
    /**
     *
     * 对原生方法和事件进行封装
     *
     */
    
    //发送消息
    send(text) {
        if (this._alive) {
            text = typeof text == 'string' ? text : JSON.stringify(text);
            this.ws.send(text);
        }
    }
    
    //断开连接
    close() {
        if (this._alive) {
            this.ws.close();
        }
    }
    
    //接收消息
    onmessage(func, all = false) {
        this.ws.onmessage = data => {
            this._message_func = func;
            func(!all ? data.data : data);
        }
    }
    
    //websocket连接成功事件
    onopen(func){
        this.ws.onopen = event=>{
            this._alive = true;
            func ? func(event) : false;
        }
    }
    
    //websocket关闭事件
    onclose(func){
        this.ws.onclose = event=>{
            //设置状态为断开
            this._alive = false;
            
            clearInterval(this._heart_timer);
            
            if(this.reconnect){
                /* 断开后立刻重连 */
                this.onreconnect()
            }
            func ? func(event) : false;
            
        }
    }
    //websocket错误事件
    onerror(func) {
        this.ws.onerror = event => {
            func ? func(event) : false
        }
    }
}

export default socket