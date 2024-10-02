import express from "express";
import router from "./routes";
import connectDB from "./config/db"; // Import DB connection
import cors from "cors"; // Import CORS
import dotenv from 'dotenv';

try {
    dotenv.config();
} catch (error) {
    console.log(error)    
}

const app = express();

app.use(express.json());

app.use(cors());

// Connect to the database
connectDB();

app.use('', router);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});
