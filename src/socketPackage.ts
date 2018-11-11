import { SimpleEventEmitter } from "./simpleEventEmitter";
import { requestLoginType,standardRequest,requestMessageType } from "./types";
import * as WebSocket from "ws";

/**
 * 描述接口内部状态的接口
 */
interface state {
    /**
     * 是否处于登录状态中
     */
    login: boolean;
    /**
     * 是否处于登录状态中
     */
    connect: boolean;
    /**
     * 是否处于抑制错误状态中
     */
    tryError: boolean;
};

interface lister {
    [key: string]: (...args: any) => void;
}

/**
 * 1. 可用方法
 * - 构造函数
 * - connect 方法 没有建立连接的情况下调用登录,已经建立的情况下则重新连接
 * - boradCast 方法 向服务器广播消息
 * - close 方法 该方法调用后关闭连接
 * 2. 可用事件
 * - error 事件websocket错误
 * - close 连接被关闭就是原生的websocket关闭事件
 * - requesterror 登录后不符合格式的请求会触发这个事件,一旦被触发就意味着连接被关闭
 * - broadcast 由服务器向客户端广播的信息都会触发这个事件
 * - login 调用connect方法后登录成功会触发这个事件
 */
export class socketPackage  extends SimpleEventEmitter {

    /**
     * 保存远程主机的地址
     */
    private url: string = '';
    private webScoket: WebSocket;
    private nickName: string;
    private auth:string;

    /**
     * 保存客户端状态
     */
    private state: state = {
        login: false,
        connect: false,
        tryError: false
    };

    /**
     * 调用后将对象转为JSON使用websocket.send方法发送
     * @param data 需要发送的数据
     */
    private send(data: standardRequest):void{
        this.webScoket.send(JSON.stringify(data));
    }


    private openListener = () => {

        this.state.connect =true;

        if(!this.state.login){

            const requset:requestLoginType = {
                type:'login',
                nickName:this.nickName
            };

            this.send(requset);
        }
        
    }

    private closeListener = (event) => {

        this.terminate();
        this.emit('close',event);
    }

    private errorListener = (event) => {

        if(this.state.tryError){
            return;
        }
        this.emit('error', event);
        this.terminate();

    }

    private messageListener = (event) => {

        const response = JSON.parse(event.data);
        
        if(response.type == 'login' && response.result){
            this.auth = response.auth;
            this.state.login = true;
            this.emit('login',response);
            return;
        }

        // 如果result返回false意味着此时服务器已经关闭了连接
        if(!response.result){
            this.terminate();
            this.emit('requesterror',response);
            return;
        }

        // 剩下的都是广播事件
        this.emit('broadcast',response);
        
    }

    /**
     * 创建一个客户端实例,如果指定了昵称则创建后就立即连接
     * 
     * @param url 服务器地址
     * @param nickName 昵称
     */
    constructor(url: string, nickName?: string) {

        super();

        this.url = url;

        if (nickName) {
            this.connect(nickName);
        }

    };

    /**
     * 调用后给内部的websocket添加监听
     */
    private process(): void {

        if (this.state.login || this.state.connect) {
            throw "非法调用该方法只有在彻底断开连接的时候才可以调用!";
        }

        // 添加事件监听
        this.webScoket.addEventListener('open', this.openListener);
        this.webScoket.addEventListener('error', this.errorListener);
        this.webScoket.addEventListener('message', this.messageListener);
        this.webScoket.addEventListener('close', this.closeListener);

    };

    /**
     * 删除所有的监听器且不会发出错误信息,
     * 关闭socket连接且清空内部的引用
     */
    private terminate(): void {

        this.state.tryError = true;
        // 删除所有的监听器
        this.webScoket.removeEventListener('close', this.closeListener);
        this.webScoket.removeEventListener('open', this.openListener);
        this.webScoket.removeEventListener('message', this.messageListener);
        this.webScoket.removeEventListener('error', this.errorListener);
        // 关闭连接
        this.webScoket.close();
        this.webScoket = null;
        this.state.login = this.state.connect = this.state.tryError = false;

    }

    /**
     * 调用后连接服务器,如果已经存在连接则彻底断开连接后再次连接
     */
    public connect(nickName?: string) {

        const openCode = WebSocket.OPEN,
            connectCode = WebSocket.CONNECTING,
            closeCode = WebSocket.CLOSING,
            codeArray = [openCode, connectCode, closeCode];

        if (this.webScoket) {
            // 如果处于连接状态则彻底关闭连接并且清空引用
            if (codeArray.indexOf(this.webScoket.readyState) !== -1) {
                this.terminate();
            }

        }

        if (!this.nickName && !nickName) {
            throw new Error('内部没有昵称,可以在connect方法或者新建实例的时候传入');
        }

        if(!this.nickName){
            this.nickName = nickName;
        }

        this.webScoket = new WebSocket(this.url);

        this.process();

    };

    /**
     * 发送消息
     * 
     * - 只有登录后这个方法才会真正的发送消息
     * - 
     */
    public boradCast(message:string):boolean {
        
        if(this.state.login){

            const response: requestMessageType = {
                type:'message',
                auth:this.auth,
                nickName:this.nickName,
                message:message.toString()
            }

            this.send(response);

            return true;
        }

        return false;

    }

    /**
     * 调用该方法则关闭连接且触发close事件
     * 
     * - 如果没有连接或者没有登录则该方法无效
     */
    public close():void{

        if(this.webScoket && this.state.login){
            this.webScoket.close();
            this.terminate();
        }

    }

}
