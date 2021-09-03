import { Router } from "express"
import createError from "http-errors"
import { JWTAuthMiddleware } from "../../auth/middlewares"
import UserModel, { UserDocument, UserMod } from "./schema"
import AccomodationsModel from "../accomodations/schema"
import { hostOnly } from "./sharedMiddlewares"

const usersRouter = Router()

/***************GET ALL USERS*******************/

usersRouter.get("/", JWTAuthMiddleware, hostOnly, async (req, res, next) => {
  try {
    const users = await UserModel.find()
    res.send(users)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

/***************GET ONLY YOUR USER DETAILS*******************/

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

/***************GET USER DEATILS BY SPECIFIC ID*******************/

usersRouter.get("/:userId", JWTAuthMiddleware, hostOnly, async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await UserModel.findById(userId)
    if (user) {
      res.status(200).send(user)
    } else {
      next(createError(`user with id ${userId} not found`))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

/***************POST USER DETAILS*******************/

/* usersRouter.post("/", async (req, res, next) => {
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
}) */

/***************EDIT ONLY YOUR USER DEATILS*******************/

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    if (req.user) {
      const user = req.user as UserDocument
      user.name = req.body.name ? req.body.name : user.name
      user.surname = req.body.surname ? req.body.surname : user.surname
      user.email = req.body.email ? req.body.email : user.email
      user.role = req.body.role ? req.body.role : user.role
      req.user = user
      const editUser = await user.save()
      res.send(editUser)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

/***************EDIT USER DEATILS BY ID*******************/

usersRouter.put("/:userId", JWTAuthMiddleware, hostOnly, async (req, res, next) => {
  try {
    const userId = req.params.userId
    const editUser = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    })
    if (editUser) {
      res.send(editUser)
    } else {
      next(createError(404, `user with id: ${userId} not found`))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

/***************DELETE ONLY YOUR USER DEATILS*******************/

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await (req.user as UserDocument).deleteOne()
    res.status(204).send()
  } catch (error) {
    console.log(error)
    next(error)
  }
})

/***************DELETE USER DETAILS BY ID*******************/

usersRouter.delete("/:userId", JWTAuthMiddleware, hostOnly, async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await UserModel.findByIdAndDelete(userId)
    if (user) {
      res.status(204).send()
    } else {
      next(createError(404, `user with id ${userId} not found`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.get(
  "/me/accomodation",
  JWTAuthMiddleware,
  hostOnly,
  async (req, res, next) => {
    try {
      const userId = (req.user as UserDocument)._id
      const myAccomodations = await AccomodationsModel.find({ host: userId })
      res.send(myAccomodations)
    } catch (error) {
      next(error)
    }
  }
)

export default usersRouter
