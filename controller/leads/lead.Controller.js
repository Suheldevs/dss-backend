import leadModel from "../../models/leads/leadModel.js"
import registrationModel from "../../models/registration/registration.model.js";
import saleRegistrationModel from "../../models/registration/registration.model.js";
import AppError from "../../util/appError.js";
// CREATE Lead
export const createLead = async (req, res) => {
  try {
    console.log("data", req.body);
    const { concernPersonName, phone,userId } = req.body;

    if (!req.body || !concernPersonName || !phone||!userId  ) {
      return res.status(400).json({
        success: false,
        message: "consern Person Name ,Phone and userId are required",
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
    const result = await leadModel.find().sort({ createdAt: -1 });
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

    const result = await leadModel.findById(id).sort({ createdAt: -1 });


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

    // Lead Accept API (Part inside your updateLead or a new controller)

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
      leadAccept,
      notes,
    } = req.body;

    if (leadAccept === true) {
      leadData.employeeleadsAccept.push({
        status: true,
        time: new Date()
      });
      await leadData.save(); // Important: save leadData
    }

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
    const result = await leadModel.find({ leadStatus: "Pending" }).sort({ createdAt: -1 });
    if (!result || result.length === 0) {
      return next(new AppError("No Data found", 404));
    }
    return res.status(200).json({ success: true, message: "Panding List", data: { result } });
  } catch (error) {
    return next(new AppError(error.message, 500))
  }
}

//get lead by employee all acceped lead ;

export const getAllAssionLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await leadModel.find({
      $or: [{ saleEmployeeId: id }, { saleEmployeeId2: id }]
    }).sort({ createdAt: -1 });
    if (!result || result.length === 0) {
      return next(new AppError("Assion leads not found", 404))
    }
    return res.status(200).json({ success: true, message: "All Data", data: { result } });

  } catch (error) {
    return next(new AppError(error.message, 500))
  }
}


export const getAllLeadsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const registration = await registrationModel.findById(id)
    if (!registration) {
      return next(new AppError("Employee not found", 404));
    }
    if (registration.role === "SaleHOD") {
      const result = await leadModel.find().sort({ createdAt: -1 });;
      if (!result || result.length === 0) return next(new AppError("Leads not found", 404))
      return res.status(200).json({ success: true, message: "All Leads", data: { result } })
    }
    if (registration.role === "SalesTL") {
      const result = await leadModel.find()
      if (!result || result.length === 0) return next(new AppError("Leads not found", 404))
      return res.status(200).json({ success: true, message: "All Leads", data: { result } })
    }
    if (registration.role === "SaleEmployee") {
      const result = await leadModel.find({ $or: [{ saleEmployeeId: id }, { saleEmployeeId2: id }] })
      if (!result || result.length === 0)return next(new AppError("No Leads Assigned", 404));
      return res.status(200).json({ success: true, message: "All Assigned Leads", data: { result } })
    }
     return next (new AppError("Role not match",400));
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}

//jisame lead create kiya h 
export const leadsCreateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await leadModel.find({userId: id }).sort({ createdAt: -1 });;

    if (!result || result.length === 0) {
      return next(new AppError("No leads found for this employee.", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Leads fetched successfully.",
      data: {result},
    });

  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};


