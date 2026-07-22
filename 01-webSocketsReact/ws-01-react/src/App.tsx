import { useEffect, useState } from 'react'
import './App.css'

function App() {
  // 1. Manage WebSocket instance in React state
  // Generic type <WebSocket | null> allows initial null value while preserving full TypeScript autocomplete.
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [latestMessage, setLatestMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  // 2. Establish connection inside useEffect on Component Mount
  // Empty dependency array [] ensures the WebSocket connection is initialized ONLY ONCE.
  useEffect(() => {
    // Modern browsers natively support 'new WebSocket()'—no third-party npm packages (like axios or ws) are needed on the frontend.
    const ws = new WebSocket('ws://localhost:8080');

    // Event 1: Connection Opened
    // Fires after the initial HTTP upgrade and 1-time TCP handshake completes successfully.
    ws.onopen = () => {
      console.log('WebSocket connection established');
      // Setting socket in state triggers a re-render to hide the loading screen and display the interactive UI.
      setSocket(ws);
    };

    // Event 2: Message Received from Server
    // Real-time Push: Server pushes events directly to the browser without the client needing to poll.
    ws.onmessage = (message) => {
      console.log('Message received from server:', message);
      setLatestMessage(message.data);
    };

    // Event 3: Cleanup Function on Component Unmount
    // Closes the persistent TCP connection when the user navigates away to prevent memory leaks and zombie sockets.
    return () => {
      ws.close();
    };
  }, []);

  // 3. Conditional Rendering (Loader State)
  // Ensures the user sees a loading state until the WebSocket handshake completes and socket state is non-null.
  if (!socket) {
    return <div>Connecting to WebSocket server...</div>
  }

  return (
    <>
      <div className="card">
        <h2>Real-Time WebSocket Chat</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={() => {
          if (socket) {
            // 4. Push message to server over the persistent TCP connection instantly
            socket.send(inputValue);
            setInputValue("");
          }
        }}>
          Send Message
        </button>
        <div style={{ marginTop: '20px' }}>
          <strong>Latest Server Message:</strong> {latestMessage}
        </div>
      </div>
    </>
  )
}

export default App
