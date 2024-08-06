const roomSignalingDataHandler = (socket, data) => {
  const { connUserSocketId, signal } = data;
  const username = socket.user.username;
  const userId = socket.user.userId;

  const signalingData = {
    signal,
    connUserSocketId: socket.id,
    username: username,
    userId: userId,
  };
  socket.to(connUserSocketId).emit("conn-signal", signalingData);
};

module.exports = roomSignalingDataHandler;
