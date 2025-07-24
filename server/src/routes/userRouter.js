import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendRequests, getRecomendedUsers, sendFriendRequest } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.use(protectRoute);

userRouter.get("/", getRecomendedUsers);
userRouter.get("/friends", getMyFriends);

userRouter.post("/friend-request/:id" , sendFriendRequest);
userRouter.put("/friend-request/:id/accept" , acceptFriendRequest);

userRouter.get("/friend-requests" , getFriendRequests);
userRouter.get("/outgoing-friend-requests" , getOutgoingFriendRequests);

export default userRouter;