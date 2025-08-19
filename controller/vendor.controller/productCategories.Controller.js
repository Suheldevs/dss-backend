import ProductCategoryModel from "../../models/vendor.model/productCategories.js";

export const createCategory = async (req, res) => {
  try {
    const {categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ success: false, message: "Category categoryName is required" });
    }

    const exists = await ProductCategoryModel.findOne({ categoryName, createdBy: req.user._id });
    if (exists) {
      return res.status(409).json({ success: false, message: "Category already exists" });
    }

    const category = await ProductCategoryModel.create({
      categoryName,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating category", error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await ProductCategoryModel.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching categories", error: error.message });
  }
};

//  Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // category id from URL
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    // Check if already exists for same user (avoid duplicate names)
    const exists = await ProductCategoryModel.findOne({
      categoryName,
      createdBy: req.user._id,
      _id: { $ne: id }, // exclude current category
    });

    if (exists) {
      return res.status(409).json({ success: false, message: "Category with same name already exists" });
    }

    const updated = await ProductCategoryModel.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { categoryName },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Category not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating category", error: error.message });
  }
};

