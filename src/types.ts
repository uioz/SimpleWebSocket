import * as webSocket from "ws";

/**
 * 定义检查路由的类型
 */
export interface routeParamCheckI {
    [key: string]: (request: standardRequest, ws: webSocket) => boolean | number;
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
    nickName: string;
    type: string;
    token: string;
}

/**
 * 定义login请求的类型
 */
export interface requestLoginType extends standardRequest {
    groupName?:string;
}

/**
 * 定义客户端消息发送事件
 */
export interface requestMessageType extends standardRequest {
    type:'message';
    auth:string;
    message:string;
    groupName: string;
}

// --------------------- 响应格式

export interface standardResponse {
    type: string;
    result:boolean;
}

export interface standardErrorResponse extends standardResponse {
    error:string;
}

/**
 * 登录响应类型
 */
export interface loginResponse extends standardResponse {
    type:'login';
    auth: string;
    groupName:string;
    allGroups:string[];
}

/**
 * 消息响应类型
 */
export interface messageResponse extends standardResponse {
    type:'message';
}

/**
 * 响应错误消息类型
 */
export interface errorRespone extends standardErrorResponse {
    type:string;
    result:false;
    error:string;
}

// ---------------------- 广播响应类型

/**
 * 定义标准的广播接口
 */
export interface standardBroadCastResponse {
    type:string;
    result:{
        userName: string;
        time: string;
    }
}

/**
 * 定义广播消息的接口
 */
export interface broadCastMessageResponse extends standardBroadCastResponse {
    type:'broadCast';
    result: {
        userName: string;
        message:string;
        time: string;
    }
}

/**
 * 定义广播用户登录的接口
 */
export interface broadCastLoginResponse extends standardBroadCastResponse {
    type:'broadCastLogin';
}

/**
 * 定义广播用户注销的接口
 */
export interface broadCastLogoutResponse extends standardBroadCastResponse {
    type: 'broadCastLogout';
}

