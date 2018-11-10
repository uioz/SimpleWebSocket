import { SimpleEventEmitter } from "./simpleEventEmitter";


/**
 * 描述接口内部状态的接口
 */
interface state {
    /**
     * 是否处于登录状态中
     */
    login:boolean;
    /**
     * 是否处于登录状态中
     */
    connect:boolean;
    /**
     * 是否处于抑制错误状态中
     */
    tryError:boolean;
};

interface lister {
    [key:string]:(...args:any)=>void;
}

class socketPackage extends SimpleEventEmitter {

    /**
     * 保存远程主机的地址
     */
    private url:string = '';
    private webScoket:WebSocket;
    private nickName:string;

    /**
     * 保存客户端状态
     */
    private state:state = {
        login:false,
        connect:false,
        tryError:false
    };


    private openListener:()=>{

    }

    private closeListener:()=>{

    }

    private errorListener:()=>{

    }

    private messageListener:()=>{

    }
    
    /**
     * 创建一个客户端实例,如果指定了昵称则创建后就立即连接
     * 
     * @param url 服务器地址
     * @param nickName 昵称
     */
    constructor(url:string,nickName?:string){

        super();

        this.url = url;

        if(nickName){
            this.connect(nickName);
        }

    };

    /**
     * 
     */
    private process () {
        
        if(this.state.login || this.state.connect){
            throw "非法调用该方法只有在彻底断开连接的时候才可以调用!";
        }

        // 添加事件监听
        this.webScoket.addEventListener('open',this.openListener);
        this.webScoket.addEventListener('error',this.errorListener);
        this.webScoket.addEventListener('message',this.messageListener);
        this.webScoket.addEventListener('error',this.messageListener);

    };

    /**
     * 删除所有的监听器且不会发出错误信息,
     * 关闭socket连接且清空内部的引用
     */
    private terminate(){

        this.state.tryError = true;
        // 删除所有的监听器
        this.webScoket.removeEventListener('close',this.closeListener);
        this.webScoket.removeEventListener('open', this.openListener);
        this.webScoket.removeEventListener('message', this.messageListener);
        this.webScoket.removeEventListener('error',this.errorListener);
        // 关闭连接
        this.webScoket.close();
        this.webScoket = null;
        this.state.login = this.state.connect = this.state.tryError = false;
        
    }

    /**
     * connect
     */
    public connect(nickName?:string) {
        
        const openCode = WebSocket.OPEN,
              connectCode = WebSocket.CONNECTING,
              closeCode = WebSocket.CLOSING,
              codeArray = [openCode,connectCode,closeCode];

        if(this.webScoket){
            // 如果处于连接状态则彻底关闭连接并且清空引用
            if(codeArray.indexOf(this.webScoket.readyState) !== -1){
                this.terminate();
            }

        }

        if(!this.nickName && !nickName){
            throw new Error('内部没有昵称,可以在connect方法或者新建实例的时候传入');
        }

        this.webScoket = new WebSocket(this.url);

        this.process();

    };

}