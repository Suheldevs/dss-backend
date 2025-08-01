import { Schema, model } from "mongoose";

// Paid payment subdocument schema
const paidPaymentSchema = new Schema({
  amount: {
    type: String,
    required: true
  },
  paidAt: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String,
    enum: ["cash", "bank", "upi", "cheque", "online","credit_card","debit_card","other"],
    default: "cash"
  },
  remarks: {
    type: String
  }
});

// Main project payment schema
const projectPaymentSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "SaleClientBriefing",
    required: true,
    unique: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  totalPaid: {
    type: Number,
    default: 0 // Keep track of total paid
  },
  remainingAmount: {
    type: Number,
    required: true
  },
  paidPayments: [paidPaymentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ProjectPaymentModel = model("ProjectPayment", projectPaymentSchema);
export default ProjectPaymentModel;
