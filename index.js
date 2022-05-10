const mongoose = require("mongoose");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("./middleware/cors");
const fileUpload = require("express-fileupload");
const socket = require("./socket");
// const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.port || 3001;

const server = require("http").Server(app);
socket.connect(server);

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
app.use(cors);

// const allowedOrigins = ["https://facebook-client-two.vercel.app/"];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg =
//           "The CORS policy for this site does not allow access from the specified Origin.";
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

mongoose.connect(process.env.MongoDB_URL, () => {
  console.log("Connected to MongoDB");
});

app.use("/api", require("./routes"));

// app.listen(PORT, async () => {
//   console.log(`Listening at http://localhost:${PORT}`);
// });
