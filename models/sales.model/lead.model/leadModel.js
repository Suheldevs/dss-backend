import { Schema, model } from "mongoose";

const leadSchema = new Schema({
  leadSource: {
    type: String,
    required: true,
    enum: ["Website", "Phone", "Email", "Justdial", "Indiamart", "Instagram", "Facebook", "Other"],
    default: "Other",
  },
  leadType: {
    type: String,
    enum: ["Fresh", "Repeat"],
    default: "Fresh",
  },
  queryDate: {
    type: Date,
    default: null
  },
  senderName: {
    type: String,
    default: "",
  },
  contactPerson: {
    type: String,
    default: ""
  },
  companyName: {
    type: String,
    default: ""
  },
  concernPersonDesignation: {
    type: String,
    default: ""
  },
  businessType: {
    type: String,
    default: ""
  },
  concernPersonName: {
    type: String,
    default: ""
  },
  remark: {
    type: String,
    default: ""
  },
  projectDetail: {
    type: String,
    default: ""
  },
  clientRatingInBusiness: {
    type: String,
    default: ""
  },
  clientProfileComment: {
    type: String,
    default: ""
  },
  expectedBusinessSize: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: "",
  },
  city: {
    type: String,
    default: ""
  },
  phone: {
    type: String,
    required: true,
  },
  altPhone: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: "",
  },
  pincode: {
    type: String,
    default: "",
  },
  requirement: {
    type: String,
    default: "",
  },
  contentShared: {
    type: String,
    default: ""
  },
  leadId:{
    type:String,
    default:""
  },
  recceStatus: {
    type: String,
    enum: ["Pending", "In Progress", "Success", "Close"],
    default: "Pending"
  },
  costumerStatus: {
    type: String,
    enum: ["Hot", "Warm", "Cold", "Loss", "Win"],
    default: "Cold",
  },
  leadStatus: {
    type: String,
    enum: ["Pending", "In Progress", "Success", "Close"],
    default: "Pending"
  },
  salesTLId: {
    type: Schema.Types.ObjectId,
    ref: "Registration",
    default: null,
  },
  salesHodId: {
    type: Schema.Types.ObjectId,
    ref: "Registration",
    default:null
  },
  saleEmployeeId: {
    type: Schema.Types.ObjectId,
    ref: "Registration",
    default:null,
  },
  saleEmployeeId2:{
    type:Schema.Types.ObjectId,
    ref:"Registration",
    default:null
  },
  notes: {
    type: String,
    default: "",
  },
}, {
  timestamps: true,
});

const leadModel = model("Lead", leadSchema);

export default leadModel;
