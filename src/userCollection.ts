import * as WebSocket from 'ws';

/**
 * 保存所有用户连接
 * 
 * - key 是用户的唯一凭证是用户的nickName+auth
 * 
 */
export const userCollection: Map<string, WebSocket> = new Map();

/**
 * 保存当前所有用户的昵称和对应的id
 */
export const userNickNameCollection:Map<string,string> = new Map();