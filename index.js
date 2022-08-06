const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();

const PORT = process.env.PORT || 5000;

app.ws('/',(ws,req)=>{
    ws.on('message', function(msg) {
        msg = JSON.parse(msg);
        switch(msg.method){
            case 'connection':
                connectionHandler(ws, msg);
                broadcastConnection(ws,msg);
                break;
            default:
                broadcastConnection(ws,msg);
                break;
        }

    });

});

const connectionHandler =(ws, msg)=>{
    ws.gameId = msg.gameId;
    ws.id = msg.userId;
}

const broadcastConnection = (ws, msg) => {

    aWss.clients.forEach(client => {
        if(client.gameId===msg.gameId && client.id!==msg.userId) {
            client.send(JSON.stringify(msg))
        }
    })

}

function clientsCount(){
    let count = 0;
    aWss.clients.forEach(client=>{
        count++;
    })
    return count;
}

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start();