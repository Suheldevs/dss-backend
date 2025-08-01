import { model, Schema } from "mongoose";

const saleClientBriefingSchema = new Schema(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead"
    },
    clientName: {
      type: String,
      default: null
    },
    companyName: {
      type: String,
      default: null
    },
    projectName: {
      type: String,
      default: null
    },
    productName: {
      type: String,
      default: null
    },
    clientProfile: {
      type: String,
      default: null
    },
    clientBehaviour: {
      type: String,
      default: null
    },
    discussionDone: {
      type: String,
      default: null
    },
    instructionRecce: {
      type: String,
      default: null
    },
    instructionDesign: {
      type: String,
      default: null
    },
    instructionInstallation: {
      type: String,
      default: null
    },
    instructionOther: {
      type: String,
      default: null
    },
    projectId:{
        type:String,
        default:null
    },
    salesManagementStep:{
      type:Number,
      default:0
    },
    requirement:{
      type:String,
      default:null
    },
    address:{
       type:String,
       default:null 
    },
    documentUpload: {
      type: [{
        url:{type:String,require:true},
        public_id:{type:String,require:true}
      }],
       default:[]
    }
  },
  {
    timestamps: true
  }
);

const ClientBriefingModel = model("SaleClientBriefing", saleClientBriefingSchema);

export default ClientBriefingModel;
