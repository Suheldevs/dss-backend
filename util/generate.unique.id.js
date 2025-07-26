import empIdModel from "../models/unique.model/unique.empId.js";
import uniqueLeadModel from "../models/unique.model/unique.lead.model.js";
export const getNextEmployeeId = async () => {
  const counter = await empIdModel.findByIdAndUpdate(
    { _id: 'employeeId' }, // fixed ID
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const numberPart = String(counter.seq).padStart(4, '0');
  return `DSS${numberPart}`;
};

export const getLeadId=async()=>{
    // const=await
}
