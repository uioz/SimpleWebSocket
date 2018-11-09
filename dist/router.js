"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataPersistence_1 = require("./dataPersistence");
const verification_1 = require("./verification");
const public_1 = require("./public");
// TODO Date格式化
/**
 * 路由
 */
const route = {
    login: (ws, request) => {
        const time = Date.now(), auth = time.toString(32), nickName = request.nickName;
        dataPersistence_1.addUser(nickName, auth, ws);
        const broadCastResponse = {
            type: 'broadCastLogin',
            result: {
                userName: nickName,
                message: time.toString()
            }
        };
        public_1.broadcast(nickName, broadCastResponse);
        const response = {
            type: 'login',
            result: true,
            auth: auth
        };
        ws.send(JSON.stringify(response));
    },
    message: (ws, request) => {
        const nickName = request.nickName, message = request.message;
        const broadCastResponse = {
            type: 'broadCast',
            result: {
                userName: nickName,
                message: message
            }
        };
        public_1.broadcast(nickName, broadCastResponse);
        const response = {
            type: 'message',
            result: true
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
function router(ws) {
    ws.on('message', (data) => {
        const result = verification_1.checkAndFormat(ws, data);
        if (result) {
            return route[result.type](ws, result);
        }
        return ws.terminate();
    });
    public_1.closeProcess.bind(ws);
    ws.once('error', public_1.closeProcess);
    ws.once('close', public_1.closeProcess);
}
exports.router = router;
;
