import { WebSocketServer } from 'ws';
import { SOCKET_EVENTS } from '../utils/socketEvents.js';

const userSocketMap = new Map(); // username -> ws[]
let wss = null;

export function setupSocketServer(server) {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    let registeredUsername = null;

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === SOCKET_EVENTS.REGISTER && data.username) {
          registeredUsername = data.username;
          if (!userSocketMap.has(registeredUsername)) userSocketMap.set(registeredUsername, []);
          userSocketMap.get(registeredUsername).push(ws);
        }
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    });

    ws.on('close', () => {
      if (registeredUsername && userSocketMap.has(registeredUsername)) {
        userSocketMap.set(
          registeredUsername,
          userSocketMap.get(registeredUsername).filter(client => client !== ws)
        );
        if (userSocketMap.get(registeredUsername).length === 0) userSocketMap.delete(registeredUsername);
      }
    });
  });
}

export function sendNotification(username, notification) {
  const clients = userSocketMap.get(username) || [];
  for (const ws of clients) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: SOCKET_EVENTS.NOTIFICATION, notification }));
    }
  }
} 