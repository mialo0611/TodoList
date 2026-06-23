import headers from './header.js';

function errorHandler(rsp,message){
    rsp.writeHead(400, headers);
    rsp.write(JSON.stringify({  
                "status": "failed",
                "message": message
        }));
    rsp.end();
}

export default errorHandler;