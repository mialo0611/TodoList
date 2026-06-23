const http = require("http");
const { v4: uuidv4 } = require("uuid");
//這裏的id 在網頁未重新post之前會一直是同一個，會導致新增的待辦事項id相同，所以要放在requestListener裡面，每次post請求都會產生新的id
//const  id = uuidv4(); 
const errHandler = require('./errorHandler');
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
    req.setEncoding('utf-8');
    //get request body data
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
            try{
                const title = JSON.parse(body).title; 
                if (title !== undefined){
                    const  id = uuidv4();
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
                }else{
                    errHandler(rsp, "傳入內容格式錯誤");
                }                    
            }catch(err){
                errHandler(rsp, err.message);                 
            }            
        }); 
    }else if (req.method === 'DELETE'){
        if (req.url.startsWith('/todos/')){
            const id = req.url.split('/').pop();
            //console.log(id);
            const idx = todos.findIndex(todo => todo.id === id);
            if (idx !== -1){
                todos.splice(idx, 1);
                rsp.writeHead(200, headers);                        
                rsp.write(JSON.stringify({
                        "status": "success",
                        "data": todos
                }));
                rsp.end();
            } else {
                errHandler(rsp, "找不到該待辦事項");
            }    
        } else if(req.url === '/todos'){
            todos.length = 0;
            rsp.writeHead(200, headers);
            rsp.write(JSON.stringify({
                "status": "success",
                "data": todos
            }));
            rsp.end();        
        } else {
            errHandler(rsp, "格式有誤，請確是否正確");
        }
    }else if (req.url.startsWith('/todos/') && req.method === 'PATCH'){  
        req.on('end', () => {
            try{
                const titleUpd = JSON.parse(body).title;
                if (titleUpd !== undefined){
                    const id = req.url.split('/').pop();
                    //console.log(id);
                    const idx = todos.findIndex(todo => todo.id === id);
                    if (idx !== -1){
                        todos[idx].title = titleUpd;
                        rsp.writeHead(200, headers);                        
                        rsp.write(JSON.stringify({
                                "status": "success",
                                "data": todos
                        }));
                        rsp.end();
                    }else{
                        errHandler(rsp, "找不到該待辦事項");
                    }
                }else{
                    errHandler(rsp, "傳入內容格式錯誤");
                }                    
            }catch(err){
                errHandler(rsp, err.message);                 
            }            
        });         
    } else if (req.url === '/todos' && req.method === 'OPTIONS'){
        rsp.writeHead(200, headers);
        rsp.end();
    }else{
        errHandler(rsp, "Not Found");        
    }
}
const server = http.createServer(requestListener);
server.listen(8080);