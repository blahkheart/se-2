import mongoose from "mongoose";

export interface TierDocument extends mongoose.Document {
  name: string;
  lockAddress: string;
  description: string;
  type: string;
  visibility: string;
  monthlyPrice: number;
  yearlyPrice: number;
  welcomePageUrl: string;
  currency: string;
  createdBy: mongoose.Schema.Types.ObjectId;
}

const tierSchema = new mongoose.Schema<TierDocument>(
  {
    name: { type: String, required: true },
    lockAddress: { type: String, required: true },
    description: { type: String },
    type: { type: String },
    visibility: { type: String },
    monthlyPrice: { type: Number },
    welcomePageUrl: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth-api.User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Tier = mongoose.models.Tiers || mongoose.model("Tiers", tierSchema);
export default Tier;
