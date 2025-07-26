import ClientBriefingModel from "../../../models/sales.model/sales.client.briefing.model/sales.client.briefing.model.js";
import AppError from "../../../util/appError.js";
import cloudinary from "cloudinary"
import mongoose from "mongoose";

export const createClientBriefing = async (req, res, next) => {
    try {
        console.log("📥 Body:", req.body);
        console.log("📁 Files:", req.files);
        //  return
        const {
            leadId,
            clientName,
            companyName,
            projectName,
            productName,
            clientProfile,
            clientBehaviour,
            discussionDone,
            instructionRecce,
            instructionDesign,
            instructionInstallation,
            instructionOther,
        } = req.body;

        if (!leadId) {
            return next(new AppError("Lead ID is required", 400));
        }
          const objectLeadId = new mongoose.Types.ObjectId(leadId)
        // ✅ Upload files to cloudinary
        const documentUpload = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const base64 = Buffer.from(file.buffer).toString("base64");
                const dataURI = `data:${file.mimetype};base64,${base64}`;

                const uploaded = await cloudinary.v2.uploader.upload(dataURI, {
                    folder: "client-briefings"
                });

                documentUpload.push({
                    url: uploaded.secure_url,
                    public_id: uploaded.public_id
                });
            }
        }

        // ✅ Save to MongoDB
        const result = await ClientBriefingModel.create({
            leadId:objectLeadId,
            clientName,
            companyName,
            projectName,
            productName,
            clientProfile,
            clientBehaviour,
            discussionDone,
            instructionRecce,
            instructionDesign,
            instructionInstallation,
            instructionOther,
            documentUpload
        });

        res.status(201).json({
            success:true,
            message:"Add Sales Client Briefing successfully",
            data: {result}
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};


export const clientBriefingView = async (req, res, next) => {
  try {
    const { leadId } = req.query;

    const result = await ClientBriefingModel.find({ leadId });

    if (!result || result.length === 0) {
      return next(new AppError("Data not found", 404));
    }
    return res.status(200).json({
      success: true,
      message: "Client briefing data fetched successfully",
      data: {result},
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

