import createError from "http-errors"

export const hostOnly = (req, res, next) => {
    if (req.user.role === "Host") {
      next()
    } else {
      next(createError(403, "Host only!"))
    }
  }