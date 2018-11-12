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
let defaultGroupName = 'defaultName';
function setDefaultGroupName(newName) {
    defaultGroupName = newName;
}
exports.setDefaultGroupName = setDefaultGroupName;
;
function getDefaultGroupName() {
    return defaultGroupName;
}
exports.getDefaultGroupName = getDefaultGroupName;
;
function hasGroupName(name) {
    return userGroup.has(name);
}
exports.hasGroupName = hasGroupName;
;
let serverToken = '';
function setServerToken(newName) {
    serverToken = newName;
}
exports.setServerToken = setServerToken;
;
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
    const iterator = userCollection.values();
    if (!nickName && !groupName) {
        return iterator;
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
