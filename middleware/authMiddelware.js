const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError')
const User = require('../models/userModel');
const config = require('../config/config')

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers[ 'authorization' ];
        if (!authHeader) {
            return res.status(403).json({
                statuscode: 403,
                success: false,
                error: true,
                message: "No Token Provided"
            });
        }

        const token = authHeader.split(" ")[ 1 ];
        if (!token) {
            return res.status(403).json({
                statuscode: 403,
                success: false,
                error: true,
                message: "Invalid Token Format"
            });
        }

        jwt.verify(token, config.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    statuscode: 403,
                    success: false,
                    error: true,
                    message: "Unauthorized"
                });
            }

            if (decoded.role === 1) {
                req.user = await User.findOne({
                     isAdmin: 'admin'
                });
            }

            if (!req.user) {
                return res.status(403).json({
                    statuscode: 403,
                    success: false,
                    error: true,
                    message: "Forbidden: You don't have permission to perform this action."
                });
            }

            next();
        });
    } catch (error) {
        return res.status(500).json({
            statuscode: 500,
            success: false,
            error: true,
            message: "Internal Server Error",
            details: error.message
        });
    }
};


const verifyJWT = (async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[ 1 ];
            const decoded = jwt.verify(token, config.SECRET_KEY);
            const user = await User.findById(decoded?._id).select('-password -refreshToken')
            if (!user) {
                throw new ApiError(404, 'Invalid access token!')
            }
            req.user = user
            next()
        }
        catch (error) {
            console.log(error)
            throw new ApiError(401, 'Invalid access token!')
        }
    }
})

module.exports = {
    authenticate,
    verifyJWT
};

