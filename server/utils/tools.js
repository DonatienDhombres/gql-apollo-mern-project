const userOwnership = (req, valueToCompare) => {
   if (req._id.toString() !== valueToCompare.toString()) {
      return false;
   }
   return true;
}

const sortArgsHelper = (sort) => {
   let sortArgs = { sortBy: "_id", order: "asc", limit: 10, skip: 0 }

   for (key in sort) {
      if (sort[key]) {
         sortArgs[key] = sort[key]
      }
   }

   return sortArgs;
}


module.exports = {
   userOwnership,
   sortArgsHelper
}