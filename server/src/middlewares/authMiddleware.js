import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).json({ message: "unauthorizes - no token provided" });

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) return res.status(401).json({ message: "unauthorized - Invalid token" });

        const user = await User.findById(decode.userId).select("-password");
        if (!user) return res.status(401).json({ message: "unauthorized - user not found" });

        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
