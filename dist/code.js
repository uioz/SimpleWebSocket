"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 定义服务端的错误信息
 */
var errorCode;
(function (errorCode) {
    errorCode[errorCode["\u8BF7\u6C42\u53C2\u6570\u9519\u8BEF"] = 10] = "\u8BF7\u6C42\u53C2\u6570\u9519\u8BEF";
    errorCode[errorCode["login:\u8BE5\u6635\u79F0\u5DF2\u7ECF\u6709\u4EBA\u4F7F\u7528"] = 11] = "login:\u8BE5\u6635\u79F0\u5DF2\u7ECF\u6709\u4EBA\u4F7F\u7528";
    errorCode[errorCode["login:\u7C7B\u578B\u8BF7\u6C42\u7F3A\u5C11\u5FC5\u8981\u7684\u53C2\u6570"] = 12] = "login:\u7C7B\u578B\u8BF7\u6C42\u7F3A\u5C11\u5FC5\u8981\u7684\u53C2\u6570";
    errorCode[errorCode["message:\u7C7B\u578B\u8BF7\u6C42\u53C2\u6570\u9519\u8BEF"] = 13] = "message:\u7C7B\u578B\u8BF7\u6C42\u53C2\u6570\u9519\u8BEF";
    errorCode[errorCode["message:\u7C7B\u578B\u8BF7\u6C42\u7F3A\u5C11\u5FC5\u8981\u53C2\u6570"] = 14] = "message:\u7C7B\u578B\u8BF7\u6C42\u7F3A\u5C11\u5FC5\u8981\u53C2\u6570";
    errorCode[errorCode["system:\u7528\u6237\u4E0D\u5B58\u5728"] = 100] = "system:\u7528\u6237\u4E0D\u5B58\u5728";
})(errorCode = exports.errorCode || (exports.errorCode = {}));
;
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
