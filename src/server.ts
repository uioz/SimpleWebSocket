import * as WebSocket  from "ws";
import { router } from "./router";

const wss = new WebSocket.Server({
    port:4012
});

wss.on('connection',router);

wss.on('error',(error)=>{
    console.error(error);
});

wss.on('listening',()=>{
    console.log('WebSocket Server has running in 8080 port!');
});