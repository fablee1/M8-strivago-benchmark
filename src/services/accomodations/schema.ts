import mongoose, { Document, Model } from "mongoose"
import { Accomodation } from "../../types"

const { Schema, model } = mongoose

interface AccomodationDocument extends Document, Accomodation {}

interface AccomodationModel extends Model<AccomodationDocument> {}

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

export default model<AccomodationDocument, AccomodationModel>(
  "Accomodation",
  AccomodationSchema
)
