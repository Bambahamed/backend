const jwt = require("jsonwebtoken");
const User = require("../models/user");

const config = process.env;

const verifyTokenSocket = async (socket, next) => {
  const token = socket.handshake.auth?.token;

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    const user = await User.findById(decoded.userId);
    /* socket.user = decoded; */
    socket.user = {
      userId: user._id.toString(),
      username: user.username,
      decoded,
    };
  } catch (err) {
    const socketError = new Error("NOT_AUTHORIZED");
    return next(socketError);
  }
  next();
};

module.exports = verifyTokenSocket;
