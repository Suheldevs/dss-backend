import EmployeeReportingModel from "../../../models/sales.model/sales.employee.model/reporting.model.js";
import AppError from "../../../util/appError.js";
import testModel from "../../../models/test/tes.model.js";

// 🔹 Create new report
export const createEmployeeReport = async (req, res) => {
  try {
    const {
      clientName,
      number,
      EmployeeId,
      TLId,
      DepartmentHodId
    } = req.body;

    if (!clientName || !number || !EmployeeId || !TLId || !DepartmentHodId) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled."
      });
    }

    const newReport = await EmployeeReportingModel.create(req.body);
    res.status(201).json({ success: true, data: newReport });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// // 🔹 Get all reports (with optional filters)
export const getAllEmployeeReports = async (req, res) => {
  try {
    const filters = req.query || {};
    const reports = await EmployeeReportingModel.find(filters)
      .populate("DepartmentHodId", "name email")
      .populate("TLId", "name email")
      .populate("EmployeeId", "name email")
      .populate("leadId");

    res.status(200).json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// // 🔹 Get single report by ID
export const getReportById = async (req, res) => {
  try {
    const report = await EmployeeReportingModel.findById(req.params.id)
      .populate("DepartmentHodId", "name email")
      .populate("TLId", "name email")
      .populate("EmployeeId", "name email")
      .populate("leadId");

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.status(200).json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// // 🔹 Update report
export const updateReport = async (req, res) => {
  try {
    const updated = await EmployeeReportingModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// // 🔹 Delete report
export const deleteReport = async (req, res) => {
  try {
    const deleted = await EmployeeReportingModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.status(200).json({ success: true, message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const upLoad_multipal_data=async(req,res,next)=>{
  console.log("aaaa");    
     try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Optional: Validate data here
    const result = await testModel.insertMany(sheetData);
    res.status(200).json({
      message: "Data inserted successfully",
      inserted: result.length
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Failed to insert data", error });
  }
}