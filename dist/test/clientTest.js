"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketPackage_1 = require("../src/socketPackage");
const readline = require("readline");
const token = process.argv.splice(2)[0];
let url = 'ws://127.0.0.1:8888';
let nickName = '二狗子';
let client;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: (line) => {
        const completions = 'connect broadcast close send eval --help'.split(' ');
        const hits = completions.filter((c) => c.startsWith(line));
        // 如果没匹配到则展示全部补全
        return [hits.length ? hits : completions, line];
    },
    prompt: '> '
});
rl.prompt();
function runClient() {
    const client = new socketPackage_1.socketPackage(url, token, nickName);
    client.on('login', (response) => {
        console.log('login', response);
    });
    client.on('broadcast', (response) => {
        console.log('broadcast', response);
    });
    client.on('error', (error) => {
        console.log('error', error);
    });
    client.on('requesterror', (error) => {
        console.log('requestError', error);
    });
    client.on('close', (response) => {
        console.log('close', response);
    });
    return client;
}
;
rl.question('请输入Url地址例如默认地址 ws://127.0.0.1:8888 直接回车则使用默认地址! ', (answer) => {
    if (answer) {
        url = answer;
    }
    rl.prompt();
    rl.question('请输入初始用户的昵称默认昵称 二狗子 ', (answer) => {
        if (answer) {
            nickName = answer;
        }
        client = runClient();
    });
});
rl.prompt();
rl.on('line', (line) => {
    switch (line.trim()) {
        case 'connect':
            rl.question(`输入连接参数 <昵称> string default: <${client.nickName}> <群组名称> true||string default:'' \n`, (answer) => {
                answer = answer.split(' ');
                if (answer.length == 1) {
                    client.connect(answer[0]);
                }
                else if (answer.length == 2) {
                    client.connect(answer[0], answer[1]);
                }
                else {
                    client.connect();
                }
                rl.prompt();
            });
            break;
        case 'send':
            rl.question(`请输入JSON格式的信息,不输入则跳过: \n`, (answer) => {
                if (answer) {
                    client.send(JSON.parse(answer));
                }
                rl.prompt();
            });
            break;
        case 'broadcast':
            rl.question(`请输入需要广播的信息: \n`, (answer) => {
                if (answer) {
                    client.broadCast(answer);
                }
                rl.prompt();
            });
            break;
        case 'close':
            rl.question(`y\\n`, (answer) => {
                if (answer.toLocaleLowerCase() === 'y') {
                    client.close();
                }
                rl.prompt();
            });
            break;
        case 'eval':
            rl.question(`输入任何内容与当前环境进行交互,不输入则跳过: \n`, (answer) => {
                if (answer !== '') {
                    eval(answer);
                }
                rl.prompt();
            });
            break;
        default:
            console.log('详细格式: --help(帮助) connect [昵称](可选) send [参数] broadcast [参数] close eval [参数]');
            break;
    }
    rl.prompt();
}).on('close', () => {
    console.log('再见!');
    process.exit(0);
});
