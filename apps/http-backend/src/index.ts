import express, { json } from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "@repo/environment/config";
import { checkAuth } from "./middlewares/checkAuth";
import {CreateUserSchema} from "@repo/common/types";
const app = express();
app.use(express.json());


app.post("/signup",(req,res)=>{
    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message : "Incorrect input"
        })
        return
    }
    res.json({
        "message" : "User is created!"
    })
});

app.post("/signin",(req,res)=>{
    const userId = req.body.userId;
    const password = req.body.password;
    const token = jwt.sign({
                        userId
                    },JWT_SECRET);

    res.json({
        token
    })
})


app.post("/room",checkAuth,(req,res)=>{
    const roomId = "1234"
    res.json({
        roomId
    })
})

app.listen(3001);

