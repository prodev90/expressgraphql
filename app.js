var express = require('express');
var graphqlHTTP = require('express-graphql');
var Graphql = require('graphql');
var { buildSchema } = require('graphql');

const session = {id: "1001", expires: 20000};

const personType = new Graphql.GraphQLObjectType({
  name: "Person",
  fields:{
    name: { type: Graphql.GraphQLString },
    age: { type: Graphql.GraphQLInt }
  }
});

const queryType = new Graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    hello: {
      type: Graphql.GraphQLString,
      resolve: () => 'Hello world!',
    },
    persons: {
      type: new Graphql.GraphQLList(personType),
      args: {
        name: {type: Graphql.GraphQLString},
        age: {type: Graphql.GraphQLInt}
      },
      resolve: (post, args, context, info) => {
        console.log(context);
        console.log(args);
        const {name, age} = args;

        return [
          {name:"kim", age: 20},
          {name:"lee", age: 30},
          {name:"park", age: 40},
        ].filter((person) => {
          if(!name && !age){ return true; }
          if(!age && name && person.name === name){ return true; }
          if(!name && age && person.age === age){ return true; }
          if(name && age && person.name === name && person.age === age){ return true; }
          return false;
        });
      }
    }
  }
});

var schema = buildSchema(`
  type Query {
    hello: String
    persons(name: String, age: Int): [Person]
  }

  type Person {
    name: String
    age: Int
  }
`);

var root = {
  hello: () => 'Hello world!',
  persons: (args, context, info) => {
    console.log(context);
    console.log(args);
    const {name, age} = args;

    return [
      {name:"kim", age: 20},
      {name:"lee", age: 30},
      {name:"park", age: 40},
    ].filter((person) => {
      if(!name && !age){ return true; }
      if(!age && name && person.name === name){ return true; }
      if(!name && age && person.age === age){ return true; }
      if(name && age && person.name === name && person.age === age){ return true; }
      return false;
    });
  }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  context: session,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));