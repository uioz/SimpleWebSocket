import { routeParamCheckI, standardRequest } from "./types";
import { userNickNameCollection } from "./userCollection";
import { errorCode } from "./code";
import { sendErrorMessage } from "./public";
import * as webSocket from "ws";

/**
 * 执行路由前的参数完整性检查
 */
export const paramCheck: routeParamCheckI = {
    login(request: standardRequest) {

        const keys = Object.keys(request);

        if (keys.length == 2) {
            if (userNickNameCollection.has((request as any).nickName)) {
                return errorCode['login:该昵称已经有人使用'];
            }
        } else if (keys.length < 2) {
            return errorCode['login:类型请求缺少必要的参数'];
        } else {
            return errorCode['请求参数错误'];
        }

    },
    // logOut(request: standardRequest) {



    // }
};


/**
 * 格式化用户数据为json如果数据错误则返回错误码
 * @param userData 用户传入的数据
 */
export function formatUserData(userData: string): standardRequest | number {
    try {

        const result: standardRequest = JSON.parse(userData);

        if (typeof result != 'object' || Array.isArray(result) || !result.type) {
            throw errorCode['请求参数错误'];
        }

        return result;

    } catch (error) {

        return error;

    }
};

/**
 * 校验传入的数据是否符合要求
 * 
 * - 符合返回解析后的对象
 * - 不符合发送错误信息,然后返回false
 * @param ws webSocket
 * @param data 用户传入的数据对象
 */
export function checkAndFormat(ws:webSocket,data:string):standardRequest|false {

    const requestParam = formatUserData(data),
          requestType = requestParam['type'];

    // 处理错误
    if (typeof requestParam == 'number') {
        sendErrorMessage(ws, requestParam);
        return false;
    }

    if(!paramCheck[requestType]){
        sendErrorMessage(ws,errorCode['请求参数错误']);
        return false;
    }

    const requestCheckResult = paramCheck[requestType](requestParam);

    // 处理错误
    if (typeof requestCheckResult == 'number') {
        sendErrorMessage(ws, requestCheckResult);
        return false;
    }

    return requestParam;
};