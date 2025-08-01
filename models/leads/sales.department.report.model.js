import { Schema, model } from "mongoose";

const salesDepartmentReportSchema = new Schema(
  {
    dailyRevenueTarget: { type: Number, default: 0 },
    weeklyRevenueTarget: { type: Number, default: 0 },
    monthlyRevenueTarget: { type: Number, default: 0 },
    revenueAchievedToday: { type: Number, default: 0 },
    revenueAchievedThisWeek: { type: Number, default: 0 },
    revenueAchievedThisMonth: { type: Number, default: 0 },
    ordersClosedToday: { type: Number, default: 0 },
    totalLeads: { type: Number, default: 0 },
    hotLeads: { type: Number, default: 0 },
    warmLeads: { type: Number, default: 0 },
    coldLeads: { type: Number, default: 0 },
    leadsGeneratedToday: { type: Number, default: 0 },
    leadsGeneratedThisWeek: { type: Number, default: 0 },
    numberOfClientsApproachedToday: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    dssProjectsOverviewUpdatedToday: { type: Number, default: 0 },
    totalLiveProjectDayIn: { type: Number, default: 0 },
    totalLiveProjectDayOut: { type: Number, default: 0 },
    totalCompletedProjectsToday: { type: Number, default: 0 },
    totalCompletedProductSignagesToday: { type: Number, default: 0 },
    shortDescriptionOfCompletedProjectProduct: { type: String, default: "" },
    totalLiveProjectsPreSale: { type: Number, default: 0 },
    totalLiveProjectsQuotation: { type: Number, default: 0 },
    totalQuotationFinalizedToday: { type: Number, default: 0 },
    totalPendingQuotationsCompanySide: { type: Number, default: 0 },
    reasonCompany: { type: String, default: "" },
    totalHoldedQuotationsClientSide: { type: Number, default: 0 },
    reasonClient: { type: String, default: "" },
    receivableOutstandingNewProjects: { type: Number, default: 0 },
    receivableOutstandingOldProjects: { type: Number, default: 0 },
    remarkOutstanding: { type: String, default: "" },
    challengesFacedToday: { type: String, default: "" },
    actionAgainstChallenges: { type: String, default: "" },
    overallPerformanceSummary: { type: String, default: "" },
    actionPlanForNextDay: { type: String, default: "" },
    anySuggestion: { type: String, default: "" },
    trend: {
      type: String,
      enum: ["increase", "decrease"],
      default: "increase",
    },
    remarks: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const SalesDepartmentReport = model("SalesDepartmentReport", salesDepartmentReportSchema);

export default SalesDepartmentReport;
