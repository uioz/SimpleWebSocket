import * as webSocket from "ws";

const ws = new webSocket('ws://127.0.0.1:8080');

let flag = 1;

ws.on('open', () => {

    ws.send(JSON.stringify({
        type: 'login',
        nickName: 'hello world'
    }));

});

ws.on('message', (data: any) => {

    // data = JSON.parse(data);

    // console.log('接收到的数据',data);
    console.log('response',data);

    // TODO 修复broadCastLogin的向自身发送消息的bug

    if(flag){

        
        const resposne = JSON.stringify({
            type: 'message',
            nickName: 'hello world',
            auth: data.auth,
            message: 'whatthefuck'
        });

        
        ws.send(resposne);

        flag = 0;

    }

})