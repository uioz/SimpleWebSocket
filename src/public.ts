import * as webSocket from "ws";
import { standardErrorResponse } from "./types";
import { errorCode } from "./code";
import { userCollection, userNickNameCollection } from "./userCollection";
import { isString, isBoolean, isObject, isArray, isNull, isNumber } from "util";

export function bordcast() {

}

/**
 * 发送自定义的错误信息
 * @param ws socket对象
 * @param errorCode 错误代码
 */
export function sendErrorMessage(ws: webSocket, errorcode: number) {


    const response: standardErrorResponse = {
        type: 'login',
        result: false,
        error: errorCode[errorcode]
    };

    console.log('响应错误:errorCode', errorcode, '错误详细内容:', errorCode[errorcode], '错误结果:', response);

    ws.send(JSON.stringify(response));
};

/**
 * 错误和关闭的自动处理
 * @param errorOrcloseCode 错误信息或者关闭代码
 * @param closeCodeReason 关闭代码对应的原因
 */
export function closeProcess(this: webSocket, errorOrcloseCode: object | number, closeCodeReason?: string) {

    this.removeAllListeners();

    const nickName: string = (this as any).nickName;

    if (nickName) {

        // 清除信息
        const userId = userNickNameCollection.get(nickName);
        userNickNameCollection.delete(nickName);
        userCollection.delete(userId);

        // 此处广播离线
        return console.log(typeof errorOrcloseCode == 'object' ? '己连接用户错误-错误信息:' : '己连接用户关闭-关闭代码', errorOrcloseCode);

    }

    return console.log(typeof errorOrcloseCode == 'object' ? '未连接用户错误-错误信息:' : '未连接用户关闭-关闭代码', errorOrcloseCode);

};

type canCompareType = 'string' | 'number' | 'boolean' | 'object' | 'array';

enum compareStateCode {
    '匹配正确' = 0,
    '过少参数' = 1,
    '过多参数' = 2,
    '参数键名不对' = 3,
    '参数类型不匹配' = 4,
    '参数不是对象' = 5,
}

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

        if(!isObject(data)){
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

