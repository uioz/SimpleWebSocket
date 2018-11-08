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