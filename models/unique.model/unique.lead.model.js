import { Schema,model } from "mongoose";

const uniqueLeadSchema=new Schema(
    {
      seq:{
        type:Number,
        default:0
      }
    },
    {
        timestamps:true
    }
)

const uniqueLeadModel=model("UnquieLeadId",uniqueLeadSchema);

export default uniqueLeadModel