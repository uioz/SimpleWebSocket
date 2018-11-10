"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("./code");
/**
 * 保存所有用户连接
 *
 * - key 是用户的唯一凭证是用户的nickName+auth
 */
const userCollection = new Map();
/**
 * 保存当前所有用户的昵称和对应的id
 */
const userNickNameCollection = new Map();
/**
 * 获取用户昵称和对应的id集合
 */
function getUsersIdCollection() {
    return userNickNameCollection;
}
exports.getUsersIdCollection = getUsersIdCollection;
;
/**
 * 获取用户id对应的socket集合
 */
function getUserSocketCollection() {
    return userCollection;
}
exports.getUserSocketCollection = getUserSocketCollection;
;
/**
 * 检测是否存在该用户
 * @param nickName 用户昵称
 */
exports.hasUser = (nickName) => userNickNameCollection.has(nickName);
/**
 * 删除用户的所有信息,如果存在该用户
 * @param nickName 用户的昵称
 */
function removeUser(nickName) {
    const userId = userNickNameCollection.get(nickName);
    if (!userId) {
        return false;
    }
    userNickNameCollection.delete(nickName);
    userCollection.delete(userId);
    return true;
}
exports.removeUser = removeUser;
/**
 * 添加一个用户,如果已存在用户返回false
 * @param nickName 用户昵称
 * @param auth 用户凭证
 * @param webSocket 用户socket
 */
function addUser(nickName, auth, webSocket) {
    if (exports.hasUser(nickName)) {
        return false;
    }
    const userId = nickName + auth;
    userNickNameCollection.set(nickName, userId);
    userCollection.set(userId, webSocket);
    return true;
}
exports.addUser = addUser;
;
function getLiveSockets(nickName) {
    const iterator = userCollection.values();
    if (!nickName) {
        return iterator;
    }
    const userId = userNickNameCollection.get(nickName), userSocket = userCollection.get(userId), result = [], OPENCODE = code_1.ReadyStateConstants['OPEN'];
    for (const socket of iterator) {
        if (userSocket !== socket && socket.readyState === OPENCODE) {
            result.push(socket);
        }
    }
    return result;
}
exports.getLiveSockets = getLiveSockets;
;
