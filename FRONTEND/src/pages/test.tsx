"use strict";
require("dotenv").config();
const express = require("express");
const app = express();
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { connectToMongoDB } = require("./app/connections/mongo_connections");

const credentials = {
  key: fs.readFileSync('/etc/letsencrypt/live/app.prosignature.ai-0001/privkey.pem', 'utf8'),
  cert: fs.readFileSync('/etc/letsencrypt/live/app.prosignature.ai-0001/fullchain.pem', 'utf8')
};


const { Server } = require("socket.io");
const chatSocketHandler = require("./app/sockets/Socket"); 



app.use(helmet());
app.use(cors({
  origin: ['https://app.prosignature.ai', 'http://localhost:3000', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


app.options('*', cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

connectToMongoDB();
require("./app/routes")(app);
const httpsServer = https.createServer(credentials, app);
const PORT = process.env.PORT || 3152;

const io = new Server(httpsServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8080', 'https://app.prosignature.ai'],
    methods: ['GET', 'POST'],
    credentials: true,
  }
});


chatSocketHandler(io);
httpsServer.listen(PORT, () => {
  console.log(`✅ HTTPS Server is running at https://app.prosignature.ai:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTPS server');
  httpsServer.close(() => {
    console.log('HTTPS server closed');
  });
});







// "use strict";
// require("dotenv").config();
// const { connectToMongoDB } = require("./app/connections/mongo_connections");
// const express = require("express");
// const app = express();
// const https = require("https");
// const fs = require("fs");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const rateLimit = require("express-rate-limit");

// // 🔐 Load SSL certificates from Certbot
// const credentials = {
//   key: fs.readFileSync('/etc/letsencrypt/live/app.prosignature.ai-0001/privkey.pem', 'utf8'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/app.prosignature.ai-0001/fullchain.pem', 'utf8')
// };

// // ✅ Security middleware
// app.use(helmet());

// // ✅ CORS Configuration
// app.use(cors({
//   origin: ['https://app.prosignature.ai', 'http://localhost:3000', 'http://localhost:8080'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));
// app.options('*', cors());

// // ✅ Common middleware
// app.use(morgan('dev'));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json({ limit: "10mb" }));

// // ✅ Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: 'Too many requests, please try again later.'
// });
// app.use(limiter);

// // ✅ MongoDB connection
// connectToMongoDB();

// // ✅ Routes
// require("./app/routes")(app);

// // ✅ Create HTTPS server
// const httpsServer = https.createServer(credentials, app);
// const PORT = process.env.PORT || 3152;

// httpsServer.listen(PORT, () => {
//   console.log(`✅ HTTPS Server is running at https://app.prosignature.ai:${PORT}`);
// });

// // ✅ Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM signal received: closing HTTPS server');
//   httpsServer.close(() => {
//     console.log('HTTPS server closed');
//   });
// });
