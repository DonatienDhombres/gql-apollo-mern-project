const { AuthenticationError } = require('apollo-server-express')
const { User } = require('../../models/user');
const { Post } = require('../../models/post');
const { Category } = require('../../models/category');
const authorize = require('../../utils/isAuth');
const { sortArgsHelper } = require('../../utils/tools');



module.exports = {
   Query: {
      // Find a user by id and check if it has the right token
      user: async (parent, args, context, info) => {
         const { id } = args;
         const { req: req1 } = context;
         try {
            const req = authorize(req1) /* authorize va renvoyer la req si on a un token valide dans le req.headers.authorization, et renvoyer une erreur sinon
            Rq: le req.headers.authorize on l'a définit nous-même dans le context du server.js */
            const user = await User.findOne({ '_id': id });

            if (req._id.toString() !== user._id.toString()) {
               throw new AuthenticationError("You don't own this user");

            }
            return user;

         } catch (err) {
            throw err;
         }
      },
      // Check if a user is authenticated, and if he is, send him back
      isAuth: async (parent, args, context, info) => {
         try {
            const req = authorize(context.req, true);

            if (!req._id) {
               throw new AuthenticationError('Bad token');
            }
            return { _id: req._id, email: req.email, token: req.token }
         } catch (err) {
            throw err;
         }
      },
      categories: async (parent, args, context, info) => {
         const { catId } = args;
         try {
            let catQuery = {};
            if (catId) {
               catQuery['_id'] = catId;
            }

            const categories = await Category.find(catQuery);
            return categories;

         } catch (err) {
            throw err;
         }
      },
      post: async (parent, args, context, info) => {
         const { id } = args;
         try {
            const post = await Post.findById(id);
            return post;
         } catch (err) {
            throw err;
         }
      },
      posts: async (parent, args, context, info) => {
         const { sort, queryBy } = args;
         try {
            let queryArgs = {};
            if (queryBy) {
               const { key, value } = queryBy
               queryArgs[key] = value;
            };

            let sortArgs = sortArgsHelper(sort)
            // console.log(sortArgs)

            const { sortBy, order, limit, skip } = sortArgs;

            const posts = await Post
               .find(queryArgs)
               .sort([[sortBy, order]])
               .skip(skip)
               .limit(limit);
            return posts;
         } catch (err) {
            throw err;
         }
      }
   }
}

