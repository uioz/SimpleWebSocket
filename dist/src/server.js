"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const router_1 = require("./router");
const public_1 = require("./public");
const dataPersistence_1 = require("./dataPersistence");
const userInput = process.argv.splice(2);
if (userInput.length < 1) {
    throw new Error('参数缺失');
}
// 设置服务器签名
const serverToken = userInput.pop();
if (!serverToken) {
    throw new Error('必须有服务器签名用于前后端交互使用!');
}
debugger;
dataPersistence_1.setServerToken(serverToken);
// 设置服务器端口
const defaultPort = parseInt(userInput.shift()) || 8888;
// 设置服务器用户组
const userGroupNames = userInput.length ? userInput : [dataPersistence_1.getDefaultGroupName()];
debugger;
dataPersistence_1.setDefaultGroupName(userGroupNames[0]);
dataPersistence_1.setUserGroup(userGroupNames);
const wss = new WebSocket.Server({
    port: defaultPort
});
wss.on('connection', router_1.router);
wss.on('error', (error) => {
    console.error(error);
});
wss.on('listening', () => {
    console.log(`WebSocket Server has running in ${defaultPort} port!`);
});
// 启用超时检查
public_1.crashedProcess();
