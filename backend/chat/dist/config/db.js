"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDb = async () => {
    const url = process.env.MONGO_URL;
    if (!url) {
        throw new Error("Mongo DB url in not given in .env file");
    }
    try {
        await mongoose_1.default.connect(url);
        console.log("Connected to mongoDB");
    }
    catch (error) {
        console.error("failed to connec to mongoDb", error);
        process.exit(1);
    }
};
exports.default = connectDb;
