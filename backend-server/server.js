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
const getAllEmployees = async(_, {type, retirementFilter}) => {
    try {
        const filter = type ? { EmployeeType: type } : {};
        const getEmployees = await db.collection('employees').find(filter).toArray();
        if(!getEmployees.length) {
            throw new Error("No data found")
        }

        const getUpdatedEmployees = getEmployees
            .map((employee) => {
                const retirementDetails = calculateRetirementDetails(employee);
                return { ...employee, retirementDetails };
            })
            .filter((employee) => {
                if (retirementFilter) {
                    return employee.retirementDetails?.isUpcoming || false;
                }
                return true;
            });
        return getUpdatedEmployees;
        
    } catch (error) {
        throw new Error(error.message)
    }
}

//  Get the Employees Count from the DB collection
const getEmployeesCount = async () => {
    try {

        const getEmployeesCount = await db.collection("counters")
        .findOneAndUpdate(
          { name: 'employees' },
          { $inc: { count: 1 } },
          { returnOriginal: false, upsert: true }
        );
        console.log(getEmployeesCount)
        if(!getEmployeesCount) {
            throw new Error("Error while fetching count");
        }
        return getEmployeesCount.count;
    } catch(error) {
        throw new Error(error.message);
    }
}


// Create new Employee to the DB
const createEmployee = async (_, {newEmployee})=> {
    try {

        const employeeAdd = {
            ...newEmployee,
            id: await getEmployeesCount()
        }
        console.log(employeeAdd)
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
        const retirementDetails = calculateRetirementDetails(employeeDetail);
        return { ...employeeDetail, retirementDetails };
    } catch(error) {
        console.log('Error while fetching employee details');
        throw new Error(error.message);
    }

}

// Update Employee Details by passing the Id and EmployeeInput
const updateEmployee = async (_, {id, newEmployee}) => {
    try {
        const updateData = await db.collection('employees').updateOne({id: parseInt(id)}, {$set: newEmployee});
        console.log(updateData)
        if (updateData.matchedCount === 0) {
            throw new Error('Employee not found, please check the Id.');
        }
        const updatedEmployee = await db.collection('employees').findOne({id: parseInt(id)});
        if(!updatedEmployee) {
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


// Calculating the upcoming Retirement Details
const calculateRetirementDetails = (employee) => {
    const retirementAge = 70; 
    const today = new Date();
    
    // Caluclating the exact age
    const birthDate = new Date(employee.dob);
    let age = employee.age;
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjusting the month difference if the birthday hasn't occurred this year yet
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--; 
    }

    const yearsLeftForRetirement = retirementAge - age;

    if (yearsLeftForRetirement <= 0 || !employee.currentStatus) {
        return null;
    }

    // Calculating the retirement date
    const retirementDate = new Date(birthDate);
    retirementDate.setFullYear(birthDate.getFullYear() + retirementAge);

    // Calculating the remaining days, months and years for the retirement
    const timeDiff = retirementDate - today;
    const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const monthsLeft = Math.floor(daysLeft / 30.44) % 12; // 30.44 = Average no. of. days in a year
    const yearsLeft = Math.floor(daysLeft / 365);

    const isUpcoming = (() => {
        const diffInMonths =
            (retirementDate.getFullYear() - today.getFullYear()) * 12 +
            (retirementDate.getMonth() - today.getMonth());
        return diffInMonths <= 6 && diffInMonths >= 0;
    })();

    return {
        dateOfRetirement: retirementDate,
        yearsLeft: `${yearsLeft} years`,
        monthsLeft: `${monthsLeft} months`,
        daysLeft: `${daysLeft % 30} days`,
        isUpcoming
    };
};



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
    } else {
        console.log(err)
    }
});