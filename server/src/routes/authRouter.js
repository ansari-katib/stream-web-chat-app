import express from 'express';
import { login, logout, onboard, signup } from '../controllers/authController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.post("/onboarding", protectRoute, onboard);

// check if user login or not : 
authRouter.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
})

export default authRouter;
