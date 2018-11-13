"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 保存所有用户连接
 *
 * - key 是用户的唯一凭证是用户的nickName+auth
 */
const userCollection = new Map();
/**
 * 以Group的形式保存用户 键是用户组名称 值是nickName对应的userID组成的Map
 */
const userGroup = new Map();
let defaultGroupName = 'defaultGroup';
function setDefaultGroupName(newName) {
    defaultGroupName = newName;
}
exports.setDefaultGroupName = setDefaultGroupName;
;
/**
 * 获取内置的用户组名称
 */
function getDefaultGroupName() {
    return defaultGroupName;
}
exports.getDefaultGroupName = getDefaultGroupName;
;
/**
 * 查看当前用户组集合中是否存在指定名称的用户组
 * @param name 用户组名称
 */
function hasGroupName(name) {
    return userGroup.has(name);
}
exports.hasGroupName = hasGroupName;
;
/**
 * 使用给定的用户组名称来创建多个用户组
 * @param groupNames 有字符串组成的用户组
 */
function setUserGroup(groupNames) {
    for (const name of groupNames) {
        userGroup.set(name, new Map());
    }
}
exports.setUserGroup = setUserGroup;
;
/**
 * 获取当前存在的用户组
 */
function getUserGroupNames() {
    return Array.from(userGroup.keys());
}
exports.getUserGroupNames = getUserGroupNames;
let serverToken = '';
/**
 * 向服务器设置一个签名用于请求时候的验证
 * @param newName 设置一个服务器签名
 */
function setServerToken(newName) {
    serverToken = newName;
}
exports.setServerToken = setServerToken;
;
/**
 * 获取服务器内部的签名
 */
function getServerToken() {
    return serverToken;
}
exports.getServerToken = getServerToken;
;
/**
 * 检测指定群组下是是否存在指定昵称的用户
 * @param groupName 群组名称
 * @param nickName 用户昵称
 */
function hasUser(groupName, nickName) {
    return userGroup.get(groupName).has(nickName);
}
exports.hasUser = hasUser;
/**
 * 删除指定群组的指定昵称的用户
 * @param groupName 群组的名称
 * @param nickName 用户的昵称
 */
function removeUser(groupName, nickName) {
    const nickNameMap = userGroup.get(groupName);
    if (!nickNameMap) {
        return false;
    }
    const userID = nickNameMap.get(nickName);
    if (!userID) {
        return false;
    }
    userCollection.delete(userID);
    nickNameMap.delete(nickName);
    return true;
}
exports.removeUser = removeUser;
;
/**
 * 添加一个用户,如果已存在用户返回false
 * @param nickName 用户昵称
 * @param auth 用户凭证
 * @param webSocket 用户socket
 */
function addUser(groupName, nickName, auth, webSocket) {
    if (hasUser(groupName, nickName)) {
        return false;
    }
    const userId = nickName + auth, nickNameMap = userGroup.get(groupName);
    nickNameMap.set(nickName, userId);
    userCollection.set(userId, webSocket);
    return true;
}
exports.addUser = addUser;
;
function getOtherPeopleSocket(groupName, nickName) {
    if (!nickName && !groupName) {
        return userCollection.values();
    }
    const nickNameMap = userGroup.get(groupName), allUsersID = nickNameMap.values(), userID = nickNameMap.get(nickName), result = [];
    for (const otherUserID of allUsersID) {
        if (otherUserID !== userID) {
            result.push(userCollection.get(otherUserID));
        }
    }
    return result;
}
exports.getOtherPeopleSocket = getOtherPeopleSocket;
;
