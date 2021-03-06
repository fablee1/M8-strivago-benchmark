import { Router } from "express"
import createError from "http-errors"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"
import { hostOnly } from "../users/sharedMiddlewares.js"

import AccomodationModel from "./schema.js"

const accomodationsRouter = Router()

accomodationsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accomodations = await AccomodationModel.find().populate("host")
    res.send(accomodations)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

accomodationsRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accomodation = await AccomodationModel.findById(req.params.id).populate("host")

    if (accomodation) {
      res.send(accomodation)
    } else {
      next(createError(404, `Accomodation with id ${req.params.id}, is not found!`))
    }
  } catch (error) {
    next(error)
  }
})

accomodationsRouter.post("/", JWTAuthMiddleware, hostOnly, async (req, res, next) => {
  try {
    const newAccomodation = new AccomodationModel({ ...req.body, host: req.user.id })
    const { _id } = await newAccomodation.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

accomodationsRouter.put("/:id", JWTAuthMiddleware, hostOnly, async (req, res, next) => {
  try {
    const updatedAccomodation = await AccomodationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    if (updatedAccomodation) {
      res.sendStatus(204)
    } else {
      next(createError(404, `Accomodation with id ${req.params.id} is not found!`))
    }
  } catch (error) {
    next(error)
  }
})

accomodationsRouter.delete(
  "/:id",
  JWTAuthMiddleware,
  hostOnly,
  async (req, res, next) => {
    try {
      const accomodationDeleted = await AccomodationModel.findByIdAndDelete(req.params.id)
      if (accomodationDeleted) {
        res.sendStatus(204)
      } else {
        next(createError(404, `Accomodation with _id ${req.params.id} not found!`))
      }
    } catch (error) {
      next(error)
    }
  }
)

export default accomodationsRouter
