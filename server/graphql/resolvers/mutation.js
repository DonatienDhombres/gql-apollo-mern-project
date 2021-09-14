const { User } = require('../../models/user');
const { UserInputError, AuthenticationError, ApolloError } = require('apollo-server-express')

module.exports = {
   Mutation: {
      authUser: async (parent, args, context, info) => {
         const { email, password, token } = args.fields;
         try {
            // Check the mail
            const user = await User.findOne({ 'email': email });
            if (!user) {
               throw new AuthenticationError('email not recognized');
            }
            // Check the password
            const checkpass = await user.comparePassword(password);
            if (!checkpass) {
               throw new AuthenticationError('wrong password');
            }

            // User must be right, log in
            // Generates a new token, and saves the user (in the generateToken method that we have implemented)
            const getToken = await user.generateToken();
            if (!getToken) {
               throw new AuthenticationError('Something went wrong, try again');
            }

            // Return
            return {
               _id: user._id,
               email: user.email,
               token: user.token

            };
         } catch (err) {

            throw err

         }
      },
      signUp: async (parent, args, context, info) => {
         try {
            const user = new User({
               email: args.fields.email,
               password: args.fields.password
            });

            const getToken = await user.generateToken();
            if (!getToken) {
               // throw err; 
               // -->throw err c'est le classique. dans apollo, il y a des méthodes de gestion d'erreur plus spécifiques
               throw new AuthenticationError('Something went wrong, try again');
            }

            return { ...getToken._doc }
         } catch (err) {
            if (err.code === 11000) {
               //c'est un code d'erreur de mongoose
               throw new AuthenticationError('Sorry, duplicated email, try a new one');
            }
            throw err

         }
      },
   }
}



