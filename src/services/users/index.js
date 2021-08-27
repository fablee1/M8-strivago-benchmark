import { Router } from "express"
import createError from "http-errors"
import passport from "passport"
import UserModel from "./schema.js"
import { hostOnly } from "./sharedMiddlewares.js"

const usersRouter = Router()

/***************GET ALL USERS*******************/

usersRouter.get("/", hostOnly, async (req, res, next) => {
    try {
        const users = await UserModel.find()
        res.send(users)
    } catch (error) {
        console.log(error);
        next(error)
    }
})

/***************GET ONLY YOUR USER DETAILS*******************/

usersRouter.get("/me", async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        console.log(error);
        next(error)
    }
})

/***************GET USER DEATILS BY SPECIFIC ID*******************/

usersRouter.get("/:userId", hostOnly, async (req, res, next) => {
    try {
        const userId = req.params.userId
        const user = await UserModel.findById(userId)
        if(user){
            res.status(200).send(user)
        }else{
            next(createError(`user with id ${userId} not found`))
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

/***************POST USER DETAILS*******************/

usersRouter.post("/", async (req, res, next) => {
    try {
        const { email } = req.body
        const user = await UserModel.findOne({ email: email})
        if(user){
            next(createError(403, "Email already exists"))
        }else{
            const newUser = new UserModel(req.body)
            const {_id} = await newUser.save()
            res.status(201).send({_id})
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

/***************EDIT ONLY YOUR USER DEATILS*******************/

usersRouter.put("/me", async (req, res, next) => {
    try {
        req.user = {...req.body}
        const editUser = await req.user.save()
        req.send(editUser)
    } catch (error) {
        console.log(error);
        next(error)
    }
})

/***************EDIT USER DEATILS BY ID*******************/

usersRouter.put("/:userId", hostOnly, async (req, res, next) => {
    try {
        const userId = req.params.userId
        const editUser = await UserModel.findByIdAndUpdate(userId, req.body,{
            new: true,
            runValidators: true
        })
        if(editUser){
            res.send(editUser)
        }else{
            next(createError(404, `user with id: ${userId} not found`))
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

/***************DELETE ONLY YOUR USER DEATILS*******************/

usersRouter.delete("/me", async (req, res, next) => {
    try {
        await req.user.deleteOne()
        res.status(204).send()
    } catch (error) {
        console.log(error);
        next(error)
    }
})

/***************DELETE USER DETAILS BY ID*******************/

usersRouter.delete("/:userId", hostOnly, async (req, res, next) => {
    try {
        const userId = req.params.userId
        const user = await UserModel.findByIdAndDelete(userId)
        if(user){
            res.status(204).send()
        }else{
            next(createError(404, `user with id ${userId} not found`))
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

export default usersRouter
