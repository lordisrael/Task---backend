const express = require('express');
const dbConnect = require('./config/dbConnect');
const taskRoute = require('./route/taskRoute');
const authRoute = require('./route/authRoute');
const dotenv = require('dotenv');
const notFound = require('./middleware/not-found');
const cors = require('cors');



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