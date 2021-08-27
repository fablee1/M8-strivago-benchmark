import passport from "passport"
import FacebookStrategy from "passport-facebook"

const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:4000/auth/facebookRedirect",
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      return
    } catch (error) {
      return
    }
  }
)

passport.serializeUser(function (user, passportNext) {
  passportNext(null, user)
})

export default facebookStrategy
