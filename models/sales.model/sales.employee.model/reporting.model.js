import { Schema, model } from "mongoose";

const salesReportingSchema = new Schema(
    {
        clientName: { type: String },
        companyName: { type: String },
        number: { type: String },
        nextFollowUpDate: { type: Date, default: null },
        remarks: { type: String, default: "" },
        DepartmentHodId: {
            type: Schema.Types.ObjectId,
            ref: "Registration",
            default: null
        },
        TLId: {
            type: Schema.Types.ObjectId,
            ref: "Registration",
            default: null
        },
        EmployeeId: {
            type: Schema.Types.ObjectId,
            ref: "Registration",
            default: null
        },
        leadId: {
            type: Schema.Types.ObjectId,
            ref: "SaleRegistration",
            default: null
        },
    },

    {
        timestamps: true
    }
);

const EmployeeReportingModel = model("EmployeeReporting", salesReportingSchema);

export default EmployeeReportingModel;
