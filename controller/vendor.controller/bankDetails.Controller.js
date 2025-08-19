// import Bank from "../models/Bank.model.js";

import bankModel from "../../models/vendor.model/bankdetails.Model.js";


export const addBank = async (req, res) => {
  try {
    console.log("body",req.body)
    const {
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      branchName,
      upiId,
    } = req.body;

    if (!accountHolderName || !accountNumber || !ifscCode || !bankName) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing" });
    }

    const newBank = new bankModel({
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      branchName,
      upiId,
      createdBy: req.user?._id, // if authentication exist
    });

    await newBank.save();

    res.status(201).json({ success: true, message: "Bank added successfully" });
  } catch (error) {
    console.error("Error adding bank:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while adding bank" });
  }
};

// ➤ Get Bank List (only id, bankName, accountNumber)
export const getBanks = async (req, res) => {
  try {
    const banks = await bankModel.find(
      { createdBy: req.user?._id }, // user-wise filter
      { _id: 1, bankName: 1, accountNumber: 1 } // सिर्फ ये fields
    ).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: banks });
  } catch (error) {
    console.error("Error fetching banks:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching banks" });
  }
};

// ➤ Delete Bank
// export const deleteBank = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Bank.findByIdAndDelete(id);
//     res.status(200).json({ success: true, message: "Bank deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting bank:", error);
//     res.status(500).json({ success: false, message: "Server error while deleting bank" });
//   }
// };
