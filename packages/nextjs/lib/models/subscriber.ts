import mongoose from "mongoose";

export interface SubscriberDocument extends mongoose.Document {
  id: string;
  email: string;
  address: string;
  tier: mongoose.Schema.Types.ObjectId;
  startDate: number;
  endDate: number;
  isActive: boolean;
}

const subscriberSchema = new mongoose.Schema<SubscriberDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
      unique: true,
    },
    tier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tier",
      required: true,
    },
    startDate: { type: Number, default: Date.now },
    endDate: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const Subscriber = mongoose.models.Subscribers || mongoose.model("Subscribers", subscriberSchema);
export default Subscriber;
