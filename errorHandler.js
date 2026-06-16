function errorHandler(rsp,message){
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }; 
    rsp.writeHead(400, headers);
    rsp.write(JSON.stringify({  
                "status": "failed",
                "message": message
        }));
    rsp.end();
}

module.exports = errorHandler;