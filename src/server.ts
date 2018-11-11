import * as WebSocket  from "ws";
import { router } from "./router";
import * as readline from "readline";

let port: number = 8888;

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

    wss.on('connection', router);

    wss.on('error', (error) => {
        console.error(error);
    });

    wss.on('listening', () => {
        console.log(`WebSocket Server has running in ${port} port!`);
    });


});


