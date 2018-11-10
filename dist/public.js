"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("./code");
const dataPersistence_1 = require("./dataPersistence");
const util_1 = require("util");
/**
 * 向除了该用户的所有在线的用户广播消息
 * @param nickName 用户昵称
 * @param data 发送的数据
 */
function broadcast(nickName, data) {
    const sockets = dataPersistence_1.getLiveSockets(nickName);
    for (const socket of sockets) {
        socket.send(JSON.stringify(data));
    }
}
exports.broadcast = broadcast;
;
/**
 * 向系统或者控制台打印或者输出
 * @param errorCode 错误代码
 * @param data 输出的数据
 */
function logError(errorCode, data) {
    console.log('\n', '----------logError----------');
    console.log('连接错误原因:', code_1.ErrorCode[errorCode], '\n', '用户连接源数据:', data);
    console.log('----------logErrorEnd----------', '\n');
}
exports.logError = logError;
;
/**
 * 发送自定义的错误信息
 * @param ws socket对象
 * @param errorCode 错误代码
 */
function sendErrorMessage(ws, errorcode) {
    const errorType = code_1.ErrorType[errorcode] ? code_1.ErrorType[errorcode] : 'system';
    const response = {
        type: errorType,
        result: false,
        error: code_1.ErrorCode[errorcode]
    };
    console.log('\n', '-------------sendErrorMessage------------');
    console.log('连接类型: ', ws.nickName ? `登录用户-昵称:${ws.nickName}` : `未登录用户`, '\n', 'errorCode:', errorcode, '\n', '错误详细内容:', code_1.ErrorCode[errorcode], '\n', '错误结果:', response);
    console.log('------------sendErrorMessageEnd-----------', '\n');
    try {
        ws.send(JSON.stringify(response));
    }
    catch (error) {
    }
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
    if (dataPersistence_1.hasUser(nickName)) {
        dataPersistence_1.removeUser(nickName);
        const response = {
            type: 'broadCastLogout',
            result: {
                userName: nickName,
                time: new Date().toLocaleString()
            }
        };
        broadcast(nickName, response);
        console.log('\n', '---------------closeAndErrorProcess--------------');
        console.log(typeof errorOrcloseCode == 'object' ? `昵称:${nickName}连接错误:` : `昵称:${nickName}通信关闭-关闭代码`, errorOrcloseCode, '\n');
        console.log('-------------closeAndErrorProcessEnd------------', '\n');
        return;
    }
    console.log('\n', '---------------closeAndErrorProcess--------------');
    console.log(typeof errorOrcloseCode == 'object' ? `非法用户连接错误:` : `非法用户通信关闭-关闭代码`, errorOrcloseCode);
    console.log('----------------closeAndErrorProcessEnd------------', '\n');
    return;
}
exports.closeProcess = closeProcess;
;
var compareStateCode;
(function (compareStateCode) {
    compareStateCode[compareStateCode["\u5339\u914D\u6B63\u786E"] = 0] = "\u5339\u914D\u6B63\u786E";
    compareStateCode[compareStateCode["\u8FC7\u5C11\u53C2\u6570"] = 1] = "\u8FC7\u5C11\u53C2\u6570";
    compareStateCode[compareStateCode["\u8FC7\u591A\u53C2\u6570"] = 2] = "\u8FC7\u591A\u53C2\u6570";
    compareStateCode[compareStateCode["\u53C2\u6570\u952E\u540D\u4E0D\u5BF9"] = 3] = "\u53C2\u6570\u952E\u540D\u4E0D\u5BF9";
    compareStateCode[compareStateCode["\u53C2\u6570\u7C7B\u578B\u4E0D\u5339\u914D"] = 4] = "\u53C2\u6570\u7C7B\u578B\u4E0D\u5339\u914D";
    compareStateCode[compareStateCode["\u53C2\u6570\u4E0D\u662F\u5BF9\u8C61"] = 5] = "\u53C2\u6570\u4E0D\u662F\u5BF9\u8C61";
})(compareStateCode || (compareStateCode = {}));
;
/**
 * 用于比较对象是否符合相应的格式
 */
class dataCompare {
    constructor() {
        /**
         * 保存作为比较的标准
         */
        this.standard = {};
    }
    /**
     * 在内部添加一个比较标准对象并且需要提供一个名字
     *
     * 一个比较标准对象例子:
     * {
     *   key1:'number',
     *   key2:'object',
     *   key3:'array',
     *   key4:'string',
     *   key5:'boolean'
     * }
     *
     * @param name 比较标准的名称
     * @param obj 比较标准的格式
     */
    setStandardCompare(name, obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const type = obj[key];
                switch (type) {
                    case 'string':
                        obj[key] = util_1.isString;
                        break;
                    case 'boolean':
                        obj[key] = util_1.isBoolean;
                        break;
                    case 'object':
                        obj[key] = util_1.isObject;
                        break;
                    case 'array':
                        obj[key] = util_1.isArray;
                        break;
                    case 'number':
                        obj[key] = util_1.isNumber;
                        break;
                }
            }
        }
        this.standard[name] = obj;
    }
    ;
    /**
     * 校验对象是否符合指定的对象标准
     *
     * 当比较成功的时候返回状态码 0 其余的返回大于0的整数.
     *
     * 直接判断成功状态可以使用!compare(name,data)
     *
     * @param name 使用比较标准的名字
     * @param data 被校验的对象
     */
    compare(name, data) {
        if (!util_1.isObject(data)) {
            return dataCompare.StateCode['参数不是对象'];
        }
        const compareStandard = this.standard[name];
        const standardKeys = Object.keys(compareStandard);
        const comparisonKeys = Object.keys(data);
        if (comparisonKeys.length > standardKeys.length) {
            return dataCompare.StateCode['过多参数'];
        }
        if (comparisonKeys.length < standardKeys.length) {
            return dataCompare.StateCode['过少参数'];
        }
        for (const key of standardKeys) {
            if (comparisonKeys.indexOf(key) != -1) {
                if (!compareStandard[key](data[key])) {
                    return dataCompare.StateCode['参数类型不匹配'];
                }
            }
            else {
                return dataCompare.StateCode['参数键名不对'];
            }
        }
        return dataCompare.StateCode['匹配正确'];
    }
    ;
}
/**
 * 状态码
 */
dataCompare.StateCode = compareStateCode;
exports.dataCompare = dataCompare;
;
