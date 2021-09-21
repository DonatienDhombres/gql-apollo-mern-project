const { User } = require('../../models/user');
const { Post } = require('../../models/post');
const { Category } = require('../../models/category');


module.exports = {
   Category: {
      posts: async (parent, args, context, info) => {
         try {
            const categoryID = parent._id;
            const posts = await Post.find({ 'category': categoryID });

            return posts;
         } catch (err) {
            throw err
         }
      },
      author: async (parent, args, context, info) => {
         try {
            const authorID = parent.author;
            const user = await User.findOne({ _id: authorID });

            // return user without password
            return {
               ...user._doc,
               password: null
            }
         } catch (err) {
            throw err
         }
      }

   }
}

