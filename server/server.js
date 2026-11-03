const express = require('express');
require('dotenv/config');
const initializeSocket = require("./sockets/socket.js");
const { connectDB } = require('./config/db.js');
const cors = require('cors');
const app = express();
const authMiddleware = require("./middlewares/authMiddleware");
app.use(express.json());
app.use(cors());
const http = require('http');
const server = http.createServer(app);
const authRoutes = require("./routes/authRoutes.js");

const startServer = async () => {
  await connectDB();
const io = initializeSocket(server);
app.set("io",io);
  const PORT = process.env.PORT;
app.use('/',authRoutes);
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
const problemRoutes = require("./routes/problemRoutes.js");
const requestRoutes = require("./routes/requestRoutes.js");
const workspaceRoutes = require('./routes/workspaceRoutes.js');
const chatRoutes = require("./routes/chatRoutes.js");

app.use('/problems',authMiddleware,problemRoutes);
app.use("/requests",authMiddleware, requestRoutes);
app.use('/workspace', authMiddleware, workspaceRoutes);
app.use("/chat",authMiddleware,chatRoutes);
startServer().catch((error) => {
  console.error('Unable to start server:', error);
});


