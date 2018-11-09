import * as WebSocket from 'ws';
import { ReadyStateConstants } from "./code";

/**
 * 保存所有用户连接
 * 
 * - key 是用户的唯一凭证是用户的nickName+auth
 */
const userCollection: Map<string, WebSocket> = new Map();

/**
 * 保存当前所有用户的昵称和对应的id
 */
const userNickNameCollection: Map<string, string> = new Map();

/**
 * 获取用户昵称和对应的id集合
 */
export function getUsersIdCollection() {
    return userNickNameCollection;
};

/**
 * 获取用户id对应的socket集合
 */
export function getUserSocketCollection() {
    return userCollection;
};

/**
 * 检测是否存在该用户
 * @param nickName 用户昵称
 */
export const hasUser = (nickName: string) => userNickNameCollection.has(nickName);

/**
 * 删除用户的所有信息,如果存在该用户
 * @param nickName 用户的昵称
 */
export function removeUser(nickName: string): boolean {

    const userId = userNickNameCollection.get(nickName);

    if (!userId) {
        return false;
    }

    userNickNameCollection.delete(nickName);
    userCollection.delete(userId);
    
    return true;

}

/**
 * 添加一个用户,如果已存在用户返回false
 * @param nickName 用户昵称
 * @param auth 用户凭证
 * @param webSocket 用户socket
 */
export function addUser(nickName: string, auth: string, webSocket: WebSocket): boolean {

    if (hasUser(nickName)) {
        return false;
    }

    const userId = nickName + auth;

    userNickNameCollection.set(nickName, userId);
    userCollection.set(userId, webSocket);

    return true;

};

/**
 * 获取所有的socket
 * - 如果没有内容传入则返回所有的socket对象
 * - 如果传入了用户昵称则返回没有该用户且没有均在OPEN状态的socket集合
 * @param nickName 用户昵称
 */
export function getLiveSockets(): IterableIterator<WebSocket>;
export function getLiveSockets(nickName: string): Array<WebSocket>;
export function getLiveSockets(nickName?: string) {

    const iterator = userCollection.values();

    if (!nickName) {
        return iterator;
    }

    const userId = userNickNameCollection.get(nickName),
        userSocket = userCollection.get(userId),
        result: Array<WebSocket> = [],
        OPENCODE = ReadyStateConstants['OPEN'];


    for (const socket of iterator) {

        if (userSocket !== socket && socket.readyState === OPENCODE) {

            result.push(socket);

        }

    }

    return result;
};



