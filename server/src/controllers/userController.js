import FriendRequest from "../model/friendRequest.js";
import User from "../model/userModel.js";


export const getRecomendedUsers = async (req, res) => {
    try {

        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recomendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },   // exclude current user 
                { _id: { $nin: currentUser.friends } },  // exclude the user's friends 
                { isOnboarded: true }   // only if successfully onboarded
            ]
        })

        res.status(200).json(recomendedUsers);
    } catch (error) {
        console.error("Error in getRecomended controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMyFriends = async (req, res) => {
    try {

        const user = await User.findById(req.user.id)
            .select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendFriendRequest = async (req, res) => {
    try {

        const myId = req.user.id;
        const { id: recipientId } = req.params;

        if (myId === recipientId) return res.status(400).json({ message: "you can't send friend request to yourself" });

        const recipient = await User.findById(recipientId);

        if (!recipient) return res.status(404).json({ message: "Recipient not found" });

        if (recipient.friends.includes(myId)) {
            return res.status(404).json({ message: "you are already friend with that user" });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ]
        })

        if (existingRequest) {
            return res.status(400).json({ message: "A friend request is already exists between you and that user" })
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        })

        res.status(201).json(friendRequest);

    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const acceptFriendRequest = async (req, res) => {
    try {

        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) return res.status(404).json({ message: "friend request not found" });

        // verify the current user is the recipient :
        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "you are not authorized to acctep this request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // add each reques to other friends array : 
        // $addToSet : add element to an array only if they do not already exist
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        })

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        })

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.error("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getFriendRequests = async (req, res) => {
    try {

        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted"
        }).populate("recipient", "fullName profilePic ");

        res.status(200).json({ incomingReqs, acceptedReqs })

    } catch (error) {
        console.error("Error in getFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getOutgoingFriendRequests = async (req, res) => {
    try {
        const outgoingFriendReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingFriendReqs);
    } catch (error) {
        console.error("Error in getOutgoingFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}