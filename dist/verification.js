"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userCollection_1 = require("./userCollection");
const code_1 = require("./code");
const public_1 = require("./public");
const dataCompare = new public_1.dataCompare();
dataCompare.setStandardCompare('login', {
    type: 'string',
    nickName: 'string'
});
dataCompare.setStandardCompare('message', {
    type: 'string',
    nickName: 'string',
    auth: 'string',
    message: 'string'
});
/**
 * 执行路由前的参数完整性检查
 */
exports.paramCheck = {
    login(request) {
        // 获取状态码
        const compareStateCode = dataCompare.compare('login', request);
        if (!compareStateCode) {
            if (userCollection_1.userNickNameCollection.has(request.nickName)) {
                return code_1.errorCode['login:该昵称已经有人使用'];
            }
            return true;
        }
        if (compareStateCode == 1) {
            return code_1.errorCode['login:类型请求缺少必要的参数'];
        }
        else {
            return code_1.errorCode['请求参数错误'];
        }
    },
    messsage(request) {
        // 获取状态码
        const compareStateCode = dataCompare.compare('login', request);
        if (!compareStateCode) {
            const userId = request.nickName + request.auth;
            if (!userCollection_1.userCollection.has(userId)) {
                return code_1.errorCode['system:用户不存在'];
            }
            return true;
        }
        if (compareStateCode == 1) {
            return code_1.errorCode['message:类型请求缺少必要参数'];
        }
        else {
            return code_1.errorCode['message:类型请求参数错误'];
        }
    }
};
/**
 * 格式化用户数据为json如果数据错误则返回错误码
 * @param userData 用户传入的数据
 */
function formatUserData(userData) {
    try {
        const result = JSON.parse(userData);
        if (typeof result != 'object' || Array.isArray(result) || !result.type) {
            throw code_1.errorCode['请求参数错误'];
        }
        return result;
    }
    catch (error) {
        return error;
    }
}
exports.formatUserData = formatUserData;
;
/**
 * 校验传入的数据是否符合要求
 *
 * - 符合返回解析后的对象
 * - 不符合向用户发送错误信息,然后返回false
 * @param ws webSocket
 * @param data 用户传入的数据对象
 */
function checkAndFormat(ws, data) {
    const requestParam = formatUserData(data), requestType = requestParam['type'];
    // 返回错误码
    if (typeof requestParam == 'number') {
        public_1.sendErrorMessage(ws, requestParam);
        return false;
    }
    // 如果没有对应的检测器
    if (!exports.paramCheck[requestType]) {
        public_1.sendErrorMessage(ws, code_1.errorCode['请求参数错误']);
        return false;
    }
    // 获取校验结果 
    const requestCheckResult = exports.paramCheck[requestType](requestParam);
    // 返回错误码
    if (typeof requestCheckResult == 'number') {
        public_1.sendErrorMessage(ws, requestCheckResult);
        return false;
    }
    // 返回格式化合校检后的请求对象
    return requestParam;
}
exports.checkAndFormat = checkAndFormat;
;
