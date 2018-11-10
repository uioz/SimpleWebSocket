"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var simpleEventEmitter_1 = require("./simpleEventEmitter");
;
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
var socketPackage = /** @class */ (function (_super) {
    __extends(socketPackage, _super);
    /**
     * 创建一个客户端实例,如果指定了昵称则创建后就立即连接
     *
     * @param url 服务器地址
     * @param nickName 昵称
     */
    function socketPackage(url, nickName) {
        var _this = _super.call(this) || this;
        /**
         * 保存远程主机的地址
         */
        _this.url = '';
        /**
         * 保存客户端状态
         */
        _this.state = {
            login: false,
            connect: false,
            tryError: false
        };
        _this.openListener = function () {
            _this.state.connect = true;
            if (!_this.state.login) {
                var requset = {
                    type: 'login',
                    nickName: _this.nickName
                };
                _this.send(requset);
            }
        };
        _this.closeListener = function (event) {
            _this.terminate();
            _this.emit('close', event);
        };
        _this.errorListener = function (event) {
            if (_this.state.tryError) {
                return;
            }
            _this.emit('error', event);
            _this.terminate();
        };
        _this.messageListener = function (event) {
            var response = JSON.parse(event.data);
            if (response.type == 'login' && response.result) {
                _this.auth = response.auth;
                _this.state.login = true;
                _this.emit('login', response);
                return;
            }
            // 如果result返回false意味着此时服务器已经关闭了连接
            if (!response.result) {
                _this.terminate();
                _this.emit('requesterror', response);
                return;
            }
            // 剩下的都是广播事件
            _this.emit('broadcast', response);
        };
        _this.url = url;
        if (nickName) {
            _this.connect(nickName);
        }
        return _this;
    }
    /**
     * 调用后将对象转为JSON使用websocket.send方法发送
     * @param data 需要发送的数据
     */
    socketPackage.prototype.send = function (data) {
        this.webScoket.send(JSON.stringify(data));
    };
    ;
    /**
     * 调用后给内部的websocket添加监听
     */
    socketPackage.prototype.process = function () {
        if (this.state.login || this.state.connect) {
            throw "非法调用该方法只有在彻底断开连接的时候才可以调用!";
        }
        // 添加事件监听
        this.webScoket.addEventListener('open', this.openListener);
        this.webScoket.addEventListener('error', this.errorListener);
        this.webScoket.addEventListener('message', this.messageListener);
        this.webScoket.addEventListener('close', this.closeListener);
    };
    ;
    /**
     * 删除所有的监听器且不会发出错误信息,
     * 关闭socket连接且清空内部的引用
     */
    socketPackage.prototype.terminate = function () {
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
    };
    /**
     * 调用后连接服务器,如果已经存在连接则彻底断开连接后再次连接
     */
    socketPackage.prototype.connect = function (nickName) {
        var openCode = WebSocket.OPEN, connectCode = WebSocket.CONNECTING, closeCode = WebSocket.CLOSING, codeArray = [openCode, connectCode, closeCode];
        if (this.webScoket) {
            // 如果处于连接状态则彻底关闭连接并且清空引用
            if (codeArray.indexOf(this.webScoket.readyState) !== -1) {
                this.terminate();
            }
        }
        if (!this.nickName && !nickName) {
            throw new Error('内部没有昵称,可以在connect方法或者新建实例的时候传入');
        }
        this.nickName = nickName;
        this.webScoket = new WebSocket(this.url);
        this.process();
    };
    ;
    /**
     * 发送消息
     *
     * - 只有登录后这个方法才会真正的发送消息
     * -
     */
    socketPackage.prototype.boradCast = function (message) {
        if (this.state.login) {
            var response = {
                type: 'message',
                auth: this.auth,
                nickName: this.nickName,
                message: message.toString()
            };
            this.send(response);
            return true;
        }
        return false;
    };
    /**
     * 调用该方法则关闭连接且触发close事件
     *
     * - 如果没有连接或者没有登录则该方法无效
     */
    socketPackage.prototype.close = function () {
        if (this.webScoket && this.state.login) {
            this.webScoket.close();
        }
    };
    return socketPackage;
}(simpleEventEmitter_1.SimpleEventEmitter));
var test = new socketPackage('WebSocket://127.0.0.1:8080', 'hello world');
test.on('login', function (response) {
    console.log('login', response);
    test.boradCast('hello world');
});
test.on('broadcast', function (response) {
    console.log('broadcast', response);
});
test.on('error', function (error) {
    console.log('error', error);
});
test.on('requesterror', function (error) {
    console.log('requestError', error);
});
test.on('close', function (response) {
    console.log('close', response);
});
