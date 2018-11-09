import * as webSocket from "ws";

/**
 * 定义检查路由的类型
 */
export interface routeParamCheckI {
    [key: string]: (request: standardRequest) => boolean | number;
}

/**
 * 定义路由的类型
 */
export interface routeI {
    [key: string]: (ws: webSocket, request: standardRequest) => void;
}

// ---------------------- 请求格式

/**
 * 用户请求的基本格式
 */
export interface standardRequest {
    type: string;
}

/**
 * 定义login请求的类型
 */
export interface requestLoginType extends standardRequest {
    nickName:string;
}

/**
 * 定义客户端消息发送事件
 */
export interface requestMessageType extends requestLoginType {
    auth:string;
    message:string;
}

// --------------------- 响应格式

export interface standardResponse extends standardRequest {
    result:boolean;
}

export interface standardErrorResponse extends standardResponse {
    error:string;
}

/**
 * 登录响应类型
 */
export interface loginResponse extends standardResponse {
    auth: string;
}

/**
 * 消息响应类型
 */
export interface messageResponse extends standardResponse {
    type:'message';
}

// ---------------------- 广播响应类型

/**
 * 定义标准的广播接口
 */
export interface standardBroadCastResponse {
    type:string;
    result:{
        userName: string;
        message: string;
    }
}

/**
 * 定义广播消息的接口
 */
export interface broadCastMessageResponse extends standardBroadCastResponse {
    type:'broadCast';
    result:{
        userName:string;
        message:string;
    }
}

/**
 * 定义广播用户登录的接口
 */
export interface broadCastLoginResponse extends standardBroadCastResponse {
    type:'broadCastLogin';
    result:{
        userName:string;
        message:string;
    }
}

/**
 * 定义广播用户注销的接口
 */
export interface broadCastLogoutResponse extends standardBroadCastResponse {
    type: 'broadCastLogout';
    result: {
        userName: string;
        message: string;
    }
}
