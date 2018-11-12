import * as WebSocket  from "ws";
import * as readline from "readline";
import { router } from "./router";
import { crashedProcess } from "./public";

let defaultPort: number = 8888;
let myPort:number;

if(myPort){

    defaultPort = myPort;

    createServer();

} else {

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

    wss.on('connection', router);

    wss.on('error', (error) => {

        console.error(error);

    });

    wss.on('listening', () => {

        console.log(`WebSocket Server has running in ${defaultPort} port!`);
        
    });

    crashedProcess();

};
