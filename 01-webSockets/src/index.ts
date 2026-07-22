import WebSocket, { WebSocketServer } from "ws";
import http from "http";

// 1. Create a native HTTP Server
// WebSockets start as a standard HTTP request and get "upgraded" to a persistent TCP WebSocket connection.
// Native node 'http' library requires no external dependencies (like Express), though Express can also be wrapped.
const server = http.createServer(function (req: any, res: any) {
    console.log((new Date()) + " Received request from " + req.url);
    res.end("Hello World");
});

// 2. Attach WebSocket Server onto the HTTP Server instance
// The 'ws' library is used because it adheres strictly to the IETF WebSocket specification.
// Unlike Socket.io, standard WebSockets work natively in web browsers (new WebSocket(...)),
// mobile apps (iOS/Android), Rust, and Go without requiring custom client libraries.
const wss = new WebSocketServer({ server });

let userCnt = 0;

// 3. Listen for new client connection events
// 'wss.on("connection")' fires whenever a client completes the initial HTTP handshake and opens a persistent TCP socket.
wss.on('connection', function connection(socket) {
    // Register error handler for this specific client socket connection
    socket.on('error', console.error);

    // 4. Handle incoming messages from this client
    // Full-duplex communication: Client can send data at any time without waiting for a server request.
    socket.on('message', function message(data, isBinary) {
        // 5. Broadcast message to all connected clients (e.g., Chat app or Multiplayer game sync)
        // 'wss.clients' holds all currently active WebSocket client instances.
        wss.clients.forEach(function each(client) {
            // Verify that the client's TCP socket connection is actively open before sending data
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });

    // Increment user count and log connection details
    console.log((new Date()) + " User connected. Total active users: " + (++userCnt));

    // 6. Send an initial welcome message directly to the newly connected client
    socket.send("Welcome to the WebSocket server!");
});

// 7. Start listening for incoming HTTP and WebSocket connections on Port 8080
server.listen(8080, function() {
    console.log((new Date()) + " Server is listening on port 8080");
});