const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const config = require('config')
const db = config.get('mongoURI');

// graphql
const typeDefs = require('./graphql/schema')
const { Query } = require('./graphql/resolvers/query')
const { Mutation } = require('./graphql/resolvers/mutation')
const { User } = require('./graphql/resolvers/user');



const app = express();
const server = new ApolloServer({
   typeDefs,
   resolvers: {
      Query,
      Mutation,
      User
   },
   context: ({ req, res }) => {
      req.headers.authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTQyMGY0NGIzMTY3YjUyMDg3ZThhYjAiLCJlbWFpbCI6InRhcmF0YXRhMTFAbWFpbC5jb20iLCJpYXQiOjE2MzE3MTkyMzYsImV4cCI6MTYzMjMyNDAzNn0.ADVI9GzxOpjrk8xcFPizXK1hz-TJdtZGkLrwuUVtoFE';
      return { req }
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
