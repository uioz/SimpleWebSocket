"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const router_1 = require("./router");
const readline = require("readline");
let port = 8888;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
});
rl.prompt();
rl.question(`请输入服务器启用的端口号-默认端口号${port} 不输入端口号则使用默认端口号! \n`, (answer) => {
    if (answer) {
        port = parseInt(answer);
    }
    const wss = new WebSocket.Server({
        port: port
    });
    wss.on('connection', router_1.router);
    wss.on('error', (error) => {
        console.error(error);
    });
    wss.on('listening', () => {
        console.log(`WebSocket Server has running in ${port} port!`);
    });
});
