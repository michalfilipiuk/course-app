import mongoose from "mongoose";

const connectMongo = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        return conn;
    } catch(e) {
        console.error('MongoDB connection error:', e.message);
        throw e; // Re-throw the error to handle it in the calling code
    }
}

// Add connection status check
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

export default connectMongo;