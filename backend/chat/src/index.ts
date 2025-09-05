import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db";
import chatRoute from "./routes/chat"



dotenv.config();
connectDb();


const app = express();
app.use(express.json())


app.use("/api/v1",chatRoute)

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});