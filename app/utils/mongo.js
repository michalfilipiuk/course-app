import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}

const uri = process.env.MONGO_URI;

// Add diagnostic logging
console.log('Environment:', process.env.NODE_ENV);
console.log('MongoDB URI (masked):', uri.replace(/\/\/.*@/, '//<credentials>@'));

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

try {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect()
      .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} catch (err) {
  console.error('MongoDB connection error:', err);
  throw new Error(`Failed to establish MongoDB connection: ${err.message}`);
}

// Test the connection
clientPromise
  .then(client => {
    console.log('Successfully connected to MongoDB');
    return client.db().command({ ping: 1 });
  })
  .then(() => {
    console.log('MongoDB ping successful');
  })
  .catch(err => {
    console.error('MongoDB connection/ping failed:', err);
    throw err;
  });

export default clientPromise;
  