import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from "@repo/environment/config";

export function checkAuth(req : Request ,res : Response,next : NextFunction){
    try{
        const token = req.headers.authorization?.split(" ")[1] ?? "";
        const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload;
        console.log(decoded);
        if(decoded){
            req.userId = decoded.username;
            console.log("User is authenticated");
            next();
        } else {
            res.status(403).json({message : "You are not authorized!"});
            return;
        }
    } catch(e){
        res.status(403).json({message : "Error while authenticated!"});
        return;
    }
    
}