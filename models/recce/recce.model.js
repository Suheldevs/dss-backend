import mongoose, { Schema,model } from "mongoose";

const recceSchema = new Schema(
  {
    clientName: { type: String, required: true },
    clientCode: { type: String, required: true },
    projectName: { type: String, required: true },
    projectCode: { type: String, required: true },
    productName: { type: String, required: true },
    productCode: { type: String, required: true },

    height: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ["inch", "cm", "m", "feet"], required: true }
    },
    width: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ["inch", "cm", "m", "feet"], required: true }
    },
    thickness: {
      value: { type: Number },
      unit: { type: String, enum: ["inch", "cm", "m", "feet"] }
    },

    imagesFile: [{ type: String }], // file URLs or paths
    quantity: { type: Number, default: 1 },

    lit: { type: Boolean, default: false },      // with lighting
    nonLit: { type: Boolean, default: false },   // without lighting

    connectionPoint: { type: String },
    mountingHangingDescription: { type: String },

    visibility: { type: String, enum: ["oneSide", "twoSide"] },
    fabricationWork: { type: Boolean, default: false },
    scaffolding: { type: Boolean, default: false },
    civilWork: { type: Boolean, default: false },

    clientInstruction: { type: String },
    recceInstruction: { type: String },

    layer: { type: String, enum: ["2d", "3d"] },
    heightFromRoad: { type: Number },
    distanceOfView: { type: Number },

    color: { type: String },
    shape: { type: String },

    leadId:{
      type:Schema.Types.ObjectId,
      ref:"Lead"
    },
    projectId:{
      type:Schema.Types.ObjectId,
      ref:"SaleClientBriefing"
    }
  },
  {
    timestamps: true
  }
);

const recceModel= model("Recce", recceSchema);

export default recceModel;
