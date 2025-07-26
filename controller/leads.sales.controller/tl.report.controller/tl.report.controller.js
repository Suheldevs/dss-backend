
import tlReportModel from "../../../models/sales.model/report.model/tl.report.model.js"
import AppError from "../../../util/appError.js";
import moment from "moment"

export const createTLReport = async (req, res, next) => {
  try {
    const {
      sift,
      hot = [],
      warm = [],
      cold = [],
      loss = [],
      win = []
    } = req.body;

    // 🔹 Optional: Calculate total amount from hot + cold + win
    //  const startofDay=moment().startOf("day").toDate();
    //  const endofDay=moment().endOf("day").toDate();

    //  const existinReport=await tlReportModel.findOne({
    //    sift,
    //    createdAt:{$gte:startofDay,$lte:endofDay}
    //  });

    //  if(existinReport){
    //    return next(new AppError(`A ${sift} report for today already exists`))    
    //  }
    
    // ret/urn
    let totalAmount = 0;
    [...hot, ...cold, ...win,...warm].forEach((item) => {
      if (item.amount) {
        totalAmount += Number(item.amount) || 0;
      }
    });
      // 🔹 Create new report with counts
    const savedReport = new tlReportModel({
      sift,
      hot,
      warm,
      cold,
      loss,
      win,
      hotCount: hot.length,
      warmCount: warm.length,
      coldCount: cold.length,
      lossCount: loss.length,
      winCount: win.length,
      totalAmount,
      totalLead:hot.length + warm.length + cold.length + loss.length + win.length
    });

    const result = await savedReport.save();

    res.status(201).json({
      success:true,
      message: "TL Report created successfully",
      data: {result}
    });
  } catch (error) {
     return next(new AppError(error.message,500))
  }
};

export const viewReport = async (req, res, next) => {
  try {
    const result = await tlReportModel.find(); // await is required

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reports found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      data: result,
    });
  } catch (error) {
     return next(new AppError(error.message,500));
  }
};

