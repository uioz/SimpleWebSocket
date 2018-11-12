import * as webSocket from "ws";
import {
    routeI,
    requestLoginType,
    requestMessageType,
} from "./types";
import { addUser } from "./dataPersistence";
import { checkAndFormat } from "./verification";
import { closeProcess, broadcast,responseFactory } from "./public";
import { ErrorCode } from "./code";

/**
 * 路由
 */
const route: routeI = {
    login: (ws: webSocket, request: requestLoginType) => {

        const
            time = new Date(),
            auth = time.getTime().toString(32),
            nickName = request.nickName;

        addUser(nickName, auth, ws);

        // 向socket挂载昵称
        (ws as any).nickName = nickName

        broadcast(nickName,responseFactory.getBroadCastLoginResponse(nickName,time.toLocaleString()));
        ws.send(JSON.stringify(responseFactory.getLoginResponse(auth)));

    },
    message: (ws: webSocket, request: requestMessageType) => {

        const
            nickName = request.nickName,
            message = request.message;
        
        if(message.length < 1 && message.length > 1024){

            return ws.send(JSON.stringify(responseFactory.getMessageErrorResponse(ErrorCode['message:消息的长度应该在1到1024个长度之间'])));

        }

        broadcast(nickName,responseFactory.getBroadCastMessageResponse(message,nickName));
        ws.send(JSON.stringify(responseFactory.getMessageSuccessResponse()));
        
    }
};

/**
 * route的逻辑相当简单.
 * 
 * 校验用户传入的参数是否符合规定的格式.
 * 
 * 如果不符合就发送对应的不符合的消息,然后中断连接.
 * 
 * 如果非法连接就直接中断.
 * 
 * @param ws webSocket对象
 */
export function router(ws: webSocket) {

    ws.on('message', (data: string) => {

        const result = checkAndFormat(ws, data);

        if (result) {
            return route[result.type](ws, result);
        }

        return ws.terminate();

    });

    ws.once('error', closeProcess);
    ws.once('close', closeProcess);

};
