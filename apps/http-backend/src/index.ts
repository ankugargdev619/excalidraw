import express, { json } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {JWT_SECRET} from "@repo/environment/config";
import {SALT} from "@repo/environment/config";
import { checkAuth } from "./middlewares/checkAuth";
import {CreateRoomSchema, CreateUserSchema, SigninSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client";
const app = express();
app.use(express.json());


app.post("/signup",async (req,res)=>{
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success){
        const issue = parsedData.error?.issues[0];
        res.status(411).json({
            message : `${issue?.path[0]} ${issue?.message}` || "Incorrect input"
        })
        return
    }

    

    try{
        const hashPass = await bcrypt.hash(parsedData.data.password,SALT);
        const user = await prismaClient.user.create({
            data : {
                name : parsedData.data?.name,
                // TODO hash the password
                email : parsedData.data.username,
                password : hashPass
            }
        })
    } catch(e){
        console.log(e);
        res.status(411).json({
            message : "User is already registered"
        });
        return
    }

    res.json({
        "message" : "User is created!"
    })
});

app.post("/signin",async (req,res)=>{
    const parsedData = SigninSchema.safeParse(req.body);

    if(!parsedData.success){
        const issue = parsedData.error?.issues[0];
        res.status(411).json({
            message : `${issue?.path[0]} ${issue?.message}` || "Incorrect input"
        })
        return
    }

    try{
        const user = await prismaClient.user.findFirst({
            where : {
                email : parsedData.data.username
            }
        })

        if(!user){
            res.json({
                message : "User not found"
            });
            return
        }

        const isValidPass = await bcrypt.compare(parsedData.data.password,user?.password)
        if(!isValidPass){
            res.status(411).json({
                message : "Your password is incorrect"
            });
            return;
        }

        const token = jwt.sign({
            username : user?.email
        },JWT_SECRET)

        res.json({
            token : token
        })
        return

    } catch(e){
        console.log(e);
        res.status(411).json({
            message : "User does not exist"
        });
        return
    }

})


app.post("/room",checkAuth,async (req,res)=>{
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        const issue = parsedData.error?.issues[0];
        res.status(411).json({
            message : `${issue?.path[0]} ${issue?.message}` || "Incorrect input"
        })
        return;
    }

    const userId = req.userId;
    console.log(userId);

    try{        
        const room = await prismaClient.room.create({
            data :{
                slug : parsedData?.data.name,
                adminId : userId
            }
        })
        console.log(room);
        res.json({
            room
        })
        return
    } catch(e){
        console.log(e);
        res.status(411).json({
            message : "Error creating room!"
        })
        return
    }
})

app.listen(3001);

