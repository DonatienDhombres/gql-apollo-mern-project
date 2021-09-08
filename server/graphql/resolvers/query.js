const { AuthenticationError } = require('apollo-server-express')
const { User } = require('../../models/user');
const authorize = require('../../utils/isAuth')


module.exports = {
   Query: {
      user: async (parent, args, context, info) => {
         const { id } = args;
         try {
            const req = authorize(context.req)
            const user = await User.findOne({ '_id': id });

            if (req._id.toString() !== user._id.toString()) {
               throw new AuthenticationError("You don't own this user");

            }
            return user;

         } catch (err) {
            throw err;
         }
      }
   }
}