import * as WebSocket from 'ws';

/**
 * 保存所有用户连接
 * 
 * - key 是用户的唯一凭证是用户的nickName+auth
 */
const userCollection: Map<string, WebSocket> = new Map();

/**
 * 以Group的形式保存用户 键是用户组名称 值是nickName对应的userID组成的Map
 */
const userGroup: Map<string, Map<string, string>> = new Map();

let defaultGroupName = 'defaultName';

export function setDefaultGroupName(newName:string) {
    defaultGroupName = newName;
};

export function getDefaultGroupName() {
    return defaultGroupName;
};

export function hasGroupName(name:string) {
    return userGroup.has(name);
};

let serverToken = '';

export function setServerToken(newName: string) {
    serverToken = newName;
};

export function getServerToken() {
    return serverToken;
};



/**
 * 检测指定群组下是是否存在指定昵称的用户
 * @param groupName 群组名称
 * @param nickName 用户昵称
 */
export function hasUser(groupName: string, nickName: string): boolean {

    return userGroup.get(groupName).has(nickName);
}

/**
 * 使用给定的用户组名称来创建多个用户组
 * @param groupNames 有字符串组成的用户组
 */
export function setUserGroup(groupNames:string[]) {
    for (const name of groupNames) {
        userGroup.set(name,new Map());
    }
};




/**
 * 删除指定群组的指定昵称的用户
 * @param groupName 群组的名称
 * @param nickName 用户的昵称
 */
export function removeUser(groupName:string,nickName: string): boolean {

    const nickNameMap = userGroup.get(groupName);

    if(!nickNameMap){
        return false;
    }

    const userID = nickNameMap.get(nickName);

    if(!userID){
        return false;
    }

    userCollection.delete(userID);
    nickNameMap.delete(nickName);
    
    return true;

};

/**
 * 添加一个用户,如果已存在用户返回false
 * @param nickName 用户昵称
 * @param auth 用户凭证
 * @param webSocket 用户socket
 */
export function addUser(groupName:string,nickName: string, auth: string, webSocket: WebSocket): boolean {

    if (hasUser(groupName,nickName)) {
        return false;
    }

    const 
    userId = nickName + auth,
    nickNameMap = userGroup.get(groupName);

    nickNameMap.set(nickName,userId);
    userCollection.set(userId, webSocket);

    return true;

};

/**
 * 获取所有的socket
 * - 如果没有内容传入则返回所有的socket对象
 * - 如果传入了用户昵称则返回没有该用户且没有均在OPEN状态的socket集合
 * @param nickName 用户昵称
 */
export function getOtherPeopleSocket(): IterableIterator<WebSocket>;
export function getOtherPeopleSocket(groupName:string,nickName: string): Array<WebSocket>;
export function getOtherPeopleSocket(groupName?:string,nickName?: string) {

    const iterator = userCollection.values();

    if (!nickName && !groupName) {
        return iterator;
    }

    const 
    nickNameMap = userGroup.get(groupName),
    allUsersID = nickNameMap.values(),
    userID = nickNameMap.get(nickName),
    result:Array<WebSocket> = [];

    for (const otherUserID of allUsersID) {

        if(otherUserID !== userID){
            result.push(userCollection.get(otherUserID));
        }

    }

    return result;
};



