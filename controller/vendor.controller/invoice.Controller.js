
import mongoose from "mongoose";
import invoiceModel from "../../models/vendor.model/invoice.Model.js";
import InvoiceCounterModel from "../../models/vendor.model/InvoiceCounter.Model.js";
import productModel from "../../models/vendor.model/product.Model.js";
import InvoiceDraft from "../../models/vendor.model/invoiceDrafts.Model.js";
import { sendToSMS } from "../../util/vendor/sendSms.js";


// Create invoices by the logged-in user
// import invoiceModel from "../models/invoice.model.js";
// import InvoiceCounterModel from "../models/invoiceCounter.model.js";
// import productModel from "../models/productModel.js";

export const createInvoice = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const userId = req.user._id;

    // 🔹 Step 1: Invoice Counter
    let counter = await InvoiceCounterModel.findOne({ year: currentYear, createdBy: userId });

    if (!counter) {
      counter = new InvoiceCounterModel({
        year: currentYear,
        createdBy: userId,
        seq: 1,
      });
      await counter.save();
    } else {
      counter.seq += 1;
      await counter.save();
    }

    const invoiceId = `INV-${currentYear}-${String(counter.seq).padStart(3, "0")}`;

    // 🔹 Step 2: Validate and Update Stock
    const { items,draftId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invoice must contain at least one product item",
      });
    }

    for (const item of items) {
      const product = await productModel.findOne({
        _id: item.productId,
        importedBy: userId,
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      // Stock check
      if (product.inStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.productName}. Available: ${product.inStock}, Required: ${item.quantity}`,
        });
      }

      // Update stock
      product.inStock -= item.quantity;
      product.usedStock += item.quantity;
      product.totalStock = product.inStock + product.usedStock;

      await product.save();
    }

    // 🔹 Step 3: Save Invoice
    const invoiceData = {
      ...req.body,
      createdBy: userId,
      invoiceId,
    };

    const invoice = new invoiceModel(invoiceData);
    await invoice.save();

       // 🔹 Step 4: Delete draft if exists
    if (draftId) {
      await InvoiceDraft.findOneAndDelete({ draftId, createdBy: userId });
    }


    res.status(201).json({
       success: true,
       message: "Invoice created successfully, stock updated" + (draftId ? " and draft deleted" : ""),
       data: invoice,
    });
  } catch (error) {
    console.error("Invoice creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating invoice",
    });
  }
};




// GET all invoices for the logged-in user
export const getInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;

    const filter = { createdBy: new mongoose.Types.ObjectId(req.user._id) };

    // ✅ Status filter
    if (status) {
      filter.paymentStatus = status; // e.g., Paid, Pending, Partial
    }

    // ✅ Date filtering logic (only startDate & endDate)
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filter.createdAt = { $gte: start, $lte: end };
    }

    // ✅ Fetch invoices with pagination
// ✅ Aggregation pipeline
    const invoices = await invoiceModel.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "customers", // collection ka naam (CustomerModel ka collection)
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          invoiceId: 1,
          amountPaid:1,
          grandTotal: 1,
          paymentStatus: 1,
          paymentMode: 1,
          createdAt:1,
          customerName: "$customer.fullName",
          customerPhone: "$customer.phone",
        },
      },
    ]);

    const totalInvoices = await invoiceModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      total: totalInvoices,
      page: parseInt(page),
      limit: parseInt(limit),
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching invoices",
      error: error.message,
    });
  }
};

// delete data api 
// export const getInvoices = async (req, res) => {
//  try {
//     const currentYear = new Date().getFullYear();
//     const userId = req.user._id;
//     const resetCounter = await InvoiceCounterModel.findOneAndUpdate(
//       { year: currentYear },
//       { seq: 0 }, // reset sequence to 0
//       { new: true, upsert: true } // agar record nahi hai toh create kar de
//     );
//   // 1️⃣ Delete all invoices of current user
//     await invoiceModel.deleteMany({ createdBy: userId });
//  // 3️⃣ Reset invoice counter of current user
//     await InvoiceCounterModel.findOneAndUpdate(
//       { year: currentYear, createdBy: userId },
//       { $set: { seq: 0 } },
//       { new: true }
//     );
//     res.status(200).json({
//       success: true,
//       message: `Invoice counter for ${currentYear} has been reset.`,
//       data: resetCounter,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message || "Error resetting invoice counter",
//     });
//   }
// };

//  Sirf preview ke liye next invoice number return karega (save nahi karega)
 
export const getNextInvoiceNumber = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const userId = req.user._id; // Vendor/user specific

    // Current counter value fetch karo (increment nahi karna)
    const counter = await InvoiceCounterModel.findOne({ year: currentYear, createdBy: userId });

    const nextSeq = counter ? counter.seq + 1 : 1;

    // Infinite-friendly, minimum 3 digits
    const previewInvoiceId = `INV-${currentYear}-${String(nextSeq).padStart(3, "0")}`;

    res.json({
      success: true,
      previewInvoiceId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting next invoice number",
      error: error.message
    });
  }
};


// Generate Invoice Number 
// export const generateInvoice = async (req, res) => {
//   try {
//     const currentYear = new Date().getFullYear();

//     // Atomic increment
//     const counter = await Counter.findOneAndUpdate(
//       { year: currentYear },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true } // create if not exists
//     );

//     const invoiceNumber = `INV-${currentYear}-${counter.seq}`;

//     const newInvoice = await InvoiceModel.create({
//       invoiceNumber,
//       ...req.body
//     });

//     res.status(201).json({
//       success: true,
//       data: newInvoice
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// update invoice payment
export const updateInvoicePayment = async (req, res) => {
  try {
    const { invoiceId } = req.params; // invoiceId from URL
        const vendorId = req.user._id;    // Auth middleware se vendor ka ID

    const { paymentAmount, paymentMode, paymentDate, notes, sendSMS } = req.body;

    // Invoice ko find karo
    const invoice = await invoiceModel.findOne({ invoiceId, createdBy: vendorId });
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Already paid amount + new payment
    const newPaidAmount = (invoice.amountPaid || 0) + paymentAmount;

    // ✅ Payment Status Decide
    let newStatus = "Pending";
    if (newPaidAmount === 0) {
      newStatus = "Pending";
    } else if (newPaidAmount < invoice.grandTotal) {
      newStatus = "Partial";
    } else if (newPaidAmount >= invoice.grandTotal) {
      newStatus = "Paid";
    }

    // ✅ Update fields
    invoice.amountPaid = newPaidAmount;
    invoice.partialPaid = newPaidAmount < invoice.grandTotal ? newPaidAmount : 0;
    invoice.paymentStatus = newStatus;
    invoice.paymentMode = paymentMode || invoice.paymentMode;
    invoice.paymentDate = paymentDate || new Date(); // agar nahi bheja to abhi ka time
    invoice.notes = notes || invoice.notes;
    invoice.sendSMS = sendSMS ?? invoice.sendSMS;

        // ✅ Push into payment history
    invoice.paymentHistory.push({
      amount: paymentAmount,
      mode: paymentMode,
      date: paymentDate || new Date(),
      notes: notes || "",
      sendSMS:sendSMS ?? false,
    });

    // Save updated invoice
    await invoice.save();

    // Agar SMS bhejna hai
    if (invoice.sendSMS) {
      // yahan SMS logic call karna hoga (Twilio, msg91, etc.)
      console.log("📩 SMS sent to customer...");

      const customerNumber = `91${invoice.customerId.phone.replace(/^(\+91)?/, "")}`;

      const message = `Dear ${invoice.customerId.name}, 
We received your payment of ₹${paymentAmount} via ${paymentMode}.
Invoice ID: ${invoice.invoiceId}.
Thank you for your business.`;

      await sendToSMS(customerNumber, message);
    
    }

    return res.status(200).json({
      message: "Invoice payment updated successfully",
      data: invoice,
    });
  } catch (error) {
    console.error("Payment update error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
