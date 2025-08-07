// import VendorProfileModel from "../models/VendorProfileModelModel.js";

import VendorProfileModel from "../../models/vendor.model/profiledata.Model";

// Create or Add Vendor Profile
export const createVendorProfileModel = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if profile already exists
    const existingProfile = await VendorProfileModel.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: "Vendor profile already exists." });
    }

    const newProfile = new VendorProfileModel(req.body);
    const savedProfile = await newProfile.save();
    res.status(201).json({ message: "Vendor profile created successfully", data: savedProfile });
  } catch (error) {
    res.status(500).json({ message: "Failed to create profile", error: error.message });
  }
};

// Update Vendor Profile by userId
export const updateVendorProfileModel = async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedProfile = await VendorProfileModel.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Vendor profile not found." });
    }

    res.status(200).json({ message: "Vendor profile updated successfully", data: updatedProfile });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

// Get Vendor Profile by userId
export const getVendorProfileModelByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await VendorProfileModel.findOne({ userId }).populate("userId");

    if (!profile) {
      return res.status(404).json({ message: "Vendor profile not found." });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// Optional: Delete Vendor Profile
export const deleteVendorProfileModel = async (req, res) => {
  try {
    const { userId } = req.params;

    const deleted = await VendorProfileModel.findOneAndDelete({ userId });

    if (!deleted) {
      return res.status(404).json({ message: "Vendor profile not found." });
    }

    res.status(200).json({ message: "Vendor profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete profile", error: error.message });
  }
};
