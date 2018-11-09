import * as webSocket from "ws";
import { userCollection, userNickNameCollection } from "./userCollection";
import {
    routeI,
    requestLoginType,
    loginResponse,
} from "./types";
import { checkAndFormat } from "./verification";
import { closeProcess } from "./public";


/**
 * 路由
 */
const route: routeI = {
    login: (ws: webSocket, request: requestLoginType) => {

        const time = Date.now().toString(32),
            nickName = request.nickName,
            id = nickName + time;

        userCollection.set(id, ws);
        userNickNameCollection.set(nickName, id);
        (ws as any).nickName = nickName;

        const response: loginResponse = {
            type: 'login',
            result: true,
            auth:time
        };

        ws.send(JSON.stringify(response));
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

        return ws.close();

    });

    closeProcess.bind(ws);

    ws.once('error',closeProcess);
    ws.once('close',closeProcess);

};
