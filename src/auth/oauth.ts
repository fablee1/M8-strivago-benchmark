import passport from "passport"
import { Strategy as FacebookStrategy } from "passport-facebook"
import UserModel from "../services/users/schema"
import { JWTAuthenticate } from "./tools"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"

require("dotenv").config()

const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID as string,
    clientSecret: process.env.FACEBOOK_APP_SECRET as string,
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
          name: profile?.name?.givenName,
          surname: profile?.name?.familyName,
          facebookId: profile.id,
        }
        const createdUser = new UserModel(newUser)

        const savedUser = await createdUser.save()

        const tokens = await JWTAuthenticate(savedUser)

        passportNext(null, { user: savedUser, tokens })
      }
    } catch (error) {
      passportNext(error as string | Error | null | undefined)
    }
  }
)

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_SECRET as string,
    callbackURL: "http://localhost:4000/auth/redirectGoogle",
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      const user = await UserModel.findOne({ googleId: profile.id })

      if (user) {
        const tokens = await JWTAuthenticate(user)
        passportNext(null, { tokens })
      } else {
        const newUser = {
          name: profile?.name?.givenName,
          surname: profile?.name?.familyName,
          googleId: profile.id,
        }

        const createdUser = new UserModel(newUser)

        const savedUser = await createdUser.save()
        console.log("hi")
        const tokens = await JWTAuthenticate(savedUser)
        passportNext(null, { user: savedUser, tokens })
      }
    } catch (error) {
      passportNext(error as string | Error | null | undefined)
    }
  }
)

passport.serializeUser(function (user, passportNext) {
  passportNext(null, user)
})

export default facebookStrategy
