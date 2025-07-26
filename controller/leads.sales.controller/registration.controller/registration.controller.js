import registrationModel from "../../../models/sales.model/sales.registration.model/registration.model.js"
import { getNextEmployeeId } from "../../../util/generate.unique.id.js";
import AppError from "../../../util/appError.js";



// Register a new sales user
export const registerSalesUser = async (req, res) => {
  try {
    const { name, email, phoneNo, whatsappNo, altNo, password, role,city,zone } = req.body;

    const existing = await registrationModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const empId = await getNextEmployeeId();
    console.log("empID", city,zone);
    // return;

    const user = new registrationModel({
      name,
      email,
      phoneNo,
      whatsappNo,
      altNo,
      password,
      role,
      empId,
      city,
      zone
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all sales users
export const getAllSalesUsers = async (req, res) => {
  try {
    const users = await registrationModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// Get single sales user by ID
export const getSalesUserById = async (req, res) => {
  try {
    const user = await registrationModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};

// Update sales user
export const updateSalesUser = async (req, res) => {
  try {
    const updatedUser = await registrationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// Delete sales user
export const deleteSalesUser = async (req, res) => {
  try {
    const deleted = await registrationModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

//sales Employee all List
export const salesEmployeeList = async (req, res, next) => {
  try {
    const { city, zone } = req.query;

    if (!city || !zone) {
      return res.status(400).json({ message: "City and Zone are required" });
    }
    const result = await registrationModel.find({
      role: "SaleEmployee",
      city,
      zone
    });

    if (!result) {
      return next(new AppError("Not SaleEmpolyee List", 404))
    }
    const data = {
      result
    }
    return res.status(200).json({ success: true, message: "All SalesEmployee", data })
  } catch (error) {
    return next(new AppError(error.message), 500);
  }
}