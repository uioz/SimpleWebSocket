const http = require('http');

const server = http.createServer((request,response)=>{

    console.log('获取到了请求');
    response.end('hello world');

});

server.listen(8080,()=>{

    console.log('server is running in 8080 port!');

});