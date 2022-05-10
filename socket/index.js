const { instrument } = require("@socket.io/admin-ui");

let io = null;
let users = [];
module.exports = {
  connect(server) {
    io = require("socket.io")(server, {
      cors: {
        origin: [
          "http://localhost:3000",
          "https://admin.socket.io",
          "https://facebook-client-two.vercel.app/",
        ],
      },
    });

    instrument(io, {
      auth: false,
    });

    io.on("connection", (socket) => {
      socket.on("likeEvent", (data) => {
        socket.broadcast.emit("saveLike", data);
      });
      socket.on("commentEvent", (data) => {
        socket.broadcast.emit("saveComment", data);
      });
      socket.on("onlineEvent", (data) => {
        if (users.filter((user) => user.id === data.id).length === 0) {
          data.socketId = socket.id;
          users.push(data);
        }
        io.emit("online", users);
      });
      socket.on("offlineEvent", (data) => {
        users = users.filter((user) => user.id !== data.id);
        io.emit("offline", users);
      });
      socket.on("disconnect", function () {
        users = users.filter((user) => user.socketId !== socket.id);
        io.emit("offline", users);
      });
    });
  },
  getIO() {
    return io;
  },
};
