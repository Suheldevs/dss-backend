
import tlReportModel from "../../models/leads/tl.report.model.js"
import registrationModel from "../../models/registration/registration.model.js";
import AppError from "../../util/appError.js";
import moment from "moment"

export const createTLReport = async (req, res, next) => {
  try {
    const {
      shift,
      hot = [],
      warm = [],
      cold = [],
      loss = [],
      win = []
    } = req.body;
      const{id}=req.params;
    // 🔹 Optional: Calculate total amount from hot + cold + win
     const startofDay=moment().startOf("day").toDate();
     const endofDay=moment().endOf("day").toDate();
    const validateEmployee=await registrationModel.findById(id)
    if(!validateEmployee){
      return next(new AppError("Employee not found",404));
    }
     const existinReport=await tlReportModel.findOne({
       Id:id,
       shift,
       createdAt:{$gte:startofDay,$lte:endofDay}
     });

     if(existinReport){
       return next(new AppError(`You have already submitted ${shift} report today`, 400))    
     }
    
    // ret/urn
    let totalAmount = 0;
    [...hot, ...cold, ...win,...warm].forEach((item) => {
      if (item.amount) {
        totalAmount += Number(item.amount) || 0;
      }
    });
      // 🔹 Create new report with counts
    const savedReport = new tlReportModel({
      Id:id,
      shift,
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


export const  reportCreate=async(req,res,next)=>{
     try {
          
        console.log("report Update...");
        
      } catch (error) {
        return next(new AppError(error.message,500));
     }
}



