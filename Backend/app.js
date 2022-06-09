const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbKey = require('./databse-key');
const { graphqlHTTP } = require('express-graphql');
const graphQLschema = require('./graphql/schema');
const graphQLresolver = require('./graphql/resolvers');
const app = express();
const authCheck = require('./middleware/is-auth');

// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Header');

  if(req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(authCheck);

app.use('/graphql', graphqlHTTP({
  schema: graphQLschema,
  rootValue: graphQLresolver,
  graphiql: true, // wir nutzen app.use und nicht post da diese config einen GET Request auf das Test-Interface von GraphQL zulässt
  customFormatErrorFn: error => ({
    message: error.message || 'An error occurred.',
    code: error.code || 500,
    data: error.data
  })
}))


//Error Handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data
  });
});

mongoose.connect(dbKey).then(() => {
  app.listen(8080);
}
).catch((err) => console.log(err))




