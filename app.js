const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connect() {
    try {
        await client.connect();
        console.log("MongoDB se connect ho gaya!");
    } catch (error) {
        console.error("Error:", error);
    }
}

connect(); 