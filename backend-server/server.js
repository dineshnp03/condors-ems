// Group Members : 
// Dinesh Narasimhalu Punniyamoorthy
// Jemish Budheshkumar Surani
// Priyank Ghanshyambhai Padshala

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { GraphQLScalarType } from 'graphql';
import { readFile } from 'node:fs/promises';

import { connectToDb, getDb } from './db.js';

const app = new express();
const port = 5002;
app.use(express.json());
let db = undefined;

app.get('/', (req, res) => {
    res.send('Welcome to Employee Management System');
});

// Get all the Employee List from the DB collection
const getAllEmployees = async() => {
    try {
        const getEmployees = await db.collection('employees').find({}).toArray();
        if(!getEmployees.length) {
            throw new Error("No data found")
        }
        return getEmployees;
        
    } catch (error) {
        throw new Error(error.message)
    }
}

//  Get the Employees Count from the DB collection
const getEmployeesCount = async () => {
    try {

        const getEmployeesCount = await db.collection('employees').countDocuments();
        if(!getEmployeesCount) {
            throw new Error("Error while fetching count");
        }
        return getEmployeesCount;
    } catch(error) {
        throw new Error(error.message);
    }
}


// Create new Employee to the DB
const createEmployee = async (_, {newEmployee})=> {
    try {

        console.log(newEmployee);
        const employeeAdd = {
            ...newEmployee,
            id: await getEmployeesCount() + 1
        }
        const insertNewEmployee = await db.collection('employees').insertOne(employeeAdd);
        const insertedEmployee = await db.collection('employees').findOne({_id: insertNewEmployee.insertedId});
        return insertedEmployee;
    } catch(error) {
        console.log('Error while adding new employee');
        throw new Error(error.message);
    }
}

// Get Employee Details by passing the ID
const getEmployeeById = async (_, {id}) => {
    try {
        const employeeDetail = await db.collection('employees').findOne({id: parseInt(id)});

        if(!employeeDetail) {
            throw new Error('Employee Detail not found, Check admin');
        }
        return employeeDetail;
    } catch(error) {
        console.log('Error while fetching employee details');
        throw new Error(error.message);
    }

}

// Update Employee Details by passing the Id and EmployeeInput
const updateEmployee = async (_, {id, employeeInput}) => {
    try {
        await db.collection('employees').updateOne({id: parseInt(id)}, {$set: employeeInput});
        const updatedEmployee = await db.collection('employees').findOne({id: parseInt(id)});
        if(!updateEmployee) {
            throw new Error('Employee Detail not found, Check admin');
        }
        return updatedEmployee;
    } catch(error) {
        console.log('Error while updating employee details');
        throw new Error(error.message);
    }
}


// Delete Employee Details by passing the Id
const deleteEmployee = async (_, {id}) => {
    try {
        const deletedEmployee = await db.collection('employees').findOne({id: parseInt(id)});
        if(!deletedEmployee) {
            throw new Error('Employee Detail not found, Check admin');
        }
        const result = await db.collection('employees').deleteOne({id: parseInt(id)});
        console.log(result)
        return result.deletedCount > 0;
    } catch(error) {
        console.log('Error while deleting employee details');
        throw new Error(error.message);
    }
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
        employeeList: getAllEmployees,
        employeeDetail: getEmployeeById,
    },
    Mutation: {
        createEmployee: createEmployee,
        updateEmployee,
        deleteEmployee
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