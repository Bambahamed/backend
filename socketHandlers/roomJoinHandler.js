const serverStore = require("../serverStore");
const roomsUpdates = require("./updates/room");

const roomJoinHandler = (socket, data) => {
  const { roomId } = data;
  console.log("data2", data);
  const participantDetails = {
    userId: socket.user.userId,
    socketId: socket.id,
    /* mail: socket.user.mail, */
    username: socket.user.username,
  };
  console.log("participant", participantDetails);

  const roomDetails = serverStore.getActiveRoom(roomId);
  if (!roomDetails) {
    console.error(`Room with ID ${roomId} not found`);
    return;
  }

  serverStore.joinActiveRoom(roomId, participantDetails);

  const allUserIds = roomDetails.participants.map(
    (participant) => participant.userId
  );
  allUserIds.push(participantDetails.userId); // Ajoute le nouvel utilisateur

  // Envoie l'information aux utilisateurs dans la salle qu'ils doivent se préparer pour une connexion entrante
  roomDetails.participants.forEach((participant) => {
    socket.to(participant.socketId).emit("conn-prepare", {
      connUserSocketId: participantDetails.socketId,
      username: socket.user.username,
      userId: participantDetails.userId,
      allUserIds: allUserIds, // Envoie les IDs de tous les utilisateurs
    });
  });

  // Envoie aussi la liste des IDs à l'utilisateur qui vient de rejoindre
  socket.emit("conn-prepare", {
    connUserSocketId: participantDetails.socketId,
    username: socket.user.username,
    userId: socket.user.userId,
    allUserIds: allUserIds,
  });

  roomsUpdates.updateRooms();
};

module.exports = roomJoinHandler;
