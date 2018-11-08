"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("./code");
const userCollection_1 = require("./userCollection");
function bordcast() {
}
exports.bordcast = bordcast;
/**
 * 发送自定义的错误信息
 * @param ws socket对象
 * @param errorCode 错误代码
 */
function sendErrorMessage(ws, errorcode) {
    const response = {
        type: 'login',
        result: false,
        error: code_1.errorCode[errorcode]
    };
    console.log('响应错误:errorCode', errorcode, '错误详细内容:', code_1.errorCode[errorcode], '错误结果:', response);
    ws.send(JSON.stringify(response));
}
exports.sendErrorMessage = sendErrorMessage;
;
/**
 * 错误和关闭的自动处理
 * @param errorOrcloseCode 错误信息或者关闭代码
 * @param closeCodeReason 关闭代码对应的原因
 */
function closeProcess(errorOrcloseCode, closeCodeReason) {
    this.removeAllListeners();
    const nickName = this.nickName;
    if (nickName) {
        // 清除信息
        const userId = userCollection_1.userNickNameCollection.get(nickName);
        userCollection_1.userNickNameCollection.delete(nickName);
        userCollection_1.userCollection.delete(userId);
        // 此处广播离线
        return console.log(typeof errorOrcloseCode == 'object' ? '己连接用户错误-错误信息:' : '己连接用户关闭-关闭代码', errorOrcloseCode);
    }
    return console.log(typeof errorOrcloseCode == 'object' ? '未连接用户错误-错误信息:' : '未连接用户关闭-关闭代码', errorOrcloseCode);
}
exports.closeProcess = closeProcess;
;
