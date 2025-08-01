import {Schema,model} from "mongoose"

const userProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Registration",  // Vendor's ID
    required: true,
    unique: true,
  },

   createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Registration", // DSS HR's ID
      required: true,
    },

  photo: {
    type: String,
    default: "https://www.gravatar.com/avatar/?d=mp", // default avatar
  },

  businessInfo: {
    contactPersonName: { type: String, required: true },
    businessName: { type: String, required: true },
    businessEmail: { type: String, required: true },
    businessAddress: {
      street: { type: String, default: "" },
      area: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
    contactNumber: { type: String, required: true },
    altContactNumber: { type: String, default: "" },
  },

  kyc: {
    gst: { type: String, required: true },
    pan: { type: String, required: true },
    aadhar: { type: String, required: true },
    bank: {
      name: { type: String, required: true },
      account: { type: String, required: true },
      ifsc: { type: String, required: true },
    },
    CIN: { type: String, default: "" },
    TIN: { type: String, default: "" },
  },

  contract: {
    name: { type: String, default: "DSS Vendor Agreement.pdf" },
    url: { type: String, default: "/DSS_Vendor_Agreement.pdf" },
  },
}, {
  timestamps: true,
});

const userProfileModel= model("UserProfile", userProfileSchema);

export default userProfileModel ;