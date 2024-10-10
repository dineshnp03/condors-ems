import { MongoClient } from "mongodb";

const url = "mongodb+srv://dineshnpcan:admin@dineshcluster0.eja60zw.mongodb.net/employees?retryWrites=true&w=majority&appName=dineshcluster0";
let db;

const connectToDb = (callback) => {
    MongoClient.connect(url).then(client => {
        db = client.db();
        return callback(db);

    }).catch(error => {
        console.error(error);
        return callback(url, error)
    })

}
const getDb = () => {
    return db;
}


export { connectToDb, getDb};