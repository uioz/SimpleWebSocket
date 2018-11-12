"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 定义服务端的错误信息
 */
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["system:\u8BF7\u6C42\u53C2\u6570\u9519\u8BEF"] = 10] = "system:\u8BF7\u6C42\u53C2\u6570\u9519\u8BEF";
    ErrorCode[ErrorCode["login:\u8BE5\u6635\u79F0\u5DF2\u7ECF\u6709\u4EBA\u4F7F\u7528"] = 11] = "login:\u8BE5\u6635\u79F0\u5DF2\u7ECF\u6709\u4EBA\u4F7F\u7528";
    ErrorCode[ErrorCode["login:\u7C7B\u578B\u8BF7\u6C42\u7F3A\u5C11\u5FC5\u8981\u7684\u53C2\u6570"] = 12] = "login:\u7C7B\u578B\u8BF7\u6C42\u7F3A\u5C11\u5FC5\u8981\u7684\u53C2\u6570";
    ErrorCode[ErrorCode["login:\u6635\u79F0\u5FC5\u987B\u957F\u5EA6\u57281\u523010\u4E4B\u95F4\u7684\u975E\u7A7A\u767D\u5B57\u7B26\u4E32"] = 13] = "login:\u6635\u79F0\u5FC5\u987B\u957F\u5EA6\u57281\u523010\u4E4B\u95F4\u7684\u975E\u7A7A\u767D\u5B57\u7B26\u4E32";
    ErrorCode[ErrorCode["message:\u7C7B\u578B\u8BF7\u6C42\u53C2\u6570\u9519\u8BEF"] = 20] = "message:\u7C7B\u578B\u8BF7\u6C42\u53C2\u6570\u9519\u8BEF";
    ErrorCode[ErrorCode["message:\u7C7B\u578B\u8BF7\u6C42\u7F3A\u5C11\u5FC5\u8981\u53C2\u6570"] = 21] = "message:\u7C7B\u578B\u8BF7\u6C42\u7F3A\u5C11\u5FC5\u8981\u53C2\u6570";
    ErrorCode[ErrorCode["message:\u6D88\u606F\u7684\u957F\u5EA6\u5E94\u8BE5\u57281\u52301024\u4E2A\u957F\u5EA6\u4E4B\u95F4"] = 22] = "message:\u6D88\u606F\u7684\u957F\u5EA6\u5E94\u8BE5\u57281\u52301024\u4E2A\u957F\u5EA6\u4E4B\u95F4";
    ErrorCode[ErrorCode["system:\u7528\u6237\u4E0D\u5B58\u5728"] = 100] = "system:\u7528\u6237\u4E0D\u5B58\u5728";
    ErrorCode[ErrorCode["system:\u7FA4\u7EC4\u4E0D\u5B58\u5728"] = 101] = "system:\u7FA4\u7EC4\u4E0D\u5B58\u5728";
    ErrorCode[ErrorCode["error:\u6570\u636E\u683C\u5F0F\u5316\u9519\u8BEF"] = 200] = "error:\u6570\u636E\u683C\u5F0F\u5316\u9519\u8BEF";
    ErrorCode[ErrorCode["error:\u6CA1\u6709\u5BF9\u5E94\u7684\u68C0\u6D4B\u5668"] = 201] = "error:\u6CA1\u6709\u5BF9\u5E94\u7684\u68C0\u6D4B\u5668";
    ErrorCode[ErrorCode["error:\u6570\u636E\u6821\u68C0\u9519\u8BEF"] = 202] = "error:\u6570\u636E\u6821\u68C0\u9519\u8BEF";
    ErrorCode[ErrorCode["error:\u6CA1\u6709Token"] = 203] = "error:\u6CA1\u6709Token";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
;
/**
 * 定义了响应错误码对应的错误类型
 */
exports.ErrorType = {
    10: 'system',
    11: 'login',
    12: 'login',
    13: 'message',
    14: 'message',
    100: 'system'
};
/**
 * 定义连接状态描述符号
 */
var ReadyStateConstants;
(function (ReadyStateConstants) {
    ReadyStateConstants[ReadyStateConstants["CONNECTING"] = 0] = "CONNECTING";
    ReadyStateConstants[ReadyStateConstants["OPEN"] = 1] = "OPEN";
    ReadyStateConstants[ReadyStateConstants["CLOSING"] = 2] = "CLOSING";
    ReadyStateConstants[ReadyStateConstants["CLOSED"] = 3] = "CLOSED";
})(ReadyStateConstants = exports.ReadyStateConstants || (exports.ReadyStateConstants = {}));
;
/**
 * 定义连接状态对应的中文翻译
 */
var ReadyStateConstantsTranslated;
(function (ReadyStateConstantsTranslated) {
    ReadyStateConstantsTranslated["CONNECTING"] = "\u8FDE\u63A5\u4E2D";
    ReadyStateConstantsTranslated["OPEN"] = "\u6253\u5F00";
    ReadyStateConstantsTranslated["CLOSING"] = "\u5173\u95ED\u4E2D";
    ReadyStateConstantsTranslated["CLOSED"] = "\u5DF2\u5173\u95ED";
})(ReadyStateConstantsTranslated = exports.ReadyStateConstantsTranslated || (exports.ReadyStateConstantsTranslated = {}));
;
