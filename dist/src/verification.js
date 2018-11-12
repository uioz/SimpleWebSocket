"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataPersistence_1 = require("./dataPersistence");
const code_1 = require("./code");
const public_1 = require("./public");
const dataCompare = new public_1.dataCompare();
const loginExp = /^[^\s][^\s]{0,9}$/;
dataCompare.setStandardCompare('login', {
    type: 'string',
    nickName: 'string',
    token: 'string'
});
dataCompare.setStandardCompare('message', {
    type: 'string',
    nickName: 'string',
    token: 'string',
    auth: 'string',
    message: 'string'
});
/**
 * 执行路由前的参数完整性检查
 */
exports.paramCheck = {
    login(request) {
        const compareStateCode = dataCompare.compare('login', request);
        if (!compareStateCode) {
            if (!loginExp.test(request.nickName)) {
                return code_1.ErrorCode['login:昵称必须长度在1到10之间的非空白字符串'];
            }
            let groupName = request.groupName;
            if (groupName) {
                if (!dataPersistence_1.hasGroupName(groupName)) {
                    return code_1.ErrorCode['system:群组不存在'];
                }
            }
            else {
                groupName = dataPersistence_1.getDefaultGroupName();
            }
            if (dataPersistence_1.hasUser(groupName, request.nickName)) {
                return code_1.ErrorCode['login:该昵称已经有人使用'];
            }
            return true;
        }
        if (compareStateCode == 1) {
            return code_1.ErrorCode['login:类型请求缺少必要的参数'];
        }
        else {
            return code_1.ErrorCode['system:请求参数错误'];
        }
    },
    message(request, webSocket) {
        // 获取状态码
        const compareStateCode = dataCompare.compare('message', request);
        if (!compareStateCode) {
            const nickName = request.nickName, groupName = webSocket.groupName;
            if (!dataPersistence_1.hasUser(groupName, nickName)) {
                return code_1.ErrorCode['system:用户不存在'];
            }
            return true;
        }
        if (compareStateCode == 1) {
            return code_1.ErrorCode['message:类型请求缺少必要参数'];
        }
        else {
            return code_1.ErrorCode['message:类型请求参数错误'];
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
            throw code_1.ErrorCode['system:请求参数错误'];
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
 * 用于拦截没有serverToken的请求
 * @param request 请求对象
 */
function autoFirewall(request) {
    if (request.token !== dataPersistence_1.getServerToken()) {
        return code_1.ErrorCode['system:请求参数错误'];
    }
    return true;
}
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
    // 数据格式化过滤器
    if (typeof requestParam == 'number') {
        public_1.sendErrorMessage(ws, requestParam);
        public_1.logError(code_1.ErrorCode['error:数据格式化错误'], data);
        return false;
    }
    // 服务器Token过滤器
    const ifNotHaveTokenCode = autoFirewall(requestParam);
    if (typeof ifNotHaveTokenCode === 'number') {
        public_1.sendErrorMessage(ws, ifNotHaveTokenCode);
        public_1.logError(code_1.ErrorCode['error:没有Token'], data);
        return false;
    }
    // 请求类型过滤器
    if (!exports.paramCheck[requestType]) {
        public_1.sendErrorMessage(ws, code_1.ErrorCode['system:请求参数错误']);
        public_1.logError(code_1.ErrorCode['error:没有对应的检测器'], data);
        return false;
    }
    // 路由过滤器
    const requestCheckResult = exports.paramCheck[requestType](requestParam, ws);
    if (typeof requestCheckResult == 'number') {
        public_1.sendErrorMessage(ws, requestCheckResult);
        public_1.logError(code_1.ErrorCode['error:数据校检错误'], data);
        return false;
    }
    // 返回格式化合校检后的请求对象
    return requestParam;
}
exports.checkAndFormat = checkAndFormat;
;
