"use strict";
require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { connectToMongoDB } = require("./app/connections/mongo_connections");

const { Server } = require("socket.io");
const { supportChatSocketHandler } = require("./app/sockets/Socket");

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:8081'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));



connectToMongoDB();

require("./app/routes")(app);

const PORT = process.env.PORT || 3155;
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:8081'],
    methods: ['GET', 'POST'],
    credentials: true,
  }
});
  
supportChatSocketHandler(io);


httpServer.listen(PORT, () => {
  console.log(`🚀 HTTP Server running at http://localhost:${PORT}`);
});

// ✅ Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
});
