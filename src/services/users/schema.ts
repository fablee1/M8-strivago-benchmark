import mongoose, { Model, Document } from "mongoose"
import bcrypt from "bcrypt"
import { User } from "../../types"

const { Schema, model } = mongoose

export interface UserDocument extends Document, User {}

export interface UserMod extends Model<UserDocument> {
  checkCredentials(email: string, password: string): Promise<UserDocument | null>
}

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      description: "name is a required field",
    },
    surname: {
      type: String,
      required: true,
      description: "Surname is a required field",
    },
    email: {
      type: String,
      description: "email is a required field",
    },
    password: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    googleId: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Host", "Guest"],
      default: "Guest",
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password!, 10)
  }
  next()
})

UserSchema.methods.toJSON = function () {
  const userDocument = this
  const userObject = userDocument.toObject()
  delete userObject.password
  delete userObject.__v
  return userObject
}

UserSchema.statics.checkCredentials = async function (email: string, password: string) {
  const user = await this.findOne({ email })
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }
}

export default model<UserDocument, UserMod>("User", UserSchema)
