import * as webSocket from "ws";
import { standardErrorResponse } from "./types";
import { errorCode } from "./code";
import { userCollection,userNickNameCollection } from "./userCollection";

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

    console.log('响应错误:errorCode', errorcode,'错误详细内容:',errorCode[errorcode],'错误结果:',response);

    ws.send(JSON.stringify(response));
};

/**
 * 错误和关闭的自动处理
 * @param errorOrcloseCode 错误信息或者关闭代码
 * @param closeCodeReason 关闭代码对应的原因
 */
export function closeProcess(this:webSocket,errorOrcloseCode:object|number,closeCodeReason?:string) {

    this.removeAllListeners();

    const nickName:string = (this as any).nickName;

    if(nickName){

        // 清除信息
        const userId = userNickNameCollection.get(nickName);
        userNickNameCollection.delete(nickName);
        userCollection.delete(userId);

        // 此处广播离线
        return console.log(typeof errorOrcloseCode == 'object' ? '己连接用户错误-错误信息:' : '己连接用户关闭-关闭代码',errorOrcloseCode);
        
    }

    return console.log(typeof errorOrcloseCode == 'object' ? '未连接用户错误-错误信息:' : '未连接用户关闭-关闭代码', errorOrcloseCode);

};