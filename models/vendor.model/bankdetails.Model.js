import mongoose from "mongoose";

const bankSchema = new mongoose.Schema(
  {
    accountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String, required: true },
    branchName: { type: String },
    upiId: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Registration" }, // optional
  },
  { timestamps: true }
);

const bankModel = mongoose.model("Bank", bankSchema);
export default bankModel;
