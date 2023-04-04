import mongoose from "mongoose";

export interface IntegrationDocument extends mongoose.Document {
  name: string;
  apiKey: string;
  description: string;
  createdBy: mongoose.Schema.Types.ObjectId;
}

const integrationSchema = new mongoose.Schema<IntegrationDocument>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  apiKey: {
    type: String,
    required: true,
    unique: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Integration = mongoose.model("Integrations", integrationSchema);

export default Integration;
