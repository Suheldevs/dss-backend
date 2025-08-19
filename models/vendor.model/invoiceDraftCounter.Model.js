import mongoose from "mongoose";

const draftCounterSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Registration", required: true },
  seq: { type: Number, default: 0 },
});

const DraftCounterModel = mongoose.model("DraftsCounter", draftCounterSchema);

export default DraftCounterModel;
