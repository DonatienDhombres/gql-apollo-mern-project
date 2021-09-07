module.exports = {
   Query: {
      hello: async (parent, args, context, info) => {
         return 'hello back'
      }
   }
}