const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const ApiError = require('../utils/apiError');

exports.registerUser = async (req, res) => {
    try {
        const { userName, password, isAdmin } = req.body;

        if (!userName || !password) {
            return res.status(400).json(new ApiError(400, null, "Username and password are required"));
        }

        const existingUser = await User.findOne({ userName });

        if (existingUser) {
            return res.status(200).json({ statusCode: 200, message: "User Already Exists", data: existingUser });
        }

        let userRole;
        if (isAdmin === 1) {
            userRole = 'admin';
        } else if (isAdmin === 2) {
            userRole = 'manager';
        } else {
            return res.status(400).json(new ApiError(400, null, "Invalid role specified"));
        }

        const user = new User({
            userName,
            password,
            isAdmin: userRole,
            status: true
        });

        await user.save();

        return res.status(200).json({ error: false, statusCode: 200, message: "Registered Successfully", data: user });

    } catch (error) {
        console.error("Error during creation:", error);
        return res.status(500).json(new ApiError(500, null,"An error occurred during registration"));
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { userName, password } = req.body;

        if (!userName) {
            return res.status(400).json(new ApiError(400, null, "Username is required"));
        }

        const user = await User.findOne({ userName });

        if (!user) {
            return res.status(404).json(new ApiError(404, null, "User does not exist"));
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json(new ApiError(401, null, "Invalid user credentials"));
        }

        const payload = {
            _id: user._id,
            role: user.isAdmin === 'admin' ? 1 : 0
        };

        const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '1d'
        });

        const loggedInUser = await User.findById(user._id).select('-password');

        return res.status(200).json({
            error: false,
            statusCode: 200,
            message: "Logged In Successfully",
            data: loggedInUser,
            accessToken
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json(new ApiError(500, "Server Error", "Something went wrong during login"));
    }
};
