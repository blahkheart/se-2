import mongoose from "mongoose";

export interface SubscriberDocument extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  membership: mongoose.Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const subscriberSchema = new mongoose.Schema<SubscriberDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "auth-api.User", required: true },
    membership: {
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
