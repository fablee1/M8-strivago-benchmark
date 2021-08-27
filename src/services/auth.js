import { Router } from "express"
import createError from "http-errors"
import passport from "passport"
import { JWTAuthenticate } from "../auth/tools.js"
import UserModel from "./users/schema.js"

const authRouter = Router()

authRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.checkCredentials(email, password)
        if(user){
            const accessToken = await JWTAuthenticate(user)
            res.send({accessToken})
        }else{
            next(createError(401, "Credentials are not valid"))
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

authRouter.post("/register", async (req, res, next) => {
    try {
        const { email } = req.body
        const user = await UserModel.findOne({ email: email})
        if(user){
            next(createError(403, "Email already exists"))
        }else{
            const newUser = new UserModel(req.body)
            const addedUser = await newUser.save()
            const token = await JWTAuthenticate(addedUser)
            res.status(201).send({accessToken: token, addedUser})
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

authRouter.get("/facebookLogin", async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log(error);
        next(error)
    }
})

authRouter.get("/facebookRedirect", async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log(error);
        next(error)
    }
})


export default authRouter
