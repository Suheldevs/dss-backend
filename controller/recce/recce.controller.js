import AppError from "../../util/appError.js"
import ClientBriefingModel from "../../models/leads/sales.client.briefing.model.js";


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
