const { Post } = require('../../models/post');
const { Category } = require('../../models/category');
const { sortArgsHelper } = require('../../utils/tools');


module.exports = {
   User: {
      posts: async (parent, args, context, info) => {
         const { sort } = args;
         try {
            let sortArgs = sortArgsHelper(sort)
            const userId = parent._id;
            // console.log(sortArgs)
            const { sortBy, order, limit, skip } = sortArgs;

            const posts = await Post
               .find({ author: userId })
               .sort([[sortBy, order]])
               .skip(skip)
               .limit(limit);

            return posts;
         } catch (err) {
            throw err
         }
      },
      categories: async (parent, args, context, info) => {
         try {
            const userId = parent._id;
            const categories = await Category.find({ author: userId });

            return categories;
         } catch (err) {
            throw err
         }
      }
   }
}

