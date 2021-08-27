import createError from "http-errors"
import UserModel from "../services/users/schema.js"
import { verifyJWT } from "./tools.js"

export const JWTAuthMiddleware = async (req, res, next) => {
    console.log(req.headers);
    if(!req.headers.authorization){
        next(createError(401, "please provide credentials in the authorization header!!"))
    }else{
        const token = req.headers.authorization.replace("Bearer ", "")
        const decodedToken = await verifyJWT(token)
        const user = await UserModel.findById(decodedToken._id)
        if(user){
            req.user = user
            next()
        }else{
            next(createError(404, 'User not found'))
        }
    }
}