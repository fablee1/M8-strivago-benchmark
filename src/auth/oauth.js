import passport from "passport"
import FacebookStrategy from "passport-facebook"
import UserModel from "../services/users/schema.js"
import { JWTAuthenticate } from "./tools.js"

const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://localhost:4000/auth/facebookRedirect",
    profileFields: ["id", "name", "email"],
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      const user = await UserModel.findOne({ facebookId: profile.id })
      if (user) {
        const tokens = await JWTAuthenticate(user)
        passportNext(null, { tokens })
      } else {
        const newUser = {
          name: profile.name.givenName,
          surname: profile.name.familyName,
          facebookId: profile.id,
        }
        const createdUser = new UserModel(newUser)

        const savedUser = await createdUser.save()

        const tokens = await JWTAuthenticate(savedUser)

        passportNext(null, { user: savedUser, tokens })
      }
    } catch (error) {
      console.log(error)
      passportNext(error)
    }
  }
)

passport.serializeUser(function (user, passportNext) {
  passportNext(null, user)
})

export default facebookStrategy
