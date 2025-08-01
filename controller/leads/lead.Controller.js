import leadModel from "../../models/leads/leadModel.js"
import saleRegistrationModel from "../../models/registration/registration.model.js";
import AppError from "../../util/appError.js";
// CREATE Lead
export const createLead = async (req, res) => {
  try {
    console.log("data", req.body);

    const { concernPersonName, phone } = req.body;

    if (!req.body || !concernPersonName || !phone) {
      return res.status(400).json({
        success: false,
        message: "consern Person Name  and Phone are required",
      });
    }
    const lead = await leadModel.create(req.body);
    res.status(200).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// GET All Leads
export const getAllLeads = async (req, res) => {
  try {
    const result = await leadModel.find()
    res.status(200).json({
      success: true,
      message: "All Leads",
      data: { result },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET Single Lead
export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id);

    const result = await leadModel.findById(id)


    if (!result) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.status(200).json({ success: true, data: { result } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE Lead
export const updateLead = async (req, res, next) => {
  try {
    const { salesTLId, saleEmployeeId, saleEmployeeId2, stepName } = req.body;
    const { id } = req.params;
    const leadData = await leadModel.findById(id);
    if (leadData.saleEmployeeId2) {
      return next(new AppError("Lead can only be assigned two times", 400));
    }
    if (salesTLId) {
      const tl = await saleRegistrationModel.findById(salesTLId);
      if (!tl || tl.role !== "SalesTL") {
        return next(new AppError("Only Sales TL can assign a lead", 402));
      }
    }
    // if
    const {
      leadSource,
      leadType,
      queryDate,
      senderName,
      contactPerson,
      companyName,
      concernPersonDesignation,
      businessType,
      concernPersonName,
      remark,
      projectDetail,
      clientRatingInBusiness,
      clientProfileComment,
      expectedBusinessSize,
      email,
      city,
      phone,
      altPhone,
      address,
      pincode,
      requirement,
      contentShared,
      recceStatus,
      costumerStatus,
      leadStatus,
      salesHodId,
      employee1LeadAcceptanceStatus,
      employee2LeadAcceptanceStatus,
      notes,
    } = req.body;

    if (saleEmployeeId) {
      leadData.steps.push({ stepName: "leadeAssion1", time: new Date() });
    }
    if (saleEmployeeId2) {
      leadData.steps.push({ stepName: "LeadeAssion2", time: new Date() });
    }
    if (employee1LeadAcceptanceStatus) {
      leadData.steps.push({ stepName: "employee1LeadAcceptance", time: new Date() });
    }
    if (employee2LeadAcceptanceStatus) {
      leadData.steps.push({ stepName: "employee2LeadAcceptanceStatus", time: new Date() });
    }

    const updateFields = {
      leadSource,
      leadType,
      queryDate,
      senderName,
      contactPerson,
      companyName,
      concernPersonDesignation,
      businessType,
      concernPersonName,
      remark,
      projectDetail,
      clientRatingInBusiness,
      clientProfileComment,
      expectedBusinessSize,
      email,
      city,
      phone,
      altPhone,
      address,
      pincode,
      requirement,
      contentShared,
      recceStatus,
      costumerStatus,
      leadStatus,
      salesHodId,
      notes,
    };

    if (salesTLId) updateFields.salesTLId = salesTLId;
    if (saleEmployeeId) updateFields.saleEmployeeId = saleEmployeeId;
    if (saleEmployeeId2) updateFields.saleEmployeeId2 = saleEmployeeId2;
    if (saleEmployeeId || saleEmployeeId2) updateFields.leadStatus = "In Progress";

    // return;

    const updatedLead = await leadModel.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead updated success",
      data: updatedLead,
    });

  } catch (error) {
    return next(new AppError(error.message || "Server Error", 500));
  }
};


// DELETE Lead
export const deleteLead = async (req, res) => {
  try {
    const deleted = await leadModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Pending least

export const pandingList = async (req, res, next) => {
  try {
    const result = await leadModel.find({ leadStatus: "Pending" })
    if (!result || result.length === 0) {
      return next(new AppError("No Data found", 404));
    }
    return res.status(200).json({ success: true, message: "Panding List", data: { result } });
  } catch (error) {
    return next(new AppError(error.message, 500))
  }
}


