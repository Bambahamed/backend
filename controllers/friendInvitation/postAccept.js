const FriendInvitation = require("../../models/friendInvitation");
const User = require("../../models/user");
const friendsUpdates = require("../../socketHandlers/updates/friends");

const postAccept = async (req, res) => {
  try {
    const { id } = req.body;
    const invitation = await FriendInvitation.findById(id);

    if (!invitation) {
      return res.status(401).send("Error occurred. Please tyr again");
    }

    const { senderId, receiverId } = invitation;

    const senderUser = await User.findById(senderId);
    senderUser.friends = [...senderUser.friends, receiverId];

    const receiverUser = await User.findById(receiverId);
    receiverUser.friends = [...receiverUser.friends, senderId];

    await senderUser.save();
    await receiverUser.save();

    // delete invitation
    await FriendInvitation.findByIdAndDelete(id);

    // update list of the friends if the users are online
    friendsUpdates.updateFriends(senderId.toString());
    friendsUpdates.updateFriends(receiverId.toString());

    // update list of friends pending invitation
    friendsUpdates.updateFriendsPendingInvitations(receiverId.toString());
    return res.status(200).send("Friend successfully added");
  } catch (error) {
    return res.status(500).send("Something went wrong. Please try again");
  }
};

module.exports = postAccept;
