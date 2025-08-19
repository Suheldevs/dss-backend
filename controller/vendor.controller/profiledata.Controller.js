import mongoose from "mongoose";
import VendorProfileModel from "../../models/vendor.model/profiledata.Model.js";

// ✅ Create Vendor Profile
export const createVendorProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    // Prevent duplicate
    const existingProfile = await VendorProfileModel.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists for this user.",
      });
    }

    // Attach uploaded files if provided
    if (req.files?.profileImage?.[0]) {
      req.body.profileImage = {
        fileName: req.files.profileImage[0].originalname,
        fileUrl: req.files.profileImage[0].path,
      };
    }
    if (req.files?.contractForm?.[0]) {
      req.body.contractForm = {
        fileName: req.files.contractForm[0].originalname,
        fileUrl: req.files.contractForm[0].path,
      };
    }

    const newProfile = new VendorProfileModel(req.body);
    await newProfile.save();

    res.status(201).json({
      success: true,
      message: "Vendor profile created successfully.",
      data: newProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating vendor profile.",
      error: error.message,
    });
  }
};

// ✅ Update Vendor Profile
export const updateVendorProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL params

    // Attach uploaded files if provided
    if (req.files?.profileImage?.[0]) {
      req.body.profileImage = {
        fileName: req.files.profileImage[0].originalname,
        fileUrl: req.files.profileImage[0].path,
      };
    }
    if (req.files?.contractForm?.[0]) {
      req.body.contractForm = {
        fileName: req.files.contractForm[0].originalname,
        fileUrl: req.files.contractForm[0].path,
      };
    }

    // Find and update by userId instead of _id
    const updatedProfile = await VendorProfileModel.findOneAndUpdate(
  { userId: new mongoose.Types.ObjectId(userId) }, // ✅ cast to ObjectId
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found for this userId.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating vendor profile.",
      error: error.message,
    });
  }
};


// ✅ Update Only Profile Image
export const updateVendorProfileImage = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if image is uploaded
    if (!req.files?.profileImage?.[0]) {
      return res.status(400).json({
        success: false,
        message: "No profile image uploaded.",
      });
    }

    const profileImage = {
      fileName: req.files.profileImage[0].originalname,
      fileUrl: req.files.profileImage[0].path,
    };

    // Update only profileImage field
    const updatedProfile = await VendorProfileModel.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $set: { profileImage } },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found for this userId.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile image.",
      error: error.message,
    });
  }
};

