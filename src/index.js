import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import robot from "robotjs";
import cors from "cors";
import qrcode from "qrcode";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT = 3000;
const sessions = new Map();

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Welcome to Mobile Mouse App! Scan the QR code to connect.");
});

// Generate QR code for a new session
app.get("/generate-qrcode", async (req, res) => {
  const sessionId = Math.random().toString(36).substr(2, 9); // Generate unique session ID
  sessions[sessionId] = null; // Initialize session
  const qrCode = await qrcode.toDataURL(`?sessionId=${sessionId}`);
  res.send(`<img src="${qrCode}" width="500" alt="QR Code"/>`);
});

io.on("connection", (socket) => {
  console.log(`New client connected`);

  // Register computer to a session
  socket.on("registerComputer", (sessionId) => {
    sessions[sessionId] = socket; // Link session ID to computer socket
    console.log(`Computer registered with session ID: ${sessionId}`);
  });

  // Handle mouse commands from phone
  // Handle mouse commands from phone
  socket.on("controlMouse", ({ sessionId, command }) => {
    const targetSocket = sessions[sessionId];
    if (targetSocket) {
      if (command.type === "move") {
        const { dx, dy } = command;
        const { x, y } = robot.getMousePos();
        robot.moveMouse(x + dx, y + dy);
        console.log(`Mouse moved to: ${x + dx}, ${y + dy}`);
      } else if (command.type === "click") {
        const { button } = command;
        robot.mouseClick(button);
        console.log(`Mouse ${button} click executed`);
      }
    } else {
      console.error(`No computer found for session ID: ${sessionId}`);
    }
  });

  //mouse movement handler
  socket.on("mouseMove", ({ dx, dy }) => {
    console.log(`Received moveMouse event with dx: ${dx}, dy: ${dy}`);
    const { x, y } = robot.getMousePos();
    robot.moveMouse(x + dx, y + dy);
  });

  //mouse click handler
  socket.on("mouseClick", (button) => {
    console.log("mouse click");
    robot.mouseClick(button);
  });

  socket.on("disconnect", () => {
    for (const sessionId in sessions) {
      if (sessions[sessionId] === socket) {
        delete sessions[sessionId];
        console.log(`Session ${sessionId} disconnected`);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`🔊 App listening on port ${PORT}`);
});
