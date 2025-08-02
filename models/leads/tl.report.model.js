import { Schema, model } from "mongoose";

const tlReportSchema = new Schema(

  {
    totalAmount: {
      type: Number,
      default: 0
    },
    Id: {
      type: Schema.Types.ObjectId,
      ref:"Registration"
    },
    shift: {
      type: String,
      enum: ["Morning", "Evening"],
      required: true,
    },
    totalLead: {
      type: Number,
      default: 0
    },
    hot: [
      {
        companyName: {
          type: String,
          default: ""
        },
        amount: {
          type: Number,
          default: 0
        }
      }
    ],
    hotCount: {
      type: Number,
      default: 0
    },

    warm: [
      {
        companyName: {
          type: String,
          default: ""
        },
        amount: {
          type: Number,
          default: 0
        }
      }
    ],
    warmCount: {
      type: Number,
      default: 0
    },

    cold: [
      {
        companyName: {
          type: String,
          default: ""
        },
        amount: {
          type: Number,
          default: 0
        }
      }
    ],
    coldCount: {
      type: Number,
      default: 0
    },

    loss: [
      {
        companyName: {
          type: String,
          default: ""
        }
      }
    ],
    lossCount: {
      type: Number,
      default: 0
    },

    win: [
      {
        companyName: {
          type: String,
          default: ""
        },
        amount: {
          type: Number,
          default: 0
        }
      }
    ],
    winCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const tlReportModel = model("TLReport", tlReportSchema);

export default tlReportModel;
