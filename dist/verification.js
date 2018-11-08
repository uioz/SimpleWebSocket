"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userCollection_1 = require("./userCollection");
const code_1 = require("./code");
const public_1 = require("./public");
/**
 * 执行路由前的参数完整性检查
 */
exports.paramCheck = {
    login(request) {
        const keys = Object.keys(request);
        if (keys.length == 2) {
            if (userCollection_1.userNickNameCollection.has(request.nickName)) {
                return code_1.errorCode['login:该昵称已经有人使用'];
            }
        }
        else if (keys.length < 2) {
            return code_1.errorCode['login:类型请求缺少必要的参数'];
        }
        else {
            return code_1.errorCode['请求参数错误'];
        }
    },
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
 * - 不符合发送错误信息,然后返回false
 * @param ws webSocket
 * @param data 用户传入的数据对象
 */
function checkAndFormat(ws, data) {
    const requestParam = formatUserData(data), requestType = requestParam['type'];
    // 处理错误
    if (typeof requestParam == 'number') {
        public_1.sendErrorMessage(ws, requestParam);
        return false;
    }
    if (!exports.paramCheck[requestType]) {
        public_1.sendErrorMessage(ws, code_1.errorCode['请求参数错误']);
        return false;
    }
    const requestCheckResult = exports.paramCheck[requestType](requestParam);
    // 处理错误
    if (typeof requestCheckResult == 'number') {
        public_1.sendErrorMessage(ws, requestCheckResult);
        return false;
    }
    return requestParam;
}
exports.checkAndFormat = checkAndFormat;
;
