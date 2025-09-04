import mongoose from "mongoose";
const connectDb = async () => {
    const url = process.env.MONGO_URL;
    if (!url) {
        throw new Error("Mongo DB url in not given in .env file");
    }
    try {
        await mongoose.connect(url);
        console.log("Connected to mongoDB");
    }
    catch (error) {
        console.error("failed to connec to mongoDb", error);
        process.exit(1);
    }
};
export default connectDb;
