"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userCollection_1 = require("./userCollection");
const verification_1 = require("./verification");
const public_1 = require("./public");
/**
 * 路由
 */
const route = {
    login: (ws, request) => {
        const time = Date.now().toString(32), nickName = request.nickName, id = nickName + time;
        userCollection_1.userCollection.set(id, ws);
        userCollection_1.userNickNameCollection.set(nickName, id);
        ws.nickName = nickName;
        const response = {
            type: 'login',
            result: true,
            auth: time
        };
        ws.send(JSON.stringify(response));
    }
};
function router(ws) {
    ws.on('message', (data) => {
        const result = verification_1.checkAndFormat(ws, data);
        if (result) {
            return route[result.type](ws, result);
        }
        return ws.close();
    });
    public_1.closeProcess.bind(ws);
    ws.once('error', public_1.closeProcess);
    ws.once('close', public_1.closeProcess);
}
exports.router = router;
;
