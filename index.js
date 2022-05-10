const mongoose = require("mongoose");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("./middleware/cors");
const fileUpload = require("express-fileupload");
const socket = require("./socket");

require("dotenv").config();

const app = express();
const PORT = process.env.port || 3001;

// const server = require("http").Server(app);
// const io = require("socket.io")(server, {
//   cors: { origin: ["http://localhost:3000", "https://admin.socket.io"] },
// });

// instrument(io, {
//   auth: false,
// });

// server.listen(PORT, () => {
//   console.log(`Listening at http://localhost:${PORT}`);
// });


const server = require("http").Server(app);
socket.connect(server);

// instrument(socket.connection(), {
//   auth: false,
// });

server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
app.use(morgan("dev"));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
// app.use(cors);

mongoose.connect(process.env.MongoDB_URL, () => {
  console.log("Connected to MongoDB");
});

app.use("/api", require("./routes"));

// app.listen(PORT, async () => {
//   console.log(`Listening at http://localhost:${PORT}`);
// });
