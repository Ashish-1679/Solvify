const express = require('express');
require('dotenv/config');
const { connectDB } = require('./config/db.js');
const cors = require('cors');
const app = express();

const authMiddleware = require("./middlewares/authMiddleware");
app.use(express.json());
app.use(cors());
const http = require('http');
const server = http.createServer(app);
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT;
const authRoutes = require("./routes/authRoutes.js");

app.use('/',authRoutes);
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
const problemRoutes = require("./routes/problemRoutes.js");
const requestRoutes = require("./routes/requestRoutes.js");
app.use('/problems',authMiddleware,problemRoutes);
app.use("/requests",authMiddleware, requestRoutes);
startServer().catch((error) => {
  console.error('Unable to start server:', error);
});

