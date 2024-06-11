import dotenv from "dotenv";

import { MongoClient } from "mongodb";

dotenv.config();

const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_URI = process.env.MONGODB_DATABASE_URI;
const MONGODB_DB = process.env.MONGODB_DB;
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URI}`;
const client = new MongoClient(uri);

export async function getLatestTransactionData() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const collection = client
      .db(MONGODB_DB)
      .collection(MONGODB_COLLECTION);
    const query = {}; // query for all transactions
    const options = {
      sort: { _id: -1 },
      projection: { _id: 0 },
    };
    const result = await collection.findOne(query, options);
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function storeTransactionDataInDatabase(transactionData) {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const collection = client
      .db("polititian-transactions")
      .collection("transactions-test");
    const result = await collection.insertOne(transactionData);
    console.log(
      `Transaction data was inserted with the _id: ${result.insertedId}`
    );
  } catch (error) {
    console.error(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
