const jwt = require("jsonwebtoken");

function createToken(user, statusCode, res) {

    // CREATE TOKEN
    const token = jwt.sign(
        { userId: user.id, userEmail: user.email },
        process.env.SECRET
    );

    // Set dynamic options based on environment (localhost vs production)
    const isProduction = process.env.NODE_ENV === "production";

    // Cookie options
    const options = {
        httpOnly: true,
        path: "/",
        secure: isProduction, // Set to true only in production (HTTPS required)
        sameSite: isProduction ? "none" : "lax", // "none" for production (cross-origin), "lax" for localhost
    };

    // For local development (localhost)
    if (!isProduction) {
        // Set cookie for localhost with `secure: false` (non-HTTPS)
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // For localhost, do not require HTTPS
            sameSite: "lax", // Allow cross-origin requests on localhost
        });
    }

    // For production (deployment)
    res.status(statusCode)
       .cookie("token", token, options) // Use the appropriate options
       .json({ success: true, user, token });
}

module.exports = createToken;
