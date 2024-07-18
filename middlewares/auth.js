const jwt = require("jsonwebtoken");

const userModal = require("../models/users-model");

const HttpsErrors = require("../models/https-errors");

async function isAuthenticated(req,res,next)
{

   const {token} =  req.cookies;

   if(!token)
   {
     return next(new HttpsErrors("Login First !!", 401));
   }

  const decreptedToken =  jwt.verify(token,process.env.SECRET);

  req.user = await userModal.findById(decreptedToken.userId);

   next();

};

// role will be converted to array using ... operators

function checkRoles(...role)
{
 
  return function(req,res,next){
    
    // IF ROLE DOESNT INCLUDE CURRENT LOGIN USER ROLE

    if(!role.includes(req.user.role))
    {
        return next(new HttpsErrors("You have not permission to do this action !!",403));
    }
    next();
  }
 
};

module.exports.isAuthenticated = isAuthenticated;

module.exports.checkRoles = checkRoles;