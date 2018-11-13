import * as WebSocket  from "ws";
import { router } from "./router";
import { crashedProcess } from "./public";
import { setUserGroup,getDefaultGroupName,setServerToken, setDefaultGroupName } from "./dataPersistence";

const userInput = process.argv.splice(2);

if(userInput.length < 1 ){
    throw new Error('参数缺失');
}

// 设置服务器签名
const serverToken:string = userInput.pop();
if(!serverToken){
    throw new Error('必须有服务器签名用于前后端交互使用!');
}
debugger;
setServerToken(serverToken);

// 设置服务器端口
const defaultPort: number = parseInt(userInput.shift()) || 8888;

// 设置服务器用户组
const userGroupNames = userInput.length ? userInput : [getDefaultGroupName()];
debugger;
setDefaultGroupName(userGroupNames[0]);
setUserGroup(userGroupNames);

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

// 启用超时检查
crashedProcess();