"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const router_1 = require("./router");
const public_1 = require("./public");
const readline = require("readline");
let defaultPort = 8888;
let myPort;
if (myPort) {
    defaultPort = myPort;
    createServer();
}
else {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '> '
    });
    rl.prompt();
    rl.question(`请输入服务器启用的端口号-默认端口号${defaultPort} 不输入端口号则使用默认端口号! \n`, (answer) => {
        if (answer) {
            defaultPort = parseInt(answer);
        }
        createServer();
    });
}
function createServer() {
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
    public_1.crashedProcess();
}
;
