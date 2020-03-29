const jwt = require("jsonwebtoken");

// FOR ROUTE SECUIRTY
module.exports = function(req, res, next) {
  let token = req.headers["authorization"];

  // decode token
  if (token) {
    token.startsWith("Bearer ");
    // Remove Bearer from string
    token = token.slice(7, token.length);
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        return res.json({
          error: true,
          message: "Token is not valid"
        });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).json({
      message: "No token provided. Unauthorized"
    });
  }
};
