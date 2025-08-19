import AppError from "../../util/appError.js"
import ClientBriefingModel from "../../models/leads/sales.client.briefing.model.js";
import { uploadFilesToCloudinary } from "../../middlewares/file.upload/upload.middleware.js";
import recceModel from "../../models/recce/recce.model.js";

export const getSinglStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await ClientBriefingModel.findById(id, {
      recceStatus: true,
    });

    if (!result) {
      return next(new AppError("Project not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Success",
      data: result,
    });

  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};


// Create new Recce entry
export const createRecce = async (req, res,next) => {
  try {
    const {
       projectId,
       leadID,
      clientName,
      clientCode,
      projectName,
      projectCode,
      productName,
      productCode,
      height,
      width,
      thickness,
      quantity,
      lit,
      nonLit,
      connectionPoint,
      mountingHangingDescription,
      visibility,
      fabricationWork,
      scaffolding,
      civilWork,
      clientInstruction,
      recceInstruction,
      layer,
      heightFromRoad,
      distanceOfView,
      color,
      shape
    } = req.body;
    
     if(!projectId||!leadID){
        return next(new AppError("Lead id and project id is require",404))
     }

    // Upload to Cloudinary if files exist
    const imagesFile = req.files && req.files.length > 0
      ? await uploadFilesToCloudinary(req.files, "recce-files")
      : [];

    const newRecce = new recceModel({
      projectId,
      leadID,
      clientName,
      clientCode,
      projectName,
      projectCode,
      productName,
      productCode,
      height,
      width,
      thickness,
      quantity,
      lit,
      nonLit,
      connectionPoint,
      mountingHangingDescription,
      visibility,
      fabricationWork,
      scaffolding,
      civilWork,
      clientInstruction,
      recceInstruction,
      layer,
      heightFromRoad,
      distanceOfView,
      color,
      shape,
      imagesFile
    });

    await newRecce.save();

    res.status(201).json({
      success: true,
      message: "Recce form created successfully",
      data: newRecce
    });
  } catch (error) {
    console.error("Error creating Recce form:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


export const updateRecce = async (req, res) => {
  try {
    const {
      projectId,
      leadID,
      clientName,
      clientCode,
      projectName,
      projectCode,
      productName,
      productCode,
      height,
      width,
      thickness,
      quantity,
      lit,
      nonLit,
      connectionPoint,
      mountingHangingDescription,
      visibility,
      fabricationWork,
      scaffolding,
      civilWork,
      clientInstruction,
      recceInstruction,
      layer,
      heightFromRoad,
      distanceOfView,
      color,
      shape
    } = req.body;

      if(!projectId||!leadID){
        return next(new AppError("Lead id and project id is require",404))
     }

      const imagesFile = req.files && req.files.length > 0
      ? await uploadFilesToCloudinary(req.files, "recce-files")
      : [];

    const updateData = {
      clientName,
      clientCode,
      projectName,
      projectCode,
      productName,
      productCode,
      height,
      width,
      thickness,
      quantity,
      lit,
      nonLit,
      connectionPoint,
      mountingHangingDescription,
      visibility,
      fabricationWork,
      scaffolding,
      civilWork,
      clientInstruction,
      recceInstruction,
      layer,
      heightFromRoad,
      distanceOfView,
      color,
      shape
    };

    // Agar nayi image ayi hai to hi set kare
    if (imagesFile) {
      updateData.imagesFile = imagesFile;
    }

    const updatedRecce = await Recce.findByIdAndUpdate(
      req.params.id, // URL se id milegi
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedRecce) {
      return res.status(404).json({
        success: false,
        message: "Recce form not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Recce form updated successfully",
      data: updatedRecce
    });
  } catch (error) {
    console.error("Error updating Recce form:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
