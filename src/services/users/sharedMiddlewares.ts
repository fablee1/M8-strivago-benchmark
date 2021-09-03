import { NextFunction, Response, Request } from "express"
import createError from "http-errors"
import { UserDocument } from "./schema"

export const hostOnly = (req: Request, res: Response, next: NextFunction) => {
  if ((req.user as UserDocument).role === "Host") {
    next()
  } else {
    next(createError(403, "Host only!"))
  }
}
