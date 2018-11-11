import { socketPackage } from "../src/socketPackage";
import * as readline from "readline";

const test = new socketPackage('ws://127.0.0.1:8080', 'hello world');

test.on('login', (response) => {
    console.log('login', response);
});

test.on('broadcast', (response) => {
    console.log('broadcast', response);
});

test.on('error', (error) => {
    console.log('error', error);
});

test.on('requesterror', (error) => {
    console.log('requestError', error);
});

test.on('close', (response) => {
    console.log('close', response);
});

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

rl.on('line', (line) => {
    switch (line.trim()) {
        case 'connect':
            rl.question(`请输入昵称,不输入使用默认昵称,当前昵称<${'hello'}>: \n`, (answer) => {
                
                if(answer){
                    test.connect(answer);
                }else{
                    test.connect();
                }

                rl.prompt();
            });
            break;
        case 'send':
            rl.question(`请输入JSON格式的信息,不输入则跳过: \n`, (answer) => {
                if(answer){
                    test.send(JSON.parse(answer));
                }
                rl.prompt();
            });
            break;
        case 'broadcast':
            rl.question(`请输入需要广播的信息: \n`, (answer) => {
                if(answer){
                    test.boradCast(answer)
                }
                rl.prompt();
            });
            break;
        case 'close':
            rl.question(`y\\n`, (answer) => {
                if (answer.toLocaleLowerCase() === 'y') {
                    test.close();
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