const jwt = require('jsonwebtoken');
require('dotenv').config();
const { AuthenticationError } = require('apollo-server-express');

const throwAuthError = () => {
   throw new AuthenticationError('You are not auth, shame, shame, shame');
}

const authorize = (req, verify = false) => {
   // Returns the request if token is valid, and pass parameters : id, email and isAuth from token to req

   // Is there a header (token is in the header) ?
   const authorizationHeader = req.headers.authorization || '';
   if (!authorizationHeader) {
      req.isAuth = false;
      return !verify ? throwAuthError() : req;
   }

   // Is there a token after Bearer ?
   const token = authorizationHeader.replace('Bearer ', '');
   if (!token || token === '') {
      req.isAuth = false;
      return !verify ? throwAuthError() : req;
   }

   let decodedJWT;
   try {
      // Can we decode the token ? Is it a correct token ?
      decodedJWT = jwt.verify(token, process.env.SECRET)
      if (!decodedJWT) {
         req.isAuth = false;
         return !verify ? throwAuthError() : req;
      }
      // We pass information from the token to req
      req.isAuth = true;
      req._id = decodedJWT._id;
      req.email = decodedJWT.email;
      req.token = token

      return req;

   } catch (err) {
      req.isAuth = false;
      return !verify ? throwAuthError() : req;
   }

}

module.exports = authorize;

