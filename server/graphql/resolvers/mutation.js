const { User } = require('../../models/user');
const { Post } = require('../../models/post');
const { UserInputError, AuthenticationError, ApolloError } = require('apollo-server-express')
const authorize = require('../../utils/isAuth');
const { userOwnership } = require('../../utils/tools');



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
      updateUserProfile: async (parent, args, context, info) => {
         const { name, lastname, _id } = args;
         const { req: req1 } = context;
         try {
            const req = authorize(req1) /* authorize va return la req si on a un token valide dans le req.headers */

            if (!userOwnership(req, _id)) { /*userOwnership renvoie true ou false selon que request.id == id càd, la req a été envoyée par le bon user*/
               throw new AuthenticationError("You dont own this user");
            }

            const user = await User.findOne({ '_id': _id });
            if (!user) {
               throw new AuthenticationError('no user');
            }

            // Normally, should validate fields before using (name, lastname) 
            user.name = name;
            user.lastname = lastname;
            await user.save();
            return { ...user._doc };
         } catch (err) {
            throw err
         }
      },
      updateUserEmailPass: async (parent, args, context, info) => {
         const { email, password, _id } = args;
         const { req: req1 } = context;

         try {
            const req = authorize(req1); /* check if the user has a valid token*/

            if (!userOwnership(req, _id)) /* check if the user owns the document it wants to update*/
               throw new AuthenticationError("You dont own this user");

            const user = await User.findOne({ _id: req._id });
            if (!user) throw new AuthenticationError("Sorry, try again");

            //// validate fields, please
            if (email) { user.email = email }
            if (password) { user.password = password }

            /// USER IS RIGHT, GENERATE TOKEN
            const getToken = await user.generateToken(); /*getToken is a user (in which it adds at token) */
            if (!getToken) {
               throw new AuthenticationError('Something went wrong, try again');
            }

            return { ...getToken._doc, token: getToken.token }
         } catch (err) {
            throw new ApolloError('Something went wrong, try again', err);
         }
      },
      createPost: async (parent, args, context, info) => {
         const { title, excerpt, content, status } = args.fields;
         const { req: req1 } = context;

         try {
            const req = authorize(req1) /* authorize va return la req si on a un token valide dans le req.headers */

            // Should validate fields here
            const post = new Post({
               title: title,
               excerpt: excerpt,
               content: content,
               status: status,
               author: req._id
            });

            const result = await post.save();
            return { ...result._doc };

         } catch (err) {
            throw err
         }
      }
   }
}



