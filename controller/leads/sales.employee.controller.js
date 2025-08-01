
import tlReportModel from "../../models/leads/tl.report.model.js"
import registrationModel from "../../models/registration/registration.model.js";
import AppError from "../../util/appError.js";
import moment from "moment"


export const createEmployeeReport = async (req, res, next) => {
  try {
    const {
      sift,
      hot = [],
      warm = [],
      cold = [],
      loss = [],
      win = []
    } = req.body;
    const { id } = req.params;
    const validateEmployee=await registrationModel.findById(id)
    if(!validateEmployee){
      return next(new AppError("Employee not found",404));
    }
    if (!id||!sift) {
      return next(new AppError("Id and Sift is required", 400))
    }
    if (!id) {
      return next(new AppError("Id is required", 400))
    }
    // 🔹 Optional: Calculate total amount from hot + cold + win
    const startofDay = moment().startOf("day").toDate();
    const endofDay = moment().endOf("day").toDate();
    const existinReport = await tlReportModel.findOne({
      Id: id,
      sift,
      createdAt: { $gte: startofDay, $lte: endofDay }
    });

    if (existinReport) {
      return next(new AppError(`You have already submitted the ${sift} report today`, 400))
    }
    let totalAmount = 0;
    [...hot, ...cold, ...win, ...warm].forEach((item) => {
      if (item.amount) {
        totalAmount += Number(item.amount) || 0;
      }
    });
    // 🔹 Create new report with counts
    const savedReport = new tlReportModel({
      Id: id,
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
      totalLead: hot.length + warm.length + cold.length + loss.length + win.length
    });

    const result = await savedReport.save();

    res.status(201).json({
      success: true,
      message: "Empolyee Report created successfully",
      data: { result }
    });
  } catch (error) {
    return next(new AppError(error.message, 500))
  }
};


export const viewEmployeeReport = async (req, res, next) => {
  try {
      const{id}=req.params;
    const result = await tlReportModel.find({
      Id:id
    }); // await is required

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
    return next(new AppError(error.message, 500));
  }
};


export const todayData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // Today 00:00:00

    const endDate = new Date();
    endDate.setHours(23, 59, 59); // Today 23:59:59

    const data = await tlReportModel.find({
      Id: id, // Assuming you're filtering by this ID
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    res.status(200).json({
      success:true,
      status: "success",
      data,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

