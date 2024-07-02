const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError')
const User = require('../models/userModel');

const authenticate = async (req, res, next) => {
    const token = req.headers[ 'authorization' ];
    if (!token) {
        return res.json({
            statuscode: 403,
            success: false,
            error: true,
            message: "No Token Provided"
        });
    }
    jwt.verify(token.split(" ")[ 1 ], process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.json({
                statuscode: 403,
                success: false,
                error: true,
                message: "Unauthorized"
            });
        }
        if (decoded.role === 1) { 
            req.user = await User.findOne({
                where: { id: decoded._id, isAdmin: 'admin' },
                raw: true,
                nest: true,
            });
        }
        if (!req.user) {
            return res.json({
                statuscode: 403,
                success: false,
                error: true,
                message: "Forbidden: You don't have permission to perform this action."
            });
        }
        next();
    });
};

module.exports = {
    authenticate,
};


// const jwt = require('jsonwebtoken');
// const ApiError = require('../utils/apiError')

// const authenticate = async(req, res, next) => {
//     const token = req.headers[ 'authorization' ];
//     if (!token) {
        // return res.json({statuscode:403,
        //                 success:false,
        //                 error:true,
        //                 message:"No Token Provided"});
//     }
//     jwt.verify(token.split(" ")[ 1 ], process.env.SECRET_KEY, (err, decoded) => {
        // if (err) {
            // return res.json({
            //     statuscode: 403,
            //     success: false,
            //     error: true,
            //     message: "Unauthorized"
            // });
//      }
  
//         req.userId = decoded._id;
//         req.isAdmin = decoded.isAdmin;
//         next();
//     });
// };

// const isAdmin = (req, res, next) => {
//     if (!req.isAdmin) {

        // return res.json({
        //     statuscode: 403,
        //     success: false,
        //     error: true,
        //     message: "Forbidden: You don't have permission to perform this action."
        // });
       
//     }
//     next();
// };

// module.exports = {
//     authenticate,
//     isAdmin
// }
