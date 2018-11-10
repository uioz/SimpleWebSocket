const readline = require('readline');
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
    console.log(line.trim());
    
    switch (line.trim()) {
        case 'connect':
            rl.question(`请输入昵称,不输入使用默认昵称,当前昵称<${'hello'}>: `, (answer) => {
                console.log(answer);
                rl.prompt();     
            });
            break;
        case 'send':
            rl.question(`请输入JSON格式的信息,不输入则跳过:`, (answer) => {
                if (answer !== '') {

                }
                rl.prompt();
            });
            break;
        case 'broadcast':
            rl.question(`请输入JSON格式的信息,不输入则跳过:`, (answer) => {
                if (answer !== '') {

                }
                rl.prompt();
            });
            break;
        case 'close':
            rl.question(`y\\n`, (answer) => {
                if (answer.toLocaleLowerCase() === 'y') {
                    
                }
                rl.prompt();
            });
            break;
        case 'eval':
            rl.question(`输入任何内容与当前环境进行交互,不输入则跳过: `, (answer) => {
                if(answer !== ''){
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