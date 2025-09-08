import express from 'express';
import cors from 'cors';
import dbConnect from './config/dbConnect';
import notFound from './middleware/not-found';
import taskRoute from './route/taskRoute';
import authRoute from './route/authRoute';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tasks", taskRoute);



app.use(notFound);


const start =  async () => {
    try {
        await dbConnect(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port} `)
        })

    } catch (error) {
        console.log(error)
    }
}
start()