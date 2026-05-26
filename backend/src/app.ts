import express , {Request,Response,NextFunction} from 'express';
import cors from 'cors';
const app = express();

app.use(cors);
app.use(express.json());

app.get('/' , (req,res)=>{
    res.json({message : "vedaAI is running"})
});



app.use((err:any , req:Request,res:Response, next:NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success : false,
        message,
    })
});

export default app;