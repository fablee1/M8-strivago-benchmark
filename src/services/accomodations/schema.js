import mongoose from "mongoose"

const { Schema, model } = mongoose

const AccomodationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    host: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
)

export default model("Accomodation", AccomodationSchema)
