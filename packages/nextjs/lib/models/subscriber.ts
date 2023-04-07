import mongoose from "mongoose";

export interface SubscriberDocument extends mongoose.Document {
  email: string;
  tier: mongoose.Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const subscriberSchema = new mongoose.Schema<SubscriberDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    tier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tier",
      required: true,
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const Subscriber = mongoose.models.Subscribers || mongoose.model("Subscribers", subscriberSchema);
export default Subscriber;
