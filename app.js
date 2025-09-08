import express from 'express';
import cors from 'cors';
import dbConnect from './config/dbConnect';




const app = express();

app.use(express.json());
app.use(cors());


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