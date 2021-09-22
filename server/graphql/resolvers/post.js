const { User } = require('../../models/user');
const { Post } = require('../../models/post');
const { Category } = require('../../models/category');
const { sortArgsHelper } = require('../../utils/tools');


module.exports = {
   Post: {
      author: async (parent, args, context, info) => {
         try {
            const userId = parent.author;
            const user = await User.findOne({ _id: userId });

            // return user without password
            return {
               ...user._doc,
               password: null
            }
         } catch (err) {
            throw err
         }
      },
      category: async (parent, args, context, info) => {
         try {
            const categoryId = parent.category;
            const category = await Category.findById(categoryId)

            return {
               ...category._doc
            }
         } catch (err) {
            throw err
         }
      },
      related: async (parent, args, context, info) => {
         try {
            const category = parent.category;
            const { sort } = args;

            let sortArgs = sortArgsHelper(sort)
            const { sortBy, order, limit, skip } = sortArgs;

            const posts = await Post
               .find({ "category": category })
               .sort([[sortBy, order]])
               .skip(skip)
               .limit(limit);

            return posts;
         } catch (err) {
            throw err
         }
      }
   }
}

