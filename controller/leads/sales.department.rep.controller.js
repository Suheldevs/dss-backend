import SalesDepartmentReport from "../models/salesDepartmentReport.model.js";
import AppError from "../utils/appError.js"; // Optional, if you use a custom error handler

// Create a new report

// CREATE a new Sales Department Report
export const createReport = async (req, res, next) => {
  try {
    const {
      dailyRevenueTarget,
      weeklyRevenueTarget,
      monthlyRevenueTarget,
      revenueAchievedToday,
      revenueAchievedThisWeek,
      revenueAchievedThisMonth,
      ordersClosedToday,
      totalLeads,
      hotLeads,
      warmLeads,
      coldLeads,
      leadsGeneratedToday,
      leadsGeneratedThisWeek,
      numberOfClientsApproachedToday,
      conversionRate,
      dssProjectsOverviewUpdatedToday,
      totalLiveProjectDayIn,
      totalLiveProjectDayOut,
      totalCompleteProjectToday,
      totalCompletedProductSignagesToday,
      shortDescriptionOfCompletedProjectProduct,
      totalLiveProjectInSalesDepartmentPreSale,
      totalLiveProjectInSalesDepartmentQuotation,
      totalQuotationFinalizedToday,
      totalPendingQuotationFromCompanySide,
      reasonCompany,
      totalHoldedQuotationFromClientSide,
      reasonClient,
      receivableOutstandingNewProjects,
      receivableOutstandingOldProjects,
      remarkOutstanding,
      challengesFacedToday,
      actionWillTakeAgainstTheseChallenges,
      overallPerformanceSummary,
      actionPlanForNextDay,
      anySuggestion,
      trend,
      remarks,
    } = req.body;

    const reportData = {
      dailyRevenueTarget,
      weeklyRevenueTarget,
      monthlyRevenueTarget,
      revenueAchievedToday,
      revenueAchievedThisWeek,
      revenueAchievedThisMonth,
      ordersClosedToday,
      totalLeads,
      hotLeads,
      warmLeads,
      coldLeads,
      leadsGeneratedToday,
      leadsGeneratedThisWeek,
      numberOfClientsApproachedToday,
      conversionRate,
      dssProjectsOverviewUpdatedToday,
      totalLiveProjectDayIn,
      totalLiveProjectDayOut,
      totalCompleteProjectToday,
      totalCompletedProductSignagesToday,
      shortDescriptionOfCompletedProjectProduct,
      totalLiveProjectInSalesDepartmentPreSale,
      totalLiveProjectInSalesDepartmentQuotation,
      totalQuotationFinalizedToday,
      totalPendingQuotationFromCompanySide,
      reasonCompany,
      totalHoldedQuotationFromClientSide,
      reasonClient,
      receivableOutstandingNewProjects,
      receivableOutstandingOldProjects,
      remarkOutstanding,
      challengesFacedToday,
      actionWillTakeAgainstTheseChallenges,
      overallPerformanceSummary,
      actionPlanForNextDay,
      anySuggestion,
      trend,
      remarks,
    };

    const report = await SalesDepartmentReport.create(reportData);

    res.status(201).json({
      status: "success",
      data: report,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};


// Get all reports
export const getAllReports = async (req, res, next) => {
  try {
    const reports = await SalesDepartmentReport.find();
    res.status(200).json({
      status: "success",
      results: reports.length,
      data: reports,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// Get single report by ID
export const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await SalesDepartmentReport.findById(id);
    if (!report) return next(new AppError("Report not found", 404));

    res.status(200).json({
      status: "success",
      data: report,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// Update report by ID
export const updateReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await SalesDepartmentReport.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return next(new AppError("Report not found", 404));

    res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// Delete report by ID
export const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await SalesDepartmentReport.findByIdAndDelete(id);
    if (!deleted) return next(new AppError("Report not found", 404));

    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
