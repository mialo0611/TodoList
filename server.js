const http = require("http");
const { v4: uuidv4 } = require("uuid");
const  id = uuidv4();
const todos =[];

const requestListener = (req, rsp) => {
    console.log(req.method);
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    };  
    let body = '';
    //req.setEncoding('utf-8');

    req.on('data', chunk => {
        //console.log(chunk);
        body += chunk;
    });    

    if (req.url === '/todos' && req.method === 'GET') {        
        rsp.writeHead(200, headers);
        rsp.write(JSON.stringify({
                "status": "success",
                "data": todos
        }));
        rsp.end();
    } else if (req.url === '/todos' && req.method === 'POST'){
        req.on('end', () => {
            const title = JSON.parse(body).title; 
            const newTodo = {
                id: id,
                title: title
            };
            todos.push(newTodo);
            rsp.writeHead(200, headers);
            rsp.write(JSON.stringify({
                "status": "success",
                "data": todos
            }));
            rsp.end();
        });
               
    } else if (req.url === '/todos' && req.method === 'OPTIONS'){
        rsp.writeHead(200, headers);
        rsp.end();
    }else{
        rsp.writeHead(404, headers);
        rsp.write(JSON.stringify({
            "status" :"failed",
            "message": 'Not Found'
        }));
        rsp.end();
    }
}
const server = http.createServer(requestListener);
server.listen(3030);