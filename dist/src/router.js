"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataPersistence_1 = require("./dataPersistence");
const verification_1 = require("./verification");
const public_1 = require("./public");
const code_1 = require("./code");
/**
 * 路由
 */
const route = {
    login: (ws, request) => {
        const time = new Date(), auth = time.getTime().toString(32), nickName = request.nickName, groupName = request.groupName;
        dataPersistence_1.addUser(groupName, nickName, auth, ws);
        // 向socket挂载昵称
        ws.nickName = nickName;
        // 向socket挂载群组
        ws.groupName = groupName;
        public_1.broadcast(groupName, nickName, public_1.responseFactory.getBroadCastLoginResponse(nickName, time.toLocaleString()));
        public_1.send(ws, public_1.responseFactory.getLoginResponse(auth, groupName, dataPersistence_1.getUserGroupNames()));
    },
    message: (ws, request) => {
        const nickName = request.nickName, message = request.message, groupName = request.groupName;
        if (message.length < 1 && message.length > 1024) {
            return public_1.send(ws, public_1.responseFactory.getMessageErrorResponse(code_1.ErrorCode['message:消息的长度应该在1到1024个长度之间']));
        }
        public_1.broadcast(groupName, nickName, public_1.responseFactory.getBroadCastMessageResponse(message, nickName));
        public_1.send(ws, public_1.responseFactory.getMessageSuccessResponse());
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
    ws.once('error', public_1.closeProcess);
    ws.once('close', public_1.closeProcess);
}
exports.router = router;
;
