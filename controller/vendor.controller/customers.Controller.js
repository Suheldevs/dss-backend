
import vendorCustomerModel from "../../models/vendor.model/customers.Model.js";

// ✅ Create Customer Profile
export const createCustomerProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      gstin,
      companyName,
      addressLine1,
      addressLine2,
      city,
      pincode,
      state,
      country,
    } = req.body;

    const newProfile = new vendorCustomerModel({
      createdBy: req.user._id, // ✅ Get from logged-in user
      fullName,
      phone,
      email,
      gstin,
      companyName,
      addressLine1,
      addressLine2,
      city,
      pincode,
      state,
      country: country || "India",
    });

    await newProfile.save();

    res.status(201).json({
      success: true,
      message: "Customer profile created successfully.",
      data: newProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating customer profile.",
      error: error.message,
    });
  }
};

// ✅ Get all customer profiles for the logged-in user
export const getCustomerProfiles = async (req, res) => {
  try {
    const profiles = await vendorCustomerModel.find({ createdBy: req.user._id }).sort({ createdAt: -1 }); // ✅ latest first;

    if (!profiles.length) {
      return res.status(404).json({
        success: false,
        message: "No customer profiles found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer profiles retrieved successfully.",
      data: profiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving customer details.",
      error: error.message,
    });
  }
};
