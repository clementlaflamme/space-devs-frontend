import { type Request, type Response, type NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

// Token = Header.Payload.Signature
// Payload : {sub: number, role: "USER" | "ADMIN"} 
export type JwtPayload = {sub: number, role: "USER" | "ADMIN"}

export function authentifier(req: Request, res: Response, next: NextFunction){
    const header = req.headers.authorization // "Bearer xxx.yyy.zzz"
    if(!header?.startsWith("Bearer ")){
        return res.status(401).json({erreur : "Token Manquant"})
    }
    const token = header.split(" ")[1] // ==> ["Bearer","xxx.yyy.zzz"]
    if(!token){
        return res.status(401).json({erreur: "Token manquant !"})
    }
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as unknown as JwtPayload;
        
        (req as any).user = payload
        next()
    }catch{
        res.status(401).json({erreur:"Token invalide ou expire !"})
    }
}

export function exigerRole(role: "ADMIN" | "USER"){
    return (req:Request, res:Response, next:NextFunction) => {
        if((req as any).user.role !== role){
            return res.status(403).json({erreur:"Acces refuse !"})
        }
        next()
    }
}