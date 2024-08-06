const roomInitializeConnectionHandler = async (socket, data) => {
  const { connUserSocketId } = data;
  const username = socket.user.username;
  const userId = socket.user.userId;

  const initData = {
    connUserSocketId: socket.id,
    username: username,
    userId: userId,
  };
  socket.to(connUserSocketId).emit("conn-init", initData);
};

module.exports = roomInitializeConnectionHandler;
