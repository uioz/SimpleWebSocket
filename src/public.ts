import * as webSocket from "ws";
import { standardErrorResponse, standardBroadCastResponse,broadCastLogoutResponse } from "./types";
import { ErrorCode, ErrorType } from "./code";
import { removeUser, getLiveSockets,hasUser } from "./dataPersistence";
import { isString, isBoolean, isObject, isArray, isNumber } from "util";


/**
 * 向除了该用户的所有在线的用户广播消息
 * @param nickName 用户昵称
 * @param data 发送的数据
 */
export function broadcast(nickName: string, data: standardBroadCastResponse):void {

    const sockets = getLiveSockets(nickName);

    for (const socket of sockets) {

        socket.send(JSON.stringify(data));

    }

};

/**
 * 向系统或者控制台打印或者输出
 * @param errorCode 错误代码
 * @param data 输出的数据
 */
export function logError(errorCode: number, data: any):void {

    console.log('\n','----------logError----------');
    console.log('连接错误原因:', ErrorCode[errorCode],'\n','用户连接源数据:', data);
    console.log('----------logErrorEnd----------', '\n');


};

/**
 * 发送自定义的错误信息
 * @param ws socket对象
 * @param errorCode 错误代码
 */
export function sendErrorMessage(ws: webSocket, errorcode: number):void {

    const errorType = ErrorType[errorcode] ? ErrorType[errorcode] : 'system';

    const response: standardErrorResponse = {
        type: errorType,
        result: false,
        error: ErrorCode[errorcode]
    };

    console.log('\n','-------------sendErrorMessage------------');
    console.log('连接类型: ',(ws as any).nickName ? `登录用户-昵称:${(ws as any).nickName}` : `未登录用户`,'\n', 'errorCode:', errorcode,'\n','错误详细内容:', ErrorCode[errorcode],'\n','错误结果:', response);
    console.log( '------------sendErrorMessageEnd-----------', '\n');

    try {
        ws.send(JSON.stringify(response));
    } catch (error) {

    }
};

/**
 * 错误和关闭的自动处理
 * @param errorOrcloseCode 错误信息或者关闭代码
 * @param closeCodeReason 关闭代码对应的原因
 */
export function closeProcess(this: webSocket, errorOrcloseCode: object | number, closeCodeReason?: string) {

    this.removeAllListeners();

    const nickName: string = (this as any).nickName;

    if (hasUser(nickName)) {

        removeUser(nickName);

        const response: broadCastLogoutResponse = {
            type:'broadCastLogout',
            result:{
                userName:nickName,
                time:new Date().toLocaleString()
            }
        };

        broadcast(nickName,response);

        console.log('\n','---------------closeAndErrorProcess--------------');
        console.log(typeof errorOrcloseCode == 'object' ? `昵称:${nickName}连接错误:` : `昵称:${nickName}通信关闭-关闭代码`, errorOrcloseCode, '\n');
        console.log( '-------------closeAndErrorProcessEnd------------', '\n');
        return ;
    }

    console.log('\n', '---------------closeAndErrorProcess--------------');
    console.log(typeof errorOrcloseCode == 'object' ? `非法用户连接错误:` : `非法用户通信关闭-关闭代码`, errorOrcloseCode);
    console.log('----------------closeAndErrorProcessEnd------------', '\n');

    return ;
};

type canCompareType = 'string' | 'number' | 'boolean' | 'object' | 'array';

enum compareStateCode {
    '匹配正确' = 0,
    '过少参数' = 1,
    '过多参数' = 2,
    '参数键名不对' = 3,
    '参数类型不匹配' = 4,
    '参数不是对象' = 5,
};

/**
 * 用于比较对象是否符合相应的格式
 */
export class dataCompare {

    /**
     * 状态码
     */
    static StateCode = compareStateCode;

    /**
     * 保存作为比较的标准
     */
    private standard: {
        [stardandName: string]: {
            [key: string]: (obj: any) => boolean;
        }
    } = {};

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
    public setStandardCompare(name: string, obj: { [key: string]: canCompareType }) {

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const type = obj[key];

                switch (type) {
                    case 'string':
                        (obj[key] as any) = isString;
                        break;
                    case 'boolean':
                        (obj[key] as any) = isBoolean;
                        break;
                    case 'object':
                        (obj[key] as any) = isObject;
                        break;
                    case 'array':
                        (obj[key] as any) = isArray;
                        break;
                    case 'number':
                        (obj[key] as any) = isNumber;
                        break;
                }

            }
        }

        this.standard[name] = obj as any;

    };

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
    public compare(name: string, data: object): number {

        if (!isObject(data)) {
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

            } else {
                return dataCompare.StateCode['参数键名不对'];
            }

        }

        return dataCompare.StateCode['匹配正确'];

    };

};

