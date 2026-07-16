import WebSocket, { WebSocketServer } from "ws";
import http from "http";
const server = http.createServer(function (req, res) {
    console.log((new Date()) + "received request from " + req.url);
    res.end("Hello World");
});
const wss = new WebSocketServer({ server });
wss.on('connection', function connection(socket) {
    socket.on('error', console.error);
    socket.on('message', function messsage(data) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
    socket.send("Welcome to the WebSocket server!");
});
server.listen(8080, function () {
    console.log((new Date()) + "Server is listening on port 8080");
});
//# sourceMappingURL=index.js.map