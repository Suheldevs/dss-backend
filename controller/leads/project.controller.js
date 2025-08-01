import ProjectPaymentModel from "../../models/leads/project.payment.model.js";
import AppError from "../../util/appError.js";
import ClientBriefingModel from "../../models/leads/sales.client.briefing.model.js";

export const createInitialProjectPayment = async (req, res, next) => {
  try {
    let { projectId, totalAmount, discount = 0, totalPaid, method, remarks } = req.body;

    if (!projectId || !totalAmount || !totalPaid || !method) {
      return next(new AppError("Required fields missing", 400));
    }
    const result = await ClientBriefingModel.findOne({_id:projectId});
      console.log("result",result);
      
    if (!result) {
      return next(new AppError("Please provide a correct project ID", 400));
    }
    // 🔁 Convert string to numbers
    totalAmount = Number(totalAmount);
    discount = Number(discount);
    totalPaid = Number(totalPaid);

    // ❌ Check if conversion failed
    if (isNaN(totalAmount) || isNaN(totalPaid) || isNaN(discount)) {
      return next(new AppError("Invalid numeric values", 400));
    }

    const existing = await ProjectPaymentModel.findOne({ projectId });
    if (existing) {
      return next(new AppError("Payment record already exists for this project", 400));
    }

    const remainingAmount = totalAmount - totalPaid - discount;

    const newRecord = await ProjectPaymentModel.create({
      projectId,
      totalAmount,
      discount,
      totalPaid,
      remainingAmount,
      paidPayments: [
        {
          amount: totalPaid, // 👈 corrected here
          method: method,
          remarks: remarks,
          paidAt: new Date()
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: "Initial project payment created",
      data: newRecord
    });
  } catch (error) {
    next(error);
  }
};

export const addProjectPayment = async (req, res, next) => {
  try {
    let { projectId, amount, method, remarks } = req.body;

    if (!projectId || !amount || !method) {
      return next(new AppError("Required fields missing", 400));
    }

    amount = Number(amount);
    if (isNaN(amount)) {
      return next(new AppError("Invalid amount", 400));
    }

    const paymentRecord = await ProjectPaymentModel.findOne({ projectId });
    if (!paymentRecord) {
      return next(new AppError("Project payment record not found", 404));
    }

    if (amount > paymentRecord.remainingAmount) {
      return next(new AppError("Amount exceeds remaining balance", 400));
    }

    // Update values
    const newTotalPaid = paymentRecord.totalPaid + amount;
    const newRemainingAmount = paymentRecord.totalAmount - newTotalPaid - paymentRecord.discount;

    // Push new payment
    paymentRecord.paidPayments.push({
      amount,
      method,
      remarks,
      paidAt: new Date()
    });

    // Update totals
    paymentRecord.totalPaid = newTotalPaid;
    paymentRecord.remainingAmount = newRemainingAmount;

    await paymentRecord.save();

    res.status(200).json({
      success: true,
      message: "Payment added successfully",
      data: paymentRecord
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentSingle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await ProjectPaymentModel.findOne({ projectId: id });

    if (!result) {
      return next(new AppError("Payment record not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { result },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};


