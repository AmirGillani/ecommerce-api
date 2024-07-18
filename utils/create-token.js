const jwt = require("jsonwebtoken");

function createToken(user, statusCode, res) {

    // CREATE TOKEN

  const token = jwt.sign(
    { userId: user.id, userEmail: user.email },
    process.env.SECRET,
    { expiresIn: process.env.TOKEN_EXPIRE }
  );

    // OPTIONS FOR COOKIES
    
  const options = {
    expires: new Date(
       Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
      // path = where the cookie is valid
        path: "/",
        // secure = only send cookie over https
        secure: true,
        // sameSite = only send cookie if the request is coming from the same origin
        sameSite: "none"
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, user, token });
}

module.exports = createToken;
