const serverStore = require("../serverStore");
const roomsUpdates = require("./updates/room");

const roomCreateHandler = (socket) => {
  console.log("handling room create event");
  const socketId = socket.id;
  const userId = socket.user.userId;
  /* const mail = socket.user.mail; */
  const username = socket.user.username;

  const roomDetails = serverStore.addNewActiveRoom(userId, socketId, username);

  socket.emit("room-create", {
    roomDetails,
  });
  roomsUpdates.updateRooms();
};

module.exports = roomCreateHandler;
