const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const config = require('config')
const db = config.get('mongoURI');

// graphql
const typeDefs = require('./graphql/schema')
const { Query } = require('./graphql/resolvers/query')
const { Mutation } = require('./graphql/resolvers/mutation')


const app = express();
const server = new ApolloServer({
   typeDefs,
   resolvers: {
      Query,
      Mutation
   }
});


server.applyMiddleware({ app });


//Connect Database
const connectDB = async () => {
   try {
      await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
      console.log('MongoDB Connected...');
   } catch (err) {
      console.log(err.message);
      //Exist process with failure
      process.exit(1);
   }
}
connectDB();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
})
