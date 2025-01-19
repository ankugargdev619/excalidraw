import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from "@repo/environment/config";

export function checkAuth(req : Request ,res : Response,next : NextFunction){
    const token = req.headers.authorization ?? "";
    const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload;

    if(decoded){
        req.userId = decoded.userId;
        next();
    }
    res.status(403).json("You are not authorized!");
}