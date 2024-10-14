import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { readFile } from 'node:fs/promises';
import { GraphQLScalarType } from 'graphql';

import {connectToDb, getDb} from './db.js'

const app = new express();
const port = 5002;
app.use(express.json());
let db = undefined;

app.get('/', (req, res) => {
    res.send('Welcome to Employee Management System');
});

// Get all the Employee List from the DB collection
const getAllEmployees = async() => {
    const getEmployees = await db.collection('employees').find({}).toArray();
    return getEmployees;
}

//  Get the Employees Count from the DB collection
const getEmployeesCount = async () => {
    const getEmployeesCount = await db.collection('employees').countDocuments();
    return getEmployeesCount;
}


// Create new Employee to the DB
const createEmployee = async (_, {newEmployee})=> {
    console.log(newEmployee);
    const employeeAdd = {
        ...newEmployee,
        id: await getEmployeesCount() + 1
    }
    const insertNewEmployee = await db.collection('employees').insertOne(employeeAdd);
    const insertedEmployee = await db.collection('employees').findOne({_id: insertNewEmployee.insertedId});
    return insertedEmployee;
}

//  Creating the custom scalar Date Type using GraphQlScalarType
const GraphQLDateResolver = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'Custom GraphQl Date type',
    serialize(value) {
        return value.toISOString();
    },
    parseValue(value) {
        const newDate = new Date(value);
        return isNaN(newDate) ? undefined : newDate;
    },
});


// Defining the Types by reading from schema.graphql file
const typeDefs = await readFile('./schema.graphql', 'utf8');

//  Defining the resolvers - which acts as controllers to the GraphQL
const resolvers = {
    Query: {
        employeeList: getAllEmployees
    },
    Mutation: {
        createEmployee: createEmployee
    },
    GraphQLDate: GraphQLDateResolver
};

//  Defining the Apollo Server
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

// Initializing the Apollo Server.
await apolloServer.start();

// Attaching the graphql with the Express.
app.use('/graphql', expressMiddleware(apolloServer))


// Exploring the DB connection
connectToDb((url, err) => {
    if(!err) {
        app.listen(port, () => {
            console.log("App is running in port: ", port)
            console.log("Connected to Mongo Db: ", url)
            console.log(`Start Apollo server in http://localhost:${port}/graphql`);
            db = getDb();
        })
        // console.log(db)
    } else {
        console.log(err)
    }
});