"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const router_1 = require("./router");
const wss = new WebSocket.Server({
    port: 4012
});
wss.on('connection', router_1.router);
wss.on('error', (error) => {
    console.error(error);
});
wss.on('listening', () => {
    console.log('WebSocket Server has running in 8080 port!');
});
