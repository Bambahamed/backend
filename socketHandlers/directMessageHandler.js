const Message = require("../models/message");
const Conversation = require("../models/conversation");
const chatUpdates = require("./updates/chat");

const directMessageHandler = async (socket, data) => {
  try {
    console.log("direct message event is being handled");
    const { userId } = socket.user;
    const { receiverUserId, content } = data;

    //create new message
    const message = await Message.create({
      content: content,
      author: userId,
      date: new Date(),
      type: "DIRECT",
    });

    // find if conversation exist with this two users - if not create new

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
      type: "DIRECT",
    });

    if (conversation) {
      conversation.messages.push(message._id);
      await conversation.save();

      // perform and update to sender and  receiver if is online
      chatUpdates.updateChatHistory(conversation._id.toString());
    } else {
      // create new conversation if not exists
      const newConversation = await Conversation.create({
        messages: [message._id],
        participants: [userId, receiverUserId],
        type: "DIRECT",
      });

      // perform and update to sender and receiver if is online
      chatUpdates.updateChatHistory(newConversation._id.toString());
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = directMessageHandler;
