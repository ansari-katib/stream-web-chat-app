import User from "../model/userModel.js";
import jwt from 'jsonwebtoken'
import { upsertStreamUser } from "../lib/stream.js";

export const signup = async (req, res) => {

    const { fullName, password, email } = req.body;

    try {

        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 5) {
            return res.status(400).json({ message: "password must be at least 5 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existedUser = await User.findOne({ email });

        if (existedUser) {
            return res.status(400).json({ message: "Email is already existed , use a different one" })
        }

        const idx = Math.floor(Math.random() * 100) + 1; // generate number between 1 - 100

        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar,
        });

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            });
            console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.log("Error in signup while creating stream", error.message);
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,                                      // protect from XSS attacks ,
            sameSite: "strict",                                  // protect from CSRF attacks ,
            secure: process.env.NODE_ENV === "production",
        });

        res.status(201).json({ success: true, user: newUser });

    } catch (error) {
        console.log("Error in signup controller ", error.message);
        res.status(500).json({ message: "Internal server error " });
    }

};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email and password" });

        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email and password" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,                                      // protect from XSS attacks ,
            sameSite: "strict",                                  // protect from CSRF attacks ,
            secure: process.env.NODE_ENV === "production",
        });

        res.status(201).json({ success: true, user });

    } catch (error) {
        console.log("Error in login controller ", error.message);
        res.status(500).json({ message: "Internal server error " });
    }

};

export const logout = async (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "logout successfully" });
};

export const onboard = async (req, res) => {
    try {
        const userId = req.user._id;

        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullname",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean),
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, { new: true })

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            })
            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
        } catch (StreamError) {
           console.log("Error while updating user in Stream " , StreamError.message);
        }

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.log("Onboarding error ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}